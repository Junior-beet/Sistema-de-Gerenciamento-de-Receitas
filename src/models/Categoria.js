export class Categoria {
    #id;
    #usuarioId;
    #nome;
    #tipo;
    #cor;
    #ordem;

    constructor(pUsuarioId, pNome, pTipo, pCor, pOrdem, pId) {
        this.usuarioId = pUsuarioId;
        this.nome = pNome;
        this.tipo = pTipo;
        this.cor = pCor;
        this.ordem = pOrdem;
        this.#id = pId;
    }

    get id() {
         return this.#id; 
        }

    get usuarioId() {
         return this.#usuarioId;
         }

    get nome() { 
        return this.#nome; 
    }

    get tipo() { 
        return this.#tipo; 
    }

    get cor() { 
        return this.#cor; 
    }

    get ordem() {
         return this.#ordem;
         }

    set usuarioId(value) { 
        this.#usuarioId = value;
     }

    set nome(value) {
         this.#nome = value;
         }

    set tipo(value) { 
        this.#tipo = value; 
    }

    set cor(value) { 
        this.#cor = value; 
    }

    set ordem(value) { 
        this.#ordem = value; 
    }

    static criar(dados) {
        return new Categoria(dados.usuarioId, dados.nome, dados.tipo, dados.cor, dados.ordem, null);
    }

    static editar(dados, id) {
        return new Categoria(dados.usuarioId, dados.nome, dados.tipo, dados.cor, dados.ordem, id);
    }
}
