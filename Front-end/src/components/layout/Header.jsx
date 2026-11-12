import { useEffect, useState } from 'react'
import { auth } from '../../services/auth.jsx'
import { navegar } from '../../services/navigation.jsx'
import { getTheme, toggleTheme } from '../../services/theme.jsx'

function getRotas() {
  if (auth.estaLogado()) {
    const usuario = auth.sessaoLocal()
    const rotas = [
      { href: '/dashboard', label: 'Painel' },
      { href: '/saiba-mais', label: 'Saiba Mais' },
      { href: '#sair', label: 'Sair' },
    ]
    if (usuario?.cargo === 'DIRETOR_FINANCEIRO') {
      rotas.splice(1, 0, { href: '/calculos', label: 'Movimentações' })
      rotas.splice(2, 0, { href: '/relatorios', label: 'Relatorios' })
    }
    return rotas
  }
  return [
    { href: '/login', label: 'Login' },
    { href: '/cadastro', label: 'Cadastro' },
    { href: '/saiba-mais', label: 'Saiba Mais' },
  ]
}

export function Header({ rotaAtiva }) {
  const rotas = getRotas()
  const [tema, setTema] = useState(() => (typeof document !== 'undefined' ? document.documentElement.getAttribute('data-bs-theme') : getTheme()) || 'light')

  useEffect(() => {
    const sync = e => setTema(e.detail || document.documentElement.getAttribute('data-bs-theme') || 'light')
    window.addEventListener('tema-alterado', sync)
    return () => window.removeEventListener('tema-alterado', sync)
  }, [])

  const aoClicar = rota => e => {
    e.preventDefault()
    if (rota === '#sair') {
      auth.logout()
      navegar('/login')
      return
    }
    navegar(rota)
  }

  return (
    <header className="app-header sticky-top">
      <nav className="navbar navbar-expand-sm" style={{ color: 'white' }}>
        <div className="container">
          <a className="navbar-brand" href="/" style={{ cursor: 'pointer', color: 'white' }} onClick={e => { e.preventDefault(); navegar('/') }}>
            <img src="/assets/letraLOGO.png" alt="Logo do SGR" style={{ width: 72, height: 32 }} />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Menu de navegação">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-1 align-items-sm-center">
              {rotas.map(rota => (
                <li className="nav-item" key={rota.href}>
                  <a
                    className={`nav-link ${rota.href === rotaAtiva ? 'active' : ''}`}
                    href={rota.href}
                    style={{ color: 'white' }}
                    onClick={aoClicar(rota.href)}
                  >
                    {rota.label}
                  </a>
                </li>
              ))}
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link btn btn-link"
                  style={{ color: 'white', border: 'none', boxShadow: 'none', padding: '8px 12px' }}
                  onClick={() => toggleTheme()}
                  aria-label={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                  title={tema === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                >
                  {tema === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
