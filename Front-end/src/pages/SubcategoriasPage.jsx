import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'

function extrairCategoriaIdDaRota() {
  const path = location.pathname
  const match = path.match(/\/categorias\/(\d+)\/subcategorias/)
  return match ? match[1] : null
}

export async function SubcategoriasPage() {
  const page = document.createElement('div')
  const categoriaId = extrairCategoriaIdDaRota()

  if (!categoriaId) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/categorias' }))
    return page
  }

  const usuario = auth.sessaoLocal()
  if (!usuario) {
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
    return page
  }

  page.appendChild(Header('/categorias'))

  const main = document.createElement('main')
  main.className = 'container py-4'

  let categoria = null

  main.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <p class="text-secondary-soft mb-1"><a href="/categorias" id="linkVoltar" class="text-decoration-none">&larr; Categorias</a></p>
        <h1 class="h3 mb-1" id="pageTitle">Subcategorias</h1>
        <p class="text-secondary-soft mb-0" id="pageSubtitle">Carregando...</p>
      </div>
      <a href="/subcategorias/nova?categoria=${categoriaId}" class="btn btn-primary" id="btnNovaSub">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right:6px"><path d="M9 1v16M1 9h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Nova Subcategoria
      </a>
    </div>

    <div id="subcategoriasContainer">
      <div class="text-center py-5">
        <div class="spinner mx-auto"></div>
        <p class="text-secondary-soft mt-3">Carregando subcategorias...</p>
      </div>
    </div>
  `

  page.appendChild(main)
  page.appendChild(Footer())

  let subcategorias = []

  async function carregarCategoria() {
    try {
      const data = await api.get(`/categorias/${categoriaId}`)
      categoria = data.dados
      const isReceita = categoria.tipo === 'RECEITA'
      const cor = categoria.cor || (isReceita ? '#34A853' : '#D93025')

      document.getElementById('pageTitle').innerHTML = `
        <span class="me-2">${categoria.nome}</span>
        <span class="badge ${isReceita ? 'bg-success' : 'bg-danger'}" style="font-size:12px">${isReceita ? 'Receita' : 'Despesa'}</span>
      `
      document.getElementById('pageSubtitle').textContent = `Gerencie as subcategorias de "${categoria.nome}"`
    } catch (err) {
      document.getElementById('pageTitle').textContent = 'Categoria nao encontrada'
      document.getElementById('pageSubtitle').textContent = err.message
      document.getElementById('btnNovaSub').style.display = 'none'
    }
  }

  async function carregarSubcategorias() {
    const container = document.getElementById('subcategoriasContainer')

    try {
      const data = await api.get(`/subcategorias/categoria/${categoriaId}`)
      subcategorias = (data.dados || []).filter(s => s.ativo === 1)
      renderizar()
    } catch (err) {
      container.innerHTML = `
        <div class="text-center py-5">
          <p class="text-danger mb-2">Erro ao carregar subcategorias</p>
          <p class="text-secondary-soft small">${err.message}</p>
        </div>
      `
      mostrarToast('erro', 'Erro ao carregar subcategorias')
    }
  }

  function renderizar() {
    const container = document.getElementById('subcategoriasContainer')

    if (subcategorias.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="color:var(--color-text-muted);margin-bottom:12px">
            <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14 22h20M14 30h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p class="text-secondary-soft mb-3">Nenhuma subcategoria cadastrada</p>
          <a href="/subcategorias/nova?categoria=${categoriaId}" class="btn btn-outline-primary btn-sm sub-link">Adicionar primeira subcategoria</a>
        </div>
      `
      anexarLinks(container)
      return
    }

    let html = '<div class="row g-3">'
    subcategorias.forEach(sub => {
      html += `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card subcategoria-card">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0 fw-semibold">${sub.nome}</h6>
              </div>
              <div class="d-flex gap-1">
                <a href="/subcategorias/editar/${sub.id_subcategoria}" class="btn btn-outline-primary btn-sm sub-link">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11l3-3 4 4-3 3H2v-4zM12 2l2 2-4 4-2-2 4-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
                <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-sub" data-id="${sub.id_subcategoria}" data-nome="${sub.nome}">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4v8M10 4v8M7 4V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    })
    html += '</div>'
    container.innerHTML = html

    anexarLinks(container)

    container.querySelectorAll('.btn-excluir-sub').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.preventDefault()
        const id = btn.dataset.id
        const nome = btn.dataset.nome
        if (!confirm(`Tem certeza que deseja excluir a subcategoria "${nome}"?`)) return

        try {
          await api.delete(`/subcategorias/${id}`)
          mostrarToast('sucesso', 'Subcategoria excluida com sucesso')
          subcategorias = subcategorias.filter(s => s.id_subcategoria != id)
          renderizar()
        } catch (err) {
          mostrarToast('erro', err.message || 'Erro ao excluir subcategoria')
        }
      })
    })
  }

  function anexarLinks(container) {
    container.querySelectorAll('.sub-link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
      })
    })
  }

  document.getElementById('linkVoltar').addEventListener('click', e => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/categorias' }))
  })

  document.getElementById('btnNovaSub').addEventListener('click', e => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('navegar', { detail: e.currentTarget.getAttribute('href') }))
  })

  await carregarCategoria()
  await carregarSubcategorias()

  return page
}
