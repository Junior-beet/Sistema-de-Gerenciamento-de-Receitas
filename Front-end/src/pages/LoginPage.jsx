import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { auth } from '../services/auth.jsx'

export function LoginPage() {
  const page = document.createElement('div')

  const header = Header('/login')
  page.appendChild(header)

  const main = document.createElement('main')
  main.className = 'auth-page'

  const card = document.createElement('div')
  card.className = 'auth-card'

  const logo = document.createElement('img')
  logo.src = '/assets/logo-sgr.svg'
  logo.alt = 'Logo do SGR'
  logo.className = 'auth-logo'

  const title = document.createElement('h1')
  title.className = 'auth-title'
  title.textContent = 'Acessar Sistema'

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = 'Insira suas credenciais para continuar'

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'loginAlert'

  const form = document.createElement('form')
  form.id = 'loginForm'
  form.noValidate = true

  const emailGroup = document.createElement('div')
  emailGroup.className = 'mb-3'
  emailGroup.innerHTML = `
    <label for="loginEmail" class="form-label">E-mail</label>
    <input type="email" class="form-control" id="loginEmail" placeholder="seu@email.com" required>
  `

  const passGroup = document.createElement('div')
  passGroup.className = 'mb-4'
  passGroup.innerHTML = `
    <label for="loginSenha" class="form-label">Senha</label>
    <input type="password" class="form-control" id="loginSenha" placeholder="Sua senha" required minlength="8">
  `

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Entrar'

  form.appendChild(emailGroup)
  form.appendChild(passGroup)
  form.appendChild(btn)

  const divider = document.createElement('div')
  divider.className = 'auth-divider'
  divider.textContent = 'ou'

  const footer = document.createElement('div')
  footer.className = 'text-center'
  footer.innerHTML = `
    <p class="small mb-2" style="color:var(--color-text-secondary)">Ainda não tem conta? <a href="/cadastro" class="fw-semibold">Cadastre-se</a></p>
    <p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/esqueci-senha" class="fw-semibold">Esqueci minha senha</a></p>
  `

  card.appendChild(logo)
  card.appendChild(title)
  card.appendChild(subtitle)
  card.appendChild(alert)
  card.appendChild(form)
  card.appendChild(divider)
  card.appendChild(footer)

  main.appendChild(card)
  page.appendChild(main)
  page.appendChild(Footer())

  form.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const senha = document.getElementById('loginSenha').value
    const result = await auth.login(email, senha)

    if (result.erro) {
      mostrarAlerta(alert, 'erro', result.erro)
      mostrarToast('erro', result.erro)
    } else {
      mostrarAlerta(alert, 'sucesso', `Bem-vindo, ${result.usuario.nome}!`)
      mostrarToast('sucesso', `Login efetuado com sucesso. Bem-vindo, ${result.usuario.nome}!`)
      setTimeout(() => window.dispatchEvent(new CustomEvent('navegar', { detail: '/calculos' })), 1200)
    }
  })

  card.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  return page
}
