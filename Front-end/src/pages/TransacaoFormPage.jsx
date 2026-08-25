import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'

function getParams() {
  const params = new URLSearchParams(location.search)
  return {
    tipo: params.get('tipo') || 'RECEITA',
    id: params.get('id') || null
  }
}

function extrairIdDaRota() {
  const path = location.pathname
  const match = path.match(/\/transacoes\/editar\/(\d+)/)
  return match ? match[1] : null
}

export async function TransacaoFormPage() {
  const page = document.createElement('div')
  const { tipo, id: idQuery } = getParams()
  const idRota = extrairIdDaRota()
  const id = idRota || idQuery
  const isEdit = !!id
  const titulo = isEdit ? 'Editar' : 'Nova'
  const tipoLabel = tipo === 'RECEITA' ? 'Receita' : 'Despesa'
  const tipoColor = tipo === 'RECEITA' ? 'success' : 'danger'

  const usuario = auth.sessaoLocal()
  if (!usuario) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
    return page
  }

  page.appendChild(Header('/dashboard'))

  const main = document.createElement('main')
  main.className = 'auth-page'

  const card = document.createElement('div')
  card.className = 'auth-card'
  card.style.maxWidth = '600px'

  const logo = document.createElement('img')
  logo.src = '/assets/logo-sgr.svg'
  logo.alt = 'Logo do SGR'
  logo.className = 'auth-logo'

  const title = document.createElement('h1')
  title.className = 'auth-title'
  title.textContent = `${titulo} ${tipoLabel}`

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = `Preencha os dados da ${tipoLabel.toLowerCase()}`

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'formAlert'

  const form = document.createElement('form')
  form.id = 'transacaoForm'
  form.noValidate = true

  const descGroup = document.createElement('div')
  descGroup.className = 'mb-3'
  descGroup.innerHTML = `
    <label for="descricao" class="form-label">Descrição <span class="text-danger">*</span></label>
    <input type="text" class="form-control" id="descricao" placeholder="Ex: Salário, Freelance, Aluguel..." required maxlength="100">
  `
  form.appendChild(descGroup)

  const valorGroup = document.createElement('div')
  valorGroup.className = 'mb-3'
  valorGroup.innerHTML = `
    <label for="valor" class="form-label">Valor <span class="text-danger">*</span></label>
    <div class="input-group">
      <span class="input-group-text">R$</span>
      <input type="number" class="form-control" id="valor" placeholder="0,00" step="0.01" min="0.01" required>
    </div>
  `
  form.appendChild(valorGroup)

  const dataGroup = document.createElement('div')
  dataGroup.className = 'mb-3'
  const hoje = new Date().toISOString().split('T')[0]
  dataGroup.innerHTML = `
    <label for="data" class="form-label">Data <span class="text-danger">*</span></label>
    <input type="date" class="form-control" id="data" value="${hoje}" required max="${hoje}">
  `
  form.appendChild(dataGroup)

  const catGroup = document.createElement('div')
  catGroup.className = 'mb-3'
  catGroup.innerHTML = `
    <label for="categoria" class="form-label">Categoria <span class="text-danger">*</span></label>
    <select class="form-select" id="categoria" required>
      <option value="" disabled selected>Carregando categorias...</option>
    </select>
  `
  form.appendChild(catGroup)

  const subGroup = document.createElement('div')
  subGroup.className = 'mb-4'
  subGroup.innerHTML = `
    <label for="subcategoria" class="form-label">Subcategoria</label>
    <select class="form-select" id="subcategoria" disabled>
      <option value="">Selecione uma categoria primeiro</option>
    </select>
  `
  form.appendChild(subGroup)

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = `btn btn-${tipoColor} btn-lg w-100`
  btn.textContent = isEdit ? 'Salvar Alterações' : `Cadastrar ${tipoLabel}`
  btn.id = 'btnSubmit'

  form.appendChild(btn)

  const divider = document.createElement('div')
  divider.className = 'auth-divider'
  divider.textContent = 'ou'

  const footer = document.createElement('div')
  footer.className = 'text-center'
  footer.innerHTML = `<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="/dashboard" class="fw-semibold">← Voltar ao Dashboard</a></p>`

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

  let categorias = []
  let subcategorias = []

  async function carregarCategorias() {
    try {
      const data = await api.get(`/categorias/usuario/${usuario.id_usuario}`)
      categorias = (data.dados || []).filter(c => c.tipo === tipo)

      const select = document.getElementById('categoria')
      if (categorias.length === 0) {
        select.innerHTML = `<option value="" disabled selected>Nenhuma categoria ${tipoLabel.toLowerCase()} cadastrada</option>`
        select.disabled = true
        btn.disabled = true
        btn.textContent = `Cadastre uma categoria ${tipoLabel.toLowerCase()} primeiro`
        return
      }

      select.innerHTML = `<option value="" disabled selected>Selecione a categoria</option>` +
        categorias.map(c => `<option value="${c.id_categoria}" style="color:${c.cor || '#333'}">${c.nome}</option>`).join('')
      select.disabled = false
    } catch (err) {
      document.getElementById('categoria').innerHTML = `<option value="" disabled selected>Erro ao carregar categorias</option>`
      mostrarToast('erro', 'Erro ao carregar categorias')
    }
  }

  async function carregarSubcategorias(categoriaId) {
    const select = document.getElementById('subcategoria')
    select.disabled = true
    select.innerHTML = '<option value="">Carregando...</option>'

    try {
      const data = await api.get(`/subcategorias/categoria/${categoriaId}`)
      subcategorias = (data.dados || []).filter(s => s.ativo === 1)

      if (subcategorias.length === 0) {
        select.innerHTML = '<option value="" disabled selected>Nenhuma subcategoria ativa</option>'
        select.disabled = true
        return
      }

      select.innerHTML = '<option value="" disabled selected>Selecione a subcategoria (opcional)</option>' +
        subcategorias.map(s => `<option value="${s.id_subcategoria}">${s.nome}</option>`).join('')
      select.disabled = false
    } catch (err) {
      select.innerHTML = '<option value="" disabled selected>Erro ao carregar subcategorias</option>'
      select.disabled = true
    }
  }

  document.getElementById('categoria').addEventListener('change', e => {
    const catId = e.target.value
    if (catId) {
      carregarSubcategorias(catId)
    } else {
      const select = document.getElementById('subcategoria')
      select.innerHTML = '<option value="" disabled selected>Selecione uma categoria primeiro</option>'
      select.disabled = true
    }
  })

  if (isEdit) {
    btn.disabled = true
    btn.textContent = 'Carregando...'

    try {
      const data = await api.get(`/transacoes/${id}`)
      const t = data.dados

      document.getElementById('descricao').value = t.descricao || ''
      document.getElementById('valor').value = t.valor
      document.getElementById('data').value = t.data_transacao?.split('T')[0] || hoje

      await carregarCategorias()

      const catSelect = document.getElementById('categoria')
      catSelect.value = t.id_categoria
      catSelect.dispatchEvent(new Event('change'))

      setTimeout(() => {
        const subSelect = document.getElementById('subcategoria')
        if (t.id_subcategoria) {
          subSelect.value = t.id_subcategoria
        }
        btn.disabled = false
        btn.textContent = 'Salvar Alterações'
      }, 100)
    } catch (err) {
      mostrarAlerta(alert, 'erro', 'Erro ao carregar transação: ' + err.message)
      btn.disabled = false
      btn.textContent = 'Tentar novamente'
    }
  } else {
    await carregarCategorias()
  }

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const descricao = document.getElementById('descricao').value.trim()
    const valor = parseFloat(document.getElementById('valor').value)
    const data = document.getElementById('data').value
    const categoriaId = document.getElementById('categoria').value
    const subcategoriaId = document.getElementById('subcategoria').value || null

    if (!descricao || !valor || !data || !categoriaId) {
      mostrarAlerta(alert, 'erro', 'Preencha todos os campos obrigatórios')
      return
    }

    btn.disabled = true
    btn.innerHTML = '<span class="spinner spinner-sm me-2"></span>Salvando...'

    const payload = {
      descricao,
      valor,
      data_transacao: data,
      id_categoria: parseInt(categoriaId),
      id_subcategoria: subcategoriaId ? parseInt(subcategoriaId) : null,
      tipo,
      id_usuario: usuario.id_usuario
    }

    try {
      if (isEdit) {
        await api.put(`/transacoes/${id}`, payload)
        mostrarToast('sucesso', `${tipoLabel} atualizada com sucesso!`)
      } else {
        await api.post('/transacoes', payload)
        mostrarToast('sucesso', `${tipoLabel} cadastrada com sucesso!`)
      }

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/dashboard' }))
      }, 1000)
    } catch (err) {
      mostrarAlerta(alert, 'erro', err.message || `Erro ao ${isEdit ? 'atualizar' : 'cadastrar'} ${tipoLabel.toLowerCase()}`)
      mostrarToast('erro', err.message || `Erro ao ${isEdit ? 'atualizar' : 'cadastrar'}`)
    } finally {
      btn.disabled = false
      btn.textContent = isEdit ? 'Salvar Alterações' : `Cadastrar ${tipoLabel}`
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