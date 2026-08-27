import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'

function extrairIdDaRota() {
  const path = location.pathname
  const match = path.match(/\/subcategorias\/editar\/(\d+)/)
  return match ? match[1] : null
}

export async function SubcategoriaFormPage() {
  const page = document.createElement('div')
  const params = new URLSearchParams(location.search)
  const categoriaId = params.get('categoria') || null
  const idRota = extrairIdDaRota()
  const isEdit = !!idRota

  const usuario = auth.sessaoLocal()
  if (!usuario) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
    return page
  }

  page.appendChild(Header('/categorias'))

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
  title.textContent = isEdit ? 'Editar Subcategoria' : 'Nova Subcategoria'

  const subtitle = document.createElement('p')
  subtitle.className = 'auth-subtitle'
  subtitle.textContent = 'Preencha os dados da subcategoria'

  const alert = document.createElement('div')
  alert.className = 'alert d-none'
  alert.id = 'formAlert'

  const form = document.createElement('form')
  form.id = 'subcategoriaForm'
  form.noValidate = true

  const catGroup = document.createElement('div')
  catGroup.className = 'mb-3'
  catGroup.innerHTML = `
    <label for="categoria" class="form-label">Categoria Pai <span class="text-danger">*</span></label>
    <select class="form-select" id="categoria" required>
      <option value="" disabled selected>Carregando categorias...</option>
    </select>
  `
  form.appendChild(catGroup)

  const nomeGroup = document.createElement('div')
  nomeGroup.className = 'mb-4'
  nomeGroup.innerHTML = `
    <label for="nome" class="form-label">Nome <span class="text-danger">*</span></label>
    <input type="text" class="form-control" id="nome" placeholder="Ex: Supermercado, Restaurante, Transporte..." required maxlength="100">
  `
  form.appendChild(nomeGroup)

  const btn = document.createElement('button')
  btn.type = 'submit'
  btn.className = 'btn btn-primary btn-lg w-100'
  btn.textContent = isEdit ? 'Salvar Alteracoes' : 'Cadastrar Subcategoria'
  btn.id = 'btnSubmit'
  form.appendChild(btn)

  const divider = document.createElement('div')
  divider.className = 'auth-divider'
  divider.textContent = 'ou'

  const footer = document.createElement('div')
  footer.className = 'text-center'
  const voltarHref = categoriaId ? `/categorias/${categoriaId}/subcategorias` : '/categorias'
  footer.innerHTML = `<p class="small mb-0" style="color:var(--color-text-secondary)"><a href="${voltarHref}" class="fw-semibold">&larr; Voltar</a></p>`

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

  async function carregarCategorias() {
    try {
      const data = await api.get(`/categorias/usuario/${usuario.id_usuario}`)
      categorias = data.dados || []

      const select = document.getElementById('categoria')
      if (categorias.length === 0) {
        select.innerHTML = '<option value="" disabled selected>Nenhuma categoria cadastrada</option>'
        select.disabled = true
        btn.disabled = true
        return
      }

      select.innerHTML = '<option value="" disabled selected>Selecione a categoria</option>' +
        categorias.map(c => {
          const tipo = c.tipo === 'RECEITA' ? 'Receita' : 'Despesa'
          return `<option value="${c.id_categoria}">${c.nome} (${tipo})</option>`
        }).join('')
      select.disabled = false

      if (categoriaId) {
        select.value = categoriaId
      }
    } catch (err) {
      document.getElementById('categoria').innerHTML = '<option value="" disabled selected>Erro ao carregar categorias</option>'
      mostrarToast('erro', 'Erro ao carregar categorias')
    }
  }

  if (isEdit) {
    btn.disabled = true
    btn.textContent = 'Carregando...'

    try {
      const data = await api.get(`/subcategorias/${idRota}`)
      const sub = data.dados

      await carregarCategorias()

      document.getElementById('categoria').value = sub.id_categoria
      document.getElementById('nome').value = sub.nome || ''

      btn.disabled = false
      btn.textContent = 'Salvar Alteracoes'
    } catch (err) {
      mostrarAlerta(alert, 'erro', 'Erro ao carregar subcategoria: ' + err.message)
      btn.disabled = false
      btn.textContent = 'Tentar novamente'
    }
  } else {
    await carregarCategorias()
  }

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const idCategoria = document.getElementById('categoria').value
    const nome = document.getElementById('nome').value.trim()

    if (!idCategoria || !nome) {
      mostrarAlerta(alert, 'erro', 'Preencha todos os campos obrigatorios')
      return
    }

    btn.disabled = true
    btn.innerHTML = '<span class="spinner spinner-sm me-2"></span>Salvando...'

    const payload = {
      id_categoria: parseInt(idCategoria),
      nome
    }

    try {
      if (isEdit) {
        await api.put(`/subcategorias/${idRota}`, payload)
        mostrarToast('sucesso', 'Subcategoria atualizada com sucesso!')
      } else {
        await api.post('/subcategorias', payload)
        mostrarToast('sucesso', 'Subcategoria cadastrada com sucesso!')
      }

      const voltarPara = idCategoria ? `/categorias/${idCategoria}/subcategorias` : '/categorias'
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navegar', { detail: voltarPara }))
      }, 800)
    } catch (err) {
      mostrarAlerta(alert, 'erro', err.message || 'Erro ao salvar subcategoria')
      mostrarToast('erro', err.message || 'Erro ao salvar subcategoria')
    } finally {
      btn.disabled = false
      btn.textContent = isEdit ? 'Salvar Alteracoes' : 'Cadastrar Subcategoria'
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
