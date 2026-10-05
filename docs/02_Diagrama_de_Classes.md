# Diagrama de Classes

## Sistema de Gerenciamento de Receitas

## 1. Objetivo

Este documento apresenta as principais entidades do sistema e seus relacionamentos, considerando a estrutura atual do banco `banco_tcc`.

## 2. Diagrama

```mermaid
classDiagram
class Usuario { +id_usuario : CHAR(36) +nome : VARCHAR(100) +email : VARCHAR(150) +cargo : VARCHAR(100) +senha_usuario : VARCHAR(255) +data_criacao : DATETIME }
class Categoria { +id_categoria : CHAR(36) +id_usuario : CHAR(36) +nome : VARCHAR(100) +tipo : ENUM +cor : VARCHAR(20) +ordem : INT }
class Subcategoria { +id_subcategoria : CHAR(36) +id_categoria : CHAR(36) +nome : VARCHAR(100) +ativo : TINYINT }
class Conta { +id_conta : CHAR(36) +id_usuario : CHAR(36) +numero : VARCHAR(50) +tipo : VARCHAR(50) +descricao : VARCHAR(255) +ativo : TINYINT }
class Movimentacao { +id_movimentacao : CHAR(36) +id_conta : CHAR(36) +id_categoria : CHAR(36) +id_subcategoria : CHAR(36) +tipo : ENUM +valor : DECIMAL(10,2) +data_lancamento : DATE +descricao : VARCHAR(255) +forma_pagamento : VARCHAR(100) +ativo : TINYINT }
class Receita { +id_receita : CHAR(36) +id_movimentacao : CHAR(36) +origem : VARCHAR(100) +data_prevista : DATE }
class Despesa { +id_despesa : CHAR(36) +id_movimentacao : CHAR(36) +data_vencimento : DATE +data_pagamento : DATE +status : VARCHAR(50) }
class Parcelado { +id : CHAR(36) +id_movimentacao : CHAR(36) +numero_parcela : INT +total_parcelas : INT +valor : DECIMAL(10,2) +status : VARCHAR(50) }
class TokenRecuperacao { +id : CHAR(36) +id_usuario : CHAR(36) +token : VARCHAR(255) +expiracao : DATETIME +usado : TINYINT }
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

| Classe | Responsabilidade |
|---|---|
| `Usuario` | Armazena os dados e informações de acesso do usuário. |
| `Categoria` | Organiza as movimentações por categoria e tipo. |
| `Subcategoria` | Detalha uma categoria. |
| `Conta` | Representa a conta vinculada às movimentações. |
| `Movimentacao` | Registra os lançamentos financeiros. |
| `Receita` | Armazena informações complementares de receitas. |
| `Despesa` | Armazena informações complementares de despesas. |
| `Parcelado` | Controla informações de parcelamento. |
| `TokenRecuperacao` | Controla tokens de recuperação de acesso. |

## 4. Relacionamentos

- Um `Usuario` pode possuir várias `Categoria`.
- Um `Usuario` pode possuir várias `Conta`.
- Um `Usuario` pode possuir vários `TokenRecuperacao`.
- Uma `Categoria` pode possuir várias `Subcategoria`.
- Uma `Conta` pode estar relacionada a várias `Movimentacao`.
- Uma `Categoria` pode estar relacionada a várias `Movimentacao`.
- Uma `Subcategoria` pode estar relacionada a várias `Movimentacao`.
- Uma `Movimentacao` pode possuir registros em `Receita`.
- Uma `Movimentacao` pode possuir registros em `Despesa`.
- Uma `Movimentacao` pode possuir registros em `Parcelado`.

## 5. Observação

Os identificadores do banco atual utilizam `CHAR(36)` com geração padrão por `UUID()`. Portanto, o diagrama foi atualizado para não utilizar `INT` como tipo das chaves identificadoras.
