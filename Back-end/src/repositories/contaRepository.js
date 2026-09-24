import { connection } from '../configs/Database.js';

const contaRepository = {
    selecionarPorUsuario: async (id_usuario) => {
        const sql = `
            SELECT id_conta, id_usuario, numero, tipo, descricao, ativo
            FROM contas
            WHERE id_usuario = ? AND ativo = 1
            ORDER BY descricao, numero
        `;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows;
    },

    selecionarPorIdEUsuario: async (id_conta, id_usuario) => {
        const sql = `
            SELECT id_conta, id_usuario, numero, tipo, descricao, ativo
            FROM contas
            WHERE id_conta = ? AND id_usuario = ? AND ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_conta, id_usuario]);
        return rows[0] || null;
    },
};

export default contaRepository;
