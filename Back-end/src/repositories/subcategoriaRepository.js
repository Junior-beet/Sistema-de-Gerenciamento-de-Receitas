import { connection } from '../configs/Database.js';

const subcategoriaRepository = {
    criar: async (subcategoria) => {
        const sql = 'INSERT INTO subcategorias (id_subcategoria, id_categoria, nome) VALUES (?, ?, ?)';
        const values = [subcategoria.id_subcategoria, subcategoria.id_categoria, subcategoria.nome];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionarPorCategoria: async (id_categoria) => {
        const sql = 'SELECT * FROM subcategorias WHERE id_categoria = ? AND ativo = 1';
        const [rows] = await connection.execute(sql, [id_categoria]);
        return rows;
    },

    selecionarPorIdEUsuario: async (id_subcategoria, id_usuario) => {
        const sql = `
            SELECT s.*
            FROM subcategorias s
            INNER JOIN categorias c ON s.id_categoria = c.id_categoria
            WHERE s.id_subcategoria = ? AND c.id_usuario = ? AND s.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_subcategoria, id_usuario]);
        return rows[0] || null;
    },

    atualizar: async (subcategoria, id_usuario) => {
        const sql = `
            UPDATE subcategorias s
            INNER JOIN categorias c ON s.id_categoria = c.id_categoria
            SET s.id_categoria = ?, s.nome = ?, s.ativo = ?
            WHERE s.id_subcategoria = ? AND c.id_usuario = ?
        `;
        const values = [subcategoria.id_categoria, subcategoria.nome, subcategoria.ativo, subcategoria.id_subcategoria, id_usuario];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id_subcategoria, id_usuario) => {
        const sql = `
            UPDATE subcategorias s
            INNER JOIN categorias c ON s.id_categoria = c.id_categoria
            SET s.ativo = 0
            WHERE s.id_subcategoria = ? AND c.id_usuario = ?
        `;
        const [rows] = await connection.execute(sql, [id_subcategoria, id_usuario]);
        return rows;
    },
};

export default subcategoriaRepository;
