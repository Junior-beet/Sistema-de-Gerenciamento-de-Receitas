import bcrypt from 'bcrypt';
import { connection } from '../configs/Database.js';
import { Usuario } from '../models/Usuario.js';
import { Conta } from '../models/Conta.js';
import usuarioRepository from '../repositories/usuarioRepository.js';
import categoriaRepository from '../repositories/categoriaRepository.js';
import contaRepository from '../repositories/contaRepository.js';

const SALT_ROUNDS = 10;

const usuarioController = {
    criar: async (req, res) => {
        try {
            const { nome, email, senha_usuario, cargo } = req.body;

            if (!nome || !email || !senha_usuario || !cargo) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: nome, email, senha_usuario e cargo' });
            }

            if (cargo === 'CEO') {
                const ceoExistente = await usuarioRepository.buscarPorCargo('CEO');
                if (ceoExistente) {
                    return res.status(400).json({ sucesso: false, mensagem: 'Já existe um CEO cadastrado no sistema' });
                }
            }

            const emailExistente = await usuarioRepository.selecionarPorEmail(email);
            if (emailExistente) {
                return res.status(400).json({ sucesso: false, mensagem: 'Este e-mail já está cadastrado' });
            }

            const usuarioValidado = Usuario.criar({ nome, email, senha_usuario, cargo });

            const senhaHash = await bcrypt.hash(usuarioValidado.senha_usuario, SALT_ROUNDS);
            usuarioValidado.senha_usuario = senhaHash;

            const db = await connection.getConnection();

            try {
                await db.beginTransaction();

                const result = await usuarioRepository.criar(usuarioValidado, db);

                // Todo usuario recebe uma conta propria: e ela que recebe os lancamentos.
                const conta = Conta.criar({
                    id_usuario: usuarioValidado.id_usuario,
                    numero: '001',
                    tipo: 'Empresarial',
                    descricao: 'Conta da Empresa',
                });
                await contaRepository.criar(conta, db);

                await db.commit();

                res.status(201).json({ sucesso: true, mensagem: 'Usuário cadastrado com sucesso', dados: result });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar usuário', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await usuarioRepository.selecionar();
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar usuários', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const id_usuario = String(req.params.id || '').trim();

            if (!id_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            const result = await usuarioRepository.selecionarPorId(id_usuario);

            if (!result) {
                return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            }

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar usuário', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id_usuario = String(req.params.id || '').trim();
            const { nome, email, cargo } = req.body;

            if (!id_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            if (!nome || !email || !cargo) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: nome, email e cargo' });
            }

            const usuarioExiste = await usuarioRepository.selecionarPorId(id_usuario);
            if (!usuarioExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            }

            if (cargo === 'CEO' && usuarioExiste.cargo !== 'CEO') {
                const ceoExistente = await usuarioRepository.buscarPorCargo('CEO');
                if (ceoExistente) {
                    return res.status(400).json({ sucesso: false, mensagem: 'Já existe um CEO cadastrado no sistema' });
                }
            }

            const emailExistente = await usuarioRepository.selecionarPorEmail(email);
            if (emailExistente && emailExistente.id_usuario !== id_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'Este e-mail já está em uso por outro usuário' });
            }

            // A senha não é alterada aqui: o modelo exige o campo apenas para validação.
            const usuario = Usuario.editar({ nome, email, senha_usuario: 'placeholder123', cargo }, id_usuario);
            const result = await usuarioRepository.atualizar(usuario);

            res.status(200).json({ sucesso: true, mensagem: 'Usuário atualizado com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar usuário', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id_usuario = String(req.params.id || '').trim();

            if (!id_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            if (id_usuario === req.usuario.id_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir o próprio usuário autenticado' });
            }

            const usuarioExiste = await usuarioRepository.selecionarPorId(id_usuario);
            if (!usuarioExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            }

            // Apagar o usuário em cascata destruiria o histórico financeiro dele. Em vez disso,
            // a posse das categorias e contas é transferida para outro usuário ativo
            // antes de remover o cadastro.
            const sucessor = await usuarioRepository.selecionarOutroUsuario(id_usuario);
            const db = await connection.getConnection();

            try {
                await db.beginTransaction();

                if (sucessor) {
                    await categoriaRepository.transferirUsuario(id_usuario, sucessor.id_usuario, db);
                    await contaRepository.transferirUsuario(id_usuario, sucessor.id_usuario, db);
                }

                await usuarioRepository.deletarTokens(id_usuario, db);
                const result = await usuarioRepository.deletar(id_usuario, db);

                await db.commit();

                const mensagem = sucessor
                    ? `Usuário excluído com sucesso. Categorias e contas foram transferidas para ${sucessor.nome}.`
                    : 'Usuário excluído com sucesso.';

                res.status(200).json({ sucesso: true, mensagem, dados: result });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar usuário', errorMessage: error.message });
        }
    }
};

export default usuarioController;