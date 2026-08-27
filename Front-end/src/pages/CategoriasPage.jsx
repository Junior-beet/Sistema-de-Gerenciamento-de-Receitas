import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'

export async function CategoriasPage() {
  const page = document.createElement('div')
  page.appendChild(Header('/categorias'))

  const main = document.createElement('main')
  main.className = 'container py-4'

  const usuario = auth.sessaoLocal()
  const userName = usuario?.nome?.split(' ')[0] || 'Usuario'

  main.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">Categorias</h1>
        <p class="text-secondary-soft mb-0">Gerencie suas receitas e despesas, ${userName}.</p>
      </div>
      <div class="d-flex gap-2">
        <a href="/categorias/nova?tipo=RECEITA" class="btn btn-success" id="btnNovaReceita">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right:6px"><path d="M9 1v16M1 9h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nova Receita
        </a>
        <a href="/categorias/nova?tipo=DESPESA" class="btn btn-danger" id="btnNovaDespesa">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right:6px"><path d="M9 1v16M1 9h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nova Despesa
        </a>
      </div>
    </div>

    <ul class="nav nav-tabs mb-4" id="categoriasTabs">
      <li class="nav-item">
        <button class="nav-link active" data-tab="todas">Todas</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-tab="RECEITA">Receitas</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-tab="DESPESA">Despesas</button>
      </li>
    </ul>

    <div id="categoriasContainer">
      <div class="text-center py-5">
        <div class="spinner mx-auto"></div>
        <p class="text-secondary-soft mt-3">Carregando categorias...</p>
      </div>
    </div>
  `

  page.appendChild(main)
  page.appendChild(Footer())

  let categorias = []
  let tabAtiva = 'todas'

  async function carregarCategorias() {
    const container = document.getElementById('categoriasContainer')

    try {
      const data = await api.get(`/categorias/usuario/${usuario.id_usuario}`)
      categorias = data.dados || []
      renderizar()
    } catch (err) {
      container.innerHTML = `
        <div class="text-center py-5">
          <p class="text-danger mb-2">Erro ao carregar categorias</p>
          <p class="text-secondary-soft small">${err.message}</p>
        </div>
      `
      mostrarToast('erro', 'Erro ao carregar categorias')
    }
  }

  function renderizar() {
    const container = document.getElementById('categoriasContainer')
    const filtradas = tabAtiva === 'todas' ? categorias : categorias.filter(c => c.tipo === tabAtiva)

    if (filtradas.length === 0) {
      const msg = tabAtiva === 'todas'
        ? 'Nenhuma categoria cadastrada'
        : tabAtiva === 'RECEITA'
          ? 'Nenhuma receita cadastrada'
          : 'Nenhuma despesa cadastrada'
      container.innerHTML = `
        <div class="text-center py-5">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="color:var(--color-text-muted);margin-bottom:12px">
            <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14 22h20M14 30h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p class="text-secondary-soft mb-3">${msg}</p>
          <a href="/categorias/nova?tipo=RECEITA" class="btn btn-outline-success btn-sm cat-link">Adicionar receita</a>
          <a href="/categorias/nova?tipo=DESPESA" class="btn btn-outline-danger btn-sm ms-2 cat-link">Adicionar despesa</a>
        </div>
      `
      anexarLinks(container)
      return
    }

    const receitas = filtradas.filter(c => c.tipo === 'RECEITA')
    const despesas = filtradas.filter(c => c.tipo === 'DESPESA')

    let html = ''

    if (receitas.length > 0 && tabAtiva === 'todas') {
      html += `<h5 class="text-success mb-3 d-flex align-items-center gap-2">
        <span style="width:10px;height:10px;border-radius:50%;background:var(--color-success);display:inline-block"></span>
        Receitas
      </h5>`
      html += '<div class="row g-3 mb-4">'
      receitas.forEach(c => { html += renderizarCard(c) })
      html += '</div>'
    } else if (receitas.length > 0 && tabAtiva === 'RECEITA') {
      html += '<div class="row g-3">'
      receitas.forEach(c => { html += renderizarCard(c) })
      html += '</div>'
    }

    if (despesas.length > 0 && tabAtiva === 'todas') {
      html += `<h5 class="text-danger mb-3 d-flex align-items-center gap-2">
        <span style="width:10px;height:10px;border-radius:50%;background:var(--color-danger);display:inline-block"></span>
        Despesas
      </h5>`
      html += '<div class="row g-3 mb-4">'
      despesas.forEach(c => { html += renderizarCard(c) })
      html += '</div>'
    } else if (despesas.length > 0 && tabAtiva === 'DESPESA') {
      html += '<div class="row g-3">'
      despesas.forEach(c => { html += renderizarCard(c) })
      html += '</div>'
    }

    container.innerHTML = html
    anexarEventos(container)
  }

  function renderizarCard(cat) {
    const isReceita = cat.tipo === 'RECEITA'
    const cor = cat.cor || (isReceita ? '#34A853' : '#D93025')
    return `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card categoria-card" style="border-left:4px solid ${cor}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="card-title mb-1 fw-semibold">${cat.nome}</h6>
                <span class="badge ${isReceita ? 'bg-success' : 'bg-danger'}" style="font-size:11px">${isReceita ? 'Receita' : 'Despesa'}</span>
              </div>
              <div class="color-dot" style="background:${cor}"></div>
            </div>
            <div class="d-flex gap-1 mt-3">
              <a href="/categorias/editar/${cat.id_categoria}" class="btn btn-outline-primary btn-sm cat-link" data-action="editar" data-id="${cat.id_categoria}">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11l3-3 4 4-3 3H2v-4zM12 2l2 2-4 4-2-2 4-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Editar
              </a>
              <a href="/categorias/${cat.id_categoria}/subcategorias" class="btn btn-outline-secondary btn-sm cat-link">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5h8M3 9h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                Subcategorias
              </a>
              <button type="button" class="btn btn-outline-danger btn-sm btn-excluir-cat" data-id="${cat.id_categoria}" data-nome="${cat.nome}">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4v8M10 4v8M7 4V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  function anexarLinks(container) {
    container.querySelectorAll('.cat-link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
      })
    })
  }

  function anexarEventos(container) {
    anexarLinks(container)

    container.querySelectorAll('.btn-excluir-cat').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.preventDefault()
        const id = btn.dataset.id
        const nome = btn.dataset.nome
        if (!confirm(`Tem certeza que deseja excluir a categoria "${nome}"? Todas as subcategorias tambem serao removidas.`)) return

        try {
          await api.delete(`/categorias/${id}`)
          mostrarToast('sucesso', 'Categoria excluida com sucesso')
          categorias = categorias.filter(c => c.id_categoria != id)
          renderizar()
        } catch (err) {
          mostrarToast('erro', err.message || 'Erro ao excluir categoria')
        }
      })
    })
  }

  document.getElementById('categoriasTabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]')
    if (!btn) return
    tabAtiva = btn.dataset.tab
    document.querySelectorAll('#categoriasTabs .nav-link').forEach(l => l.classList.remove('active'))
    btn.classList.add('active')
    renderizar()
  })

  main.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  await carregarCategorias()

  return page
}
