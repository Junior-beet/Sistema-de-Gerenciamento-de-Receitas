import { APP_NAME } from '../../config/constants.jsx'
import { auth } from '../../services/auth.jsx'

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

export function Footer() {
  const footer = document.createElement('footer')
  footer.className = 'footer-section'
  footer.style.backgroundColor = '#1976D2'
  footer.style.color = 'white'
<<<<<<< HEAD

  const links = getLinks()
=======
>>>>>>> 25787d0ad699044ce952b771753454b2ab3c51f4

  footer.innerHTML = `
    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-4">
          <div class="footer-brand">
            <span class="footer-brand-name">${APP_NAME}</span>
          </div>
          <p class="footer-about">
            Sistema de Gerenciamento de Receitas desenvolvido pela equipe TechSolutions,
            alunos do SENAI, para auxiliar no controle financeiro e na organização
            de ganhos de forma prática e segura.
          </p>
        </div>

        <div class="col-6 col-lg-2 offset-lg-1">
          <h6>Navegação</h6>
          <ul class="footer-links mb-0">
            ${links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
          </ul>
        </div>

        <div class="col-6 col-lg-3">
          <h6>Equipe TechSolutions</h6>
          <ul class="footer-team mb-0">
            ${EQUIPE.map(m => `
              <li class="footer-team-item">
                <span class="footer-team-avatar" style="background:${m.cor}">${m.inicial}</span>
                <span class="footer-team-nome">${m.nome}</span>
              </li>`).join('')}
          </ul>
        </div>

        <div class="col-lg-2">
          <h6>Contato</h6>
          <ul class="footer-contact mb-0">
            <li><span class="contact-label">E-mail</span> contato@sgr.com.br</li>
            <li><span class="contact-label">Instituição</span> SENAI</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 ${APP_NAME}. Todos os direitos reservados.</span>
        <span>Desenvolvido por equipe TechSolutions</span>
      </div>
    </div>
  `

  footer.querySelectorAll('a[href^="/"], a[href="#sair"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault()
      if (anchor.getAttribute('href') === '#sair') {
        auth.logout()
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
        return
      }
      window.dispatchEvent(new CustomEvent('navegar', { detail: anchor.getAttribute('href') }))
    })
  })

  footer.querySelectorAll('h6, p, li, span, a').forEach(element => {
    element.style.color = 'white'
  })

<<<<<<< HEAD
  footer.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('mouseenter', () => link.style.color = '#BBDEFB')
    link.addEventListener('mouseleave', () => link.style.color = 'white')
  })

=======
>>>>>>> 25787d0ad699044ce952b771753454b2ab3c51f4
  return footer
}