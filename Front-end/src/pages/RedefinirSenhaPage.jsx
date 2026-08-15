import { Header } from '../components/layout/Header.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { auth } from '../services/auth.jsx'

export function RedefinirSenhaPage() {
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  const page = document.createElement('div')

  const header = Header('/redefinir-senha')
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
  title.textContent = 'Redefinir Senha'

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
    footer.style.borderTop = '1px solid var(--color-border-light)'
    footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/esqueci-senha" class="fw-semibold">Solicitar novo link</a></p>'

    card.appendChild(logo)
    card.appendChild(title)
    card.appendChild(msg)
    card.appendChild(footer)
    main.appendChild(card)
    page.appendChild(main)

    card.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
      })
    })

    return page
  }

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = 'Escolha sua nova senha'

  const form = document.createElement('form')
  form.id = 'redefinirForm'
  form.noValidate = true

  const passGroup = document.createElement('div')
  passGroup.className = 'mb-3'
  passGroup.innerHTML = `
    <label for="novaSenha" class="form-label">Nova Senha</label>
    <input type="password" class="form-control" id="novaSenha" placeholder="Mínimo 8 caracteres" required minlength="8">
  `

  const confirmGroup = document.createElement('div')
  confirmGroup.className = 'mb-4'
  confirmGroup.innerHTML = `
    <label for="confirmSenha" class="form-label">Confirmar Senha</label>
    <input type="password" class="form-control" id="confirmSenha" placeholder="Repita a senha" required minlength="8">
  `

  const passHint = document.createElement('div')
  passHint.className = 'form-text'
  passHint.style.cssText = 'font-size:12px;margin-top:4px;color:var(--color-text-muted)'
  passHint.textContent = 'Use ao menos 8 caracteres'
  passGroup.appendChild(passHint)

  passGroup.querySelector('input').addEventListener('input', e => {
    const value = e.target.value
    if (value.length > 0 && value.length < 8) {
      passHint.textContent = 'A senha deve ter ao menos 8 caracteres'
      passHint.style.color = 'var(--color-danger)'
    } else if (value.length >= 8) {
      passHint.textContent = 'Senha válida'
      passHint.style.color = 'var(--color-success)'
    } else {
      passHint.textContent = 'Use ao menos 8 caracteres'
      passHint.style.color = 'var(--color-text-muted)'
    }
  })

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Redefinir Senha'

  const footer = document.createElement('div')
  footer.className = 'text-center mt-4 pt-4'
  footer.style.borderTop = '1px solid var(--color-border-light)'
  footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/login" class="fw-semibold">Voltar ao login</a></p>'

  form.appendChild(passGroup)
  form.appendChild(confirmGroup)
  form.appendChild(btn)

  card.appendChild(logo)
  card.appendChild(title)
  card.appendChild(subtitle)
  card.appendChild(alert)
  card.appendChild(form)
  card.appendChild(footer)

  main.appendChild(card)
  page.appendChild(main)

  form.addEventListener('submit', async e => {
    e.preventDefault()
    const novaSenha = document.getElementById('novaSenha').value
    const confirmSenha = document.getElementById('confirmSenha').value

    if (novaSenha.length < 8) {
      mostrarAlerta(alert, 'erro', 'A nova senha deve ter ao menos 8 caracteres.')
      return
    }

    if (novaSenha !== confirmSenha) {
      mostrarAlerta(alert, 'erro', 'As senhas não conferem.')
      return
    }

    const result = await auth.redefinirSenha(token, novaSenha)

    if (result.erro) {
      mostrarAlerta(alert, 'erro', result.erro)
      mostrarToast('erro', result.erro)
    } else {
      mostrarAlerta(alert, 'sucesso', 'Senha redefinida com sucesso!')
      mostrarToast('sucesso', 'Senha redefinida com sucesso!')
      setTimeout(() => window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' })), 2000)
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
