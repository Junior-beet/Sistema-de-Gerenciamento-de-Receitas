import { useEffect, useState } from 'react'
import { Header } from '../../components/layout/Header.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { auth } from '../../services/auth.jsx'
import { api } from '../../services/api.jsx'
import { mostrarToast } from '../../components/shared/Toast.jsx'
import { navegar } from '../../services/navigation.jsx'

function extrairIdDaRota() {
  const match = location.pathname.match(/\/subcategorias\/editar\/([^/]+)/)
  return match ? match[1] : null
}

export function SubcategoriaFormPage() {
  const params = new URLSearchParams(location.search)
  const categoriaId = params.get('categoria') || null
  const idRota = extrairIdDaRota()
  const isEdit = !!idRota

  const usuario = auth.sessaoLocal()

  const [categorias, setCategorias] = useState([])
  const [idCategoria, setIdCategoria] = useState(categoriaId || '')
  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!usuario) {
      navegar('/login')
      return
    }
    iniciar()
  }, [])

  async function iniciar() {
    try {
      const data = await api.get('/categorias')
      const lista = data.dados || []
      setCategorias(lista)

      if (isEdit) {
        const sub = await api.get(`/subcategorias/${idRota}`)
        setIdCategoria(sub.dados.id_categoria)
        setNome(sub.dados.nome || '')
      }
    } catch (err) {
      setAlert({ tipo: 'erro', mensagem: 'Erro ao carregar: ' + err.message })
    } finally {
      setCarregando(false)
    }
  }

  const aoEnviar = async e => {
    e.preventDefault()

    if (!idCategoria || !nome.trim()) {
      setAlert({ tipo: 'erro', mensagem: 'Preencha todos os campos obrigatórios' })
      return
    }

    setSalvando(true)
    setAlert(null)

    const payload = {
      id_categoria: idCategoria,
      nome: nome.trim(),
    }

    try {
      if (isEdit) {
        await api.put(`/subcategorias/${idRota}`, payload)
        mostrarToast('sucesso', 'Subcategoria atualizada com sucesso!')
      } else {
        await api.post('/subcategorias', payload)
        mostrarToast('sucesso', 'Subcategoria cadastrada com sucesso!')
      }

      const voltarPara = idCategoria ? `/calculos/${idCategoria}/subcategorias` : '/calculos'
      setTimeout(() => navegar(voltarPara), 800)
    } catch (err) {
      setAlert({ tipo: 'erro', mensagem: err.message || 'Erro ao salvar subcategoria' })
      mostrarToast('erro', err.message || 'Erro ao salvar subcategoria')
    } finally {
      setSalvando(false)
    }
  }

  const voltarHref = categoriaId ? `/calculos/${categoriaId}/subcategorias` : '/calculos'

  return (
    <div>
      <Header rotaAtiva="/calculos" />
      <main className="auth-page">
        <div className="auth-card" style={{ maxWidth: 520 }}>
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <h1 className="auth-title">{isEdit ? 'Editar Subcategoria' : 'Nova Subcategoria'}</h1>
          <p className="auth-subtitle">Preencha os dados da subcategoria</p>

          {alert && (
            <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
              {alert.mensagem}
            </div>
          )}

          <form noValidate onSubmit={aoEnviar}>
            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Calculo Pai <span className="text-danger">*</span></label>
              <select
                className="form-select"
                id="categoria"
                required
                value={idCategoria}
                onChange={e => setIdCategoria(e.target.value)}
                disabled={carregando || categorias.length === 0}
              >
                <option value="" disabled>
                  {categorias.length === 0 ? 'Nenhum calculo cadastrado' : 'Selecione o calculo'}
                </option>
                {categorias.map(c => (
                  <option value={c.id_categoria} key={c.id_categoria}>
                    {c.nome} ({c.tipo === 'RECEITA' ? 'Receita' : 'Despesa'})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="nome" className="form-label">Nome <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="nome"
                placeholder="Ex: Supermercado, Restaurante, Transporte..."
                required
                maxLength="100"
                value={nome}
                onChange={e => setNome(e.target.value)}
                disabled={carregando}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={carregando || salvando || categorias.length === 0}>
              {carregando ? 'Carregando...' : salvando ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Subcategoria'}
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <div className="text-center">
            <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>
              <a href={voltarHref} className="fw-semibold" onClick={e => { e.preventDefault(); navegar(voltarHref) }}>&larr; Voltar</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}