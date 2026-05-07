import { connection } from '../configs/Database.js';

const categoriaRepository = {

    criar: async (categoria) => {
        const sql = 'INSERT INTO categorias (id_usuario, nome, tipo, cor, ordem) VALUES (?, ?, ?, ?, ?);';
        const values = [categoria.usuarioId, categoria.nome, categoria.tipo, categoria.cor, categoria.ordem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    atualizar: async (categoria) => {
        const sql = 'UPDATE categorias SET nome = ?, tipo = ?, cor = ?, ordem = ? WHERE id_categoria = ?;';
        const values = [categoria.nome, categoria.tipo, categoria.cor, categoria.ordem, categoria.id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id) => {
        const sql = 'DELETE FROM categorias WHERE id_categoria = ?;';
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    },

    selecionar: async (usuarioId) => {
        const sql = 'SELECT * FROM categorias WHERE id_usuario = ?;';
        const [rows] = await connection.execute(sql, [usuarioId]);
        return rows;
    },

    existeNome: async (nome, usuarioId) => {
        const sql = 'SELECT id_categoria FROM categorias WHERE nome = ? AND id_usuario = ?;';
        const [rows] = await connection.execute(sql, [nome, usuarioId]);
        return rows.length > 0;
    }
};

export default categoriaRepository;