import saldoRepository from '../repositories/saldoRepositories.js';

const saldoController = {

    selecionar: async (req, res) => {
        try {
            const usuarioId = Number(req.params.usuarioId);
            const rows = await saldoRepository.buscarPorUsuario(usuarioId);

            const receitas = rows.find(r => r.tipo === 'RECEITA')?.total || 0;
            const despesas = rows.find(r => r.tipo === 'DESPESA')?.total || 0;
            const saldo = receitas - despesas;

            res.status(200).json({
                result: {
                    totalReceitas: +receitas,
                    totalDespesas: +despesas,
                    saldo: +saldo,
                    situacao: saldo >= 0 ? 'POSITIVO' : 'NEGATIVO'
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default saldoController;