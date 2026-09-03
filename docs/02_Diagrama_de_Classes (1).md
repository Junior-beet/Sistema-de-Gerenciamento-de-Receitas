# Diagrama de Classes

## Sistema de Gerenciamento de Receitas

## 1. Objetivo

O diagrama apresenta as principais entidades do sistema e seus
relacionamentos, considerando a estrutura atual do banco `banco_tcc`.

## 2. Diagrama

``` mermaid
classDiagram

class Usuario {
  +id_usuario
  +nome
  +email
  +cargo
  +senha_usuario
  +data_criacao
}

class Categoria {
  +id_categoria
  +id_usuario
  +nome
  +tipo
  +cor
  +ordem
}

class Subcategoria {
  +id_subcategoria
  +id_categoria
  +nome
  +ativo
}

class Conta {
  +id_conta
  +id_usuario
  +numero
  +tipo
  +descricao
  +ativo
}

class Movimentacao {
  +id_movimentacao
  +id_conta
  +id_categoria
  +id_subcategoria
  +tipo
  +valor
  +data_lancamento
  +descricao
  +forma_pagamento
  +ativo
}

class Receita {
  +id_receita
  +id_movimentacao
  +origem
  +data_prevista
}

class Despesa {
  +id_despesa
  +id_movimentacao
  +data_vencimento
  +data_pagamento
  +status
}

class Parcelado {
  +id
  +id_movimentacao
  +numero_parcela
  +total_parcelas
  +valor
  +status
}

class TokenRecuperacao {
  +id
  +id_usuario
  +token
  +expiracao
  +usado
}

Usuario "1" --> "N" Categoria
Usuario "1" --> "N" Conta
Usuario "1" --> "N" TokenRecuperacao
Categoria "1" --> "N" Subcategoria
Conta "1" --> "N" Movimentacao
Categoria "1" --> "N" Movimentacao
Subcategoria "1" --> "N" Movimentacao
Movimentacao "1" --> "N" Receita
Movimentacao "1" --> "N" Despesa
Movimentacao "1" --> "N" Parcelado
```

## 3. Classes principais

  -----------------------------------------------------------------------
  Classe                              Responsabilidade
  ----------------------------------- -----------------------------------
  `Usuario`                           Armazena os dados do usuário e suas
                                      informações de acesso.

  `Categoria`                         Organiza as movimentações por
                                      categoria e tipo.

  `Subcategoria`                      Detalha uma categoria.

  `Conta`                             Representa a conta vinculada às
                                      movimentações.

  `Movimentacao`                      Registra os lançamentos
                                      financeiros.

  `Receita`                           Armazena informações complementares
                                      de receitas.

  `Despesa`                           Armazena informações complementares
                                      de despesas.

  `Parcelado`                         Controla informações de
                                      parcelamento.

  `TokenRecuperacao`                  Controla tokens de recuperação de
                                      acesso.
  -----------------------------------------------------------------------

## 4. Relacionamentos

-   Um `Usuario` pode possuir várias `Categoria`.
-   Um `Usuario` pode possuir várias `Conta`.
-   Um `Usuario` pode possuir vários `TokenRecuperacao`.
-   Uma `Categoria` pode possuir várias `Subcategoria`.
-   Uma `Conta` pode estar relacionada a várias `Movimentacao`.
-   Uma `Categoria` pode estar relacionada a várias `Movimentacao`.
-   Uma `Subcategoria` pode estar relacionada a várias `Movimentacao`.
-   Uma `Movimentacao` pode possuir registros em `Receita`, `Despesa` e
    `Parcelado`.
