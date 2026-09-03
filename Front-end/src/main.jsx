import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { CadastroPage } from './pages/CadastroPage.jsx'
import { SaibaMaisPage } from './pages/SaibaMaisPage.jsx'
import { EsqueciSenhaPage } from './pages/EsqueciSenhaPage.jsx'
import { RedefinirSenhaPage } from './pages/RedefinirSenhaPage.jsx'
import { CategoriasPage } from './pages/CategoriasPage.jsx'
import { CategoriaFormPage } from './pages/CategoriaFormPage.jsx'
import { SubcategoriasPage } from './pages/SubcategoriasPage.jsx'
import { SubcategoriaFormPage } from './pages/SubcategoriaFormPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { auth } from './services/auth.jsx'
import { ROTAS_PUBLICAS } from './config/constants.jsx'

const rotas = {
  '/': HomePage,
  '/login': LoginPage,
  '/cadastro': CadastroPage,
  '/saiba-mais': SaibaMaisPage,
  '/esqueci-senha': EsqueciSenhaPage,
  '/redefinir-senha': RedefinirSenhaPage,
  '/calculos': CategoriasPage,
  '/calculos/nova': CategoriaFormPage,
  '/calculos/editar': CategoriaFormPage,
  '/calculos/subcategorias': SubcategoriasPage,
  '/subcategorias/nova': SubcategoriaFormPage,
  '/subcategorias/editar': SubcategoriaFormPage,
  '/dashboard': DashboardPage,
}

function extrairCaminhoBase(caminho) {
  let caminhoBase = caminho.split('?')[0].split('#')[0]
  if (caminhoBase.length > 1 && caminhoBase.endsWith('/')) {
    caminhoBase = caminhoBase.slice(0, -1)
  }
  return caminhoBase
}

function matchRota(caminhoBase) {
  if (rotas[caminhoBase]) return rotas[caminhoBase]
  if (/^\/calculos\/editar\/\d+$/.test(caminhoBase)) return rotas['/calculos/editar']
  if (/^\/calculos\/\d+\/subcategorias$/.test(caminhoBase)) return rotas['/calculos/subcategorias']
  if (/^\/subcategorias\/editar\/\d+$/.test(caminhoBase)) return rotas['/subcategorias/editar']
  return null
}

function irPara(caminho, substituir = false) {
  if (substituir) {
    history.replaceState({}, '', caminho)
  } else {
    history.pushState({}, '', caminho)
  }
  rotear(caminho)
}

async function rotear(caminho) {
  const app = document.getElementById('app')
  if (!app) return

  app.innerHTML = ''

  const caminhoBase = extrairCaminhoBase(caminho)

  if (!ROTAS_PUBLICAS.includes(caminhoBase) && !auth.estaLogado()) {
    irPara('/', true)
    return
  }

  const pagina = matchRota(caminhoBase)
  if (!pagina) {
    irPara('/', true)
    return
  }

  const el = await pagina()

  if (el) {
    el.classList.add('page-enter')
    app.appendChild(el)
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.addEventListener('navegar', e => {
  irPara(e.detail)
})

window.addEventListener('popstate', () => {
  rotear(location.pathname + location.search)
})

rotear(location.pathname + location.search || '/')
