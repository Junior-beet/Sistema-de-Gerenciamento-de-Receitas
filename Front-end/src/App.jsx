import { useEffect, useState } from 'react'
import { HomePage } from './pages/infos/HomePage.jsx'
import { LoginPage } from './pages/cadastro/LoginPage.jsx'
import { CadastroPage } from './pages/cadastro/CadastroPage.jsx'
import { SaibaMaisPage } from './pages/infos/SaibaMaisPage.jsx'
import { EsqueciSenhaPage } from './pages/cadastro/EsqueciSenhaPage.jsx'
import { RedefinirSenhaPage } from './pages/cadastro/RedefinirSenhaPage.jsx'
import { CategoriasPage } from './pages/categorias/CategoriasPage.jsx'
import { CategoriaFormPage } from './pages/categorias/CategoriaFormPage.jsx'
import { SubcategoriasPage } from './pages/categorias/SubcategoriasPage.jsx'
import { SubcategoriaFormPage } from './pages/categorias/SubcategoriaFormPage.jsx'
import { ReceitaFormPage } from './pages/movimentacoes/ReceitaFormPage.jsx'
import { DespesaFormPage } from './pages/movimentacoes/DespesaFormPage.jsx'
import { DashboardPage } from './pages/relatorios/DashboardPage.jsx'
import { RelatoriosPage } from './pages/relatorios/RelatoriosPage.jsx'
import { ToastHost } from './components/shared/Toast.jsx'
import { auth } from './services/auth.jsx'
import { ROTAS_PUBLICAS } from './config/constants.jsx'
import { navegar } from './services/navigation.jsx'

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
  '/receitas/nova': ReceitaFormPage,
  '/despesas/nova': DespesaFormPage,
  '/dashboard': DashboardPage,
  '/relatorios': RelatoriosPage,
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
  if (/^\/calculos\/editar\/[^/]+$/.test(caminhoBase)) return rotas['/calculos/editar']
  if (/^\/calculos\/[^/]+\/subcategorias$/.test(caminhoBase)) return rotas['/calculos/subcategorias']
  if (/^\/subcategorias\/editar\/[^/]+$/.test(caminhoBase)) return rotas['/subcategorias/editar']
  return null
}

export function App() {
  const [caminho, setCaminho] = useState(() => location.pathname + location.search)

  useEffect(() => {
    const aoNavegar = e => {
      const destino = e.detail || '/'
      history.pushState({}, '', destino)
      setCaminho(destino)
    }
    const aoPopstate = () => {
      setCaminho(location.pathname + location.search)
    }
    window.addEventListener('navegar', aoNavegar)
    window.addEventListener('popstate', aoPopstate)
    return () => {
      window.removeEventListener('navegar', aoNavegar)
      window.removeEventListener('popstate', aoPopstate)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [caminho])

  const caminhoBase = extrairCaminhoBase(caminho)

  const precisaLogin = !ROTAS_PUBLICAS.includes(caminhoBase) && !auth.estaLogado()

  useEffect(() => {
    if (precisaLogin) navegar('/')
  }, [precisaLogin])

  const Pagina = precisaLogin ? HomePage : matchRota(caminhoBase)

  if (!Pagina) {
    return <HomePage />
  }

  return (
    <>
      <div className="app-page page-enter">
        <Pagina key={caminho} />
      </div>
      <ToastHost />
    </>
  )
}
