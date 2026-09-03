# RF-003, RF-004, RF-005/006 — Lançamentos Financeiros

API REST para criação, listagem, edição e exclusão de receitas e despesas do Sistema de Gerenciamento Financeiro.

**Stack:** Node.js • Express • MySQL  
**Arquitetura:** Model → Repository → Controller → Routes

---

## Arquivos criados

src/
├── controllers/ → receitaController.js, despesaController.js
├── models/ → Movimentacao.js, Receita.js, Despesa.js
├── repositories/ → movimentacaoRepository.js, receitaRepository.js, despesaRepository.js, parceladoRepository.js
└── routes/ → receitaRoutes.js, despesaRoutes.js


---

## Registrar no routes.js

```javascript
import receitaRoutes from './receitaRoutes.js';
import despesaRoutes from './despesaRoutes.js';

routes.use('/receitas', receitaRoutes);
routes.use('/despesas', despesaRoutes);
```

---

## Regras de Negócio

- Toda movimentação é salva em `movimentacoes` e depois na tabela específica (`receitas` ou `despesas`)
- Despesas podem ser **parceladas** — cada parcela gera uma movimentação separada com valor dividido igualmente e mês incrementado automaticamente
- Exclusão é **soft delete** — `ativo = 0` preserva o histórico financeiro
- Apenas `DIRETOR_FINANCEIRO` pode criar, editar e deletar
- `CEO` e `GERENTE` apenas visualizam

---

## Rotas

| Método | Rota | Descrição | Cargo |
|--------|------|-----------|-------|
| POST | `/receitas` | Cria uma receita | DIRETOR_FINANCEIRO |
| GET | `/receitas` | Lista todas as receitas | Todos |
| GET | `/receitas/conta/:id_conta` | Lista receitas por conta | Todos |
| GET | `/receitas/:id` | Busca receita por ID | Todos |
| PUT | `/receitas/:id` | Atualiza uma receita | DIRETOR_FINANCEIRO |
| DELETE | `/receitas/:id` | Soft delete de receita | DIRETOR_FINANCEIRO |
| POST | `/despesas` | Cria despesa simples ou parcelada | DIRETOR_FINANCEIRO |
| GET | `/despesas` | Lista todas as despesas | Todos |
| GET | `/despesas/conta/:id_conta` | Lista despesas por conta | Todos |
| GET | `/despesas/:id` | Busca despesa por ID | Todos |
| PUT | `/despesas/:id` | Atualiza uma despesa | DIRETOR_FINANCEIRO |
| DELETE | `/despesas/:id` | Soft delete de despesa | DIRETOR_FINANCEIRO |

---

## Endpoints

### POST `/receitas`

**Body:**
```json
{
  "id_conta": 1,
  "id_categoria": 1,
  "id_subcategoria": 1,
  "valor": 15000.00,
  "data_lancamento": "2026-07-01",
  "descricao": "Venda de produtos julho",
  "forma_pagamento": "PIX",
  "origem": "Cliente ABC Ltda",
  "data_prevista": "2026-07-05"
}
```

| Campo | Obrigatório |
|-------|-------------|
| id_conta | ✅ |
| id_categoria | ✅ |
| valor | ✅ |
| data_lancamento | ✅ |
| id_subcategoria, descricao, forma_pagamento, origem, data_prevista | ❌ |

```json
// 201 - Sucesso
{ "sucesso": true, "mensagem": "Receita criada com sucesso", "dados": { "id_movimentacao": 1 } }

// 400 - Campos faltando
{ "sucesso": false, "mensagem": "Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento" }

// 403 - Sem permissão
{ "sucesso": false, "mensagem": "Acesso negado: você não tem permissão para esta ação" }
```

---

### GET `/receitas` e `/receitas/conta/:id_conta`

```json
// 200 - Sucesso
{
  "sucesso": true,
  "dados": [
    {
      "id_movimentacao": 1, "id_receita": 1, "id_conta": 1,
      "tipo": "RECEITA", "valor": "15000.00",
      "data_lancamento": "2026-07-01", "origem": "Cliente ABC Ltda"
    }
  ]
}
```

---

### PUT `/receitas/:id`

Mesmos campos do POST. Atualiza movimentação e receita.

