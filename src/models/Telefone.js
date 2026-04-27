export class Telefone {
    #id;
    #id_cliente;
    #numero;

    constructor(pId_cliente, pNumero, pId) {
        this.id_cliente = pId_cliente; 
        this.numero = pNumero;
        this.#id = pId;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get id_cliente() {
        return this.#id_cliente;
    }

    set id_cliente(value) {
        this.#validarIdCliente(value);
        this.#id_cliente = value;
    }

    get numero() {
        return this.#numero;
    }

    set numero(value) {
        this.#validarNumero(value);
        this.#numero = value;
    }


    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('O valor do ID é inválido');
        }
    }

    #validarIdCliente(value) {
        if (!value || value <= 0) {
            throw new Error('O id_cliente é obrigatório e deve ser maior que zero');
        }
    }

    #validarNumero(value) {
        // Validação simples: verifica se existe e se tem tamanho de telefone (ex: entre 8 e 15 dígitos)
        if (!value || value.trim().length < 8 || value.trim().length > 15) {
            throw new Error('O número deve ter entre 8 e 15 caracteres');
        }
    }

    // Design Pattern: Factory
    static criar(dados) {
        return new Telefone(dados.id_cliente, dados.numero, null);
    }

    static editar(dados, id) {
        return new Telefone(dados.id_cliente, dados.numero, id);
    }
}