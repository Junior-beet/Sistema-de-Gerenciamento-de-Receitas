# 🛠️ Guia do Administrador

## 1. Apresentação

O **Guia do Administrador** apresenta as principais funções para gerenciar e manter o Sistema de Gerenciamento de Receitas.

O sistema utiliza **MySQL** para armazenar e organizar os dados financeiros.

## 2. Acesso Administrativo

O administrador deve realizar o login com uma conta autorizada. Seu acesso possui permissões maiores que as de um usuário comum.

## 3. Gerenciamento de Usuários

O administrador pode consultar e gerenciar os usuários do sistema, além de controlar suas permissões de acesso.

## 4. Categorias e Subcategorias

O administrador pode:

- Cadastrar categorias;
- Editar categorias;
- Excluir categorias;
- Organizar subcategorias.

Essa organização facilita o controle das receitas e despesas.

## 5. Movimentações

A tabela **`movimentacoes`**, armazenada no **MySQL**, concentra as principais informações financeiras do sistema.

Ela registra dados como:

- Receita ou despesa;
- Valor;
- Data;
- Conta;
- Categoria;
- Descrição;
- Forma de pagamento.

## 6. Receitas e Despesas

O administrador pode acompanhar informações relacionadas às receitas e despesas, como valores, datas, categorias e status de pagamento.

## 7. Parcelamentos

O sistema permite acompanhar despesas parceladas, controlando a quantidade de parcelas e seus respectivos pagamentos.

## 8. Relatórios

Os dados das movimentações são utilizados para gerar informações como:

- Total de receitas;
- Total de despesas;
- Saldo;
- Gastos por categoria;
- Movimentações por período.

## 9. Controle de Acesso e Segurança

O sistema utiliza **RBAC** para controlar as permissões de cada usuário.

Também utiliza **JWT** para autenticação e **bcrypt** para proteger as senhas.

## 10. Objetivo

O objetivo do administrador é **manter o sistema organizado, seguro e funcionando corretamente**, controlando usuários, categorias, movimentações e permissões.
