import { Categoria } from '../models/Categoria.js';
import categoriaRepository from '../repositories/categoriaRepositories.js';

const categoriaController = {

    criar: async (req, res) => {
        try {
            const { usuarioId, nome, tipo, cor, ordem } = req.body;

            const existe = await categoriaRepository.existeNome(nome, usuarioId);
            if (existe) {
                return res.status(400).json({ message: 'Já existe uma categoria com esse nome' });
            }

            const categoria = Categoria.criar({ usuarioId, nome, tipo, cor, ordem });
            const result = await categoriaRepository.criar(categoria);

            res.status(201).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const { usuarioId, nome, tipo, cor, ordem } = req.body;

            const categoria = Categoria.editar({ usuarioId, nome, tipo, cor, ordem }, id);
            const result = await categoriaRepository.atualizar(categoria);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await categoriaRepository.deletar(id);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const usuarioId = Number(req.params.usuarioId);
            const result = await categoriaRepository.selecionar(usuarioId);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default categoriaController;