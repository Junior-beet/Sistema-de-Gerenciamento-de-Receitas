# 🎨 Design System — Sistema de Gerenciamento de Receitas

Este documento define os padrões visuais e de interface do sistema de gerenciamento receitas, com foco em clareza, confiabilidade, organização e produtividade.

O sistema foi projetado para auxiliar na organização, análise de receita, praticidade financeira, produtividade empresarial e tomada de decisões.

---

# 🎯 Princípios do Design

Com base nos objetivos do sistema:

- Clareza na leitura de dados financeiros
- Redução de erros operacionais
- Rapidez na tomada de decisão
- Interface limpa e objetiva

> 📌 Regra principal: interface simples + dados financeiros

---

# 🎨 Paleta de Cores

## 📌 Estratégia

O sistema utiliza cores de forma funcional, não decorativa, por conta do contexto empresarial e financeiro com que o projeto se insere:

- Azul → confiança e controle
- Verde → ganhos e sucesso
- Vermelho → perdas e erros
- Neutros → base da interface

--- 

## 🎯 Cores Principais

| Nome        | Cor       | Uso |
|------------|----------|-----|
| Primary    | #1976D2  | Botões principais, ações críticas |
| Success    | #2E7D32  | Receitas, lucro, valores positivos |
| Danger     | #C62828  | Despesas, prejuízo, erros |

# 🔤 Tipografia

## 📌 Fonte

- **Inter, sans-serif**

## 📌 Hierarquia

- H1: 32px / Bold
- H2: 24px / SemiBold
- H3: 20px / Medium
- Body: 16px / Regular
- Small: 14px / Regular

---

# 🧩 Componentes

## 🔘 Botões

### Tipos

- Primary → ações principais (Salvar, Confirmar e outras funcionalidades)
- Secondary → ações de apoio
- Danger → ações destrutivas (Excluir)

### Estados

- Default
- Hover (leve destaque)
- Active
- Disabled

---

## 📦 Cards

### Uso

- Exibir informações financeiras
- Agrupar dados (receitas, despesas, relatórios)

### Estilo

- Fundo branco
- Borda leve
- Sombra suave
- Padding: 16px ou 24px

---

## 📊 Tabelas (ESSENCIAL)

### Uso

- Listagem de receitas e despesas

### Boas práticas

- Linhas alternadas (zebra)
- Alinhamento numérico à direita
- Cores:
  - Receita → verde
  - Despesa → vermelho

---

## 📈 Dashboard

### Elementos principais

- Saldo total
- Receita total
- Despesa total
- Gráficos financeiros

### Diretrizes

- Destaque para valores importantes
- Uso de cores semânticas:
  - Verde → positivo
  - Vermelho → negativo

---

# 📐 Espaçamento

## 📏 Escala

- 4px
- 8px
- 16px
- 24px
- 32px
- 48px

📌 Utilizar múltiplos de 8px

---

# 📊 Grid e Responsividade

## Breakpoints

| Dispositivo | Largura |
|------------|--------|
| Mobile     | 320px+ |
| Tablet     | 768px+ |
| Desktop    | 1024px+ |

## Diretrizes

- Mobile-first
- Layout fluido
- Priorizar dados essenciais no mobile

---

# ♿ Acessibilidade

- Contraste adequado (WCAG)
- Navegação por teclado
- Estados de foco visíveis
- Uso de cores + texto (não depender só de cor)

---

# 🔐 Feedback e Estados do Sistema

## 📌 Sucesso
- Verde
- Mensagens claras (ex: “Receita cadastrada com sucesso”, ou "Receita encerrada no lucro")

## 📌 Erro
- Vermelho
- Explicação do problema
- Mostragem de prejuízo na receita

## 📌 Loading
- Indicadores visuais (spinner ou skeleton)

---

# 🧠 Diretrizes UX (Baseado no TCC)

- Minimizar erros de lançamento
- Facilitar leitura rápida de dados
- Priorizar informações financeiras críticas
- Evitar poluição visual

---

# 🚀 Conclusão

Este Design System foi construído para:

- Melhorar a organização financeira
- Aumentar a eficiência operacional
- Garantir a clareza e confiabilidade dos dados do projeto

A interface deve sempre servir ao objetivo principal do sistema:

> 📊 Facilitar a tomada de decisão no meio empresarial e financeiro.