# RF-007, RF-008, RF-009, RF-010, RF-014 — Cálculos, Relatórios e Auditoria

Continuação da API do Sistema de Gerenciamento Financeiro. Adição do módulo de cálculos financeiros, relatórios mensais, auditoria de ações e exportação de dados.

**Novas dependências:**
```bash
npm install pdfkit json2csv
```

---

## Arquivos adicionados
src/
├── controllers/
│ └── relatorioController.js ← novo
├── repositories/
│ └── relatorioRepository.js ← novo
├── routes/
│ └── relatorioRoutes.js ← novo
└── middlewares/
└── auditoria.middleware.js ← novo

logs/
└── auditoria.log ← criado automaticamente na primeira requisição


---

## Alterações em arquivos existentes

**`routes/routes.js`** — adicionar:
```javascript
import relatorioRoutes from './relatorioRoutes.js';

routes.use('/relatorios', relatorioRoutes);
```

**`routes/usuarioRoutes.js`** — adicionar auditoria nas rotas de escrita:
```javascript
import auditoriaMiddleware from '../middlewares/auditoria.middleware.js';

usuarioRoutes.post('/', auditoriaMiddleware('CADASTRO_USUARIO'), usuarioController.criar);
usuarioRoutes.put('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), auditoriaMiddleware('ATUALIZACAO_USUARIO'), usuarioController.atualizar);
usuarioRoutes.delete('/:id', authMiddleware, cargoMiddleware('DIRETOR_FINANCEIRO'), auditoriaMiddleware('EXCLUSAO_USUARIO'), usuarioController.deletar);
```

---

## Decisões técnicas

- **RF-007:** saldo calculado na hora via SQL — sem salvar no banco, sempre atualizado
- **RF-008:** lucro = total receitas menos total despesas do período informado
- **RF-009:** relatório mensal completo com resumo, movimentações, saldo histórico e resultado
- **RF-010:** log salvo em `logs/auditoria.log` — pasta criada automaticamente se não existir
- **RF-014:** PDF gerado com pdfkit e deletado do servidor após download — CSV enviado direto na resposta

---

## Novas rotas

| Método | Rota | Descrição | RF |
|--------|------|-----------|-----|
| GET | `/relatorios/saldo` | Saldo de todas as contas | RF-007 |
| GET | `/relatorios/saldo/:id_conta` | Saldo de uma conta específica | RF-007 |
| GET | `/relatorios/lucro` | Lucro por período | RF-008 |
| GET | `/relatorios/mensal` | Relatório mensal completo | RF-009 |
| GET | `/relatorios/exportar/pdf` | Exporta relatório em PDF | RF-014 |
| GET | `/relatorios/exportar/csv` | Exporta relatório em CSV | RF-014 |

Todas as rotas exigem token JWT e registram log de auditoria automaticamente.

---

## Endpoints

### GET `/relatorios/saldo`

Retorna saldo de todas as contas — total de receitas, despesas e saldo calculado.

```json
// 200 - Sucesso
{
  "sucesso": true,
  "dados": [
    {
      "id_conta": "uuid",
      "numero": "001",
      "tipo": "Corrente",
      "descricao": "Conta principal",
      "total_receitas": 15000.00,
      "total_despesas": 8500.00,
      "saldo": 6500.00
    }
  ]
}
```

---

### GET `/relatorios/saldo/:id_conta`

Retorna saldo de uma conta específica.

```json
// 200 - Sucesso
{
  "sucesso": true,
  "dados": {
    "id_conta": "uuid",
    "numero": "001",
    "total_receitas": 15000.00,
    "total_despesas": 8500.00,
    "saldo": 6500.00
  }
}

// 404 - Não encontrada
{ "sucesso": false, "mensagem": "Conta não encontrada" }
```

---

### GET `/relatorios/lucro?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD`

Calcula lucro ou prejuízo em um período.

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| data_inicio | ✅ | Data inicial `YYYY-MM-DD` |
| data_fim | ✅ | Data final `YYYY-MM-DD` |

```json
// 200 - Lucro
{
  "sucesso": true,
  "dados": {
    "total_receitas": 15000.00,
    "total_despesas": 8500.00,
    "lucro": 6500.00,
    "resultado": "LUCRO"
  }
}

// 200 - Prejuízo
{
  "sucesso": true,
  "dados": {
    "total_receitas": 5000.00,
    "total_despesas": 8500.00,
    "lucro": -3500.00,
    "resultado": "PREJUIZO"
  }
}

// 400 - Parâmetros faltando
{ "sucesso": false, "mensagem": "Informe data_inicio e data_fim" }
```

