import { connection } from '../configs/Database.js';

const receitaRepository = {
    criar: async (receita) => {
        const sql = `INSERT INTO receitas (id_movimentacao, origem, data_prevista) VALUES (?, ?, ?)`;
        const values = [receita.id_movimentacao, receita.origem, receita.data_prevista];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async () => {
        const sql = `
            SELECT m.*, r.id_receita, r.origem, r.data_prevista
            FROM movimentacoes m
            INNER JOIN receitas r ON m.id_movimentacao = r.id_movimentacao
            WHERE m.tipo = 'RECEITA' AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    },

    selecionarPorConta: async (id_conta) => {
        const sql = `
            SELECT m.*, r.id_receita, r.origem, r.data_prevista
            FROM movimentacoes m
            INNER JOIN receitas r ON m.id_movimentacao = r.id_movimentacao
            WHERE m.id_conta = ? AND m.tipo = 'RECEITA' AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows;
    },

    selecionarPorId: async (id_receita) => {
        const sql = `
            SELECT m.*, r.id_receita, r.origem, r.data_prevista
            FROM movimentacoes m
            INNER JOIN receitas r ON m.id_movimentacao = r.id_movimentacao
            WHERE r.id_receita = ? AND m.ativo = 1
        `;
        const [rows] = await connection.execute(sql, [id_receita]);
        return rows[0] || null;
    },

    atualizar: async (receita) => {
        const sql = `UPDATE receitas SET origem = ?, data_prevista = ? WHERE id_movimentacao = ?`;
        const values = [receita.origem, receita.data_prevista, receita.id_movimentacao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    }
};

export default receitaRepository;