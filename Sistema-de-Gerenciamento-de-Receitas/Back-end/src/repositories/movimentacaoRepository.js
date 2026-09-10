import { connection } from '../configs/Database.js';

const movimentacaoRepository = {
    criar: async (movimentacao) => {
        const sql = `INSERT INTO movimentacoes (id_conta, id_categoria, id_subcategoria, tipo, valor, data_lancamento, descricao, forma_pagamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [movimentacao.id_conta, movimentacao.id_categoria, movimentacao.id_subcategoria, movimentacao.tipo, movimentacao.valor, movimentacao.data_lancamento, movimentacao.descricao, movimentacao.forma_pagamento];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionar: async (id_conta) => {
        const sql = `SELECT * FROM movimentacoes WHERE id_conta = ? AND ativo = 1`;
        const [rows] = await connection.execute(sql, [id_conta]);
        return rows;
    },

    selecionarPorId: async (id_movimentacao) => {
        const sql = `SELECT * FROM movimentacoes WHERE id_movimentacao = ? AND ativo = 1`;
        const [rows] = await connection.execute(sql, [id_movimentacao]);
        return rows[0] || null;
    },

    atualizar: async (movimentacao) => {
        const sql = `UPDATE movimentacoes SET id_conta = ?, id_categoria = ?, id_subcategoria = ?, tipo = ?, valor = ?, data_lancamento = ?, descricao = ?, forma_pagamento = ? WHERE id_movimentacao = ?`;
        const values = [movimentacao.id_conta, movimentacao.id_categoria, movimentacao.id_subcategoria, movimentacao.tipo, movimentacao.valor, movimentacao.data_lancamento, movimentacao.descricao, movimentacao.forma_pagamento, movimentacao.id_movimentacao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    deletar: async (id_movimentacao) => {
        const sql = `UPDATE movimentacoes SET ativo = 0 WHERE id_movimentacao = ?`;
        const [rows] = await connection.execute(sql, [id_movimentacao]);
        return rows;
    }
};

export default movimentacaoRepository;