```json
// 200 - Sucesso
{ "sucesso": true, "mensagem": "Receita atualizada com sucesso" }

// 404 - Não encontrada
{ "sucesso": false, "mensagem": "Receita não encontrada" }
```

---

### DELETE `/receitas/:id`

Soft delete — seta `ativo = 0`. Registro permanece no banco.

```json
// 200 - Sucesso
{ "sucesso": true, "mensagem": "Receita removida com sucesso" }

// 404 - Não encontrada
{ "sucesso": false, "mensagem": "Receita não encontrada" }
```

---

### POST `/despesas`

**Body — Despesa simples:**
```json
{
  "id_conta": 1,
  "id_categoria": 3,
  "valor": 5000.00,
  "data_lancamento": "2026-07-05",
  "descricao": "Salário funcionário João",
  "forma_pagamento": "Transferência",
  "data_vencimento": "2026-07-05",
  "status": "PENDENTE"
}
```

**Body — Despesa parcelada:**
```json
{
  "id_conta": 1,
  "id_categoria": 3,
  "valor": 6000.00,
  "data_lancamento": "2026-07-01",
  "descricao": "Computadores para escritório",
  "forma_pagamento": "Cartão de Crédito",
  "data_vencimento": "2026-07-15",
  "status": "PENDENTE",
  "parcelado": true,
  "total_parcelas": 3
}
```

| Campo | Obrigatório |
|-------|-------------|
| id_conta | ✅ |
| id_categoria | ✅ |
| valor | ✅ |
| data_lancamento | ✅ |
| id_subcategoria, descricao, forma_pagamento, data_vencimento, data_pagamento, status, parcelado, total_parcelas | ❌ |

```json
// 201 - Despesa simples
{ "sucesso": true, "mensagem": "Despesa criada com sucesso", "dados": { "id_movimentacao": 5 } }

// 201 - Despesa parcelada
{ "sucesso": true, "mensagem": "Despesa parcelada em 3x criada com sucesso", "dados": { "ids_movimentacoes": [6, 7, 8] } }

// 400 - Campos faltando
{ "sucesso": false, "mensagem": "Preencha todos os campos obrigatórios: id_conta, id_categoria, valor e data_lancamento" }
```

---

### PUT `/despesas/:id`

Mesmos campos do POST sem `parcelado` e `total_parcelas`. Usado também para marcar como **PAGO**:

```json
{
  "id_conta": 1,
  "id_categoria": 4,
  "valor": 3500.00,
  "data_lancamento": "2026-07-01",
  "data_vencimento": "2026-07-10",
  "data_pagamento": "2026-07-08",
  "status": "PAGO"
}
```

```json
// 200 - Sucesso
{ "sucesso": true, "mensagem": "Despesa atualizada com sucesso" }

// 404 - Não encontrada
{ "sucesso": false, "mensagem": "Despesa não encontrada" }
```

---

### DELETE `/despesas/:id`

Soft delete — seta `ativo = 0`. Registro permanece no banco.

```json
// 200 - Sucesso
{ "sucesso": true, "mensagem": "Despesa removida com sucesso" }

// 404 - Não encontrada
{ "sucesso": false, "mensagem": "Despesa não encontrada" }
```

---

## Códigos de Status HTTP

| Código | Quando ocorre |
|--------|---------------|
| 200 | Listagem, busca, atualização ou exclusão bem-sucedida |
| 201 | Receita ou despesa criada com sucesso |
| 400 | Campos obrigatórios faltando ou ID inválido |
| 403 | Cargo sem permissão |
| 404 | Não encontrada ou já deletada |
| 500 | Erro no servidor ou validação no Model |

---

## Observações Técnicas

- **Tabela central:** toda movimentação passa por `movimentacoes` primeiro. O `insertId` é usado para inserir na tabela específica.
- **Parcelamento:** divide o valor total pelo número de parcelas e cria uma movimentação por parcela, incrementando o mês automaticamente.
- **Soft delete (RF-005/006):** `ativo = 0` em `movimentacoes`. Listagens sempre filtram por `ativo = 1`.
- **Status da despesa:** padrão `PENDENTE`. Atualizar para `PAGO` via `PUT` quando o pagamento for efetuado.
