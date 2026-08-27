export class Despesa {
    #id_despesa;
    #id_movimentacao;
    #data_vencimento;
    #data_pagamento;
    #status;

    constructor(pIdMovimentacao, pDataVencimento, pDataPagamento, pStatus, pIdDespesa = null) {
        this.id_movimentacao = pIdMovimentacao;
        this.data_vencimento = pDataVencimento;
        this.data_pagamento = pDataPagamento;
        this.status = pStatus;
        this.#id_despesa = pIdDespesa;
    }

    get id_despesa() { return this.#id_despesa; }
    set id_despesa(value) { this.#id_despesa = value; }

    get id_movimentacao() { return this.#id_movimentacao; }
    set id_movimentacao(value) {
        if (!value || value <= 0) throw new Error('Movimentação inválida!');
        this.#id_movimentacao = value;
    }

    get data_vencimento() { return this.#data_vencimento; }
    set data_vencimento(value) { this.#data_vencimento = value ?? null; }

    get data_pagamento() { return this.#data_pagamento; }
    set data_pagamento(value) { this.#data_pagamento = value ?? null; }

    get status() { return this.#status; }
    set status(value) { this.#status = value ?? 'PENDENTE'; }

    static criar(dados) {
        return new Despesa(dados.id_movimentacao, dados.data_vencimento, dados.data_pagamento, dados.status);
    }

    static editar(dados, id) {
        return new Despesa(dados.id_movimentacao, dados.data_vencimento, dados.data_pagamento, dados.status, id);
    }
};