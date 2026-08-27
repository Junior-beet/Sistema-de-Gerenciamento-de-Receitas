# Sistema de Gerenciamento de Receitas - Back-end

API RESTful para gerenciamento financeiro, construída com **Node.js**, **Express**, **MySQL** e autenticação **JWT**.

## Arquitetura

O projeto segue uma arquitetura em camadas com clara separação de responsabilidades:

**Routes** — Definem os endpoints HTTP e aplicam middlewares (autenticação e controle de acesso por perfil)
**Controllers** — Contêm a lógica de negócio, validações e orquestram as operações
**Repositories** — Responsáveis pelo acesso direto ao banco de dados via SQL bruto (mysql2/promise)
**Models** — Entidades de domínio com campos privados (ES2022 #), validações nos setters e métodos de fábrica estáticos
**Middlewares** — Verificação JWT e controle de acesso por cargo (GERENTE, DIRETOR_FINANCEIRO, CEO)

---

## API de CRUD de Receitas

A API de receitas permite o gerenciamento completo de entradas financeiras. Cada receita é vinculada a uma **movimentação** central, que armazena os dados comuns (conta, categoria, valor, data, descrição, forma de pagamento), enquanto a tabela receitas complementa com campos específicos como **origem** e **data prevista**.

### Endpoints

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | /receitas/ | Listar todas as receitas | Qualquer usuário autenticado |
| GET | /receitas/conta/:id_conta | Listar receitas por conta | Qualquer usuário autenticado |
| GET | /receitas/:id | Buscar receita por ID | Qualquer usuário autenticado |
| POST | /receitas/ | Criar nova receita | DIRETOR_FINANCEIRO |
| PUT | /receitas/:id | Atualizar receita | DIRETOR_FINANCEIRO |
| DELETE | /receitas/:id | Excluir receita | DIRETOR_FINANCEIRO |

### Campos ao criar/editar receita

| Campo | Obrigatório | Descrição |
|-------|:-----------:|-----------|
| id_conta | Sim | ID da conta associada |
| id_categoria | Sim | ID da categoria |
| id_subcategoria | Não | ID da subcategoria |
| valor | Sim | Valor da receita (decimal, > 0) |
| data_lancamento | Sim | Data de lançamento |
| descricao | Não | Descrição da receita |
| forma_pagamento | Não | Forma de pagamento |
| origem | Não | Origem do recebimento |
| data_prevista | Não | Data prevista de recebimento |

---

## API de CRUD de Despesas

A API de despesas gerencia todas as saídas financeiras. Assim como receitas, cada despesa é vinculada a uma **movimentação** central, enquanto a tabela despesas complementa com campos específicos: **data de vencimento**, **data de pagamento** e **status** (PENDENTE, PAGO, etc.).

### Endpoints

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | /despesas/ | Listar todas as despesas | Qualquer usuário autenticado |
| GET | /despesas/conta/:id_conta | Listar despesas por conta | Qualquer usuário autenticado |
| GET | /despesas/:id | Buscar despesa por ID | Qualquer usuário autenticado |
| POST | /despesas/ | Criar nova despesa | DIRETOR_FINANCEIRO |
| PUT | /despesas/:id | Atualizar despesa | DIRETOR_FINANCEIRO |
| DELETE | /despesas/:id | Excluir despesa | DIRETOR_FINANCEIRO |

### Campos ao criar/editar despesa

| Campo | Obrigatório | Descrição |
|-------|:-----------:|-----------|
| id_conta | Sim | ID da conta associada |
| id_categoria | Sim | ID da categoria |
| id_subcategoria | Não | ID da subcategoria |
| valor | Sim | Valor total da despesa (decimal, > 0) |
| data_lancamento | Sim | Data de lançamento |
| descricao | Não | Descrição da despesa |
| forma_pagamento | Não | Forma de pagamento |
| data_vencimento | Não | Data de vencimento |
| data_pagamento | Não | Data de pagamento |
| status | Não | Status da despesa (padrão: PENDENTE) |
| parcelado | Não | Se true, gera parcelas automaticamente |
| total_parcelas | Não | Quantidade de parcelas (usado quando parcelado: true) |

---

## Parcelamento de Despesas

O sistema de parcelamento está integrado ao endpoint de criação de despesas (POST /despesas/). Quando os campos parcelado: true e total_parcelas são enviados no corpo da requisição, a API gera automaticamente todas as parcelas.

### Como funciona

1. **Divisão do valor:** O valor total é dividido pelo número de parcelas, com arredondamento para duas casas decimais.
2. **Geração em loop:** Para cada parcela i (de 1 até total_parcelas):
   - A data_lancamento é incrementada em (i - 1) meses em relação à data original.
   - A descrição recebe um sufixo com o número da parcela — Ex: "Despesa internet (1/3)", "Despesa internet (2/3)", "Despesa internet (3/3)".
   - São criados **três registros** interligados:
     - Uma **movimentação** com o valor da parcela e tipo DESPESA.
     - Uma **despesa** vinculada à movimentação, com o status informado (ou PENDENTE por padrão).
     - Um registro na tabela **parcelado** com os metadados: número da parcela, total de parcelas, valor individual e status.

3. **Resposta:** O endpoint retorna um array com os IDs das movimentações criadas.

### Exemplo de payload

json
{
  "id_conta": 1,
  "id_categoria": 3,
  "valor": 300.00,
  "data_lancamento": "2026-03-15",
  "descricao": "Despesa internet",
  "parcelado": true,
  "total_parcelas": 3,
  "data_vencimento": "2026-03-20",
  "status": "PENDENTE"
}
Isso gera 3 despesas de R$ 100,00 cada, com datas de lançamento em março, abril e maio de 2026.

---

## Edição e Exclusão de Movimentações

### Conceito central: Movimentação

A tabela movimentacoes é a entidade central do sistema financeiro. Tanto receitas quanto despesas são "extensões" dessa tabela, vinculadas pelo campo id_movimentacao. Nunca se cria uma movimentação diretamente — ela é sempre criada como parte de uma receita ou despesa.

### Edição

A edição de uma receita ou despesa atualiza **duas tabelas** de forma simultânea:

1. **Movimentação** — Os campos comuns são atualizados (id_conta, id_categoria, id_subcategoria, valor, data_lancamento, descricao, forma_pagamento).
2. **Receita ou Despesa** — Os campos específicos do tipo são atualizados:
   - Para receitas: origem e data_prevista.
   - Para despesas: data_vencimento, data_pagamento e status.

 **Nota:** A edição de uma despesa parcelada afeta **apenas a parcela individual** correspondente ao id informado. As demais parcelas da mesma despesa original não são alteradas.

### Exclusão (Soft Delete)

A exclusão de receitas e despesas utiliza **soft delete**, ou seja, a movimentação associada recebe ativo = 0 ao invés de ser removida do banco. Como todas as consultas filtram por WHERE ativo = 1, a receita ou despesa excluída torna-se invisível nas listagens, mas os registros permanecem no banco para fins de integridade referencial e auditoria.

Ao excluir uma **receita**, a movimentação correspondente é desativada.
Ao excluir uma **despesa**, a movimentação correspondente é desativada. Os registros na tabela despesas e parcelado permanecem no banco, mas ficam ocultos nas consultas.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5.x |
| Banco de Dados | MySQL (mysql2/promise) |
| Autenticação | JWT (jsonwebtoken) — expiração de 8 horas |
| Hash de Senhas | bcrypt (10 salt rounds) |
| Envio de E-mails | Nodemailer (Gmail SMTP) |
| Variáveis de Ambiente | dotenv |
| CORS | cors (habilitado globalmente) |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| SERVER_PORT | Porta do servidor Express |
| DB_HOST | Host do MySQL |
| DB_USER | Usuário do MySQL |
| DB_PASSWORD | Senha do MySQL |
| DB_DATABASE | Nome do banco de dados |
| DB_PORT | Porta do MySQL |
| JWT_SECRET | Segredo para assinatura JWT |
| EMAIL_USER | E-mail Gmail para envio de recuperação de senha |
| EMAIL_PASS | Senha de app do Gmail |
| FRONTEND_URL | URL base do frontend (para links de redefinição de senha) |

---

## Autenticação e Perfis de Usuário

| Cargo | Permissões |
|-------|------------|
| GERENTE | Leitura de todos os dados |
| DIRETOR_FINANCEIRO | Leitura + criação, edição e exclusão de receitas, despesas, categorias, subcategorias e usuários |
| CEO | Leitura + criação, edição e exclusão (apenas um CEO permitido no sistema) |

Todas as rotas de escrita exigem autenticação JWT via header Authorization: Bearer <token> e o cargo DIRETOR_FINANCEIRO.

---

## Rotas de Senha

| Método | Rota | Descrição |
|--------|------|-----------|
| PUT | /senha/trocar | Troca a senha do usuário logado |
| POST | /senha/recuperar | Solicita recuperação e envia e-mail |
| POST | /senha/redefinir | Redefine a senha com o token do e-mail |
