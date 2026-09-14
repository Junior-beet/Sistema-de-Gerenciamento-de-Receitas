import { Movimentacao } from '../models/Movimentacao.js';
import { Receita } from '../models/Receita.js';
import movimentacaoRepository from '../repositories/movimentacaoRepository.js';
import receitaRepository from '../repositories/receitaRepository.js';

const receitaController = {
    criar: async (req, res) => {
        try {
            const { id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, origem, data_prevista } = req.body;

            if (!id_conta || !id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento' });
            }

            const movimentacao = Movimentacao.criar({ id_conta, id_categoria, id_subcategoria, tipo: 'RECEITA', valor, data_lancamento, descricao, forma_pagamento });
            const resultMov = await movimentacaoRepository.criar(movimentacao);

            const id_movimentacao = resultMov.insertId;
            const receita = Receita.criar({ id_movimentacao, origem, data_prevista });
            await receitaRepository.criar(receita);

            res.status(201).json({ sucesso: true, mensagem: 'Receita criada com sucesso', dados: { id_movimentacao } });
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
            const id_conta = Number(req.params.id_conta);

            if (!id_conta || id_conta <= 0) {
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
            const id_receita = Number(req.params.id);
            const result = await receitaRepository.selecionarPorId(id_receita);

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
            const id_receita = Number(req.params.id);
            const { id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento, origem, data_prevista } = req.body;

            if (!id_receita || id_receita <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            if (!id_conta || !id_categoria || !valor || !data_lancamento) {
                return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento' });
            }

            const receitaExiste = await receitaRepository.selecionarPorId(id_receita);
            if (!receitaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada' });
            }

            const movimentacao = Movimentacao.editar({ id_conta, id_categoria, id_subcategoria, tipo: 'RECEITA', valor, data_lancamento, descricao, forma_pagamento }, receitaExiste.id_movimentacao);
            await movimentacaoRepository.atualizar(movimentacao);

            const receita = Receita.editar({ id_movimentacao: receitaExiste.id_movimentacao, origem, data_prevista }, id_receita);
            await receitaRepository.atualizar(receita);

            res.status(200).json({ sucesso: true, mensagem: 'Receita atualizada com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar receita', errorMessage: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id_receita = Number(req.params.id);

            if (!id_receita || id_receita <= 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'ID inválido' });
            }

            const receitaExiste = await receitaRepository.selecionarPorId(id_receita);
            if (!receitaExiste) {
                return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada' });
            }

            await movimentacaoRepository.deletar(receitaExiste.id_movimentacao);

            res.status(200).json({ sucesso: true, mensagem: 'Receita removida com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover receita', errorMessage: error.message });
        }
    }
};

export default receitaController;