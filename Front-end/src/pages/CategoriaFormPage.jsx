import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'

function extrairIdDaRota() {
  const path = location.pathname
  const match = path.match(/\/calculos\/editar\/(\d+)/)
  return match ? match[1] : null
}

export async function CategoriaFormPage() {
  const page = document.createElement('div')
  const params = new URLSearchParams(location.search)
  const tipoInicial = params.get('tipo') || 'RECEITA'
  const idRota = extrairIdDaRota()
  const isEdit = !!idRota
  const titulo = isEdit ? 'Editar' : 'Novo'
  const tipoLabel = tipoInicial === 'RECEITA' ? 'Receita' : 'Despesa'

  const usuario = auth.sessaoLocal()
  if (!usuario) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
    return page
  }

  page.appendChild(Header('/calculos'))

  const main = document.createElement('main')
  main.className = 'auth-page'

  const card = document.createElement('div')
  card.className = 'auth-card'
  card.style.maxWidth = '520px'

  const logo = document.createElement('img')
  logo.src = '/assets/logo-sgr.svg'
  logo.alt = 'Logo do SGR'
  logo.className = 'auth-logo'

  const title = document.createElement('h1')
  title.className = 'auth-title'
  title.textContent = `${titulo} Calculo`

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = `Preencha os dados da ${tipoLabel.toLowerCase()}`

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'formAlert'

  const form = document.createElement('form')
  form.id = 'categoriaForm'
  form.noValidate = true

  const nomeGroup = document.createElement('div')
  nomeGroup.className = 'mb-3'
  nomeGroup.innerHTML = `
    <label for="nome" class="form-label">Nome <span class="text-danger">*</span></label>
    <input type="text" class="form-control" id="nome" placeholder="Ex: Salario, Aluguel, Supermercado..." required maxlength="100">
  `
  form.appendChild(nomeGroup)

  const tipoGroup = document.createElement('div')
  tipoGroup.className = 'mb-3'
  tipoGroup.innerHTML = `
    <label for="tipo" class="form-label">Tipo <span class="text-danger">*</span></label>
    <select class="form-select" id="tipo" required>
      <option value="RECEITA" ${tipoInicial === 'RECEITA' ? 'selected' : ''}>Receita</option>
      <option value="DESPESA" ${tipoInicial === 'DESPESA' ? 'selected' : ''}>Despesa</option>
    </select>
  `
  form.appendChild(tipoGroup)

  const corGroup = document.createElement('div')
  corGroup.className = 'mb-3'
  corGroup.innerHTML = `
    <label for="cor" class="form-label">Cor (opcional)</label>
    <div class="d-flex align-items-center gap-3">
      <input type="color" class="form-control form-control-color" id="cor" value="#34A853" title="Selecione uma cor">
      <span class="small text-secondary-soft">Cor para identificacao visual</span>
    </div>
  `
  form.appendChild(corGroup)

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = isEdit ? 'Salvar Alteracoes' : 'Cadastrar Calculo'
  btn.id = 'btnSubmit'
  form.appendChild(btn)

  const divider = document.createElement('div')
  divider.className = 'auth-divider'
  divider.textContent = 'ou'

  const footer = document.createElement('div')
  footer.className = 'text-center'
  footer.innerHTML = `<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/calculos" class="fw-semibold">&larr; Voltar para calculos</a></p>`

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

  if (isEdit) {
    btn.disabled = true
    btn.textContent = 'Carregando...'

    try {
      const data = await api.get(`/categorias/${idRota}`)
      const cat = data.dados

      document.getElementById('nome').value = cat.nome || ''
      document.getElementById('tipo').value = cat.tipo || tipoInicial
      subtitle.textContent = `Preencha os dados da ${(cat.tipo || tipoInicial) === 'DESPESA' ? 'despesa' : 'receita'}`
      if (cat.cor) document.getElementById('cor').value = cat.cor

      btn.disabled = false
      btn.textContent = 'Salvar Alteracoes'
    } catch (err) {
      mostrarAlerta(alert, 'erro', 'Erro ao carregar calculo: ' + err.message)
      btn.disabled = false
      btn.textContent = 'Tentar novamente'
    }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const nome = document.getElementById('nome').value.trim()
    const tipo = document.getElementById('tipo').value
    const cor = document.getElementById('cor').value

    if (!nome) {
      mostrarAlerta(alert, 'erro', 'Preencha o nome do calculo')
      return
    }

    btn.disabled = true
    btn.innerHTML = '<span class="spinner spinner-sm me-2"></span>Salvando...'

    const payload = {
      id_usuario: usuario.id_usuario,
      nome,
      tipo,
      cor
    }

    try {
      if (isEdit) {
        await api.put(`/categorias/${idRota}`, payload)
        mostrarToast('sucesso', 'Calculo atualizado com sucesso!')
      } else {
        await api.post('/categorias', payload)
        mostrarToast('sucesso', 'Calculo cadastrado com sucesso!')
      }

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/calculos' }))
      }, 800)
    } catch (err) {
      mostrarAlerta(alert, 'erro', err.message || 'Erro ao salvar calculo')
      mostrarToast('erro', err.message || 'Erro ao salvar calculo')
    } finally {
      btn.disabled = false
      btn.textContent = isEdit ? 'Salvar Alteracoes' : 'Cadastrar Calculo'
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
