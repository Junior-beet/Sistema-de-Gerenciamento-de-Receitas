# 📚 Projeto "Sistema de Gerencimento de Receitas"

Bem-vindo à **Sistema de Gerencimento de Receitas**.
Este repositório contém a documentação e implementação de um sistema de gerencimento de receitas desenvolvido pela equipe BrTech solutions

## 🎯 Objetivo

Projeto acadêmico com o objetivo de apoiar o ensino de **back-end e front-end**, abordando conceitos como:

* Arquitetura de sistemas
* Modelagem de dados (DER)
* Programação orientada a objetos
* Desenvolvimento de interfaces
* Boas práticas de organização de código

## 🛠️ Tecnologias Utilizadas

### 🌐 Front-end

* HTML5
* CSS3
* JavaScript
* React

### ⚙️ Back-end

* Node.js
* Express

### 🗄️ Banco de Dados

* SQLServer

## 📂 Documentação

A documentação do projeto está organizada por público e finalidade:

### 👨‍💻 Para Programadores

Contém informações técnicas para desenvolvimento e manutenção do sistema:

* 📄 [Guia do Programador](./programadores.md)
* 🧩 [Diagrama de Classes](./classes.md)
* 🗄️ [Banco de Dados (DER)](./database.md)

### 👤 Para Clientes

Documentação voltada à visão do sistema e sua utilização:

* 📄 [Guia do Cliente](./clientes.md)
* 🎨 [Design System](./design-system.md)

### 🛠️ Para Administradores

Informações sobre gerenciamento e operação do sistema:

* 📄 [Guia do Administrador](./administradores.md)

## 📌 Observações

Este projeto tem fins educacionais e busca simular um ambiente real de desenvolvimento, incluindo documentação técnica e organização profissional.

## 💰 Lógica inicial de saldo e estrutura de contas

O sistema foi desenvolvido utilizando uma estrutura centralizada de movimentações financeiras, permitindo que todos os cálculos sejam realizados de forma automática, organizada e escalável.

A base principal da lógica financeira está na tabela movimentacoes, responsável por armazenar todas as entradas e saídas do sistema.

Cada movimentação contém informações essenciais como:

* tipo da movimentação (RECEITA ou DESPESA);
* valor;
* conta vinculada;
* categoria e subcategoria;
* data do lançamento;
* descrição;
* forma de pagamento.

A partir dessa estrutura, o sistema consegue calcular automaticamente:

* saldo total;
* total de receitas;
* total de despesas;
* gastos por categoria;
* relatórios mensais;
* movimentações por período;
* dashboards financeiros.

# Centralização das Regras Financeiras

Toda a lógica de cálculo do sistema é baseada na tabela movimentacoes.
Dessa forma, evita-se duplicação de informações e inconsistências nos valores armazenados.

As tabelas receitas e despesas funcionam como complementos especializados, armazenando informações específicas de cada tipo de movimentação.

# Receitas

A tabela receitas armazena dados complementares como:

* origem da receita;
* data prevista de recebimento.
* Despesas

A tabela despesas armazena informações como:

* data de vencimento;
* data de pagamento;
* status da despesa.

# Sistema de Parcelamento

O sistema também possui suporte para movimentações parceladas através da tabela parcelado.

Essa estrutura permite:

* geração automática de parcelas;
* controle de quantidade total de parcelas;
* acompanhamento de status de pagamento;
* organização financeira mensal.

# Organização por Categorias

As tabelas categorias e subcategorias foram implementadas para melhorar a organização financeira e geração de relatórios.

Com isso, o sistema consegue identificar:

* categorias com maiores gastos;
* principais fontes de receita;
* distribuição financeira por área;
* análises detalhadas de movimentações.
* Controle de Acesso (RBAC)

# Implementação no Backend

O backend será responsável por toda a lógica de negócio do sistema financeiro, incluindo autenticação, controle de acesso, cálculos automáticos e gerenciamento das movimentações.

A aplicação será organizada em camadas para facilitar manutenção e escalabilidade:

```txt id="4mw1py"
controllers/
services/
repositories/
models/
routes/
middlewares/
```

* **Controllers:** recebem as requisições e retornam as respostas da API;
* **Services:** concentram as regras de negócio e cálculos financeiros;
* **Repositories:** realizam a comunicação com o banco de dados;
* **Models:** representam as entidades do sistema;
* **Routes:** definem os endpoints da API;
* **Middlewares:** realizam autenticação, validações e controle de acesso.

O sistema utilizará autenticação com JWT e criptografia de senhas com bcrypt.

Os cálculos financeiros serão feitos dinamicamente utilizando a tabela `movimentacoes` como base principal, permitindo gerar:

* saldo total;
* receitas;
* despesas;
* relatórios;
* dashboards financeiros.

O backend também será responsável pelo gerenciamento de parcelamentos, filtros e geração de relatórios financeiros em formato JSON para o frontend.


