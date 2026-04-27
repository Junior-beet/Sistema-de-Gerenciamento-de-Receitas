import { Produto } from "../models/Produtos.js";
import produtosRepository from "../repositories/produtosRepositories.js";

const produtosController = {

    criar: async (req, res) => {
        try {
            const { idCategoria, nomeProduto, valorProduto } = req.body;
            const caminhoImagem = req.file ? req.file.filename : null;
            console.log({idCategoria, nomeProduto, valorProduto, caminhoImagem})
            const produto = Produto.criar({idCategoria, nomeProduto, valorProduto, caminhoImagem});
            const result = await produtosRepository.criar(produto);
            res.status(201).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message});
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const { idCategoria, nomeProduto, valorProduto } = req.body;
            const caminhoImagem = req.file ? req.file.filename : null;
             console.log({idCategoria, nomeProduto, valorProduto, caminhoImagem})
            const produto = Produto.editar({idCategoria, nomeProduto, valorProduto, caminhoImagem}, id);
            const result = await produtosRepository.editar(produto);
            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message});
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await produtosRepository.deletar(id);
            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message});
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await produtosRepository.selecionar();
            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message});
        }
    }

};

export default produtosController;