import { connection } from '../configs/Database.js';

const saldoRepository = {

    buscarPorUsuario: async (usuarioId) => {
        const sql = `
            SELECT tipo, SUM(valor) as total
            FROM movimentacoes m
            INNER JOIN contas c ON m.id_conta = c.id_conta
            WHERE c.id_usuario = ? AND m.ativo = 1
            GROUP BY tipo;
        `;
        const [rows] = await connection.execute(sql, [usuarioId]);
        return rows;
    }
};

export default saldoRepository;