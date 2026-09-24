import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { api } from '../services/api.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { navegar } from '../services/navigation.jsx'

const COR_PADRAO = { RECEITA: '#34A853', DESPESA: '#D93025' }

function extrairIdDaRota() {
  const match = location.pathname.match(/\/calculos\/editar\/([^/]+)/)
  return match ? match[1] : null
}

export function CategoriaFormPage() {
  const params = new URLSearchParams(location.search)
  const tipoParam = params.get('tipo')
  const tipoInicial = tipoParam || 'RECEITA'
  const idRota = extrairIdDaRota()
  const isEdit = !!idRota
  const generico = !isEdit && !tipoParam

  const usuario = auth.sessaoLocal()

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState(tipoInicial)
  const [cor, setCor] = useState(COR_PADRAO[tipoInicial] || COR_PADRAO.RECEITA)
  const [corManual, setCorManual] = useState(false)
  const [carregando, setCarregando] = useState(isEdit)
  const [salvando, setSalvando] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!usuario) {
      navegar('/login')
      return
    }
    if (isEdit) {
      carregarCategoria()
    }
  }, [])

  async function carregarCategoria() {
    try {
      const data = await api.get(`/categorias/${idRota}`)
      const cat = data.dados
      const tipoCarregado = cat.tipo || tipoInicial
      setNome(cat.nome || '')
      setTipo(tipoCarregado)
      setCor(cat.cor || COR_PADRAO[tipoCarregado] || COR_PADRAO.RECEITA)
      setCorManual(!!(cat.cor && cat.cor !== COR_PADRAO[tipoCarregado]))
    } catch (err) {
      setAlert({ tipo: 'erro', mensagem: 'Erro ao carregar: ' + err.message })
    } finally {
      setCarregando(false)
    }
  }

  const isReceita = tipo === 'RECEITA'
  const labelAtual = isReceita ? 'Receita' : 'Despesa'
  const entidade = generico ? 'Categoria' : labelAtual
  const entidadeMin = generico ? 'categoria' : labelAtual.toLowerCase()
  const titulo = isEdit ? `Editar ${labelAtual}` : generico ? 'Nova Categoria' : `Nova ${labelAtual}`
  const classeBotao = generico ? 'btn-primary' : isReceita ? 'btn-success' : 'btn-danger'
  const classeBotaoContorno = generico ? 'btn-outline-primary' : isReceita ? 'btn-outline-success' : 'btn-outline-danger'

  const aoMudarTipo = valor => {
    setTipo(valor)
    if (!corManual) {
      setCor(COR_PADRAO[valor] || COR_PADRAO.RECEITA)
    }
  }

  const aoMudarCor = valor => {
    setCor(valor)
    setCorManual(true)
  }

  const aoEnviar = async e => {
    e.preventDefault()

    if (!nome.trim()) {
      setAlert({ tipo: 'erro', mensagem: `Preencha o nome da ${entidadeMin}` })
      return
    }

    setSalvando(true)
    setAlert(null)

    const payload = {
      id_usuario: usuario.id_usuario,
      nome: nome.trim(),
      tipo,
      cor,
    }

    try {
      if (isEdit) {
        await api.put(`/categorias/${idRota}`, payload)
        mostrarToast('sucesso', `${entidade} atualizada com sucesso!`)
      } else {
        await api.post('/categorias', payload)
        mostrarToast('sucesso', `${entidade} cadastrada com sucesso!`)
      }

      setTimeout(() => navegar('/calculos'), 800)
    } catch (err) {
      setAlert({ tipo: 'erro', mensagem: err.message || 'Erro ao salvar' })
      mostrarToast('erro', err.message || 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <Header rotaAtiva="/calculos" />
      <main className="auth-page">
        <div className="auth-card" style={{ maxWidth: 520 }}>
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <h1 className="auth-title">{titulo}</h1>
          <p className="auth-subtitle">Preencha os dados da {entidadeMin}</p>

          {alert && (
            <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
              {alert.mensagem}
            </div>
          )}

          <form noValidate onSubmit={aoEnviar}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="nome"
                placeholder="Ex: Salario, Aluguel, Supermercado..."
                required
                maxLength="100"
                value={nome}
                onChange={e => setNome(e.target.value)}
                disabled={carregando}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">Tipo <span className="text-danger">*</span></label>
              <select
                className="form-select"
                id="tipo"
                required
                value={tipo}
                onChange={e => aoMudarTipo(e.target.value)}
                disabled={carregando}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="cor" className="form-label">Cor (opcional)</label>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="color"
                  className="form-control form-control-color"
                  id="cor"
                  title="Selecione uma cor"
                  value={cor}
                  onChange={e => aoMudarCor(e.target.value)}
                  disabled={carregando}
                />
                <span className="small text-secondary-soft">Cor para identificação visual</span>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-lg w-100 ${classeBotao}`}
              disabled={carregando || salvando}
            >
              {carregando ? 'Carregando...' : salvando ? 'Salvando...' : isEdit ? 'Salvar Alterações' : `Cadastrar ${entidade}`}
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <a
            href="/calculos"
            className={`btn btn-lg w-100 ${classeBotaoContorno}`}
            onClick={e => { e.preventDefault(); navegar('/calculos') }}
          >
            Cancelar e voltar
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}