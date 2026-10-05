import { useState } from 'react'
import { APP_NAME } from '../../config/constants.jsx'
import { auth } from '../../services/auth.jsx'
import { navegar } from '../../services/navigation.jsx'

const EQUIPE = [
  { nome: 'Luiz Felipe', inicial: 'L', cor: '#FF6D01' },
  { nome: 'Akila Maria', inicial: 'A', cor: '#4285F4' },
  { nome: 'Jasiel Junior', inicial: 'J', cor: '#EA4335' },
  { nome: 'Miguel Vallim', inicial: 'M', cor: '#FBBC04' },
  { nome: 'Nicolas Bryan', inicial: 'N', cor: '#34A853' },
  { nome: 'Samuel Rabelo', inicial: 'S', cor: '#1A73E8' },
]

function getLinks() {
  if (auth.estaLogado()) {
    return [
      { href: '/', label: 'Home' },
      { href: '/calculos', label: 'Calculos' },
      { href: '/saiba-mais', label: 'Saiba Mais' },
      { href: '#sair', label: 'Sair' },
    ]
  }
  return [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Login' },
    { href: '/cadastro', label: 'Cadastro' },
    { href: '/saiba-mais', label: 'Saiba Mais' },
  ]
}

function FooterLink({ href, children }) {
  const [hover, setHover] = useState(false)
  const cor = hover ? '#BBDEFB' : 'white'

  const aoClicar = e => {
    e.preventDefault()
    if (href === '#sair') {
      auth.logout()
      navegar('/login')
      return
    }
    navegar(href)
  }

  return (
    <li>
      <a
        href={href}
        style={{ color: cor }}
        onClick={aoClicar}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </a>
    </li>
  )
}

export function Footer() {
  const [timeAberto, setTimeAberto] = useState(false)
  const links = getLinks()

  return (
    <footer className="footer-section" style={{ backgroundColor: '#1976D2', color: 'white' }}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="footer-brand">
              <span className="footer-brand-name" style={{ color: 'white' }}>{APP_NAME}</span>
            </div>
            <p className="footer-about" style={{ color: 'white' }}>
              Sistema de Gerenciamento de Receitas desenvolvido pela equipe TechSolutions,
              alunos do SENAI, para auxiliar no controle financeiro e na organização
              de ganhos de forma prática e segura.
            </p>
          </div>

          <div className="col-6 col-lg-2 offset-lg-1">
            <h6 style={{ color: 'white' }}>Navegação</h6>
            <ul className="footer-links mb-0">
              {links.map(l => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <div className="footer-team-wrapper">
              <button
                type="button"
                className={`footer-team-toggle ${timeAberto ? 'open' : ''}`}
                aria-expanded={timeAberto}
                aria-controls="equipe-techsolutions"
                style={{ color: 'white' }}
                onClick={() => setTimeAberto(!timeAberto)}
              >
                <span>Equipe TechSolutions</span>
                <span className="footer-team-chevron">{timeAberto ? '▾' : '▸'}</span>
              </button>
              <ul id="equipe-techsolutions" className={`footer-team mb-0 ${timeAberto ? 'open' : ''}`} style={{ color: 'white' }}>
                {EQUIPE.map(m => (
                  <li className="footer-team-item" key={m.nome}>
                    <span className="footer-team-avatar" style={{ background: m.cor }}>{m.inicial}</span>
                    <span className="footer-team-nome" style={{ color: '#fff' }}>{m.nome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <h6 style={{ color: 'white' }}>Contato</h6>
            <ul className="footer-contact mb-0" style={{ color: 'white' }}>
              <li><span className="contact-label">E-mail</span> contato@sgr.com.br</li>
              <li><span className="contact-label">Instituição</span> SENAI</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ color: 'white' }}>
          <span>© 2026 {APP_NAME}. Todos os direitos reservados.</span>
          <span>Desenvolvido por equipe TechSolutions</span>
        </div>
      </div>
    </footer>
  )
}