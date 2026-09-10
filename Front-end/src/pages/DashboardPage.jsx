import * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { useFetchDados } from '../hooks/useFetchDados.js'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { KpiCard } from '../components/shared/KpiCard.jsx'
import { FiltroBusca } from '../components/shared/FiltroBusca.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { erro: null }
  }

  static getDerivedStateFromError(erro) {
    return { erro }
  }

  componentDidCatch(erro, info) {
    console.error('Erro na Dashboard:', erro, info)
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="text-center py-5">
          <p className="text-danger fw-semibold mb-2">Algo deu errado ao renderizar a Dashboard</p>
          <p className="text-secondary-soft small">{String(this.state.erro.message || this.state.erro)}</p>
          <button className="btn btn-outline-primary btn-sm" onClick={() => this.setState({ erro: null })}>Tentar novamente</button>
        </div>
      )
    }
    return this.props.children
  }
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0)
}

function formatarData(data) {
  if (!data) return '-'
  const d = new Date(data)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function nomeMovimentacao(item, tipo) {
  if (item.descricao && item.descricao.trim()) return item.descricao
  if (item.origem && item.origem.trim()) return item.origem
  return tipo === 'RECEITA' ? 'Receita' : 'Despesa'
}

function Loading({ texto }) {
  return (
    <div className="text-center py-4">
      <div className="spinner mx-auto"></div>
      <p className="text-secondary-soft mt-2 small">{texto}</p>
    </div>
  )
}

function CardsResumo({ receitas, despesas }) {
  const totalReceitas = receitas.reduce((s, r) => s + (Number(r.valor) || 0), 0)
  const totalDespesas = despesas.reduce((s, d) => s + (Number(d.valor) || 0), 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-lg-4">
        <div className="value-card balance">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="card-title">Saldo Total</div>
              <div className="card-value" style={{ color: saldo >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
                {formatarMoeda(saldo)}
              </div>
            </div>
            <div className="card-icon" style={{ background: 'rgba(26,115,232,.15)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 1v20M5 5h6a3 3 0 010 6H5M5 11h7a3 3 0 010 6H5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-lg-4">
        <div className="value-card revenue">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="card-title">Total Receitas</div>
              <div className="card-value">{formatarMoeda(totalReceitas)}</div>
            </div>
            <div className="card-icon" style={{ background: 'rgba(30,142,62,.15)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 18V4M5 10l6-6 6 6" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-lg-4">
        <div className="value-card expense">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="card-title">Total Despesas</div>
              <div className="card-value">{formatarMoeda(totalDespesas)}</div>
            </div>
            <div className="card-icon" style={{ background: 'rgba(217,48,37,.15)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v14M5 14l6 6 6-6" stroke="#D93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabelaMovimentacoes({ receitas, despesas }) {
  const todas = [
    ...receitas.map(r => ({ ...r, tipo: 'RECEITA', nome: nomeMovimentacao(r, 'RECEITA') })),
    ...despesas.map(d => ({ ...d, tipo: 'DESPESA', nome: nomeMovimentacao(d, 'DESPESA') }))
  ].sort((a, b) => new Date(b.data_lancamento || 0) - new Date(a.data_lancamento || 0)).slice(0, 8)

  if (todas.length === 0) {
    return <p className="text-secondary-soft small text-center mb-0">Nenhuma movimentacao encontrada</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Descricao</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {todas.map((item, i) => {
            const isReceita = item.tipo === 'RECEITA'
            return (
              <tr key={i}>
                <td className="fw-medium">{item.nome}</td>
                <td className={isReceita ? 'value-positive' : 'value-negative'}>
                  {isReceita ? '+' : '-'} {formatarMoeda(item.valor)}
                </td>
                <td>
                  <span className={`badge ${isReceita ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: 11 }}>
                    {isReceita ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="text-secondary-soft">{formatarData(item.data_lancamento)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ResumoTipo({ receitas, despesas }) {
  const totalReceitas = receitas.reduce((s, r) => s + (Number(r.valor) || 0), 0)
  const totalDespesas = despesas.reduce((s, d) => s + (Number(d.valor) || 0), 0)
  const total = totalReceitas + totalDespesas
  const percReceitas = total > 0 ? (totalReceitas / total) * 100 : 0
  const percDespesas = total > 0 ? (totalDespesas / total) * 100 : 0

  return (
    <div>
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span className="small fw-medium text-success">Receitas</span>
          <span className="small text-secondary-soft">{percReceitas.toFixed(1)}%</span>
        </div>
        <div className="progress" style={{ height: 8, borderRadius: 4 }}>
          <div className="progress-bar bg-success" style={{ width: `${percReceitas}%` }}></div>
        </div>
        <div className="mt-1"><span className="value-positive small">{formatarMoeda(totalReceitas)}</span></div>
      </div>
      <div>
        <div className="d-flex justify-content-between mb-1">
          <span className="small fw-medium text-danger">Despesas</span>
          <span className="small text-secondary-soft">{percDespesas.toFixed(1)}%</span>
        </div>
        <div className="progress" style={{ height: 8, borderRadius: 4 }}>
          <div className="progress-bar bg-danger" style={{ width: `${percDespesas}%` }}></div>
        </div>
        <div className="mt-1"><span className="value-negative small">{formatarMoeda(totalDespesas)}</span></div>
      </div>
    </div>
  )
}

function ResumoCategorias({ categorias, receitas, despesas }) {
  const dadosCategorias = categorias
    .map(cat => {
      const items = [
        ...receitas.filter(r => r.id_categoria === cat.id_categoria),
        ...despesas.filter(d => d.id_categoria === cat.id_categoria)
      ]
      const total = items.reduce((s, item) => s + (Number(item.valor) || 0), 0)
      return { ...cat, total }
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  if (dadosCategorias.length === 0) {
    return <p className="text-secondary-soft small text-center mb-0">Nenhuma movimentacao nas categorias</p>
  }

  const maior = dadosCategorias[0].total

  return (
    <div className="d-flex flex-column gap-3">
      {dadosCategorias.map(cat => {
        const isReceita = cat.tipo === 'RECEITA'
        const cor = cat.cor || (isReceita ? '#34A853' : '#D93025')
        const pct = maior > 0 ? (cat.total / maior) * 100 : 0
        return (
          <div className="d-flex align-items-center gap-3" key={cat.id_categoria}>
            <div className="color-dot" style={{ background: cor }}></div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <span className="small fw-medium">{cat.nome}</span>
                <span className={`small ${isReceita ? 'value-positive' : 'value-negative'}`}>{formatarMoeda(cat.total)}</span>
              </div>
              <div className="progress mt-1" style={{ height: 4, borderRadius: 2 }}>
                <div className="progress-bar" style={{ width: `${pct}%`, background: cor }}></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DashboardConteudo({ usuario }) {
  const { dados, carregando, erro, recarregar } = useFetchDados(async () => {
    const [categorias, todasReceitas, todasDespesas] = await Promise.all([
      dashboardService.buscarCategorias(usuario.id_usuario),
      dashboardService.buscarReceitas(),
      dashboardService.buscarDespesas(),
    ])

    const categoriasArr = (categorias?.dados || []).map(c => c)
    const categoriasDoUsuario = new Set(categoriasArr.map(c => c.id_categoria))

    const receitas = (todasReceitas?.dados || []).filter(r => categoriasDoUsuario.has(r.id_categoria))
    const despesas = (todasDespesas?.dados || []).filter(d => categoriasDoUsuario.has(d.id_categoria))

    return { categorias: categoriasArr, receitas, despesas }
  }, [usuario.id_usuario])

  const [filtro, setFiltro] = useState({ busca: '', tipo: 'TODOS' })

  const handleAtualizar = () => {
    recarregar()
    mostrarToast('sucesso', 'Dashboard atualizado!')
  }

  const handleFiltrar = (novoFiltro) => {
    setFiltro(novoFiltro)
  }

  const receitasFiltradas = (dados?.receitas || []).filter(r => {
    const buscaMatch = !filtro.busca || (r.descricao || '').toLowerCase().includes(filtro.busca.toLowerCase()) || (r.origem || '').toLowerCase().includes(filtro.busca.toLowerCase())
    const tipoMatch = filtro.tipo === 'TODOS' || filtro.tipo === 'RECEITA'
    return buscaMatch && tipoMatch
  })

  const despesasFiltradas = (dados?.despesas || []).filter(d => {
    const buscaMatch = !filtro.busca || (d.descricao || '').toLowerCase().includes(filtro.busca.toLowerCase()) || (d.origem || '').toLowerCase().includes(filtro.busca.toLowerCase())
    const tipoMatch = filtro.tipo === 'TODOS' || filtro.tipo === 'DESPESA'
    return buscaMatch && tipoMatch
  })

  const totalReceitas = (dados?.receitas || []).reduce((s, r) => s + (Number(r.valor) || 0), 0)
  const totalDespesas = (dados?.despesas || []).reduce((s, d) => s + (Number(d.valor) || 0), 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" style={{ gap: 12 }}>
        <div>
          <h1 className="h3 mb-1">Dashboard</h1>
          <p className="text-secondary-soft mb-0">Resumo financeiro em tempo real, {(usuario.nome || 'Usuario').split(' ')[0]}.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#fff', marginRight: 6, animation: 'dashPulse 1.5s infinite' }}></span>
            Tempo Real
          </span>
          <button className="btn btn-outline-primary btn-sm" onClick={handleAtualizar} style={{ whiteSpace: 'nowrap' }}>Atualizar</button>
        </div>
      </div>

      {carregando && !dados ? (
        <Loading texto="Carregando dashboard..." />
      ) : erro && !dados ? (
        <div className="text-center py-5">
          <p className="text-danger small mb-1">Erro ao carregar dados</p>
          <p className="text-secondary-soft small mb-3">{erro}</p>
          <button className="btn btn-outline-primary btn-sm" onClick={recarregar}>Tentar novamente</button>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <KpiCard
              titulo="Saldo Total"
              valor={saldo}
              cor={saldo >= 0 ? '#1A73E8' : '#D93025'}
              icone={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 1v20M5 5h6a3 3 0 010 6H5M5 11h7a3 3 0 010 6H5" stroke={saldo >= 0 ? '#1A73E8' : '#D93025'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />
            <KpiCard
              titulo="Total Receitas"
              valor={totalReceitas}
              cor="#1E8E3E"
              icone={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 18V4M5 10l6-6 6 6" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />
            <KpiCard
              titulo="Total Despesas"
              valor={totalDespesas}
              cor="#D93025"
              icone={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v14M5 14l6 6 6-6" stroke="#D93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />
          </div>

          <FiltroBusca onFiltrar={handleFiltrar} />

          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-semibold">Movimentacoes Recentes</h5>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navegar('/calculos')}>Ver Categorias</button>
                  </div>
                    <TabelaMovimentacoes receitas={receitasFiltradas} despesas={despesasFiltradas} />
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">Resumo por Tipo</h5>
                  <ResumoTipo receitas={receitasFiltradas} despesas={despesasFiltradas} />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">Categorias com Movimentacoes</h5>
                  <ResumoCategorias categorias={dados.categorias} receitas={receitasFiltradas} despesas={despesasFiltradas} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function navegar(caminho) {
  window.dispatchEvent(new CustomEvent('navegar', { detail: caminho }))
}

export async function DashboardPage() {
  const page = document.createElement('div')
  page.appendChild(Header('/dashboard'))

  const main = document.createElement('main')
  main.className = 'container py-4'

  const root = document.createElement('div')
  main.appendChild(root)
  page.appendChild(main)
  page.appendChild(Footer())

  const usuario = auth.sessaoLocal()
  const reactRoot = createRoot(root)
  reactRoot.render(
    <ErrorBoundary>
      <DashboardConteudo usuario={usuario} />
    </ErrorBoundary>
  )

  const desmontar = () => {
    try {
      reactRoot.unmount()
    } catch (e) {
      console.warn('Dashboard ja desmontada', e)
    }
  }

  window.addEventListener('navegar', desmontar, { once: true })

  return page
}
