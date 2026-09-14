import { connection } from '../configs/Database.js';

const relatorioRepository = {

    saldoPorConta: async (id_conta) => {
        const sql = `
            SELECT
                c.id_conta,
                c.numero,
                c.tipo,
                c.descricao,

                -- COALESCE substitui NULL por 0
                -- SUM com CASE WHEN → soma só os valores que satisfazem a condição
                -- Isso evita fazer duas queries separadas (uma para receita, uma para despesa)
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,

                -- Saldo = receitas - despesas, tudo em uma query só
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS saldo

            FROM contas c

            -- LEFT JOIN → traz a conta mesmo que não tenha nenhuma movimentação
            -- Se fosse INNER JOIN, contas sem movimentação não apareceriam
            LEFT JOIN movimentacoes m ON c.id_conta = m.id_conta

            WHERE c.id_conta = ?
            GROUP BY c.id_conta, c.numero, c.tipo, c.descricao
        `;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows[0] || null;
    },

    saldoTodasContas: async () => {
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
            GROUP BY c.id_conta, c.numero, c.tipo, c.descricao
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    lucroPorPeriodo: async (data_inicio, data_fim) => {
        const sql = `
            SELECT
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS lucro
            FROM movimentacoes m

            -- BETWEEN filtra registros entre duas datas inclusive
            WHERE m.data_lancamento BETWEEN ? AND ? AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [data_inicio, data_fim]);
        return rows[0] || null;
    },

    relatorioMensal: async (ano, mes) => {

        // Monta a data de início do mês: ex. 2026-07-01
        const data_inicio = `${ano}-${String(mes).padStart(2, '0')}-01`;

        // new Date(ano, mes, 0) → o dia 0 de um mês = último dia do mês anterior
        // .toISOString().split('T')[0] → pega só a data sem a hora
        const data_fim = new Date(ano, mes, 0).toISOString().split('T')[0];

        // Query do resumo financeiro do mês
        const sqlResumo = `
            SELECT
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_receitas,
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS total_despesas,
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS lucro
            FROM movimentacoes m
            WHERE m.data_lancamento BETWEEN ? AND ? AND m.ativo = 1
        `;

        // Query de todas as movimentações do mês com JOIN para trazer nome da categoria e subcategoria
        const sqlMovimentacoes = `
            SELECT
                m.id_movimentacao, m.tipo, m.valor, m.data_lancamento,
                m.descricao, m.forma_pagamento,
                c.nome AS categoria,
                s.nome AS subcategoria
            FROM movimentacoes m

            -- LEFT JOIN → traz a movimentação mesmo sem categoria ou subcategoria vinculada
            LEFT JOIN categorias c ON m.id_categoria = c.id_categoria
            LEFT JOIN subcategorias s ON m.id_subcategoria = s.id_subcategoria

            WHERE m.data_lancamento BETWEEN ? AND ? AND m.ativo = 1
            ORDER BY m.data_lancamento ASC
        `;

        // Saldo geral histórico — considera TODAS as movimentações ativas, não só do mês
        const sqlSaldo = `
            SELECT
                COALESCE(SUM(CASE WHEN m.tipo = 'RECEITA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo = 'DESPESA' AND m.ativo = 1 THEN m.valor ELSE 0 END), 0) AS saldo_geral
            FROM movimentacoes m
            WHERE m.ativo = 1
        `;

        const [resumo] = await connection.execute(sqlResumo, [data_inicio, data_fim]);
        const [movimentacoes] = await connection.execute(sqlMovimentacoes, [data_inicio, data_fim]);
        const [saldo] = await connection.execute(sqlSaldo);
        return {
            periodo: { ano, mes, data_inicio, data_fim },
            resumo: resumo[0],
            saldo_geral: saldo[0].saldo_geral,

            // Se lucro >= 0 a empresa teve lucro, senão teve prejuízo
            resultado: resumo[0].lucro >= 0 ? 'LUCRO' : 'PREJUIZO',
            movimentacoes
        };
    }
};

export default relatorioRepository;