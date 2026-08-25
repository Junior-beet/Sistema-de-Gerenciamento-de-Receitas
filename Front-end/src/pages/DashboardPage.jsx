import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { mostrarAlerta } from '../components/shared/Alert.jsx'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarData(dataStr) {
  const data = new Date(dataStr)
  return data.toLocaleDateString('pt-BR')
}

function getTipoBadge(tipo) {
  if (tipo === 'RECEITA') return '<span class="badge bg-success">Receita</span>'
  return '<span class="badge bg-danger">Despesa</span>'
}

export async function DashboardPage() {
  const page = document.createElement('div')
  page.appendChild(Header('/dashboard'))

  const main = document.createElement('main')
  main.className = 'container py-4'

  const usuario = auth.sessaoLocal()
  const userName = usuario?.nome?.split(' ')[0] || 'Usuário'

  const alert = document.createElement('div')
  alert.className = 'alert d-none mb-4'
  alert.id = 'dashboardAlert'

  main.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">Dashboard</h1>
        <p class="text-secondary-soft mb-0">Bem-vindo, ${userName}! Acompanhe suas finanças.</p>
      </div>
      <div class="d-flex gap-2">
        <a href="/transacoes/nova?tipo=RECEITA" class="btn btn-success" id="btnNovaReceita">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right:6px"><path d="M9 1v16M1 9h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nova Receita
        </a>
        <a href="/transacoes/nova?tipo=DESPESA" class="btn btn-danger" id="btnNovaDespesa">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="margin-right:6px"><path d="M9 1v16M1 9h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Nova Despesa
        </a>
      </div>
    </div>

    <div id="dashboardAlertContainer"></div>

    <div class="row g-3 mb-4" id="cardsResumo">
      <div class="col-12 col-md-4">
        <div class="card value-card balance">
          <div class="card-body">
            <div class="card-title">Saldo Total</div>
            <div class="card-value" id="saldoTotal">R$ 0,00</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card value-card revenue">
          <div class="card-body">
            <div class="card-title">Total Receitas</div>
            <div class="card-value text-success" id="totalReceitas">R$ 0,00</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card value-card expense">
          <div class="card-body">
            <div class="card-title">Total Despesas</div>
            <div class="card-value text-danger" id="totalDespesas">R$ 0,00</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center" style="border-bottom:1px solid var(--color-border-light);background:var(--color-surface-muted)">
        <h5 class="mb-0">Últimas Transações</h5>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" id="filtroTipo" style="width:auto;min-width:160px">
            <option value="">Todos</option>
            <option value="RECEITA">Receitas</option>
            <option value="DESPESA">Despesas</option>
          </select>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped mb-0" id="tabelaTransacoes">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th class="text-end">Valor</th>
                <th>Tipo</th>
                <th class="text-end" style="width:100px">Ações</th>
              </tr>
            </thead>
            <tbody id="tbodyTransacoes">
              <tr>
                <td colspan="7" class="text-center py-4 text-secondary-soft">Carregando...</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 text-center" id="emptyState" style="display:none">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="color:var(--color-text-muted);margin-bottom:12px">
            <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 20h24M12 28h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="36" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M34 16h4M36 14v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p class="text-secondary-soft mb-2">Nenhuma transação encontrada</p>
          <a href="/transacoes/nova?tipo=RECEITA" class="btn btn-outline-primary btn-sm" id="btnPrimeiraReceita">Adicionar primeira receita</a>
          <a href="/transacoes/nova?tipo=DESPESA" class="btn btn-outline-danger btn-sm ms-2" id="btnPrimeiraDespesa">Adicionar primeira despesa</a>
        </div>
        <div class="p-3 text-center" id="paginationContainer"></div>
      </div>
    </div>
  `

  main.querySelector('#dashboardAlertContainer').appendChild(alert)
  page.appendChild(main)
  page.appendChild(Footer())

  let transacoes = []
  let paginaAtual = 1
  const itensPorPagina = 10
  let categoriasCache = {}
  let subcategoriasCache = {}

  async function carregarCategorias() {
    try {
      const data = await api.get('/categorias/usuario/' + usuario.id_usuario)
      data.dados?.forEach(c => { categoriasCache[c.id_categoria] = c })
    } catch (e) {
      console.error('Erro ao carregar categorias:', e)
    }
  }

  async function carregarSubcategorias() {
    try {
      for (const catId of Object.keys(categoriasCache)) {
        const data = await api.get('/subcategorias/categoria/' + catId)
        data.dados?.forEach(s => { subcategoriasCache[s.id_subcategoria] = s })
      }
    } catch (e) {
      console.error('Erro ao carregar subcategorias:', e)
    }
  }

  async function carregarTransacoes() {
    const tbody = document.getElementById('tbodyTransacoes')
    const emptyState = document.getElementById('emptyState')
    const paginationContainer = document.getElementById('paginationContainer')

    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-secondary-soft">Carregando...</td></tr>'
    emptyState.style.display = 'none'
    paginationContainer.innerHTML = ''

    try {
      const data = await api.get('/transacoes')
      transacoes = data.dados || []

      const filtro = document.getElementById('filtroTipo').value
      const filtradas = filtro ? transacoes.filter(t => t.tipo === filtro) : transacoes

      if (filtradas.length === 0) {
        tbody.innerHTML = ''
        emptyState.style.display = 'block'
        atualizarResumo(transacoes)
        return
      }

      emptyState.style.display = 'none'

      const inicio = (paginaAtual - 1) * itensPorPagina
      const fim = inicio + itensPorPagina
      const pagina = filtradas.slice(inicio, fim)

      tbody.innerHTML = pagina.map(t => {
        const cat = categoriasCache[t.id_categoria] || { nome: '—', cor: '#9AA0A6' }
        const sub = subcategoriasCache[t.id_subcategoria] || { nome: '—' }
        return `
          <tr>
            <td>${formatarData(t.data_transacao)}</td>
            <td>${t.descricao || '—'}</td>
            <td>
              <span class="badge" style="background:${cat.cor || '#9AA0A6'};color:#fff">${cat.nome}</span>
            </td>
            <td>${sub.nome}</td>
            <td class="text-end ${t.tipo === 'RECEITA' ? 'value-positive' : 'value-negative'} fw-semibold">
              ${formatarMoeda(t.valor)}
            </td>
            <td>${getTipoBadge(t.tipo)}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <a href="/transacoes/editar/${t.id_transacao}" class="btn btn-outline-primary btn-editar" data-id="${t.id_transacao}" title="Editar">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11l3-3 4 4-3 3H2v-4zM12 2l2 2-4 4-2-2 4-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
                <button type="button" class="btn btn-outline-danger btn-excluir" data-id="${t.id_transacao}" title="Excluir">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4v8M10 4v8M7 4V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `
      }).join('')

      atualizarResumo(transacoes)
      renderizarPaginacao(filtradas.length)
      anexarEventosBotoes()
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Erro ao carregar transações: ${err.message}</td></tr>`
      mostrarToast('erro', 'Erro ao carregar transações')
    }
  }

  function atualizarResumo(lista) {
    const totalReceitas = lista.filter(t => t.tipo === 'RECEITA').reduce((s, t) => s + Number(t.valor), 0)
    const totalDespesas = lista.filter(t => t.tipo === 'DESPESA').reduce((s, t) => s + Number(t.valor), 0)
    const saldo = totalReceitas - totalDespesas

    document.getElementById('saldoTotal').textContent = formatarMoeda(saldo)
    document.getElementById('saldoTotal').className = `card-value ${saldo >= 0 ? '' : 'text-danger'}`
    document.getElementById('totalReceitas').textContent = formatarMoeda(totalReceitas)
    document.getElementById('totalDespesas').textContent = formatarMoeda(totalDespesas)
  }

  function renderizarPaginacao(total) {
    const container = document.getElementById('paginationContainer')
    const totalPaginas = Math.ceil(total / itensPorPagina)
    if (totalPaginas <= 1) return

    let html = '<nav><ul class="pagination pagination-sm mb-0 justify-content-center">'
    html += `<li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${paginaAtual - 1}">Anterior</a></li>`
    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
        html += `<li class="page-item ${i === paginaAtual ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
      } else if (i === paginaAtual - 2 || i === paginaAtual + 2) {
        html += '<li class="page-item disabled"><span class="page-link">...</span></li>'
      }
    }
    html += `<li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${paginaAtual + 1}">Próximo</a></li>`
    html += '</ul></nav>'
    container.innerHTML = html

    container.querySelectorAll('.page-link[data-page]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault()
        const p = parseInt(a.dataset.page)
        if (p >= 1 && p <= totalPaginas && p !== paginaAtual) {
          paginaAtual = p
          carregarTransacoes()
        }
      })
    })
  }

  function anexarEventosBotoes() {
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault()
        const id = btn.dataset.id
        window.dispatchEvent(new CustomEvent('navegar', { detail: `/transacoes/editar/${id}` }))
      })
    })

    document.querySelectorAll('.btn-excluir').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.preventDefault()
        const id = btn.dataset.id
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return

        try {
          await api.delete(`/transacoes/${id}`)
          mostrarToast('sucesso', 'Transação excluída com sucesso')
          carregarTransacoes()
        } catch (err) {
          mostrarToast('erro', err.message || 'Erro ao excluir transação')
        }
      })
    })
  }

  document.getElementById('filtroTipo').addEventListener('change', () => {
    paginaAtual = 1
    carregarTransacoes()
  })

  main.querySelectorAll('a[href^="/"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  await carregarCategorias()
  await carregarSubcategorias()
  await carregarTransacoes()

  return page
}