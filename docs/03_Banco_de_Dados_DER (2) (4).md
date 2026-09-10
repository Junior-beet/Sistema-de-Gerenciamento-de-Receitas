# Banco de Dados (DER)

## Sistema de Gerenciamento de Receitas

## 1. Visão geral

O sistema utiliza o banco **`banco_tcc`**, desenvolvido em **MySQL 8.0.45** e administrado utilizando o **MySQL Workbench**. O dump informa o banco `banco_tcc` e o servidor MySQL 8.0.45.

> **Importante:** o projeto utiliza **MySQL e MySQL Workbench**. Não utiliza SQL Server.

## 2. Estrutura do banco

O banco possui 9 tabelas:

- `usuarios`
- `categorias`
- `subcategorias`
- `contas`
- `movimentacoes`
- `receitas`
- `despesas`
- `parcelado`
- `tokens_recuperacao`

## 3. Tabelas

### 3.1 `usuarios`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_usuario` | CHAR(36) | PK | Não |
| `nome` | VARCHAR(100) | — | Não |
| `email` | VARCHAR(150) | UNIQUE | Não |
| `cargo` | VARCHAR(100) | — | Sim |
| `senha_usuario` | VARCHAR(255) | — | Não |
| `data_criacao` | DATETIME | — | Sim |

### 3.2 `categorias`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_categoria` | CHAR(36) | PK | Não |
| `id_usuario` | CHAR(36) | FK → usuarios | Não |
| `nome` | VARCHAR(100) | — | Não |
| `tipo` | ENUM('RECEITA','DESPESA') | — | Não |
| `cor` | VARCHAR(20) | — | Sim |
| `ordem` | INT | — | Sim |

### 3.3 `subcategorias`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_subcategoria` | CHAR(36) | PK | Não |
| `id_categoria` | CHAR(36) | FK → categorias | Não |
| `nome` | VARCHAR(100) | — | Não |
| `ativo` | TINYINT | — | Sim |

### 3.4 `contas`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_conta` | CHAR(36) | PK | Não |
| `id_usuario` | CHAR(36) | FK → usuarios | Não |
| `numero` | VARCHAR(50) | — | Sim |
| `tipo` | VARCHAR(50) | — | Sim |
| `descricao` | VARCHAR(255) | — | Sim |
| `ativo` | TINYINT | — | Sim |

### 3.5 `movimentacoes`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_movimentacao` | CHAR(36) | PK | Não |
| `id_conta` | CHAR(36) | FK → contas | Não |
| `id_categoria` | CHAR(36) | FK → categorias | Não |
| `id_subcategoria` | CHAR(36) | FK → subcategorias | Sim |
| `tipo` | ENUM('RECEITA','DESPESA') | — | Não |
| `valor` | DECIMAL(10,2) | — | Não |
| `data_lancamento` | DATE | — | Não |
| `descricao` | VARCHAR(255) | — | Sim |
| `forma_pagamento` | VARCHAR(100) | — | Sim |
| `ativo` | TINYINT | — | Sim |

### 3.6 `receitas`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_receita` | CHAR(36) | PK | Não |
| `id_movimentacao` | CHAR(36) | FK → movimentacoes | Não |
| `origem` | VARCHAR(100) | — | Sim |
| `data_prevista` | DATE | — | Sim |

### 3.7 `despesas`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id_despesa` | CHAR(36) | PK | Não |
| `id_movimentacao` | CHAR(36) | FK → movimentacoes | Não |
| `data_vencimento` | DATE | — | Sim |
| `data_pagamento` | DATE | — | Sim |
| `status` | VARCHAR(50) | — | Sim |

### 3.8 `parcelado`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id` | CHAR(36) | PK | Não |
| `id_movimentacao` | CHAR(36) | FK → movimentacoes | Não |
| `numero_parcela` | INT | — | Sim |
| `total_parcelas` | INT | — | Sim |
| `valor` | DECIMAL(10,2) | — | Sim |
| `status` | VARCHAR(50) | — | Sim |

### 3.9 `tokens_recuperacao`

| Campo | Tipo | Chave | Nulo |
|---|---|---|---|
| `id` | CHAR(36) | PK | Não |
| `id_usuario` | CHAR(36) | FK → usuarios | Não |
| `token` | VARCHAR(255) | — | Não |
| `expiracao` | DATETIME | — | Não |
| `usado` | TINYINT | — | Sim |

## 4. Relacionamentos

```text
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

## 5. Chaves estrangeiras

- `categorias.id_usuario` → `usuarios.id_usuario`
- `contas.id_usuario` → `usuarios.id_usuario`
- `subcategorias.id_categoria` → `categorias.id_categoria`
- `movimentacoes.id_conta` → `contas.id_conta`
- `movimentacoes.id_categoria` → `categorias.id_categoria`
- `movimentacoes.id_subcategoria` → `subcategorias.id_subcategoria`
- `receitas.id_movimentacao` → `movimentacoes.id_movimentacao`
- `despesas.id_movimentacao` → `movimentacoes.id_movimentacao`
- `parcelado.id_movimentacao` → `movimentacoes.id_movimentacao`
- `tokens_recuperacao.id_usuario` → `usuarios.id_usuario`

## 6. Características do banco

- **Banco:** `banco_tcc`
- **SGBD:** MySQL 8.0.45
- **Ferramenta:** MySQL Workbench
- **Engine:** InnoDB
- **Charset:** `utf8mb4`
- Identificadores principais utilizando `CHAR(36)` e `UUID()` como valor padrão.
- E-mail de usuário com restrição `UNIQUE`.
- Integridade referencial por chaves estrangeiras.

## 7. Observação

O banco atualizado utiliza UUIDs em `CHAR(36)` para os identificadores. A documentação anterior que apresentava IDs como `INT` foi atualizada para refletir a estrutura atual.
