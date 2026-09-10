import { connection } from '../configs/Database.js';

const parceladoRepository = {
    criar: async (parcela) => {
        const sql = `INSERT INTO parcelado (id_movimentacao, numero_parcela, total_parcelas, valor, status) VALUES (?, ?, ?, ?, ?)`;
        const values = [parcela.id_movimentacao, parcela.numero_parcela, parcela.total_parcelas, parcela.valor, parcela.status];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },

    selecionarPorMovimentacao: async (id_movimentacao) => {
        const sql = `SELECT * FROM parcelado WHERE id_movimentacao = ?`;
        const [rows] = await connection.execute(sql, [id_movimentacao]);
        return rows;
    }
};

export default parceladoRepository;