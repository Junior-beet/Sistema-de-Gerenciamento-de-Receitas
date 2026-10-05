import { connection } from '../configs/Database.js';
import { Movimentacao } from '../models/Movimentacao.js';
import { Receita } from '../models/Receita.js';
import movimentacaoRepository from '../repositories/movimentacaoRepository.js';
import receitaRepository from '../repositories/receitaRepository.js';
import parceladoRepository from '../repositories/parceladoRepository.js';
import { validarLancamento } from '../services/validacaoLancamento.js';
import { isDataValida } from '../utils/validacaoData.js';

const receitaController = {
    criar: async (req, res) => {
        try {
            const { id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, origem, data_prevista } = req.body;

            if (!id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Não é possível lançar: preencha todos os campos obrigatórios (categoria, valor e data de lançamento).' });
            }
            if (!isDataValida(data_lancamento) || (data_prevista && !isDataValida(data_prevista))) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe datas válidas no formato AAAA-MM-DD.' });
            }

            const validacao = await validarLancamento({
                id_categoria,
                id_subcategoria,
                id_tipo: 'RECEITA',
                id_usuario: req.usuario.id_usuario,
            });
            if (!validacao.valido) {
                return res.status(validacao.status).json({ sucesso: false, mensagem: validacao.mensagem });
            }
            const id_conta = validacao.conta.id_conta;

            const db = await connection.getConnection();

            try {
                await db.beginTransaction();

                const movimentacao = Movimentacao.criar({ id_conta, id_categoria, id_subcategoria, tipo: 'RECEITA', valor, data_lancamento, descricao, forma_pagamento });
                const resultMov = await movimentacaoRepository.criar(movimentacao, db);
                const id_movimentacao = resultMov.insertId;

                const receita = Receita.criar({ id_movimentacao, origem, data_prevista });
                await receitaRepository.criar(receita, db);

                await db.commit();
                res.status(201).json({ sucesso: true, mensagem: 'Receita criada com sucesso', dados: { id_movimentacao } });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar receita', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await receitaRepository.selecionar();
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar receitas', errorMessage: error.message });
        }
    },

    selecionarPorConta: async (req, res) => {
        try {
            const { id_conta } = req.params;
            if (!id_conta) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID de conta inválido' });
            }

            const result = await receitaRepository.selecionarPorConta(id_conta);
            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar receitas', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const result = await receitaRepository.selecionarPorId(req.params.id);

            if (!result) {
                return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada' });
            }

            res.status(200).json({ sucesso: true, dados: result });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar receita', errorMessage: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, origem, data_prevista } = req.body;

            if (!id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Não é possível lançar: preencha todos os campos obrigatórios (categoria, valor e data de lançamento).' });
            }
            if (!isDataValida(data_lancamento) || (data_prevista && !isDataValida(data_prevista))) {
                return res.status(400).json({ sucesso: false, mensagem: 'Informe datas válidas no formato AAAA-MM-DD.' });
            }

            const receitaExiste = await receitaRepository.selecionarPorId(id);
            if (!receitaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada' });
            }

            const validacao = await validarLancamento({
                id_categoria,
                id_subcategoria,
                id_tipo: 'RECEITA',
                id_usuario: req.usuario.id_usuario,
            });
            if (!validacao.valido) {
                return res.status(validacao.status).json({ sucesso: false, mensagem: validacao.mensagem });
            }
            const id_conta = validacao.conta.id_conta;

            const db = await connection.getConnection();

            try {
                await db.beginTransaction();

                const movimentacao = Movimentacao.editar({ id_conta, id_categoria, id_subcategoria, tipo: 'RECEITA', valor, data_lancamento, descricao, forma_pagamento }, receitaExiste.id_movimentacao);
                await movimentacaoRepository.atualizar(movimentacao, db);

                const receita = Receita.editar({ id_movimentacao: receitaExiste.id_movimentacao, origem, data_prevista }, id);
                await receitaRepository.atualizar(receita, db);

                await db.commit();
                res.status(200).json({ sucesso: true, mensagem: 'Receita atualizada com sucesso' });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar receita', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const receitaExiste = await receitaRepository.selecionarPorId(req.params.id);

            if (!receitaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada' });
            }

            const db = await connection.getConnection();

            try {
                await db.beginTransaction();

                // A linha de receitas e as parcelas referenciam movimentacoes, entao
                // precisam sair antes dela para nao deixar registros orfaos.
                await receitaRepository.deletar(receitaExiste.id_receita, db);
                await parceladoRepository.excluirPorMovimentacao(receitaExiste.id_movimentacao, db);
                await movimentacaoRepository.deletar(receitaExiste.id_movimentacao, db);

                await db.commit();
                res.status(200).json({ sucesso: true, mensagem: 'Receita removida com sucesso' });
            } catch (error) {
                await db.rollback();
                throw error;
            } finally {
                db.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover receita', errorMessage: error.message });
        }
    },
};

export default receitaController;
