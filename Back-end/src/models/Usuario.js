export class Usuario {
    #id_usuario;
    #nome;
    #email;
    #senha_usuario;
    #cargo;

    constructor(pNome, pEmail, pSenha, pCargo, pIdUsuario = null) {
        this.nome = pNome;
        this.email = pEmail;
        this.senha_usuario = pSenha;
        this.cargo = pCargo;
        this.#id_usuario = pIdUsuario;
    }

    get id_usuario() { return this.#id_usuario; }
    set id_usuario(value) { this.#id_usuario = value; }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get email() { return this.#email; }
    set email(value) {
        this.#validarEmail(value);
        this.#email = value;
    }

    get senha_usuario() { return this.#senha_usuario; }
    set senha_usuario(value) {
        this.#validarSenha(value);
        this.#senha_usuario = value;
    }

    get cargo() { return this.#cargo; }
    set cargo(value) {
        this.#validarCargo(value);
        this.#cargo = value;
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3)
            throw new Error('Nome inválido, deve ter ao menos 3 caracteres!');
    }

    #validarEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !regex.test(value))
            throw new Error('E-mail inválido!');
    }

    #validarSenha(value) {
        if (!value || value.length < 8)
            throw new Error('Senha inválida, deve ter ao menos 8 caracteres!');
    }

    #validarCargo(value) {
        const cargosValidos = ['GERENTE', 'DIRETOR_FINANCEIRO', 'CEO'];
        if (!value || !cargosValidos.includes(value))
            throw new Error('Cargo inválido! Use GERENTE, DIRETOR_FINANCEIRO ou CEO.');
    }

    static criar(dados) {
        return new Usuario(dados.nome, dados.email, dados.senha_usuario, dados.cargo);
    }

    static editar(dados, id) {
        return new Usuario(dados.nome, dados.email, dados.senha_usuario, dados.cargo, id);
    }
};