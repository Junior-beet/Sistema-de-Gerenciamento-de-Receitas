import { connection } from '../configs/Database.js';

const produtosRepository = {

    criar: async (produto) => {
        const sql = 'INSERT INTO produtos (idCategoria, nomeProduto, valorProduto, caminhoImagem, dataCad) VALUES (?, ?, ?, ?, ?);';
        const values = [produto.idCategoria, produto.nomeProduto, produto.valorProduto, produto.caminhoImagem,produto.dataCad];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    editar: async (produto) => {
        const sql = 'UPDATE produtos SET idCategoria=?, nomeProduto=?, valorProduto=?, caminhoImagem=? WHERE IdProduto=?;';
        const values = [produto.idCategoria, produto.nomeProduto, produto.valorProduto, produto.caminhoImagem, produto.IdProduto];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await connection.execute(sql);
        return rows;
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM produtos WHERE IdProduto=?;';
        const values = [id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }

};

export default produtosRepository;