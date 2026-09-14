import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js';
import usuarioRepository from '../repositories/usuarioRepository.js';

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

            const result = await usuarioRepository.criar(usuarioValidado);

            res.status(201).json({ sucesso: true, mensagem: 'Usuário cadastrado com sucesso', dados: result });
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
            const id_usuario = Number(req.params.id);

            if (!id_usuario || id_usuario <= 0) {
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
            const id_usuario = Number(req.params.id);
            const { nome, email, cargo } = req.body;

            if (!id_usuario || id_usuario <= 0) {
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
            const id_usuario = Number(req.params.id);

            if (!id_usuario || id_usuario <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            const usuarioExiste = await usuarioRepository.selecionarPorId(id_usuario);
            if (!usuarioExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            }

            // Deleta tokens de recuperação vinculados primeiro
            await usuarioRepository.deletarTokens(id_usuario);

            // Depois deleta o usuário
            const result = await usuarioRepository.deletar(id_usuario);
            res.status(200).json({ sucesso: true, mensagem: 'Usuário deletado com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar usuário', errorMessage: error.message });
        }
    }
};

export default usuarioController;