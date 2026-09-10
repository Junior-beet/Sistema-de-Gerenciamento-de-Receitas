import { connection } from '../configs/Database.js';

const categoriaRepository = {
    criar: async (categoria) => {
        const sql = `INSERT INTO categorias (id_usuario, nome, tipo, cor, ordem) VALUES (?, ?, ?, ?, ?)`;
        const values = [categoria.id_usuario, categoria.nome, categoria.tipo, categoria.cor, categoria.ordem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async (id_usuario) => {
        const sql = `SELECT * FROM categorias WHERE id_usuario = ?`;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows;
    },

    selecionarPorId: async (id_categoria) => {
        const sql = `SELECT * FROM categorias WHERE id_categoria = ?`;
        const [rows] = await connection.execute(sql, [id_categoria]);
        return rows[0] || null;
    },

    atualizar: async (categoria) => {
        const sql = `UPDATE categorias SET nome = ?, tipo = ?, cor = ?, ordem = ? WHERE id_categoria = ? AND id_usuario = ?`;
        const values = [categoria.nome, categoria.tipo, categoria.cor, categoria.ordem, categoria.id_categoria, categoria.id_usuario];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletarSubcategorias: async (id_categoria) => {
        const sql = `DELETE FROM subcategorias WHERE id_categoria = ?`;
        const [rows] = await connection.execute(sql, [id_categoria]);
        return rows;
    },

    deletar: async (id_categoria) => {
        const sql = `DELETE FROM categorias WHERE id_categoria = ?`;
        const [rows] = await connection.execute(sql, [id_categoria]);
        return rows;
    }
};

export default categoriaRepository;