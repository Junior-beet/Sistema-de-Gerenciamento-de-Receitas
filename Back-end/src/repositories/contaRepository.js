import { connection } from '../configs/Database.js';

const contaRepository = {
    criar: async (conta, executor = connection) => {
        const sql = 'INSERT INTO contas (id_conta, id_usuario, numero, tipo, descricao, ativo) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [conta.id_conta, conta.id_usuario, conta.numero, conta.tipo, conta.descricao, conta.ativo];
        const [rows] = await executor.execute(sql, values);
        return rows;
    },

    selecionarTodas: async (id_usuario) => {
        const sql = `
            SELECT id_conta, id_usuario, numero, tipo, descricao, ativo
            FROM contas
            WHERE ativo = 1 AND id_usuario = ?
            ORDER BY tipo = 'Empresarial' DESC, id_conta ASC
        `;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows;
    },

    selecionarPorId: async (id_conta) => {
        const sql = `
            SELECT id_conta, id_usuario, numero, tipo, descricao, ativo
            FROM contas
            WHERE id_conta = ? AND ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows[0] || null;
    },

    selecionarContaEmpresa: async () => {
        const sql = `
            SELECT id_conta, id_usuario, numero, tipo, descricao, ativo
            FROM contas
            WHERE ativo = 1 AND tipo = 'Empresarial'
            LIMIT 1
        `;
        const [rows] = await connection.execute(sql);
        return rows[0] || null;
    },

    transferirUsuario: async (id_usuario_origem, id_usuario_destino, executor = connection) => {
        const sql = 'UPDATE contas SET id_usuario = ? WHERE id_usuario = ?';
        const [rows] = await executor.execute(sql, [id_usuario_destino, id_usuario_origem]);
        return rows;
    },
};

export default contaRepository;