import { Categoria } from "../models/Categoria.js";
import categoriaRepository from "../repositories/CategoriaRepositories.js";

const categoriaController = {
    criar: async (req, res) => {
        try {
            const {nome, descricao} = req.body;
            const categoria = Categoria.criar({nome, descricao});
            const result = await categoriaRepository.criar(categoria);
            res.status(201).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', 
            errorMessage: error.message})
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const {nome, descricao} = req.body;
            const categoria = Categoria.editar({nome, descricao}, id);
            const result = await categoriaRepository.editar(categoria);
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', 
            errorMessage: error.message})
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await categoriaRepository.deletar(id);
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', 
            errorMessage: error.message})
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionar();
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', 
            errorMessage: error.message})
        }
    },

}

export default categoriaController;