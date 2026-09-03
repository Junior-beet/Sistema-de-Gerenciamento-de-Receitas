# Guia do Programador

## Sistema de Gerenciamento de Receitas

**Equipe:** BrTech Solutions

## 1. Visão geral

O Sistema de Gerenciamento de Receitas é uma aplicação acadêmica para
gerenciamento de informações financeiras. O projeto utiliza **React,
JavaScript, HTML5 e CSS3** no front-end, **Node.js e Express** no
back-end e **MySQL** no banco de dados.

O banco utilizado é o `banco_tcc`, desenvolvido e administrado por meio
do **MySQL Workbench**.

## 2. Tecnologias

### Front-end

-   HTML5
-   CSS3
-   JavaScript
-   React

### Back-end

-   Node.js
-   Express

### Banco de dados

-   MySQL 8.0
-   MySQL Workbench

## 3. Organização do back-end

``` text
controllers/
services/
repositories/
models/
routes/
middlewares/
```

  Camada           Função
  ---------------- ----------------------------------------------------
  `controllers`    Recebe requisições e retorna respostas da API.
  `services`       Concentra as regras de negócio.
  `repositories`   Faz a comunicação com o banco de dados.
  `models`         Representa as entidades utilizadas pela aplicação.
  `routes`         Define as rotas e endpoints da API.
  `middlewares`    Executa autenticação e validações.

## 4. Banco de dados

O banco `banco_tcc` possui 9 tabelas:

-   `usuarios`
-   `categorias`
-   `subcategorias`
-   `contas`
-   `movimentacoes`
-   `receitas`
-   `despesas`
-   `parcelado`
-   `tokens_recuperacao`

A tabela `movimentacoes` concentra os principais lançamentos financeiros
e possui relacionamentos com contas, categorias e subcategorias.

## 5. Regras principais

-   Movimentações podem ser do tipo `RECEITA` ou `DESPESA`.
-   Cada movimentação possui valor e data de lançamento.
-   A movimentação está vinculada a uma conta e a uma categoria.
-   A subcategoria é opcional.
-   Categorias e contas pertencem a usuários.
-   Subcategorias pertencem a categorias.
-   Receitas e despesas possuem dados complementares.
-   Parcelamentos são relacionados às movimentações.
-   O e-mail do usuário é único.
-   Tokens de recuperação são vinculados aos usuários.

## 6. Autenticação

O projeto utiliza **JWT** para autenticação e **bcrypt** para proteção
das senhas.

A tabela `tokens_recuperacao` armazena o token, sua data de expiração e
se ele já foi utilizado.

## 7. Fluxo da aplicação

``` text
Cliente
   ↓
Routes
   ↓
Middlewares
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
MySQL
```

## 8. Manutenção

Ao alterar uma funcionalidade, deve-se verificar a regra de negócio, as
tabelas envolvidas, as rotas e os dados gravados no banco.

O **MySQL Workbench** pode ser utilizado para consultar e verificar a
estrutura e os relacionamentos do banco.

> **Importante:** o projeto utiliza **MySQL/MySQL Workbench**. Não
> utiliza SQL Server.
