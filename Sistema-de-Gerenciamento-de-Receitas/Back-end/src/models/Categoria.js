export class Categoria {
    #id_categoria;
    #id_usuario;
    #nome;
    #tipo;
    #cor;
    #ordem;

    constructor(pIdUsuario, pNome, pTipo, pCor, pOrdem, pIdCategoria = null) {
        this.id_usuario = pIdUsuario;
        this.nome = pNome;
        this.tipo = pTipo;
        this.cor = pCor;
        this.ordem = pOrdem;
        this.#id_categoria = pIdCategoria;
    }

    get id_categoria() { return this.#id_categoria; }
    set id_categoria(value) { this.#id_categoria = value; }

    get id_usuario() { return this.#id_usuario; }
    set id_usuario(value) {
        this.#validarIdUsuario(value);
        this.#id_usuario = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get tipo() { return this.#tipo; }
    set tipo(value) {
        this.#validarTipo(value);
        this.#tipo = value;
    }

    get cor() { return this.#cor; }
    set cor(value) { this.#cor = value ?? null; }

    get ordem() { return this.#ordem; }
    set ordem(value) { this.#ordem = value ?? null; }

    #validarIdUsuario(value) {
        if (!value || value <= 0) throw new Error('Usuário inválido!');
    }

    #validarNome(value) {
        if (!value || value.trim().length < 2) throw new Error('Nome inválido, deve ter ao menos 2 caracteres!');
    }

    #validarTipo(value) {
        if (!value || !['RECEITA', 'DESPESA'].includes(value))
            throw new Error('Tipo inválido! Use RECEITA ou DESPESA.');
    }

    static criar(dados) {
        return new Categoria(dados.id_usuario, dados.nome, dados.tipo, dados.cor, dados.ordem);
    }

    static editar(dados, id) {
        return new Categoria(dados.id_usuario, dados.nome, dados.tipo, dados.cor, dados.ordem, id);
    }
};