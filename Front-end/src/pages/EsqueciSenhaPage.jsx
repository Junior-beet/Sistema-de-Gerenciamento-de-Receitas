import { Header } from '../components/layout/Header.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'
import { auth } from '../services/auth.jsx'

export function EsqueciSenhaPage() {
  const page = document.createElement('div')

  const header = Header('/esqueci-senha')
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
  iconCircle.textContent = '?'
  iconDiv.appendChild(iconCircle)

  const title = document.createElement('h1')
  title.className = 'text-center fw-bold mb-1'
  title.style.color = 'var(--color-text-title)'
  title.textContent = 'Recuperar Senha'

  const divider = document.createElement('hr')
  divider.className = 'divider divider-center'

  const subtitle = document.createElement('p')
  subtitle.className = 'text-center mb-4'
  subtitle.style.color = 'var(--color-text-secondary)'
  subtitle.textContent = 'Insira seu e-mail para receber o link de redefinição'

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'resetAlert'

  const form = document.createElement('form')
  form.id = 'resetForm'
  form.noValidate = true

  const emailGroup = document.createElement('div')
  emailGroup.className = 'mb-3'
  emailGroup.innerHTML = `
    <label for="resetEmail" class="form-label">E-mail</label>
    <input type="email" class="form-control" id="resetEmail" placeholder="seu@email.com" required>
  `

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Enviar Link'

  const footer = document.createElement('div')
  footer.className = 'text-center mt-4 pt-4'
  footer.style.borderTop = '1px solid var(--color-border)'
  footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/login" class="fw-semibold">Voltar ao login</a></p>'

  form.appendChild(emailGroup)
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
    const email = document.getElementById('resetEmail').value

    await auth.gerarTokenReset(email)

    mostrarAlerta(alert, 'sucesso', 'Se o e-mail informado existir em nossa base, você receberá um link de redefinição de senha.')
  })

  cardBody.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  return page
}
