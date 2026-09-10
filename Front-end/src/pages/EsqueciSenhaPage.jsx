import { Header } from '../components/layout/Header.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { auth } from '../services/auth.jsx'

export function EsqueciSenhaPage() {
  const page = document.createElement('div')

  const header = Header('/esqueci-senha')
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
  title.textContent = 'Recuperar Senha'

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = 'Insira seu e-mail para receber o link de redefinição'

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'resetAlert'

  const form = document.createElement('form')
  form.id = 'resetForm'
  form.noValidate = true

  const emailGroup = document.createElement('div')
  emailGroup.className = 'mb-4'
  emailGroup.innerHTML = `
    <label for="resetEmail" class="form-label">E-mail</label>
    <input type="email" class="form-control" id="resetEmail" placeholder="seu@email.com" required>
  `

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Enviar Link'

  form.appendChild(emailGroup)
  form.appendChild(btn)

  const divider = document.createElement('div')
  divider.className = 'auth-divider'
  divider.textContent = 'ou'

  const footer = document.createElement('div')
  footer.className = 'text-center'
  footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/login" class="fw-semibold">Voltar ao login</a></p>'

  card.appendChild(logo)
  card.appendChild(title)
  card.appendChild(subtitle)
  card.appendChild(alert)
  card.appendChild(form)
  card.appendChild(divider)
  card.appendChild(footer)

  main.appendChild(card)
  page.appendChild(main)

  form.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('resetEmail').value

    await auth.gerarTokenReset(email)

    mostrarAlerta(alert, 'sucesso', 'Se o e-mail informado existir em nossa base, você receberá um link de redefinição de senha.')
    mostrarToast('sucesso', 'Se o e-mail existir em nossa base, o link foi enviado.')
  })

  card.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  return page
}
