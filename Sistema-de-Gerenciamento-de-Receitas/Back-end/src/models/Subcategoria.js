export class Subcategoria {
    #id_subcategoria;
    #id_categoria;
    #nome;
    #ativo;

    constructor(pIdCategoria, pNome, pAtivo = 1, pIdSubcategoria = null) {
        this.id_categoria = pIdCategoria;
        this.nome = pNome;
        this.ativo = pAtivo;
        this.#id_subcategoria = pIdSubcategoria;
    }

    get id_subcategoria() { return this.#id_subcategoria; }
    set id_subcategoria(value) { this.#id_subcategoria = value; }

    get id_categoria() { return this.#id_categoria; }
    set id_categoria(value) {
        this.#validarIdCategoria(value);
        this.#id_categoria = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get ativo() { return this.#ativo; }
    set ativo(value) { this.#ativo = value ?? 1; }

    #validarIdCategoria(value) {
        if (!value || value <= 0) throw new Error('Categoria inválida!');
    }

    #validarNome(value) {
        if (!value || value.trim().length < 2) throw new Error('Nome inválido, deve ter ao menos 2 caracteres!');
    }

    static criar(dados) {
        return new Subcategoria(dados.id_categoria, dados.nome);
    }

    static editar(dados, id) {
        return new Subcategoria(dados.id_categoria, dados.nome, dados.ativo, id);
    }
};