import { connection } from '../configs/Database.js';

const tokenRecuperacaoRepository = {
    criar: async (id_usuario, token, expiracao) => {
        const sql = `INSERT INTO tokens_recuperacao (id_usuario, token, expiracao) VALUES (?, ?, ?)`;
        const [rows] = await connection.execute(sql, [id_usuario, token, expiracao]);
        return rows;
    },

    buscarPorToken: async (token) => {
        const sql = `SELECT * FROM tokens_recuperacao WHERE token = ? AND usado = 0`;
        const [rows] = await connection.execute(sql, [token]);
        return rows[0] || null;
    },

    marcarComoUsado: async (token) => {
        const sql = `UPDATE tokens_recuperacao SET usado = 1 WHERE token = ?`;
        const [rows] = await connection.execute(sql, [token]);
        return rows;
    },

    deletarExpirados: async (id_usuario) => {
        const sql = `DELETE FROM tokens_recuperacao WHERE id_usuario = ? AND expiracao < NOW()`;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows;
    }
};

export default tokenRecuperacaoRepository;