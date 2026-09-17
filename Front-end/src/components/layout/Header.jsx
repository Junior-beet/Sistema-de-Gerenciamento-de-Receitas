import { auth } from '../../services/auth.jsx'
import { navegar } from '../../services/navigation.jsx'

function getRotas() {
  if (auth.estaLogado()) {
    const usuario = auth.sessaoLocal()
    const rotas = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/saiba-mais', label: 'Saiba Mais' },
      { href: '#sair', label: 'Sair' },
    ]
    if (usuario?.cargo === 'DIRETOR_FINANCEIRO') {
      rotas.splice(1, 0, { href: '/calculos', label: 'Calculos' })
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
            <ul className="navbar-nav ms-auto gap-1">
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
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}