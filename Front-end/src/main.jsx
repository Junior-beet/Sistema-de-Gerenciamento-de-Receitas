import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { CadastroPage } from './pages/CadastroPage.jsx'
import { SaibaMaisPage } from './pages/SaibaMaisPage.jsx'
import { EsqueciSenhaPage } from './pages/EsqueciSenhaPage.jsx'
import { RedefinirSenhaPage } from './pages/RedefinirSenhaPage.jsx'
import { auth } from './services/auth.jsx'
import { ROTAS_PUBLICAS } from './config/constants.jsx'

const rotas = {
  '/': HomePage,
  '/login': LoginPage,
  '/cadastro': CadastroPage,
  '/saiba-mais': SaibaMaisPage,
  '/esqueci-senha': EsqueciSenhaPage,
  '/redefinir-senha': RedefinirSenhaPage,
}

function extrairCaminhoBase(caminho) {
  let caminhoBase = caminho.split('?')[0].split('#')[0]
  if (caminhoBase.length > 1 && caminhoBase.endsWith('/')) {
    caminhoBase = caminhoBase.slice(0, -1)
  }
  return caminhoBase
}

function irPara(caminho, substituir = false) {
  if (substituir) {
    history.replaceState({}, '', caminho)
  } else {
    history.pushState({}, '', caminho)
  }
  rotear(caminho)
}

function rotear(caminho) {
  const app = document.getElementById('app')
  if (!app) return

  app.innerHTML = ''

  const caminhoBase = extrairCaminhoBase(caminho)

  if (!ROTAS_PUBLICAS.includes(caminhoBase) && !auth.estaLogado()) {
    irPara('/', true)
    return
  }

  const pagina = rotas[caminhoBase]
  if (!pagina) {
    irPara('/', true)
    return
  }

  const el = pagina()

  el.classList.add('page-enter')
  app.appendChild(el)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.addEventListener('navegar', e => {
  irPara(e.detail)
})

window.addEventListener('popstate', () => {
  rotear(location.pathname + location.search)
})

rotear(location.pathname + location.search || '/')
