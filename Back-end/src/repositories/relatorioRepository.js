import { connection } from '../configs/Database.js';

const relatorioRepository = {
    saldoPorConta: async (id_conta, id_usuario) => {
        const sql = `
            SELECT
                c.id_conta,
                c.numero,
                c.tipo,
                c.descricao,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS saldo
            FROM contas c
            LEFT JOIN movimentacoes m ON c.id_conta = m.id_conta
            WHERE c.id_conta = ? AND c.id_usuario = ? AND c.ativo = 1
            GROUP BY c.id_conta, c.numero, c.tipo, c.descricao
        `;
        const [rows] = await connection.execute(sql, [id_conta, id_usuario]);
        return rows[0] || null;
    },

    saldoTodasContas: async (id_usuario) => {
        const sql = `
            SELECT
                c.id_conta,
                c.numero,
                c.tipo,
                c.descricao,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS saldo
            FROM contas c
            LEFT JOIN movimentacoes m ON c.id_conta = m.id_conta
            WHERE c.id_usuario = ? AND c.ativo = 1
            GROUP BY c.id_conta, c.numero, c.tipo, c.descricao
            ORDER BY c.descricao, c.numero
        `;
        const [rows] = await connection.execute(sql, [id_usuario]);
        return rows;
    },

    lucroPorPeriodo: async (data_inicio, data_fim, id_usuario) => {
        const sql = `
            SELECT
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS lucro
            FROM movimentacoes m
            INNER JOIN contas conta ON m.id_conta = conta.id_conta
            WHERE m.data_lancamento BETWEEN ? AND ?
                AND m.ativo = 1
                AND conta.id_usuario = ?
                AND conta.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [data_inicio, data_fim, id_usuario]);
        return rows[0] || null;
    },

    relatorioMensal: async (ano, mes, id_usuario) => {
        const data_inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
        const data_fim = new Date(Date.UTC(ano, mes, 0)).toISOString().split('T')[0];

        const sqlResumo = `
            SELECT
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS lucro
            FROM movimentacoes m
            INNER JOIN contas conta ON m.id_conta = conta.id_conta
            WHERE m.data_lancamento BETWEEN ? AND ?
                AND m.ativo = 1
                AND conta.id_usuario = ?
                AND conta.ativo = 1
        `;

        const sqlMovimentacoes = `
            SELECT
                m.id_movimentacao,
                m.tipo,
                m.valor,
                m.data_lancamento,
                m.descricao,
                m.forma_pagamento,
                c.nome AS categoria,
                s.nome AS subcategoria
            FROM movimentacoes m
            INNER JOIN contas conta ON m.id_conta = conta.id_conta
            LEFT JOIN categorias c ON m.id_categoria = c.id_categoria
            LEFT JOIN subcategorias s ON m.id_subcategoria = s.id_subcategoria
            WHERE m.data_lancamento BETWEEN ? AND ?
                AND m.ativo = 1
                AND conta.id_usuario = ?
                AND conta.ativo = 1
            ORDER BY m.data_lancamento ASC
        `;

        const sqlSaldo = `
            SELECT
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS saldo_geral
            FROM movimentacoes m
            INNER JOIN contas conta ON m.id_conta = conta.id_conta
            WHERE m.ativo = 1 AND conta.id_usuario = ? AND conta.ativo = 1
        `;

        const [resumo] = await connection.execute(sqlResumo, [data_inicio, data_fim, id_usuario]);
        const [movimentacoes] = await connection.execute(sqlMovimentacoes, [data_inicio, data_fim, id_usuario]);
        const [saldo] = await connection.execute(sqlSaldo, [id_usuario]);

        return {
            periodo: { ano, mes, data_inicio, data_fim },
            resumo: resumo[0],
            saldo_geral: saldo[0].saldo_geral,
            resultado: resumo[0].lucro >= 0 ? 'LUCRO' : 'PREJUIZO',
            movimentacoes,
        };
    },
};

export default relatorioRepository;
