export class Endereco {
    #id;
    #id_cliente;
    #cep;
    #logradouro;
    #numero;
    #complemento;
    #bairro;
    #cidade;
    #uf;
    #dataCad;

    constructor(pId_cliente, pCep, pLogradouro, pNumero, pComplemento, pBairro, pCidade, pUf, pId) {
        this.id_cliente = pId_cliente; 
        this.cep = pCep;
        this.logradouro = pLogradouro;
        this.numero = pNumero;
        this.complemento = pComplemento;
        this.bairro = pBairro;
        this.cidade = pCidade;
        this.uf = pUf;
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
        this.#validarId(value);
        this.#id_cliente = value; 
        }

    get cep() { 
        return this.#cep; 
    }

    set cep(value) { 
        this.#cep = value; 
    }

    get logradouro() { 
        return this.#logradouro; 
    }

    set logradouro(value) { 
        this.#logradouro = value; 
    }

    get numero() { 
        return this.#numero; 
    }

    set numero(value) { 
        this.#validarNumero(value); 
        this.#numero = value; 
    }

    get complemento() { 
        return this.#complemento; 
    }

    set complemento(value) { 
        this.#complemento = value; 
    }

    get bairro() { 
        return this.#bairro; 
    }

    set bairro(value) { 
        this.#bairro = value; 
    }

    get cidade() { 
        return this.#cidade; 
    }

    set cidade(value) { 
        this.#cidade = value; 
    }

    get uf() { 
        return this.#uf;
    }

    set uf(value) { 
        this.#uf = value; 
    }



    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('O valor do ID não corresponde ao esperado');
        }
    }

    #validarNumero(value) {
        if (!value || value.trim().length === 0 || value.trim().length > 20) {
            throw new Error('O campo número é obrigatório e deve ter no máximo 20 caracteres');
        }
    }

    // Design Pattern: Factory
    static criar(dados) {
        return new Endereco(dados.id_cliente, dados.cep, dados.logradouro, dados.numero, dados.complemento, dados.bairro, dados.cidade, dados.uf, null);
    }

    static editar(dados, id) {
        return new Endereco(dados.id_cliente, dados.cep, dados.logradouro, dados.numero, dados.complemento, dados.bairro, dados.cidade, dados.uf, id);
    }
}