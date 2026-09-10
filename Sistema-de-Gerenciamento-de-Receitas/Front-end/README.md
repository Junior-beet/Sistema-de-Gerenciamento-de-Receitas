# SGR — Gestão de Receitas Empresariais

Sistema web para gestão de receitas empresariais, desenvolvido como projeto
de conclusão de curso.

## Funcionalidades

- **Login** — Autenticação com e-mail e senha; senha comparada com hash bcrypt
  no servidor; retorna token JWT com `id_usuario`, `nome`, `email` e `cargo`
- **Cadastro** — Registro de novos usuários com seleção de cargo
- **JWT Token** — Token salvo no `localStorage` e enviado no header
  `Authorization: Bearer <token>` em requisições autenticadas
- **Expiração automática** — Token expira em 8 horas; ao expirar o usuário é
  redirecionado ao login
- **RBAC** — O `cargo` contido no token define o que cada usuário pode acessar
- **Rotas protegidas** — Rotas não-públicas redirecionam para `/login` se não
  houver token válido
- **Esqueci minha senha** — Fluxo completo: solicitação por e-mail, token de
  redefinição com validade de 1 hora, formulário de nova senha
- **Saiba Mais** — Página institucional com a história e valores da empresa
- **API real** — Todas as operações consomem endpoints REST via `fetch` com
  proxy configurado no Vite para evitar CORS em desenvolvimento

## Fluxo de Autenticação

```
Login → POST /api/login → servidor valida senha (bcrypt) → retorna JWT
                                                               ↓
                                                   Front-end salva token
                                                   no localStorage
                                                               ↓
                                          Próximas requisições incluem
                                          Authorization: Bearer <token>
                                                               ↓
                                          Servidor verifica assinatura
                                          e expiração (8h) do JWT
```

## Mensagem de erro genérica

Independente de o e-mail existir ou não no banco, a mensagem de erro retornada
é sempre **"E-mail ou senha inválidos."**, para não vazar informações sobre
contas cadastradas.

## Esqueci minha senha

1. Usuário clica em "Esqueci minha senha" na tela de login
2. Informa o e-mail → `POST /api/esqueci-senha`
3. Servidor gera um token de redefinição (válido por 1h) e envia por e-mail
4. Usuário acessa `/redefinir-senha?token=xxx`
5. Informa nova senha → `POST /api/redefinir-senha`
6. Servidor valida o token, atualiza a senha (hash bcrypt) e invalida o token

## Estrutura do Projeto

```text
pasta trabalho/
│   .gitignore
│   index.html                    # Entry point HTML
│   package.json                  # Dependências e scripts
│   vite.config.js                # Proxy /api → localhost:3000
│   README.md
│
└── src/
    │   main.js                   # Roteador SPA + guardião de rotas
    │   style.css                 # Estilos globais
    │
    ├── components/
    │   ├── layout/
    │   │   └── Header.js         # Navbar com links dinâmicos (logado/não)
    │   └── shared/
    │       └── Alert.js          # Componente de alerta reutilizável
    │
    ├── config/
    │   └── constants.js          # Cargos, storage keys, JWT secret, API URL
    │
    ├── pages/
    │   ├── LoginPage.js          # Login (e-mail + senha → JWT)
    │   ├── CadastroPage.js       # Cadastro de novo usuário
    │   ├── EsqueciSenhaPage.js   # Solicitar link de redefinição
    │   ├── RedefinirSenhaPage.js # Redefinir senha com token
    │   └── SaibaMaisPage.js      # Página institucional
    │
    ├── services/
    │   ├── api.js                # Cliente HTTP (fetch + token no header)
    │   ├── auth.js               # Serviço de autenticação (chama API)
    │   └── crypto.js             # Utilitário JWT (criar/verificar/decodificar)
    │
    └── storage/
        └── index.js              # Abstração do localStorage
```

## Tecnologias

- **Vite** — Build tool e dev server com proxy
- **Bootstrap 5** — Framework CSS (via npm)
- **Vanilla JS** — Sem framework SPA; roteador customizado com `history.pushState`
- **Web Crypto API** — HMAC-SHA256 para assinatura JWT e SHA-256 para hash de senha
- **localStorage** — Persistência do token JWT no navegador
- **Google Fonts** — Inter e Playfair Display

## API — Endpoints Esperados

| Método | Rota | Descrição | Corpo |
|--------|------|-----------|-------|
| POST | `/api/cadastro` | Cadastro | `{ nome, email, senha, cargo }` |
| POST | `/api/login` | Login | `{ email, senha }` |
| GET | `/api/sessao` | Validar token | — |
| POST | `/api/esqueci-senha` | Solicitar reset | `{ email }` |
| POST | `/api/redefinir-senha` | Redefinir senha | `{ token, novaSenha }` |

## Como Rodar

```bash
npm install
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173`.
Requisições para `/api/*` serão redirecionadas para `http://localhost:3000/api/*`
pelo proxy configurado no `vite.config.js`.

## Variáveis de Ambiente (cliente)

Em `src/config/constants.js`:

| Constante | Valor padrão | Descrição |
|-----------|-------------|-----------|
| `API_URL` | `http://localhost:3000/api` | URL base da API |
| `JWT_SECRET` | `sua_chave_secreta_aqui` | Chave para assinatura JWT (local) |
| `TOKEN_EXPIRACAO` | `8 * 60 * 60` | Expiração do JWT em segundos (8h) |
| `ROTAS_PUBLICAS` | `['/login', '/cadastro', ...]` | Rotas que não exigem autenticação |

## Autores

- **Miguel** — Components, Config, Pages
- **Akila** — Services, Storage, Main.js, Style.css
