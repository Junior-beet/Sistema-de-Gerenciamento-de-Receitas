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

const COR_PADRAO = { RECEITA: '#34A853', DESPESA: '#D93025' }

export async function CategoriaFormPage() {
  const page = document.createElement('div')
  const params = new URLSearchParams(location.search)
  const tipoInicial = params.get('tipo') || 'RECEITA'
  const idRota = extrairIdDaRota()
  const isEdit = !!idRota
  let corManual = false

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
  title.textContent = `${isEdit ? 'Editar' : 'Nova'} ${tipoInicial === 'RECEITA' ? 'Receita' : 'Despesa'}`

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = `Preencha os dados da ${tipoInicial === 'RECEITA' ? 'receita' : 'despesa'}`

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
      <input type="color" class="form-control form-control-color" id="cor" value="${COR_PADRAO[tipoInicial]}" title="Selecione uma cor">
      <span class="small text-secondary-soft">Cor para identificacao visual</span>
    </div>
  `
  form.appendChild(corGroup)

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = `btn btn-lg w-100 ${tipoInicial === 'RECEITA' ? 'btn-success' : 'btn-danger'}`
  btn.textContent = isEdit ? 'Salvar Alteracoes' : `Cadastrar ${tipoInicial === 'RECEITA' ? 'Receita' : 'Despesa'}`
  btn.id = 'btnSubmit'
  form.appendChild(btn)

  const divider = document.createElement('div')
  divider.className = 'auth-divider'
  divider.textContent = 'ou'

  const voltarBtn = document.createElement('a')
  voltarBtn.href = '/calculos'
  voltarBtn.id = 'btnVoltar'
  voltarBtn.className = `btn btn-lg w-100 ${tipoInicial === 'RECEITA' ? 'btn-outline-success' : 'btn-outline-danger'}`
  voltarBtn.textContent = 'Cancelar e voltar'

  card.appendChild(logo)
  card.appendChild(title)
  card.appendChild(subtitle)
  card.appendChild(alert)
  card.appendChild(form)
  card.appendChild(divider)
  card.appendChild(voltarBtn)

  main.appendChild(card)
  page.appendChild(main)
  page.appendChild(Footer())

  const tipoSelect = form.querySelector('#tipo')
  const corInput = form.querySelector('#cor')

  function aplicarTema(isReceita) {
    const label = isReceita ? 'Receita' : 'Despesa'
    title.textContent = `${isEdit ? 'Editar' : 'Nova'} ${label}`
    subtitle.textContent = `Preencha os dados da ${isReceita ? 'receita' : 'despesa'}`
    voltarBtn.className = `btn btn-lg w-100 ${isReceita ? 'btn-outline-success' : 'btn-outline-danger'}`
    btn.className = `btn btn-lg w-100 ${isReceita ? 'btn-success' : 'btn-danger'}`
    btn.textContent = isEdit ? 'Salvar Alteracoes' : `Cadastrar ${label}`
    if (!corManual) corInput.value = isReceita ? COR_PADRAO.RECEITA : COR_PADRAO.DESPESA
  }

  corInput.addEventListener('input', () => { corManual = true })

  tipoSelect.addEventListener('change', () => {
    aplicarTema(tipoSelect.value === 'RECEITA')
  })

  aplicarTema(tipoInicial === 'RECEITA')

  if (isEdit) {
    btn.disabled = true
    btn.textContent = 'Carregando...'

    try {
      const data = await api.get(`/categorias/${idRota}`)
      const cat = data.dados
      const tipoCarregado = cat.tipo || tipoInicial

      document.getElementById('nome').value = cat.nome || ''
      document.getElementById('tipo').value = tipoCarregado
      corManual = !!(cat.cor && cat.cor !== COR_PADRAO[tipoCarregado])
      corInput.value = cat.cor || COR_PADRAO[tipoCarregado]
      aplicarTema(tipoCarregado === 'RECEITA')

      btn.disabled = false
      btn.textContent = 'Salvar Alteracoes'
    } catch (err) {
      mostrarAlerta(alert, 'erro', 'Erro ao carregar: ' + err.message)
      btn.disabled = false
      btn.textContent = 'Tentar novamente'
    }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const nome = document.getElementById('nome').value.trim()
    const tipo = document.getElementById('tipo').value
    const cor = document.getElementById('cor').value
    const labelAtual = tipo === 'RECEITA' ? 'Receita' : 'Despesa'

    if (!nome) {
      mostrarAlerta(alert, 'erro', `Preencha o nome da ${labelAtual.toLowerCase()}`)
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
        mostrarToast('sucesso', `${labelAtual} atualizada com sucesso!`)
      } else {
        await api.post('/categorias', payload)
        mostrarToast('sucesso', `${labelAtual} cadastrada com sucesso!`)
      }

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/calculos' }))
      }, 800)
    } catch (err) {
      mostrarAlerta(alert, 'erro', err.message || 'Erro ao salvar')
      mostrarToast('erro', err.message || 'Erro ao salvar')
    } finally {
      btn.disabled = false
      btn.textContent = isEdit ? 'Salvar Alteracoes' : `Cadastrar ${tipoSelect.value === 'RECEITA' ? 'Receita' : 'Despesa'}`
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
