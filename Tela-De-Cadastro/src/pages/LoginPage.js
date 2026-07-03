import { Header } from '../components/layout/Header.js'
import { mostrarAlerta } from '../components/shared/Alert.js'
import { auth } from '../services/auth.js'

export function LoginPage() {
  const page = document.createElement('div')

  const header = Header('/login')
  page.appendChild(header)

  const main = document.createElement('main')
  main.className = 'd-flex align-items-center'
  main.style.cssText = 'min-height:calc(100vh - 76px);background:var(--color-bg)'

  const container = document.createElement('div')
  container.className = 'container py-5'

  const row = document.createElement('div')
  row.className = 'row justify-content-center'

  const col = document.createElement('div')
  col.className = 'col-12 col-md-6 col-lg-5'

  const card = document.createElement('div')
  card.className = 'card shadow-sm'

  const cardBody = document.createElement('div')
  cardBody.className = 'card-body p-4 p-md-5'

  const iconDiv = document.createElement('div')
  iconDiv.className = 'text-center mb-3'
  const iconCircle = document.createElement('span')
  iconCircle.className = 'd-inline-flex align-items-center justify-content-center'
  iconCircle.style.cssText = 'width:48px;height:48px;border-radius:50%;background:var(--color-primary-light);color:var(--color-primary);font-size:1.3rem;font-weight:700'
  iconCircle.textContent = 'A'
  iconDiv.appendChild(iconCircle)

  const title = document.createElement('h1')
  title.className = 'text-center fw-bold mb-1'
  title.style.color = 'var(--color-text-title)'
  title.textContent = 'Acessar Sistema'

  const divider = document.createElement('hr')
  divider.className = 'divider divider-center'

  const subtitle = document.createElement('p')
  subtitle.className = 'text-center mb-4'
  subtitle.style.color = 'var(--color-text-secondary)'
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
    <input type="password" class="form-control" id="loginSenha" placeholder="Sua senha" required minlength="6">
  `

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Entrar'

  const footer = document.createElement('div')
  footer.className = 'text-center mt-4 pt-4'
  footer.style.borderTop = '1px solid var(--color-border)'
  footer.innerHTML = `
    <p class="small mb-2" style="color:var(--color-text-secondary)">Ainda não tem conta? <a href="/cadastro" class="fw-semibold">Cadastre-se</a></p>
    <p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/esqueci-senha" class="fw-semibold">Esqueci minha senha</a></p>
  `

  form.appendChild(emailGroup)
  form.appendChild(passGroup)
  form.appendChild(btn)

  cardBody.appendChild(iconDiv)
  cardBody.appendChild(title)
  cardBody.appendChild(divider)
  cardBody.appendChild(subtitle)
  cardBody.appendChild(alert)
  cardBody.appendChild(form)
  cardBody.appendChild(footer)
  card.appendChild(cardBody)
  col.appendChild(card)
  row.appendChild(col)
  container.appendChild(row)
  main.appendChild(container)
  page.appendChild(main)

  form.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const senha = document.getElementById('loginSenha').value
    const result = await auth.login(email, senha)

    if (result.erro) {
      mostrarAlerta(alert, 'erro', result.erro)
    } else {
      mostrarAlerta(alert, 'sucesso', `Bem-vindo, ${result.usuario.nome}!`)
      setTimeout(() => window.dispatchEvent(new CustomEvent('navegar', { detail: '/saiba-mais' })), 1000)
    }
  })

  cardBody.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  return page
}
