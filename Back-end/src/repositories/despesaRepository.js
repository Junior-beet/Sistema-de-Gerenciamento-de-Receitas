import { connection } from '../configs/Database.js';

const despesaRepository = {
    criar: async (despesa, executor = connection) => {
        const sql = 'INSERT INTO despesas (id_despesa, id_movimentacao, data_vencimento, data_pagamento, status) VALUES (?, ?, ?, ?, ?)';
        const values = [despesa.id_despesa, despesa.id_movimentacao, despesa.data_vencimento, despesa.data_pagamento, despesa.status];
        const [rows] = await executor.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = `
            SELECT
                m.*,
                d.id_despesa,
                d.data_vencimento,
                d.data_pagamento,
                d.status,
                cat.nome AS categoria,
                sub.nome AS subcategoria
            FROM movimentacoes m
            INNER JOIN despesas d ON m.id_movimentacao = d.id_movimentacao
            LEFT JOIN categorias cat ON m.id_categoria = cat.id_categoria
            LEFT JOIN subcategorias sub ON m.id_subcategoria = sub.id_subcategoria
            WHERE m.tipo = 'DESPESA' AND m.ativo = 1
            ORDER BY m.data_lancamento DESC, m.id_movimentacao DESC
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorConta: async (id_conta) => {
        const sql = `
            SELECT
                m.*,
                d.id_despesa,
                d.data_vencimento,
                d.data_pagamento,
                d.status,
                cat.nome AS categoria,
                sub.nome AS subcategoria
            FROM movimentacoes m
            INNER JOIN despesas d ON m.id_movimentacao = d.id_movimentacao
            LEFT JOIN categorias cat ON m.id_categoria = cat.id_categoria
            LEFT JOIN subcategorias sub ON m.id_subcategoria = sub.id_subcategoria
            WHERE m.id_conta = ? AND m.tipo = 'DESPESA' AND m.ativo = 1
            ORDER BY m.data_lancamento DESC, m.id_movimentacao DESC
        `;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows;
    },

    selecionarPorId: async (id_despesa, id_usuario) => {
        const sql = `
            SELECT m.*, d.id_despesa, d.data_vencimento, d.data_pagamento, d.status
            FROM movimentacoes m
            INNER JOIN despesas d ON m.id_movimentacao = d.id_movimentacao
            INNER JOIN contas c ON m.id_conta = c.id_conta
            WHERE d.id_despesa = ? AND c.id_usuario = ? AND m.tipo = 'DESPESA' AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_despesa, id_usuario]);
        return rows[0] || null;
    },

    atualizar: async (despesa, executor = connection) => {
        const sql = 'UPDATE despesas SET data_vencimento = ?, data_pagamento = ?, status = ? WHERE id_movimentacao = ?';
        const values = [despesa.data_vencimento, despesa.data_pagamento, despesa.status, despesa.id_movimentacao];
        const [rows] = await executor.execute(sql, values);
        return rows;
    },
};

export default despesaRepository;
