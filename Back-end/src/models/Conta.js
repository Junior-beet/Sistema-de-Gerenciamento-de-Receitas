import { v4 as uuidv4 } from 'uuid';

export class Conta {
    #id_conta;
    #id_usuario;
    #numero;
    #tipo;
    #descricao;
    #ativo;

    constructor(pIdUsuario, pNumero, pTipo, pDescricao, pAtivo = 1, pId = null) {
        this.id_usuario = pIdUsuario;
        this.numero = pNumero;
        this.tipo = pTipo;
        this.descricao = pDescricao;
        this.ativo = pAtivo;
        this.#id_conta = pId || uuidv4();
    }

    get id_conta() { return this.#id_conta; }
    set id_conta(value) {
        if (!value) throw new Error('Conta inválida!');
        this.#id_conta = value;
    }

    get id_usuario() { return this.#id_usuario; }
    set id_usuario(value) {
        if (!value) throw new Error('Usuário inválido!');
        this.#id_usuario = value;
    }

    get numero() { return this.#numero; }
    set numero(value) { this.#numero = value ?? null; }

    get tipo() { return this.#tipo; }
    set tipo(value) { this.#tipo = value ?? null; }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value ?? null; }

    get ativo() { return this.#ativo; }
    set ativo(value) { this.#ativo = value ?? 1; }

    static criar(dados) {
        return new Conta(dados.id_usuario, dados.numero, dados.tipo, dados.descricao, dados.ativo);
    }
}