import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { navegar } from '../services/navigation.jsx'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0)
}

function formatarData(data) {
  if (!data) return '-'
  const d = new Date(data)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR')
}

function nomeLancamento(item, tipo) {
  if (item.descricao && item.descricao.trim()) return item.descricao
  if (item.origem && item.origem.trim()) return item.origem
  return tipo === 'RECEITA' ? 'Receita' : 'Despesa'
}

function LancamentoCard({ item, onExcluir }) {
  const isReceita = item.tipo === 'RECEITA'
  const cor = isReceita ? 'var(--color-success)' : 'var(--color-danger)'

  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card categoria-card" style={{ borderLeft: `4px solid ${cor}` }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="card-title mb-1 fw-semibold">{item.nome}</h6>
              <span className={`badge ${isReceita ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: 11 }}>
                {isReceita ? 'Receita' : 'Despesa'}
              </span>
            </div>
            <span className={`fw-semibold ${isReceita ? 'value-positive' : 'value-negative'}`} style={{ whiteSpace: 'nowrap' }}>
              {isReceita ? '+' : '-'} {formatarMoeda(item.valor)}
            </span>
          </div>

          <div className="small text-secondary-soft d-flex flex-column gap-1">
            <span>Categoria: {item.categoriaNome}</span>
            <span>Data: {formatarData(item.data_lancamento)}</span>
            {item.forma_pagamento && <span>Pagamento: {item.forma_pagamento}</span>}
          </div>

          <div className="d-flex gap-1 mt-3">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onExcluir(item)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4v8M10 4v8M7 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CategoriasPage() {
  const [lancamentos, setLancamentos] = useState([])
  const [tabAtiva, setTabAtiva] = useState('todas')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const usuario = auth.sessaoLocal()
  const userName = usuario?.nome?.split(' ')[0] || 'Usuario'

  useEffect(() => {
    carregarLancamentos()
  }, [])

  async function carregarLancamentos() {
    try {
      const [categoriasResp, receitasResp, despesasResp] = await Promise.all([
        api.get('/categorias'),
        api.get('/receitas'),
        api.get('/despesas'),
      ])

      const categorias = categoriasResp.dados || []
      const nomesPorId = categorias.reduce((acc, c) => {
        acc[c.id_categoria] = c.nome
        return acc
      }, {})

      const receitas = (receitasResp.dados || []).map(r => ({
        ...r,
        tipo: 'RECEITA',
        id: r.id_receita,
        nome: nomeLancamento(r, 'RECEITA'),
        categoriaNome: nomesPorId[r.id_categoria] || 'Sem categoria',
      }))

      const despesas = (despesasResp.dados || []).map(d => ({
        ...d,
        tipo: 'DESPESA',
        id: d.id_despesa,
        nome: nomeLancamento(d, 'DESPESA'),
        categoriaNome: nomesPorId[d.id_categoria] || 'Sem categoria',
      }))

      const todas = [...receitas, ...despesas].sort(
        (a, b) => new Date(b.data_lancamento || 0) - new Date(a.data_lancamento || 0)
      )

      setLancamentos(todas)
      setErro(null)
    } catch (err) {
      setErro(err.message)
      mostrarToast('erro', 'Erro ao carregar lançamentos')
    } finally {
      setCarregando(false)
    }
  }

  async function excluir(item) {
    if (!item) return
    if (!window.confirm(`Tem certeza que deseja excluir o lançamento "${item.nome}"?`)) return

    const recurso = item.tipo === 'RECEITA' ? 'receitas' : 'despesas'
    try {
      await api.delete(`/${recurso}/${item.id}`)
      mostrarToast('sucesso', 'Lançamento excluído com sucesso')
      setLancamentos(prev => prev.filter(l => l.id !== item.id || l.tipo !== item.tipo))
    } catch (err) {
      mostrarToast('erro', err.message || 'Erro ao excluir lançamento')
    }
  }

  const filtrados = tabAtiva === 'todas' ? lancamentos : lancamentos.filter(l => l.tipo === tabAtiva)

  const mensagemVazia = tabAtiva === 'todas'
    ? 'Nenhum lançamento cadastrado'
    : tabAtiva === 'RECEITA'
      ? 'Nenhuma receita lançada'
      : 'Nenhuma despesa lançada'

  return (
    <div>
      <Header rotaAtiva="/calculos" />
      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: 12 }}>
          <div>
            <h1 className="h3 mb-1">Calculos</h1>
            <p className="text-secondary-soft mb-0">Acompanhe seus lançamentos de receitas e despesas, {userName}.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button type="button" className="btn btn-success" onClick={() => navegar('/receitas/nova')}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: 6 }}><path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Nova Receita
            </button>
            <button type="button" className="btn btn-danger" onClick={() => navegar('/despesas/nova')}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: 6 }}><path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Nova Despesa
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navegar('/calculos/nova')}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: 6 }}><path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Nova Categoria
            </button>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4">
          {[
            { valor: 'todas', label: 'Todas' },
            { valor: 'RECEITA', label: 'Receitas' },
            { valor: 'DESPESA', label: 'Despesas' },
          ].map(t => (
            <li className="nav-item" key={t.valor}>
              <button
                type="button"
                className={`nav-link ${tabAtiva === t.valor ? 'active' : ''}`}
                onClick={() => setTabAtiva(t.valor)}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        {carregando ? (
          <div className="text-center py-5">
            <div className="spinner mx-auto"></div>
            <p className="text-secondary-soft mt-3">Carregando lançamentos...</p>
          </div>
        ) : erro && lancamentos.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-danger mb-2">Erro ao carregar lançamentos</p>
            <p className="text-secondary-soft small">{erro}</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-5">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>
              <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 22h20M14 30h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-secondary-soft mb-3">{mensagemVazia}</p>
            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => navegar('/receitas/nova')}>Adicionar receita</button>
            <button type="button" className="btn btn-outline-danger btn-sm ms-2" onClick={() => navegar('/despesas/nova')}>Adicionar despesa</button>
          </div>
        ) : (
          <div className="row g-3">
            {filtrados.map(item => (
              <LancamentoCard key={`${item.tipo}-${item.id}`} item={item} onExcluir={excluir} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
