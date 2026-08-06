import { Header } from '../components/layout/Header.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'
import { CARGOS } from '../config/constants.jsx'
import { auth } from '../services/auth.jsx'

export function CadastroPage() {
  const page = document.createElement('div')

  const header = Header('/cadastro')
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
  iconCircle.textContent = 'C'
  iconDiv.appendChild(iconCircle)

  const title = document.createElement('h1')
  title.className = 'text-center fw-bold mb-1'
  title.style.color = 'var(--color-text-title)'
  title.textContent = 'Criar Conta'

  const divider = document.createElement('hr')
  divider.className = 'divider divider-center'

  const subtitle = document.createElement('p')
  subtitle.className = 'text-center mb-4'
  subtitle.style.color = 'var(--color-text-secondary)'
  subtitle.textContent = 'Preencha os dados para se registrar'

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'cadastroAlert'

  const form = document.createElement('form')
  form.id = 'cadastroForm'
  form.noValidate = true

  const fields = [
    { label: 'Nome completo', id: 'cadNome', type: 'text', placeholder: 'Seu nome' },
    { label: 'E-mail', id: 'cadEmail', type: 'email', placeholder: 'seu@email.com' },
    { label: 'Senha', id: 'cadSenha', type: 'password', placeholder: 'Crie uma senha segura' },
  ]

  fields.forEach(f => {
    const group = document.createElement('div')
    group.className = 'mb-3'
    group.innerHTML = `
      <label for="${f.id}" class="form-label">${f.label}</label>
      <input type="${f.type}" class="form-control" id="${f.id}" placeholder="${f.placeholder}" required ${f.type === 'password' ? 'minlength="8"' : ''}>
    `
    form.appendChild(group)

    if (f.type === 'password') {
      const hint = document.createElement('div')
      hint.className = 'form-text'
      hint.style.cssText = 'font-size:12px;margin-top:4px;color:var(--color-text-muted)'
      hint.textContent = 'Use ao menos 8 caracteres'

      group.appendChild(hint)
      group.querySelector('input').addEventListener('input', e => {
        const value = e.target.value
        if (value.length > 0 && value.length < 8) {
          hint.textContent = 'A senha deve ter ao menos 8 caracteres'
          hint.style.color = 'var(--color-danger)'
        } else if (value.length >= 8) {
          hint.textContent = 'Senha válida'
          hint.style.color = 'var(--color-success)'
        } else {
          hint.textContent = 'Use ao menos 8 caracteres'
          hint.style.color = 'var(--color-text-muted)'
        }
      })
    }
  })

  const cargoGroup = document.createElement('div')
  cargoGroup.className = 'mb-4'
  cargoGroup.innerHTML = `
    <label for="cadCargo" class="form-label">Cargo</label>
    <select class="form-select" id="cadCargo" required>
      <option value="" disabled selected>Selecione seu cargo</option>
      ${CARGOS.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
    </select>
  `
  form.appendChild(cargoGroup)

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = 'Cadastrar'

  const footer = document.createElement('div')
  footer.className = 'text-center mt-4 pt-4'
  footer.style.borderTop = '1px solid var(--color-border)'
  footer.innerHTML = '<p class="small mb-0" style="color:var(--color-text-secondary)">Já possui conta? <a href="/login" class="fw-semibold">Faça login</a></p>'

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
    const nome = document.getElementById('cadNome').value
    const email = document.getElementById('cadEmail').value
    const senha = document.getElementById('cadSenha').value
    const cargo = document.getElementById('cadCargo').value

    if (senha.length < 8) {
      mostrarAlerta(alert, 'erro', 'A senha deve ter ao menos 8 caracteres.')
      return
    }

    const result = await auth.cadastrar({ nome, email, senha, cargo })

    if (result.erro) {
      mostrarAlerta(alert, 'erro', result.erro)
    } else {
      mostrarAlerta(alert, 'sucesso', `Conta criada! Bem-vindo, ${nome}.`)
      form.reset()
      setTimeout(() => window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' })), 1200)
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
