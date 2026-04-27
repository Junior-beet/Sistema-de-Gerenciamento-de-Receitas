export class Cliente {
    #id;
    #nome;
    #cpf;
    #dataCad;

    constructor(pNome, pCpf, pId){
        this.nome = pNome;
        this.cpf = pCpf;
        this.#id = pId;
    }

    get nome(){
        return this.#nome
    }

    set nome (value){
        this.#validarNome(value);
        this.#nome = value;
    }

    get cpf(){
        return this.#cpf;
    }

    set cpf (value){
        this.#validarCpf(value);
        this.#cpf = value;
    }

    get id(){
        return this.#id;
    }

    set id (value){
        this.#validarId(value)
        this.#id = value;
    }

    #validarNome(value){
        if(!value || value.trim().length < 3 || value.trim().length > 45)
            throw new Error ('O campo nome é obrigatório e deve ter entre 3 e 45 caracteres')
    }
    #validarCpf(value) {
    if (value && (value.trim().length < 0 || value.trim().length > 11)) {
        throw new Error('O campo CPF é obrigatório e deve ter exatamente 11 caracteres');
    }
}

    #validarId(value){
        if(value && value <= 0 ){
            throw new Error ('O valor do ID não corresponde ao esperado')
    }
        }  

    // Desing Patern: Factory
    static criar(dados, id) {
        return new Cliente (dados.nome, dados.cpf, null);
    }

    static editar(dados, id) {
        return new Cliente (dados.nome, dados.cpf, id);
    }

}