import { Categoria } from '../models/Categoria.js';
import categoriaRepository from '../repositories/categoriaRepository.js';

const categoriaController = {
    criar: async (req, res) => {
        try {
            const { nome, tipo, cor, ordem } = req.body;

            if (!nome || !tipo) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha os campos obrigatórios: nome e tipo' });
            }

            const categoria = Categoria.criar({ id_usuario: req.usuario.id_usuario, nome, tipo, cor, ordem });
            const result = await categoriaRepository.criar(categoria);

            res.status(201).json({ sucesso: true, mensagem: 'Categoria criada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar categoria', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionarPorUsuario(req.usuario.id_usuario);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar categorias', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionarPorIdEUsuario(
                req.params.id,
                req.usuario.id_usuario,
            );

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
            const id_categoria = req.params.id;
            const { nome, tipo, cor, ordem } = req.body;

            if (!nome || !tipo) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha os campos obrigatórios: nome e tipo' });
            }

            const existe = await categoriaRepository.selecionarPorIdEUsuario(
                id_categoria,
                req.usuario.id_usuario,
            );
            if (!existe) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
            }

            const categoria = Categoria.editar(
                { id_usuario: req.usuario.id_usuario, nome, tipo, cor, ordem },
                id_categoria,
            );
            const result = await categoriaRepository.atualizar(categoria);

            res.status(200).json({ sucesso: true, mensagem: 'Categoria atualizada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar categoria', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id_categoria = req.params.id;
            const existe = await categoriaRepository.selecionarPorIdEUsuario(
                id_categoria,
                req.usuario.id_usuario,
            );

            if (!existe) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
            }

            await categoriaRepository.deletarSubcategorias(id_categoria);
            const result = await categoriaRepository.deletar(id_categoria, req.usuario.id_usuario);

            res.status(200).json({ sucesso: true, mensagem: 'Categoria e subcategorias vinculadas deletadas com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar categoria', errorMessage: error.message });
        }
    },
};

export default categoriaController;
