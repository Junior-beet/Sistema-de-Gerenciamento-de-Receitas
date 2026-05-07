export class Usuario {
    #id;
    #nome;
    #email;
    #senha;
    #cargo;

    constructor(pNome, pEmail, pSenha, pCargo, pId) {
        this.nome = pNome;
        this.email = pEmail;
        this.senha = pSenha;
        this.cargo = pCargo;
        this.#id = pId;
    }

    get id() { 
        return this.#id; 
    }

    get nome() { 
        return this.#nome; 
    }

    get email() { 
        return this.#email; 
    }

    get senha() { 
        return this.#senha; 
    }

    get cargo() { 
        return this.#cargo; 
    }

    set nome(value) { 
        this.#nome = value; 
    }

    set email(value) { 
        this.#email = value; 
    }

    set senha(value) { 
        this.#senha = value; 
    }

    set cargo(value) { 
        this.#cargo = value;
    }

    static criar(dados) {
        return new Usuario(dados.nome, dados.email, dados.senha, dados.cargo, null);
    }

    static editar(dados, id) {
        return new Usuario(dados.nome, dados.email, dados.senha, dados.cargo, id);
    }
}