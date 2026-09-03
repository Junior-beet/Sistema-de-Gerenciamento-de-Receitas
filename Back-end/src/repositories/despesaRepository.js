import { connection } from '../configs/Database.js';

const despesaRepository = {
    criar: async (despesa) => {
        const sql = `INSERT INTO despesas (id_movimentacao, data_vencimento, data_pagamento, status) VALUES (?, ?, ?, ?)`;
        const values = [despesa.id_movimentacao, despesa.data_vencimento, despesa.data_pagamento, despesa.status];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = `
            SELECT m.*, d.id_despesa, d.data_vencimento, d.data_pagamento, d.status
            FROM movimentacoes m
            INNER JOIN despesas d ON m.id_movimentacao = d.id_movimentacao
            WHERE m.tipo = 'DESPESA' AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorConta: async (id_conta) => {
        const sql = `
            SELECT m.*, d.id_despesa, d.data_vencimento, d.data_pagamento, d.status
            FROM movimentacoes m
            INNER JOIN despesas d ON m.id_movimentacao = d.id_movimentacao
            WHERE m.id_conta = ? AND m.tipo = 'DESPESA' AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows;
    },

    selecionarPorId: async (id_despesa) => {
        const sql = `
            SELECT m.*, d.id_despesa, d.data_vencimento, d.data_pagamento, d.status
            FROM movimentacoes m
            INNER JOIN despesas d ON m.id_movimentacao = d.id_movimentacao
            WHERE d.id_despesa = ? AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_despesa]);
        return rows[0] || null;
    },

    atualizar: async (despesa) => {
        const sql = `UPDATE despesas SET data_vencimento = ?, data_pagamento = ?, status = ? WHERE id_movimentacao = ?`;
        const values = [despesa.data_vencimento, despesa.data_pagamento, despesa.status, despesa.id_movimentacao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default despesaRepository;