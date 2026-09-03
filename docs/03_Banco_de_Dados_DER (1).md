# Banco de Dados (DER)

## Sistema de Gerenciamento de Receitas

## 1. Visão geral

O sistema utiliza o banco **`banco_tcc`**, desenvolvido em **MySQL 8.0**
e administrado utilizando o **MySQL Workbench**.

O modelo organiza usuários, contas, categorias, subcategorias e
movimentações financeiras, além das informações de receitas, despesas,
parcelamentos e recuperação de acesso.

> **Importante:** o projeto utiliza **MySQL e MySQL Workbench**. Não
> utiliza SQL Server.

## 2. Tabelas

### `usuarios`

  Campo             Tipo           Chave    Nulo
  ----------------- -------------- -------- ------
  `id_usuario`      INT            PK       Não
  `nome`            VARCHAR(100)   ---      Não
  `email`           VARCHAR(150)   UNIQUE   Não
  `cargo`           VARCHAR(100)   ---      Sim
  `senha_usuario`   VARCHAR(255)   ---      Não
  `data_criacao`    DATETIME       ---      Sim

### `categorias`

  Campo            Tipo                        Chave           Nulo
  ---------------- --------------------------- --------------- ------
  `id_categoria`   INT                         PK              Não
  `id_usuario`     INT                         FK → usuarios   Não
  `nome`           VARCHAR(100)                ---             Não
  `tipo`           ENUM('RECEITA','DESPESA')   ---             Não
  `cor`            VARCHAR(20)                 ---             Sim
  `ordem`          INT                         ---             Sim

### `subcategorias`

  Campo               Tipo           Chave             Nulo
  ------------------- -------------- ----------------- ------
  `id_subcategoria`   INT            PK                Não
  `id_categoria`      INT            FK → categorias   Não
  `nome`              VARCHAR(100)   ---               Não
  `ativo`             TINYINT        ---               Sim

### `contas`

  Campo          Tipo           Chave           Nulo
  -------------- -------------- --------------- ------
  `id_conta`     INT            PK              Não
  `id_usuario`   INT            FK → usuarios   Não
  `numero`       VARCHAR(50)    ---             Sim
  `tipo`         VARCHAR(50)    ---             Sim
  `descricao`    VARCHAR(255)   ---             Sim
  `ativo`        TINYINT        ---             Sim

### `movimentacoes`

  Campo               Tipo                        Chave                Nulo
  ------------------- --------------------------- -------------------- ------
  `id_movimentacao`   INT                         PK                   Não
  `id_conta`          INT                         FK → contas          Não
  `id_categoria`      INT                         FK → categorias      Não
  `id_subcategoria`   INT                         FK → subcategorias   Sim
  `tipo`              ENUM('RECEITA','DESPESA')   ---                  Não
  `valor`             DECIMAL(10,2)               ---                  Não
  `data_lancamento`   DATE                        ---                  Não
  `descricao`         VARCHAR(255)                ---                  Sim
  `forma_pagamento`   VARCHAR(100)                ---                  Sim
  `ativo`             TINYINT                     ---                  Sim

### `receitas`

  Campo               Tipo           Chave                Nulo
  ------------------- -------------- -------------------- ------
  `id_receita`        INT            PK                   Não
  `id_movimentacao`   INT            FK → movimentacoes   Não
  `origem`            VARCHAR(100)   ---                  Sim
  `data_prevista`     DATE           ---                  Sim

### `despesas`

  Campo               Tipo          Chave                Nulo
  ------------------- ------------- -------------------- ------
  `id_despesa`        INT           PK                   Não
  `id_movimentacao`   INT           FK → movimentacoes   Não
  `data_vencimento`   DATE          ---                  Sim
  `data_pagamento`    DATE          ---                  Sim
  `status`            VARCHAR(50)   ---                  Sim

### `parcelado`

  Campo               Tipo            Chave                Nulo
  ------------------- --------------- -------------------- ------
  `id`                INT             PK                   Não
  `id_movimentacao`   INT             FK → movimentacoes   Não
  `numero_parcela`    INT             ---                  Sim
  `total_parcelas`    INT             ---                  Sim
  `valor`             DECIMAL(10,2)   ---                  Sim
  `status`            VARCHAR(50)     ---                  Sim

### `tokens_recuperacao`

  Campo          Tipo           Chave           Nulo
  -------------- -------------- --------------- ------
  `id`           INT            PK              Não
  `id_usuario`   INT            FK → usuarios   Não
  `token`        VARCHAR(255)   ---             Não
  `expiracao`    DATETIME       ---             Não
  `usado`        TINYINT        ---             Sim

## 3. Relacionamentos

``` text
USUARIOS
 ├── 1:N ── CATEGORIAS
 │            └── 1:N ── SUBCATEGORIAS
 │
 ├── 1:N ── CONTAS
 │            └── 1:N ── MOVIMENTACOES
 │                         ├── N:1 ── CATEGORIAS
 │                         ├── N:1 ── SUBCATEGORIAS
 │                         ├── 1:N ── RECEITAS
 │                         ├── 1:N ── DESPESAS
 │                         └── 1:N ── PARCELADO
 │
 └── 1:N ── TOKENS_RECUPERACAO
```

## 4. Chaves estrangeiras

-   `categorias.id_usuario` → `usuarios.id_usuario`
-   `contas.id_usuario` → `usuarios.id_usuario`
-   `subcategorias.id_categoria` → `categorias.id_categoria`
-   `movimentacoes.id_conta` → `contas.id_conta`
-   `movimentacoes.id_categoria` → `categorias.id_categoria`
-   `movimentacoes.id_subcategoria` → `subcategorias.id_subcategoria`
-   `receitas.id_movimentacao` → `movimentacoes.id_movimentacao`
-   `despesas.id_movimentacao` → `movimentacoes.id_movimentacao`
-   `parcelado.id_movimentacao` → `movimentacoes.id_movimentacao`
-   `tokens_recuperacao.id_usuario` → `usuarios.id_usuario`

## 5. Características do banco

-   **Banco:** `banco_tcc`
-   **SGBD:** MySQL 8.0.45
-   **Ferramenta:** MySQL Workbench
-   **Engine:** InnoDB
-   **Charset:** utf8mb4
-   Chaves primárias com `AUTO_INCREMENT`
-   E-mail de usuário com restrição `UNIQUE`
-   Integridade referencial por chaves estrangeiras
