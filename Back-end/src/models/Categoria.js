import { v4 as uuidv4 } from 'uuid';

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
        this.#id_categoria = pIdCategoria || uuidv4();
    }

    get id_categoria() { return this.#id_categoria; }
    set id_categoria(value) { this.#id_categoria = value; }

    get id_usuario() { return this.#id_usuario; }
    set id_usuario(value) {
        if (!value) throw new Error('Usuário inválido!');
        this.#id_usuario = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        if (!value || value.trim().length < 2) throw new Error('Nome inválido, deve ter ao menos 2 caracteres!');
        this.#nome = value;
    }

    get tipo() { return this.#tipo; }
    set tipo(value) {
        if (!value || !['RECEITA', 'DESPESA'].includes(value))
            throw new Error('Tipo inválido! Use RECEITA ou DESPESA.');
        this.#tipo = value;
    }

    get cor() { return this.#cor; }
    set cor(value) { this.#cor = value ?? null; }

    get ordem() { return this.#ordem; }
    set ordem(value) { this.#ordem = value ?? null; }

    static criar(dados) {
        return new Categoria(dados.id_usuario, dados.nome, dados.tipo, dados.cor, dados.ordem);
    }

    static editar(dados, id) {
        return new Categoria(dados.id_usuario, dados.nome, dados.tipo, dados.cor, dados.ordem, id);
    }
};