---

### GET `/relatorios/mensal?ano=YYYY&mes=M`

Relatório financeiro completo de um mês.

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| ano | ✅ | Ex: `2026` |
| mes | ✅ | Ex: `7` |

```json
// 200 - Sucesso
{
  "sucesso": true,
  "dados": {
    "periodo": {
      "ano": 2026,
      "mes": 7,
      "data_inicio": "2026-07-01",
      "data_fim": "2026-07-31"
    },
    "resumo": {
      "total_receitas": 15000.00,
      "total_despesas": 8500.00,
      "lucro": 6500.00
    },
    "saldo_geral": 6500.00,
    "resultado": "LUCRO",
    "movimentacoes": [
      {
        "id_movimentacao": "uuid",
        "tipo": "RECEITA",
        "valor": "15000.00",
        "data_lancamento": "2026-07-01",
        "descricao": "Venda de produtos julho",
        "categoria": "Vendas",
        "subcategoria": null,
        "forma_pagamento": "PIX"
      }
    ]
  }
}

// 400 - Parâmetros faltando
{ "sucesso": false, "mensagem": "Informe ano e mes" }
```

---

### GET `/relatorios/exportar/pdf?ano=YYYY&mes=M`

Gera e faz download do relatório mensal em PDF.

**Resposta:** download do arquivo `relatorio_2026_07.pdf`

O PDF contém resumo financeiro do mês e lista completa de movimentações. O arquivo é deletado do servidor após o download.

---

### GET `/relatorios/exportar/csv?ano=YYYY&mes=M`

Exporta movimentações do mês em CSV com as colunas: tipo, valor, data, descrição, categoria, subcategoria e forma de pagamento.

**Resposta:** download do arquivo `relatorio_2026_07.csv`

---

## RF-010 — Auditoria

O `auditoriaMiddleware` é aplicado em todas as rotas do sistema e registra cada ação em `logs/auditoria.log`.

**Formato do log:**
[2026-07-10T19:00:00.000Z] | USUARIO: Miguel Vallim (DIRETOR_FINANCEIRO) | ACAO: CONSULTA_RELATORIO_MENSAL | METODO: GET | ROTA: /relatorios/mensal?ano=2026&mes=7 | IP: ::1


**Ações registradas:**

| Ação | Rota |
|------|------|
| CADASTRO_USUARIO | POST /usuarios |
| ATUALIZACAO_USUARIO | PUT /usuarios/:id |
| EXCLUSAO_USUARIO | DELETE /usuarios/:id |
| CONSULTA_SALDO_TODAS_CONTAS | GET /relatorios/saldo |
| CONSULTA_SALDO_CONTA | GET /relatorios/saldo/:id_conta |
| CONSULTA_LUCRO | GET /relatorios/lucro |
| CONSULTA_RELATORIO_MENSAL | GET /relatorios/mensal |
| EXPORTACAO_PDF | GET /relatorios/exportar/pdf |
| EXPORTACAO_CSV | GET /relatorios/exportar/csv |

---

## Códigos de Status HTTP

| Código | Quando ocorre |
|--------|---------------|
| 200 | Consulta ou exportação bem-sucedida |
| 400 | Parâmetros obrigatórios faltando |
| 404 | Conta não encontrada |
| 500 | Erro no servidor ao calcular ou exportar |

---

## Observações Técnicas

- **Saldo sempre atualizado:** calculado via SQL com `SUM + CASE WHEN` — não armazenado no banco.
- **Soft delete respeitado:** todas as queries filtram por `ativo = 1` — movimentações deletadas não entram nos cálculos.
- **Saldo histórico vs saldo do mês:** o relatório mensal separa o lucro do mês do saldo geral histórico de todas as movimentações.
- **PDF temporário:** salvo na pasta `relatorios/` e deletado do servidor após o download.
- **CSV direto:** enviado na resposta sem salvar arquivo no servidor.
- **Log de auditoria:** aplicado após o `authMiddleware`, sempre tem acesso ao nome e cargo do usuário logado em `req.usuario`.
