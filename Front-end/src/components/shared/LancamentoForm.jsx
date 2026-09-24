import { useEffect, useState } from 'react'
import { auth } from '../../services/auth.jsx'
import { api } from '../../services/api.jsx'
import { mostrarToast } from './Toast.jsx'
import { navegar } from '../../services/navigation.jsx'

const FORMAS_PAGAMENTO = [
  'PIX',
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Boleto',
  'Transferência Bancária',
]

function dataDeHoje() {
  const agora = new Date()
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
  return local.toISOString().split('T')[0]
}

export function LancamentoForm({ tipo }) {
  const isReceita = tipo === 'RECEITA'
  const label = isReceita ? 'Receita' : 'Despesa'
  const usuario = auth.sessaoLocal()

  const [contas, setContas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])

  const [idConta, setIdConta] = useState('')
  const [idCategoria, setIdCategoria] = useState('')
  const [idSubcategoria, setIdSubcategoria] = useState('')
  const [valor, setValor] = useState('')
  const [dataLancamento, setDataLancamento] = useState(dataDeHoje())
  const [formaPagamento, setFormaPagamento] = useState('')
  const [descricao, setDescricao] = useState('')
  const [origem, setOrigem] = useState('')
  const [dataPrevista, setDataPrevista] = useState('')
  const [dataVencimento, setDataVencimento] = useState('')
  const [parcelado, setParcelado] = useState(false)
  const [totalParcelas, setTotalParcelas] = useState('2')

  const [carregando, setCarregando] = useState(true)
  const [carregandoSubcategorias, setCarregandoSubcategorias] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!usuario) {
      navegar('/login')
      return
    }
    carregarOpcoes()
  }, [])

  async function carregarOpcoes() {
    try {
      const [contasResp, categoriasResp] = await Promise.all([
        api.get('/contas'),
        api.get('/categorias'),
      ])
      const listaContas = contasResp.dados || []
      setContas(listaContas)
      if (listaContas.length > 0) {
        setIdConta(listaContas[0].id_conta)
      }
      setCategorias((categoriasResp.dados || []).filter(c => c.tipo === tipo))
    } catch (err) {
      setAlert({ tipo: 'erro', mensagem: 'Erro ao carregar opções: ' + err.message })
    } finally {
      setCarregando(false)
    }
  }

  async function aoMudarCategoria(e) {
    const selecionada = e.target.value
    setIdCategoria(selecionada)
    setIdSubcategoria('')
    setSubcategorias([])

    if (!selecionada) return

    setCarregandoSubcategorias(true)
    try {
      const data = await api.get(`/subcategorias/categoria/${selecionada}`)
      setSubcategorias(data.dados || [])
    } catch {
      setSubcategorias([])
    } finally {
      setCarregandoSubcategorias(false)
    }
  }

  async function aoEnviar(e) {
    e.preventDefault()

    const valorNumerico = Number(String(valor).replace(',', '.'))

    if (!idConta || !idCategoria || !valorNumerico || valorNumerico <= 0 || !dataLancamento) {
      setAlert({ tipo: 'erro', mensagem: 'Preencha os campos obrigatórios: categoria, valor e data de lançamento' })
      return
    }

    const parcelas = Number(totalParcelas)
    if (!isReceita && parcelado && (!parcelas || parcelas < 2)) {
      setAlert({ tipo: 'erro', mensagem: 'Informe um total de parcelas maior que 1' })
      return
    }

    setSalvando(true)
    setAlert(null)

    const payload = {
      id_conta: idConta,
      id_categoria: idCategoria,
      id_subcategoria: idSubcategoria || null,
      valor: valorNumerico,
      data_lancamento: dataLancamento,
      descricao: descricao.trim() || null,
      forma_pagamento: formaPagamento || null,
    }

    if (isReceita) {
      payload.origem = origem.trim() || null
      payload.data_prevista = dataPrevista || null
    } else {
      payload.data_vencimento = dataVencimento || null
      payload.parcelado = parcelado
      payload.total_parcelas = parcelado ? parcelas : 1
    }

    try {
      if (isReceita) {
        await api.post('/receitas', payload)
        mostrarToast('sucesso', 'Receita lançada com sucesso!')
      } else {
        await api.post('/despesas', payload)
        mostrarToast('sucesso', 'Despesa lançada com sucesso!')
      }
      setTimeout(() => navegar('/calculos'), 800)
    } catch (err) {
      setAlert({ tipo: 'erro', mensagem: err.message || 'Erro ao salvar' })
      mostrarToast('erro', err.message || 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  const semContas = !carregando && contas.length === 0
  const semCategorias = !carregando && categorias.length === 0

  return (
    <>
      <h1 className="auth-title">Nova {label}</h1>
      <p className="auth-subtitle">Registre {isReceita ? 'uma entrada' : 'uma saída'} no seu fluxo financeiro</p>

      {alert && (
        <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
          {alert.mensagem}
        </div>
      )}

      {(semContas || semCategorias) && (
        <div className="alert alert-warning">
          {semContas && <div>Nenhuma conta cadastrada.</div>}
          {semCategorias && (
            <div>
              Nenhuma categoria de {label.toLowerCase()} cadastrada.{' '}
              <a
                href={`/calculos/nova?tipo=${tipo}`}
                onClick={e => { e.preventDefault(); navegar(`/calculos/nova?tipo=${tipo}`) }}
              >
                Criar categoria
              </a>
            </div>
          )}
        </div>
      )}

      <form noValidate onSubmit={aoEnviar}>
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoria <span className="text-danger">*</span></label>
          <select
            className="form-select"
            id="categoria"
            required
            value={idCategoria}
            onChange={aoMudarCategoria}
            disabled={carregando || categorias.length === 0}
          >
            <option value="" disabled>
              {carregando ? 'Carregando categorias...' : categorias.length === 0 ? 'Nenhuma categoria cadastrada' : 'Selecione a categoria'}
            </option>
            {categorias.map(c => (
              <option value={c.id_categoria} key={c.id_categoria}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="subcategoria" className="form-label">Subcategoria (opcional)</label>
          <select
            className="form-select"
            id="subcategoria"
            value={idSubcategoria}
            onChange={e => setIdSubcategoria(e.target.value)}
            disabled={carregandoSubcategorias || subcategorias.length === 0}
          >
            <option value="">
              {carregandoSubcategorias ? 'Carregando...' : subcategorias.length === 0 ? 'Sem subcategoria' : 'Sem subcategoria (opcional)'}
            </option>
            {subcategorias.map(s => (
              <option value={s.id_subcategoria} key={s.id_subcategoria}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label htmlFor="valor" className="form-label">Valor (R$) <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              id="valor"
              placeholder="0,00"
              min="0.01"
              step="0.01"
              required
              value={valor}
              onChange={e => setValor(e.target.value)}
              disabled={carregando}
            />
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label htmlFor="data_lancamento" className="form-label">Data de lançamento <span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              id="data_lancamento"
              required
              value={dataLancamento}
              onChange={e => setDataLancamento(e.target.value)}
              disabled={carregando}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="forma_pagamento" className="form-label">Forma de pagamento</label>
          <select
            className="form-select"
            id="forma_pagamento"
            value={formaPagamento}
            onChange={e => setFormaPagamento(e.target.value)}
            disabled={carregando}
          >
            <option value="">Selecione (opcional)</option>
            {FORMAS_PAGAMENTO.map(f => (
              <option value={f} key={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">Descrição</label>
          <input
            type="text"
            className="form-control"
            id="descricao"
            placeholder={isReceita ? 'Ex: Salário, Freelance...' : 'Ex: Aluguel, Supermercado...'}
            maxLength="255"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            disabled={carregando}
          />
        </div>

        {isReceita ? (
          <div className="row">
            <div className="col-12 col-sm-6 mb-3">
              <label htmlFor="origem" className="form-label">Origem (opcional)</label>
              <input
                type="text"
                className="form-control"
                id="origem"
                placeholder="Ex: Empresa X"
                maxLength="100"
                value={origem}
                onChange={e => setOrigem(e.target.value)}
                disabled={carregando}
              />
            </div>
            <div className="col-12 col-sm-6 mb-3">
              <label htmlFor="data_prevista" className="form-label">Data prevista (opcional)</label>
              <input
                type="date"
                className="form-control"
                id="data_prevista"
                value={dataPrevista}
                onChange={e => setDataPrevista(e.target.value)}
                disabled={carregando}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="data_vencimento" className="form-label">Vencimento (opcional)</label>
              <input
                type="date"
                className="form-control"
                id="data_vencimento"
                value={dataVencimento}
                onChange={e => setDataVencimento(e.target.value)}
                disabled={carregando}
              />
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="parcelado"
                  checked={parcelado}
                  onChange={e => setParcelado(e.target.checked)}
                  disabled={carregando}
                />
                <label className="form-check-label" htmlFor="parcelado">Despesa parcelada</label>
              </div>
            </div>

            {parcelado && (
              <div className="mb-3">
                <label htmlFor="total_parcelas" className="form-label">Total de parcelas <span className="text-danger">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  id="total_parcelas"
                  min="2"
                  step="1"
                  required
                  value={totalParcelas}
                  onChange={e => setTotalParcelas(e.target.value)}
                  disabled={carregando}
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className={`btn btn-lg w-100 ${isReceita ? 'btn-success' : 'btn-danger'}`}
          disabled={carregando || salvando || semContas || semCategorias}
        >
          {salvando ? 'Salvando...' : `Lançar ${label}`}
        </button>
      </form>

      <div className="auth-divider">ou</div>

      <a
        href="/calculos"
        className={`btn btn-lg w-100 ${isReceita ? 'btn-outline-success' : 'btn-outline-danger'}`}
        onClick={e => { e.preventDefault(); navegar('/calculos') }}
      >
        Cancelar e voltar
      </a>
    </>
  )
}
