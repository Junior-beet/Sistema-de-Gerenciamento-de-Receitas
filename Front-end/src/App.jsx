import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { CadastroPage } from './pages/CadastroPage.jsx'
import { SaibaMaisPage } from './pages/SaibaMaisPage.jsx'
import { EsqueciSenhaPage } from './pages/EsqueciSenhaPage.jsx'
import { RedefinirSenhaPage } from './pages/RedefinirSenhaPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { TransacaoFormPage } from './pages/TransacaoFormPage.jsx'
import { auth } from './services/auth.jsx'
import { ROTAS_PUBLICAS } from './config/constants.jsx'

const rotas = {
  '/': HomePage,
  '/login': LoginPage,
  '/cadastro': CadastroPage,
  '/saiba-mais': SaibaMaisPage,
  '/esqueci-senha': EsqueciSenhaPage,
  '/redefinir-senha': RedefinirSenhaPage,
  '/dashboard': DashboardPage,
  '/transacoes/nova': TransacaoFormPage,
  '/transacoes/editar': TransacaoFormPage,
}

function extrairCaminhoBase(caminho) {
  const idx = caminho.indexOf('?')
  return idx === -1 ? caminho : caminho.slice(0, idx)
}

function matchRota(caminhoBase) {
  if (rotas[caminhoBase]) return rotas[caminhoBase]
  if (caminhoBase.startsWith('/transacoes/editar/')) return rotas['/transacoes/editar']
  return null
}

function rotear(caminho) {
  const app = document.getElementById('app')
  app.innerHTML = ''

  const caminhoBase = extrairCaminhoBase(caminho)

  if (!ROTAS_PUBLICAS.includes(caminhoBase) && !auth.estaLogado()) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/' }))
    return
  }

  const pagina = matchRota(caminhoBase)
  if (!pagina) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/' }))
    return
  }

  const el = pagina()

  el.classList.add('page-enter')
  app.appendChild(el)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function App() {
  const app = document.getElementById('app')

  window.addEventListener('navegar', e => {
    const caminho = e.detail
    history.pushState({}, '', caminho)
    rotear(caminho)
  })

  window.addEventListener('popstate', () => {
    rotear(location.pathname + location.search)
  })

  rotear(location.pathname + location.search || '/')

  return app
}
