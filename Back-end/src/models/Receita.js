export class Receita {
    #id_receita;
    #id_movimentacao;
    #origem;
    #data_prevista;

    constructor(pIdMovimentacao, pOrigem, pDataPrevista, pIdReceita = null) {
        this.id_movimentacao = pIdMovimentacao;
        this.origem = pOrigem;
        this.data_prevista = pDataPrevista;
        this.#id_receita = pIdReceita;
    }

    get id_receita() { return this.#id_receita; }
    set id_receita(value) { this.#id_receita = value; }

    get id_movimentacao() { return this.#id_movimentacao; }
    set id_movimentacao(value) {
        if (!value || value <= 0) throw new Error('Movimentação inválida!');
        this.#id_movimentacao = value;
    }

    get origem() { return this.#origem; }
    set origem(value) { this.#origem = value ?? null; }

    get data_prevista() { return this.#data_prevista; }
    set data_prevista(value) { this.#data_prevista = value ?? null; }

    static criar(dados) {
        return new Receita(dados.id_movimentacao, dados.origem, dados.data_prevista);
    }

    static editar(dados, id) {
        return new Receita(dados.id_movimentacao, dados.origem, dados.data_prevista, id);
    }
};