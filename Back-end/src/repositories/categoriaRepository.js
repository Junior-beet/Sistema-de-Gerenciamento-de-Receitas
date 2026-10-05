import { connection } from '../configs/Database.js';

const categoriaRepository = {
    criar: async (categoria) => {
        const sql = `INSERT INTO categorias (id_categoria, id_usuario, nome, tipo, cor, ordem) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [categoria.id_categoria, categoria.id_usuario, categoria.nome, categoria.tipo, categoria.cor, categoria.ordem];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionarTodas: async () => {
        const sql = `
            SELECT id_categoria, id_usuario, nome, tipo, cor, ordem
            FROM categorias
            ORDER BY ordem, nome
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorId: async (id_categoria) => {
        const sql = `
            SELECT id_categoria, id_usuario, nome, tipo, cor, ordem
            FROM categorias
            WHERE id_categoria = ?
        `;
        const [rows] = await connection.execute(sql, [id_categoria]);
        return rows[0] || null;
    },

    atualizar: async (categoria) => {
        const sql = 'UPDATE categorias SET nome = ?, tipo = ?, cor = ?, ordem = ? WHERE id_categoria = ?';
        const values = [categoria.nome, categoria.tipo, categoria.cor, categoria.ordem, categoria.id_categoria];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    contarMovimentacoes: async (id_categoria) => {
        const sql = 'SELECT COUNT(*) AS total FROM movimentacoes WHERE id_categoria = ?';
        const [rows] = await connection.execute(sql, [id_categoria]);
        return Number(rows[0]?.total || 0);
    },

    desativarSubcategorias: async (id_categoria, executor = connection) => {
        const sql = 'UPDATE subcategorias SET ativo = 0 WHERE id_categoria = ? AND ativo = 1';
        const [rows] = await executor.execute(sql, [id_categoria]);
        return rows;
    },

    deletar: async (id_categoria, executor = connection) => {
        const sql = 'DELETE FROM categorias WHERE id_categoria = ?';
        const [rows] = await executor.execute(sql, [id_categoria]);
        return rows;
    },

    transferirUsuario: async (id_usuario_origem, id_usuario_destino, executor = connection) => {
        const sql = 'UPDATE categorias SET id_usuario = ? WHERE id_usuario = ?';
        const [rows] = await executor.execute(sql, [id_usuario_destino, id_usuario_origem]);
        return rows;
    },
};

export default categoriaRepository;