import { APP_NAME } from '../../config/constants.jsx'

export function Footer() {
  const footer = document.createElement('footer')
  footer.className = 'footer-section'
  footer.style.backgroundColor = '#1976D2'
  footer.style.color = 'white'

  footer.innerHTML = `
    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-4">
          <div class="footer-brand">
            <span class="footer-brand-name">${APP_NAME}</span>
          </div>
          <p class="footer-about">
            Sistema de Gerenciamento de Receitas desenvolvido por alunos do SENAI para
            auxiliar no controle financeiro e na organização de ganhos de forma prática e segura.
          </p>
        </div>

        <div class="col-6 col-lg-2 offset-lg-1">
          <h6>Navegação</h6>
          <ul class="footer-links mb-0">
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/cadastro">Cadastro</a></li>
            <li><a href="/saiba-mais">Saiba Mais</a></li>
          </ul>
        </div>

        <div class="col-6 col-lg-2">
          <h6>Equipe</h6>
          <ul class="footer-links mb-0">
            <li>Luiz Felipe</li>
            <li>Akila Maria</li>
            <li>Jasiel Junior</li>
            <li>Miguel Vallim</li>
            <li>Nicolas Bryan</li>
            <li>Samuel Rabelo</li>
          </ul>
        </div>

        <div class="col-lg-3">
          <h6>Contato</h6>
          <ul class="footer-contact mb-0">
            <li><span class="contact-label">E-mail</span> contato@sgr.com.br</li>
            <li><span class="contact-label">Instituição</span> SENAI</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 ${APP_NAME}. Todos os direitos reservados.</span>
        <span>Desenvolvido por equipe SENAI</span>
      </div>
    </div>
  `

  footer.querySelectorAll('a[href^="/"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: anchor.getAttribute('href') }))
    })
  })

  footer.querySelectorAll('h6, p, li, span, a').forEach(element => {
    element.style.color = 'white'
  })

  return footer
}