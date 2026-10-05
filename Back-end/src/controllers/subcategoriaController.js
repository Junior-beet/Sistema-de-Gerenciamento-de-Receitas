import { Subcategoria } from '../models/Subcategoria.js';
import categoriaRepository from '../repositories/categoriaRepository.js';
import subcategoriaRepository from '../repositories/subcategoriaRepository.js';

const subcategoriaController = {
    criar: async (req, res) => {
        try {
            const { id_categoria, nome } = req.body;

            if (!id_categoria || !nome) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha os campos obrigatórios: id_categoria e nome' });
            }

            const categoriaExiste = await categoriaRepository.selecionarPorIdEUsuario(
                id_categoria,
                req.usuario.id_usuario,
            );
            if (!categoriaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria pai não encontrada' });
            }

            const subcategoria = Subcategoria.criar({ id_categoria, nome });
            const result = await subcategoriaRepository.criar(subcategoria);

            res.status(201).json({ sucesso: true, mensagem: 'Subcategoria criada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar subcategoria', errorMessage: error.message });
        }
    },

    selecionarPorCategoria: async (req, res) => {
        try {
            const id_categoria = req.params.id_categoria;
            const categoriaExiste = await categoriaRepository.selecionarPorIdEUsuario(
                id_categoria,
                req.usuario.id_usuario,
            );

            if (!categoriaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
            }

            const result = await subcategoriaRepository.selecionarPorCategoria(id_categoria);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar subcategorias', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const result = await subcategoriaRepository.selecionarPorIdEUsuario(
                req.params.id,
                req.usuario.id_usuario,
            );

            if (!result) {
                return res.status(404).json({ sucesso: false, mensagem: 'Subcategoria não encontrada' });
            }

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar subcategoria', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id_subcategoria = req.params.id;
            const { id_categoria, nome, ativo } = req.body;

            if (!id_categoria || !nome) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha os campos obrigatórios: id_categoria e nome' });
            }

            const subcategoriaExiste = await subcategoriaRepository.selecionarPorIdEUsuario(
                id_subcategoria,
                req.usuario.id_usuario,
            );
            if (!subcategoriaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Subcategoria não encontrada' });
            }

            const categoriaExiste = await categoriaRepository.selecionarPorIdEUsuario(
                id_categoria,
                req.usuario.id_usuario,
            );
            if (!categoriaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Categoria pai não encontrada' });
            }

            const subcategoria = Subcategoria.editar({ id_categoria, nome, ativo }, id_subcategoria);
            const result = await subcategoriaRepository.atualizar(subcategoria, req.usuario.id_usuario);

            res.status(200).json({ sucesso: true, mensagem: 'Subcategoria atualizada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar subcategoria', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id_subcategoria = req.params.id;
            const existe = await subcategoriaRepository.selecionarPorIdEUsuario(
                id_subcategoria,
                req.usuario.id_usuario,
            );

            if (!existe) {
                return res.status(404).json({ sucesso: false, mensagem: 'Subcategoria não encontrada' });
            }

            const result = await subcategoriaRepository.deletar(id_subcategoria, req.usuario.id_usuario);
            res.status(200).json({ sucesso: true, mensagem: 'Subcategoria desativada com sucesso', dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao deletar subcategoria', errorMessage: error.message });
        }
    },
};

export default subcategoriaController;
