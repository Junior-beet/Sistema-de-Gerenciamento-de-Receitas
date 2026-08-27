export class Movimentacao {
    #id_movimentacao;
    #id_conta;
    #id_categoria;
    #id_subcategoria;
    #tipo;
    #valor;
    #data_lancamento;
    #descricao;
    #forma_pagamento;
    #ativo;

    constructor(pIdConta, pIdCategoria, pIdSubcategoria, pTipo, pValor, pDataLancamento, pDescricao, pFormaPagamento, pAtivo = 1, pId = null) {
        this.id_conta = pIdConta;
        this.id_categoria = pIdCategoria;
        this.id_subcategoria = pIdSubcategoria;
        this.tipo = pTipo;
        this.valor = pValor;
        this.data_lancamento = pDataLancamento;
        this.descricao = pDescricao;
        this.forma_pagamento = pFormaPagamento;
        this.ativo = pAtivo;
        this.#id_movimentacao = pId;
    }

    get id_movimentacao() { return this.#id_movimentacao; }
    set id_movimentacao(value) { this.#id_movimentacao = value; }

    get id_conta() { return this.#id_conta; }
    set id_conta(value) {
        this.#validarId(value, 'Conta');
        this.#id_conta = value;
    }

    get id_categoria() { return this.#id_categoria; }
    set id_categoria(value) {
        this.#validarId(value, 'Categoria');
        this.#id_categoria = value;
    }

    get id_subcategoria() { return this.#id_subcategoria; }
    set id_subcategoria(value) { this.#id_subcategoria = value ?? null; }

    get tipo() { return this.#tipo; }
    set tipo(value) {
        if (!value || !['RECEITA', 'DESPESA'].includes(value))
            throw new Error('Tipo inválido! Use RECEITA ou DESPESA.');
        this.#tipo = value;
    }

    get valor() { return this.#valor; }
    set valor(value) {
        if (!value || value <= 0) throw new Error('Valor inválido! Deve ser maior que zero.');
        this.#valor = value;
    }

    get data_lancamento() { return this.#data_lancamento; }
    set data_lancamento(value) {
        if (!value) throw new Error('Data de lançamento inválida!');
        this.#data_lancamento = value;
    }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value ?? null; }

    get forma_pagamento() { return this.#forma_pagamento; }
    set forma_pagamento(value) { this.#forma_pagamento = value ?? null; }

    get ativo() { return this.#ativo; }
    set ativo(value) { this.#ativo = value ?? 1; }

    #validarId(value, campo) {
        if (!value || value <= 0) throw new Error(`${campo} inválida!`);
    }

    static criar(dados) {
        return new Movimentacao(
            dados.id_conta, dados.id_categoria, dados.id_subcategoria,
            dados.tipo, dados.valor, dados.data_lancamento,
            dados.descricao, dados.forma_pagamento
        );
    }

    static editar(dados, id) {
        return new Movimentacao(
            dados.id_conta, dados.id_categoria, dados.id_subcategoria,
            dados.tipo, dados.valor, dados.data_lancamento,
            dados.descricao, dados.forma_pagamento, dados.ativo, id
        );
    }
};