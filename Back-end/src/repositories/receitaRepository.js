import { connection } from '../configs/Database.js';

const receitaRepository = {
    criar: async (receita, executor = connection) => {
        const sql = 'INSERT INTO receitas (id_receita, id_movimentacao, origem, data_prevista) VALUES (?, ?, ?, ?)';
        const values = [receita.id_receita, receita.id_movimentacao, receita.origem, receita.data_prevista];
        const [rows] = await executor.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = `
            SELECT
                m.*,
                r.id_receita,
                r.origem,
                r.data_prevista,
                cat.nome AS categoria,
                sub.nome AS subcategoria
            FROM movimentacoes m
            INNER JOIN receitas r ON m.id_movimentacao = r.id_movimentacao
            LEFT JOIN categorias cat ON m.id_categoria = cat.id_categoria
            LEFT JOIN subcategorias sub ON m.id_subcategoria = sub.id_subcategoria
            WHERE m.tipo = 'RECEITA' AND m.ativo = 1
            ORDER BY m.data_lancamento DESC, m.id_movimentacao DESC
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorConta: async (id_conta) => {
        const sql = `
            SELECT
                m.*,
                r.id_receita,
                r.origem,
                r.data_prevista,
                cat.nome AS categoria,
                sub.nome AS subcategoria
            FROM movimentacoes m
            INNER JOIN receitas r ON m.id_movimentacao = r.id_movimentacao
            LEFT JOIN categorias cat ON m.id_categoria = cat.id_categoria
            LEFT JOIN subcategorias sub ON m.id_subcategoria = sub.id_subcategoria
            WHERE m.id_conta = ? AND m.tipo = 'RECEITA' AND m.ativo = 1
            ORDER BY m.data_lancamento DESC, m.id_movimentacao DESC
        `;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows;
    },

    selecionarPorId: async (id_receita, id_usuario) => {
        const sql = `
            SELECT m.*, r.id_receita, r.origem, r.data_prevista
            FROM movimentacoes m
            INNER JOIN receitas r ON m.id_movimentacao = r.id_movimentacao
            INNER JOIN contas c ON m.id_conta = c.id_conta
            WHERE r.id_receita = ? AND c.id_usuario = ? AND m.tipo = 'RECEITA' AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_receita, id_usuario]);
        return rows[0] || null;
    },

    atualizar: async (receita, executor = connection) => {
        const sql = 'UPDATE receitas SET origem = ?, data_prevista = ? WHERE id_movimentacao = ?';
        const values = [receita.origem, receita.data_prevista, receita.id_movimentacao];
        const [rows] = await executor.execute(sql, values);
        return rows;
    },
};

export default receitaRepository;
