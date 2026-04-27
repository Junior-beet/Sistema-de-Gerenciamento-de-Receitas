export class Categoria {
    #id;
    #nome;
    #descricao;
    #dataCad;

    constructor(pNome, pDescricao, pId){
        this.nome = pNome;
        this.descricao = pDescricao;
        this.#id = pId;
    }

    get nome(){
        return this.#nome
    }

    set nome (value){
        this.#validarNome(value);
        this.#nome = value;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao (value){
        this.#validarDescricao(value);
        this.#descricao = value;
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

    #validarDescricao(value){
        if(value && (value.trim().length < 5 || value.trim().length > 100)){
            throw new Error ('O campo descrição é obrigatório e deve ter entre 3 e 100 caracteres')
    }
      }

    #validarId(value){
        if(value && value <= 0 ){
            throw new Error ('O valor do ID não corresponde ao esperado')
    }
        }  

    // Desing Patern: Factory
    static criar(dados, id) {
        return new Categoria (dados.nome, dados.descricao, null);
    }

    static editar(dados, id) {
        return new Categoria (dados.nome, dados.descricao, id);
    }

}