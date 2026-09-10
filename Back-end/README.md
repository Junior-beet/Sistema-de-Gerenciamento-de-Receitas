# RF-015 — Troca e Recuperação de Senha

Módulo de gerenciamento de senha do Sistema de Gerenciamento Financeiro. Implementa dois fluxos: troca de senha para usuário logado e recuperação de senha via link por e-mail.

**Stack:** Node.js • Express • bcrypt • nodemailer • crypto  
**Token de recuperação expira em:** 15 minutos

---

## Instalação

```bash
npm install nodemailer
```

---

## SQL — nova tabela necessária

```sql
CREATE TABLE tokens_recuperacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracao DATETIME NOT NULL,
    usado TINYINT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

---

## Arquivos criados
src/
├── configs/
│   └── mailer.js
├── controllers/
│   └── senhaController.js
├── repositories/
│   └── tokenRecuperacaoRepository.js
└── routes/
└── senhaRoutes.js

**Arquivo alterado:**
src/
└── repositories/
└── usuarioRepository.js  ← adicionado atualizarSenha()
---

## Registrar no routes.js principal

```javascript
import senhaRoutes from './senhaRoutes.js';

router.use('/senha', senhaRoutes);
```

---

## Variáveis de Ambiente necessárias
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:5173
---

## Regras de Negócio

- Troca de senha exige o usuário **logado** com token JWT válido
- A senha atual é verificada antes de permitir a troca
- A nova senha não pode ser igual à senha atual
- A nova senha deve ter mínimo de **8 caracteres**
- A nova senha deve ser confirmada para evitar erro de digitação
- O link de recuperação expira em **15 minutos**
- O token de recuperação só pode ser usado **uma vez**
- A resposta da solicitação de recuperação é sempre a mesma — não revela se o e-mail existe no sistema

---

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| PUT | `/senha/trocar` | Troca a senha do usuário logado 
| POST | `/senha/recuperar` | Solicita recuperação e envia e-mail 
| POST | `/senha/redefinir` | Redefine a senha com o token do e-mail 

---

## Endpoints

### PUT `/senha/trocar`

Troca a senha do usuário logado. Exige token JWT no header.

**Header:**
Authorization: Bearer {token}
**Body:**
```json
{
  "senha_atual": "minhasenha123",
  "nova_senha": "novasenha456",
  "confirmar_senha": "novasenha456"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| senha_atual | String |Senha atual do usuário |
| nova_senha | String | Nova senha — mínimo 8 caracteres |
| confirmar_senha | String |  Deve ser idêntica à nova_senha |

**Respostas:**

```json
// 200 - Senha trocada com sucesso
{ "sucesso": true, "mensagem": "Senha alterada com sucesso" }

// 400 - Campos faltando
{ "sucesso": false, "mensagem": "Preencha todos os campos: senha_atual, nova_senha e confirmar_senha" }

// 400 - Confirmação não confere
{ "sucesso": false, "mensagem": "A nova senha e a confirmação não conferem" }

// 400 - Senha muito curta
{ "sucesso": false, "mensagem": "A nova senha deve ter ao menos 8 caracteres" }

// 400 - Nova senha igual à atual
{ "sucesso": false, "mensagem": "A nova senha deve ser diferente da senha atual" }

// 401 - Senha atual incorreta
{ "sucesso": false, "mensagem": "Senha atual incorreta" }

// 401 - Token JWT ausente
{ "sucesso": false, "mensagem": "Token não fornecido" }

// 403 - Token JWT inválido ou expirado
{ "sucesso": false, "mensagem": "Token inválido ou expirado" }

// 404 - Usuário não encontrado
{ "sucesso": false, "mensagem": "Usuário não encontrado" }

// 500 - Erro no servidor
{ "sucesso": false, "mensagem": "Erro ao trocar senha", "errorMessage": "..." }
```

---

### POST `/senha/recuperar`

Solicita a recuperação de senha. Gera um token e envia um link por e-mail. A resposta é sempre a mesma para não revelar se o e-mail existe.

**Body:**
```json
{
  "email": "joao@empresa.com"
}
```

| Campo | Tipo |Descrição |
|-------|------|-----------|
| email | String |E-mail cadastrado no sistema |

**Respostas:**

```json
// 200 - Sempre retorna isso (e-mail existe ou não)
{
  "sucesso": true,
  "mensagem": "Se este e-mail estiver cadastrado, você receberá as instruções em breve"
}

// 400 - Campo faltando
{ "sucesso": false, "mensagem": "Informe o e-mail" }

// 500 - Erro no servidor
{ "sucesso": false, "mensagem": "Erro ao solicitar recuperação de senha", "errorMessage": "..." }
```

---

### POST `/senha/redefinir`

Redefine a senha usando o token recebido por e-mail.

**Body:**
```json
{
  "token": "a3f9c2e1b4d8...",
  "nova_senha": "novasenha456",
  "confirmar_senha": "novasenha456"
}
```

| Campo | Tipo |Descrição |
|-------|------|-----------|
| token | String |Token recebido no link do e-mail |
| nova_senha | String |Nova senha — mínimo 8 caracteres |
| confirmar_senha | String | Deve ser idêntica à nova_senha |

**Respostas:**

```json
// 200 - Senha redefinida com sucesso
{ "sucesso": true, "mensagem": "Senha redefinida com sucesso" }

// 400 - Campos faltando
{ "sucesso": false, "mensagem": "Preencha todos os campos: token, nova_senha e confirmar_senha" }

// 400 - Confirmação não confere
{ "sucesso": false, "mensagem": "A nova senha e a confirmação não conferem" }

// 400 - Senha muito curta
{ "sucesso": false, "mensagem": "A nova senha deve ter ao menos 8 caracteres" }

// 400 - Token inválido ou já usado
{ "sucesso": false, "mensagem": "Token inválido ou já utilizado" }

// 400 - Token expirado
{ "sucesso": false, "mensagem": "Token expirado. Solicite uma nova recuperação de senha" }

// 500 - Erro no servidor
{ "sucesso": false, "mensagem": "Erro ao redefinir senha", "errorMessage": "..." }
```

---

## Fluxo completo de recuperação de senha
1. Usuário acessa "Esqueci minha senha" no front-end
2. Informa o e-mail → POST /senha/recuperar
3. Sistema gera token e envia e-mail com o link
4. Usuário clica no link → front-end abre tela de nova senha com o token na URL
5. Usuário digita nova senha e confirma → POST /senha/redefinir
6. Sistema valida o token, verifica expiração e salva nova senha
7. Token é marcado como usado — não pode ser reutilizado
---
