import contaRepository from '../repositories/contaRepository.js';

const contaController = {
    selecionar: async (req, res) => {
        try {
            const contas = await contaRepository.selecionarPorUsuario(req.usuario.id_usuario);
            res.status(200).json({ sucesso: true, dados: contas });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar contas',
                errorMessage: error.message,
            });
        }
    },
};

export default contaController;
