import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { navegar } from '../services/navigation.jsx'

function extrairCategoriaIdDaRota() {
  const match = location.pathname.match(/\/calculos\/([^/]+)\/subcategorias/)
  return match ? match[1] : null
}

export function SubcategoriasPage() {
  const categoriaId = extrairCategoriaIdDaRota()
  const usuario = auth.sessaoLocal()

  const [categoria, setCategoria] = useState(null)
  const [subcategorias, setSubcategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCategoria, setErroCategoria] = useState(null)
  const [erroLista, setErroLista] = useState(null)

  useEffect(() => {
    if (!categoriaId) {
      navegar('/calculos')
      return
    }
    if (!usuario) {
      navegar('/login')
      return
    }
    carregarDados()
  }, [])

  async function carregarDados() {
    setCarregando(true)
    try {
      const data = await api.get(`/categorias/${categoriaId}`)
      setCategoria(data.dados)
      setErroCategoria(null)
    } catch (err) {
      setErroCategoria(err.message)
    }

    try {
      const data = await api.get(`/subcategorias/categoria/${categoriaId}`)
      setSubcategorias((data.dados || []).filter(s => s.ativo === 1))
      setErroLista(null)
    } catch (err) {
      setErroLista(err.message)
      mostrarToast('erro', 'Erro ao carregar subcategorias')
    } finally {
      setCarregando(false)
    }
  }

  async function excluir(sub) {
    if (!window.confirm(`Tem certeza que deseja excluir a subcategoria "${sub.nome}"?`)) return

    try {
      await api.delete(`/subcategorias/${sub.id_subcategoria}`)
      mostrarToast('sucesso', 'Subcategoria excluída com sucesso')
      setSubcategorias(prev => prev.filter(s => s.id_subcategoria !== sub.id_subcategoria))
    } catch (err) {
      mostrarToast('erro', err.message || 'Erro ao excluir subcategoria')
    }
  }

  const isReceita = categoria?.tipo === 'RECEITA'

  return (
    <div>
      <Header rotaAtiva="/calculos" />
      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-secondary-soft mb-1">
              <a href="/calculos" className="text-decoration-none" onClick={e => { e.preventDefault(); navegar('/calculos') }}>&larr; Calculos</a>
            </p>
            <h1 className="h3 mb-1">
              {categoria ? (
                <>
                  <span className="me-2">{categoria.nome}</span>
                  <span className={`badge ${isReceita ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: 12 }}>{isReceita ? 'Receita' : 'Despesa'}</span>
                </>
              ) : (
                erroCategoria ? 'Calculo nao encontrado' : 'Subcategorias'
              )}
            </h1>
            <p className="text-secondary-soft mb-0">
              {categoria ? `Gerencie as subcategorias de "${categoria.nome}"` : erroCategoria || 'Carregando...'}
            </p>
          </div>
          {categoria && (
            <button type="button" className="btn btn-primary" onClick={() => navegar(`/subcategorias/nova?categoria=${categoriaId}`)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: 6 }}><path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Nova Subcategoria
            </button>
          )}
        </div>

        {carregando ? (
          <div className="text-center py-5">
            <div className="spinner mx-auto"></div>
            <p className="text-secondary-soft mt-3">Carregando subcategorias...</p>
          </div>
        ) : erroLista ? (
          <div className="text-center py-5">
            <p className="text-danger mb-2">Erro ao carregar subcategorias</p>
            <p className="text-secondary-soft small">{erroLista}</p>
          </div>
        ) : subcategorias.length === 0 ? (
          <div className="text-center py-5">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>
              <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 22h20M14 30h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-secondary-soft mb-3">Nenhuma subcategoria cadastrada</p>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => navegar(`/subcategorias/nova?categoria=${categoriaId}`)}>Adicionar primeira subcategoria</button>
          </div>
        ) : (
          <div className="row g-3">
            {subcategorias.map(sub => (
              <div className="col-12 col-sm-6 col-lg-4" key={sub.id_subcategoria}>
                <div className="card subcategoria-card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-0 fw-semibold">{sub.nome}</h6>
                    </div>
                    <div className="d-flex gap-1">
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => navegar(`/subcategorias/editar/${sub.id_subcategoria}`)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11l3-3 4 4-3 3H2v-4zM12 2l2 2-4 4-2-2 4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => excluir(sub)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4v8M10 4v8M7 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}