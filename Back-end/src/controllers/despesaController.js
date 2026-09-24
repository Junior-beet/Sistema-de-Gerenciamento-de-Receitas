import { connection } from '../configs/Database.js';
import { Despesa } from '../models/Despesa.js';
import { Movimentacao } from '../models/Movimentacao.js';
import despesaRepository from '../repositories/despesaRepository.js';
import movimentacaoRepository from '../repositories/movimentacaoRepository.js';
import parceladoRepository from '../repositories/parceladoRepository.js';
import { validarLancamento } from '../services/validacaoLancamento.js';
import { adicionarMeses, distribuirValor } from '../utils/financeiro.js';
import { isDataValida } from '../utils/validacaoData.js';

const despesaController = {
    criar: async (req, res) => {
        try {
            const { id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, data_vencimento, data_pagamento, status, parcelado, total_parcelas } = req.body;

            if (!id_conta || !id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento' });
            }
            if (!isDataValida(data_lancamento)
                || (data_vencimento && !isDataValida(data_vencimento))
                || (data_pagamento && !isDataValida(data_pagamento))) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe datas válidas no formato AAAA-MM-DD.' });
            }

            const quantidadeParcelas = parcelado ? Number(total_parcelas) : 1;
            if (!Number.isInteger(quantidadeParcelas) || quantidadeParcelas < 1 || quantidadeParcelas > 60) {
                return res.status(400).json({ sucesso: false, mensagem: 'O total de parcelas deve ser um inteiro entre 1 e 60.' });
            }
            if (parcelado && quantidadeParcelas < 2) {
                return res.status(400).json({ sucesso: false, mensagem: 'Uma despesa parcelada deve ter pelo menos 2 parcelas.' });
            }

            const validacao = await validarLancamento({
                id_usuario: req.usuario.id_usuario,
                id_conta,
                id_categoria,
                id_subcategoria,
                id_tipo: 'DESPESA',
            });
            if (!validacao.valido) {
                return res.status(validacao.status).json({ sucesso: false, mensagem: validacao.mensagem });
            }

            const db = await connection.getConnection();

            try {
                await db.beginTransaction();
                const idsMovimentacoes = [];
                const valoresParcelados = distribuirValor(valor, quantidadeParcelas);

                for (let indice = 0; indice < quantidadeParcelas; indice++) {
                    const numeroParcela = indice + 1;
                    const dataLancamentoParcela = adicionarMeses(data_lancamento, indice);
                    const dataVencimentoParcela = data_vencimento
                        ? adicionarMeses(data_vencimento, indice)
                        : null;
                    const valorParcela = valoresParcelados[indice];
                    const descricaoParcela = parcelado
                        ? `${descricao || 'Despesa'} (${numeroParcela}/${quantidadeParcelas})`
                        : descricao;

                    const movimentacao = Movimentacao.criar({ id_conta, id_categoria, id_subcategoria, tipo: 'DESPESA', valor: valorParcela, data_lancamento: dataLancamentoParcela, descricao: descricaoParcela, forma_pagamento });
                    const resultMov = await movimentacaoRepository.criar(movimentacao, db);
                    const idMovimentacao = resultMov.insertId;

                    const despesa = Despesa.criar({ id_movimentacao: idMovimentacao, data_vencimento: dataVencimentoParcela, data_pagamento, status: status || 'PENDENTE' });
                    await despesaRepository.criar(despesa, db);

                    if (parcelado) {
                        await parceladoRepository.criar({ id_movimentacao: idMovimentacao, numero_parcela: numeroParcela, total_parcelas: quantidadeParcelas, valor: valorParcela, status: status || 'PENDENTE' }, db);
                    }

                    idsMovimentacoes.push(idMovimentacao);
                }

                await db.commit();
                res.status(201).json({
                    sucesso: true,
                    mensagem: parcelado
                        ? `Despesa parcelada em ${quantidadeParcelas}x criada com sucesso`
                        : 'Despesa criada com sucesso',
                    dados: { ids_movimentacoes },
                });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
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
            const { id_conta } = req.params;
            const result = await despesaRepository.selecionarPorConta(id_conta);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar despesas', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const result = await despesaRepository.selecionarPorId(req.params.id, req.usuario.id_usuario);
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
            const { id_despesa } = req.params;
            const { id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, data_vencimento, data_pagamento, status } = req.body;

            if (!id_conta || !id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento' });
            }
            if (!isDataValida(data_lancamento)
                || (data_vencimento && !isDataValida(data_vencimento))
                || (data_pagamento && !isDataValida(data_pagamento))) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe datas válidas no formato AAAA-MM-DD.' });
            }

            const despesaExiste = await despesaRepository.selecionarPorId(id_despesa, req.usuario.id_usuario);
            if (!despesaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Despesa não encontrada' });
            }

            const validacao = await validarLancamento({
                id_usuario: req.usuario.id_usuario,
                id_conta,
                id_categoria,
                id_subcategoria,
                id_tipo: 'DESPESA',
            });
            if (!validacao.valido) {
                return res.status(validacao.status).json({ sucesso: false, mensagem: validacao.mensagem });
            }

            const db = await connection.getConnection();

            try {
                await db.beginTransaction();

                const movimentacao = Movimentacao.editar({ id_conta, id_categoria, id_subcategoria, tipo: 'DESPESA', valor, data_lancamento, descricao, forma_pagamento }, despesaExiste.id_movimentacao);
                await movimentacaoRepository.atualizar(movimentacao, db);

                const despesa = Despesa.editar({ id_movimentacao: despesaExiste.id_movimentacao, data_vencimento, data_pagamento, status }, id_despesa);
                await despesaRepository.atualizar(despesa, db);

                await db.commit();
                res.status(200).json({ sucesso: true, mensagem: 'Despesa atualizada com sucesso' });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar despesa', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const despesaExiste = await despesaRepository.selecionarPorId(req.params.id, req.usuario.id_usuario);
            if (!despesaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Despesa não encontrada' });
            }

            await movimentacaoRepository.deletar(despesaExiste.id_movimentacao);
            res.status(200).json({ sucesso: true, mensagem: 'Despesa removida com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover despesa', errorMessage: error.message });
        }
    },
};

export default despesaController;
