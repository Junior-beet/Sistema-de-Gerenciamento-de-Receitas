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

    selecionarPorId: async (id_subcategoria) => {
        const sql = 'SELECT * FROM subcategorias WHERE id_subcategoria = ? AND ativo = 1';
        const [rows] = await connection.execute(sql, [id_subcategoria]);
        return rows[0] || null;
    },

    atualizar: async (subcategoria) => {
        const sql = 'UPDATE subcategorias SET id_categoria = ?, nome = ?, ativo = ? WHERE id_subcategoria = ?';
        const values = [subcategoria.id_categoria, subcategoria.nome, subcategoria.ativo, subcategoria.id_subcategoria];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    contarMovimentacoes: async (id_subcategoria) => {
        const sql = 'SELECT COUNT(*) AS total FROM movimentacoes WHERE id_subcategoria = ?';
        const [rows] = await connection.execute(sql, [id_subcategoria]);
        return Number(rows[0]?.total || 0);
    },

    deletar: async (id_subcategoria, executor = connection) => {
        const sql = 'UPDATE subcategorias SET ativo = 0 WHERE id_subcategoria = ?';
        const [rows] = await executor.execute(sql, [id_subcategoria]);
        return rows;
    },
};

export default subcategoriaRepository;