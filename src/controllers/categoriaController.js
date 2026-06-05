import { Categoria } from '../models/Categoria.js';
import categoriaRepository from '../repositories/categoriaRepository.js';

const categoriaController = {
    criar: async (req, res) => {
        try {
            const { id_usuario, nome, tipo, cor, ordem } = req.body;

            if (!id_usuario || !nome || !tipo) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_usuario, nome e tipo' });
            }

            const categoria = Categoria.criar({ id_usuario, nome, tipo, cor, ordem });
            const result = await categoriaRepository.criar(categoria);

            res.status(201).json({ sucesso: true, mensagem: 'Categoria criada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar categoria', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const id_usuario = Number(req.params.id_usuario);

            if (!id_usuario || id_usuario <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID de usuário inválido' });
            }

            const result = await categoriaRepository.selecionar(id_usuario);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar categorias', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const id_categoria = Number(req.params.id);
            const result = await categoriaRepository.selecionarPorId(id_categoria);

            if (!result) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
            }

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar categoria', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id_categoria = Number(req.params.id);
            const { id_usuario, nome, tipo, cor, ordem } = req.body;

            if (!id_categoria || id_categoria <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            if (!id_usuario || !nome || !tipo) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_usuario, nome e tipo' });
            }

            const categoria = Categoria.editar({ id_usuario, nome, tipo, cor, ordem }, id_categoria);
            const result = await categoriaRepository.atualizar(categoria);

            res.status(200).json({ sucesso: true, mensagem: 'Categoria atualizada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar categoria', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id_categoria = Number(req.params.id);

            if (!id_categoria || id_categoria <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            const existe = await categoriaRepository.selecionarPorId(id_categoria);
            if (!existe) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
            }

            const result = await categoriaRepository.deletar(id_categoria);
            res.status(200).json({ sucesso: true, mensagem: 'Categoria deletada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar categoria', errorMessage: error.message });
        }
    }
};

export default categoriaController;