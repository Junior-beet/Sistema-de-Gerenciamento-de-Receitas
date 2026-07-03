import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { LoginPage } from './pages/LoginPage.js'
import { CadastroPage } from './pages/CadastroPage.js'
import { SaibaMaisPage } from './pages/SaibaMaisPage.js'
import { EsqueciSenhaPage } from './pages/EsqueciSenhaPage.js'
import { RedefinirSenhaPage } from './pages/RedefinirSenhaPage.js'
import { auth } from './services/auth.js'
import { ROTAS_PUBLICAS } from './config/constants.js'

const rotas = {
  '/login': LoginPage,
  '/cadastro': CadastroPage,
  '/saiba-mais': SaibaMaisPage,
  '/esqueci-senha': EsqueciSenhaPage,
  '/redefinir-senha': RedefinirSenhaPage,
}

function extrairCaminhoBase(caminho) {
  const idx = caminho.indexOf('?')
  return idx === -1 ? caminho : caminho.slice(0, idx)
}

function rotear(caminho) {
  const app = document.getElementById('app')
  app.innerHTML = ''

  const caminhoBase = extrairCaminhoBase(caminho)

  if (!ROTAS_PUBLICAS.includes(caminhoBase) && !auth.estaLogado()) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
    return
  }

  const pagina = rotas[caminhoBase]
  if (!pagina) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
    return
  }

  const el = pagina()

  el.classList.add('page-enter')
  app.appendChild(el)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.addEventListener('navegar', e => {
  const caminho = e.detail
  history.pushState({}, '', caminho)
  rotear(caminho)
})

window.addEventListener('popstate', () => {
  rotear(location.pathname + location.search)
})

rotear(location.pathname + location.search || '/login')
