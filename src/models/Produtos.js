export class Produto {
    #IdProduto;
    #idCategoria;
    #nomeProduto;
    #valorProduto;
    #caminhoImagem;
    #dataCad;

    constructor(pIdCategoria, pNomeProduto, pValorProduto, pCaminhoImagem, pIdProduto) {
        this.idCategoria = pIdCategoria; 
        this.nomeProduto = pNomeProduto;
        this.valorProduto = pValorProduto;
        this.caminhoImagem = pCaminhoImagem;
        this.#IdProduto = pIdProduto;
        this.#dataCad = new Date();
    }

    get IdProduto() {
        return this.#IdProduto;
    }

    set IdProduto(value) {
        this.#validarId(value);
        this.#IdProduto = value;
    }

    get idCategoria() {
        return this.#idCategoria;
    }

    set idCategoria(value) {
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    get nomeProduto() {
        return this.#nomeProduto;
    }

    set nomeProduto(value) {
        this.#validarNome(value);
        this.#nomeProduto = value;
    }

    get valorProduto() {
        return this.#valorProduto;
    }

    set valorProduto(value) {
        this.#validarValor(value);
        this.#valorProduto = value;
    }

    get caminhoImagem() {
        return this.#caminhoImagem;
    }

    set caminhoImagem(value) {
        this.#validarPathImagem(value);
        this.#caminhoImagem = value;
    }

    get dataCad() {
        return this.#dataCad;
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('O valor do ID não corresponde ao esperado');
        }
    }

    #validarIdCategoria(value) {
        if (!value || value <= 0) {
            throw new Error('O idCategoria é obrigatório e deve ser maior que zero');
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 150) {
            throw new Error('O nome do produto deve ter entre 3 e 150 caracteres');
        }
    }

    #validarValor(value) {
        if (value == null || value <= 0) {
            throw new Error('O valor do produto deve ser maior que zero');
        }
    }

    #validarPathImagem(value) {
        if (!value || value.trim().length < 5) {
            throw new Error('O caminho da imagem é obrigatório');
        }
    }
  
    // Desing Patern: Factory
    static criar(dados) {
        return new Produto(dados.idCategoria, dados.nomeProduto, dados.valorProduto, dados.caminhoImagem, null);
    }

    static editar(dados, id) {
        return new Produto(dados.idCategoria, dados.nomeProduto, dados.valorProduto, dados.caminhoImagem, id);
    }
}