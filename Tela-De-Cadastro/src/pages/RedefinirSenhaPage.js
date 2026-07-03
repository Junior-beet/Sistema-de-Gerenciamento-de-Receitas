import { Header } from '../components/layout/Header.js'
import { mostrarAlerta } from '../components/shared/Alert.js'
import { auth } from '../services/auth.js'

export function RedefinirSenhaPage() {
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  const page = document.createElement('div')

  const header = Header('/redefinir-senha')
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
  iconCircle.textContent = '!'
  iconDiv.appendChild(iconCircle)

  const title = document.createElement('h1')
  title.className = 'text-center fw-bold mb-1'
  title.style.color = 'var(--color-text-title)'
  title.textContent = 'Redefinir Senha'

  const divider = document.createElement('hr')
  divider.className = 'divider divider-center'

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'redefinirAlert'

  if (!token) {
    const msg = document.createElement('p')
    msg.className = 'text-center mb-4'
    msg.style.color = 'var(--color-text-secondary)'
    msg.textContent = 'Token de redefinição não encontrado.'

    const footer = document.createElement('div')
    footer.className = 'text-center mt-4 pt-4'
    footer.style.borderTop = '1px solid var(--color-border)'
    footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/esqueci-senha" class="fw-semibold">Solicitar novo link</a></p>'

    cardBody.appendChild(iconDiv)
    cardBody.appendChild(title)
    cardBody.appendChild(divider)
    cardBody.appendChild(msg)
    cardBody.appendChild(footer)
    card.appendChild(cardBody)
    col.appendChild(card)
    row.appendChild(col)
    container.appendChild(row)
    main.appendChild(container)
    page.appendChild(main)

    cardBody.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
      })
    })

    return page
  }

  const subtitle = document.createElement('p')
  subtitle.className = 'text-center mb-4'
  subtitle.style.color = 'var(--color-text-secondary)'
  subtitle.textContent = 'Escolha sua nova senha'

  const form = document.createElement('form')
  form.id = 'redefinirForm'
  form.noValidate = true

  const passGroup = document.createElement('div')
  passGroup.className = 'mb-3'
  passGroup.innerHTML = `
    <label for="novaSenha" class="form-label">Nova Senha</label>
    <input type="password" class="form-control" id="novaSenha" placeholder="Mínimo 6 caracteres" required minlength="6">
  `

  const confirmGroup = document.createElement('div')
  confirmGroup.className = 'mb-4'
  confirmGroup.innerHTML = `
    <label for="confirmSenha" class="form-label">Confirmar Senha</label>
    <input type="password" class="form-control" id="confirmSenha" placeholder="Repita a senha" required minlength="6">
  `

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Redefinir Senha'

  const footer = document.createElement('div')
  footer.className = 'text-center mt-4 pt-4'
  footer.style.borderTop = '1px solid var(--color-border)'
  footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/login" class="fw-semibold">Voltar ao login</a></p>'

  form.appendChild(passGroup)
  form.appendChild(confirmGroup)
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
    const novaSenha = document.getElementById('novaSenha').value
    const confirmSenha = document.getElementById('confirmSenha').value

    if (novaSenha !== confirmSenha) {
      mostrarAlerta(alert, 'erro', 'As senhas não conferem.')
      return
    }

    const result = await auth.redefinirSenha(token, novaSenha)

    if (result.erro) {
      mostrarAlerta(alert, 'erro', result.erro)
    } else {
      mostrarAlerta(alert, 'sucesso', 'Senha redefinida com sucesso!')
      setTimeout(() => window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' })), 2000)
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
