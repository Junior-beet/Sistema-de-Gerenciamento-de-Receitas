import { Movimentacao } from '../models/Movimentacao.js';
import { Despesa } from '../models/Despesa.js';
import movimentacaoRepository from '../repositories/movimentacaoRepository.js';
import despesaRepository from '../repositories/despesaRepository.js';
import parceladoRepository from '../repositories/parceladoRepository.js';

const despesaController = {
    criar: async (req, res) => {
        try {
            const { id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, data_vencimento, data_pagamento, status, parcelado, total_parcelas } = req.body;

            if (!id_conta || !id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento' });
            }

            // Se for parcelado, cria uma movimentação por parcela, código a ser revisado pela Akila.
            // Ver se a ajuda da IA teve seus efeitos e teste a ser feito no insomnia, se não funcionar, rever a lógica de criação de parcelas.
            if (parcelado && total_parcelas > 1) {
                const valorParcela = parseFloat((valor / total_parcelas).toFixed(2));
                const ids = [];

                for (let i = 1; i <= total_parcelas; i++) {
                    const dataLancamentoParcela = new Date(data_lancamento);
                    dataLancamentoParcela.setMonth(dataLancamentoParcela.getMonth() + (i - 1));
                    const dataFormatada = dataLancamentoParcela.toISOString().split('T')[0];

                    const movimentacao = Movimentacao.criar({ id_conta, id_categoria, id_subcategoria, tipo: 'DESPESA', valor: valorParcela, data_lancamento: dataFormatada, descricao: `${descricao || 'Despesa'} (${i}/${total_parcelas})`, forma_pagamento });
                    const resultMov = await movimentacaoRepository.criar(movimentacao);
                    const id_movimentacao = resultMov.insertId;

                    const despesa = Despesa.criar({ id_movimentacao, data_vencimento, data_pagamento, status: status || 'PENDENTE' });
                    await despesaRepository.criar(despesa);

                    await parceladoRepository.criar({ id_movimentacao, numero_parcela: i, total_parcelas, valor: valorParcela, status: status || 'PENDENTE' });

                    ids.push(id_movimentacao);
                }

                return res.status(201).json({ sucesso: true, mensagem: `Despesa parcelada em ${total_parcelas}x criada com sucesso`, dados: { ids_movimentacoes: ids } });
            }

            const movimentacao = Movimentacao.criar({ id_conta, id_categoria, id_subcategoria, tipo: 'DESPESA', valor, data_lancamento, descricao, forma_pagamento });
            const resultMov = await movimentacaoRepository.criar(movimentacao);
            const id_movimentacao = resultMov.insertId;

            const despesa = Despesa.criar({ id_movimentacao, data_vencimento, data_pagamento, status: status || 'PENDENTE' });
            await despesaRepository.criar(despesa);

            res.status(201).json({ sucesso: true, mensagem: 'Despesa criada com sucesso', dados: { id_movimentacao } });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar despesa', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await despesaRepository.selecionar();
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar despesas', errorMessage: error.message });
        }
    },

    selecionarPorConta: async (req, res) => {
        try {
            const id_conta = Number(req.params.id_conta);

            if (!id_conta || id_conta <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID de conta inválido' });
            }

            const result = await despesaRepository.selecionarPorConta(id_conta);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar despesas', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const id_despesa = Number(req.params.id);
            const result = await despesaRepository.selecionarPorId(id_despesa);

            if (!result) {
                return res.status(404).json({ sucesso: false, mensagem: 'Despesa não encontrada' });
            }

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar despesa', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id_despesa = Number(req.params.id);
            const { id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, data_vencimento, data_pagamento, status } = req.body;

            if (!id_despesa || id_despesa <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            if (!id_conta || !id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento' });
            }

            const despesaExiste = await despesaRepository.selecionarPorId(id_despesa);
            if (!despesaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Despesa não encontrada' });
            }

            const movimentacao = Movimentacao.editar({ id_conta, id_categoria, id_subcategoria, tipo: 'DESPESA', valor, data_lancamento, descricao, forma_pagamento }, despesaExiste.id_movimentacao);
            await movimentacaoRepository.atualizar(movimentacao);

            const despesa = Despesa.editar({ id_movimentacao: despesaExiste.id_movimentacao, data_vencimento, data_pagamento, status }, id_despesa);
            await despesaRepository.atualizar(despesa);

            res.status(200).json({ sucesso: true, mensagem: 'Despesa atualizada com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar despesa', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id_despesa = Number(req.params.id);

            if (!id_despesa || id_despesa <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            const despesaExiste = await despesaRepository.selecionarPorId(id_despesa);
            if (!despesaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Despesa não encontrada' });
            }

            await movimentacaoRepository.deletar(despesaExiste.id_movimentacao);

            res.status(200).json({ sucesso: true, mensagem: 'Despesa removida com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover despesa', errorMessage: error.message });
        }
    }
};

export default despesaController;