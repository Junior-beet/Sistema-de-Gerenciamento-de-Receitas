import React, { useState } from 'react'

export function FiltroBusca({ onFiltrar, categorias = [], mostrarBusca = true }) {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('TODOS')
  const [categoria, setCategoria] = useState('TODAS')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const periodoInvalido = !!dataInicio && !!dataFim && dataInicio > dataFim

  const emitir = valores => onFiltrar({ busca, tipo, categoria, dataInicio, dataFim, ...valores })

  const handleBusca = (e) => {
    const valor = e.target.value
    setBusca(valor)
    emitir({ busca: valor })
  }

  const handleTipo = (e) => {
    const valor = e.target.value
    setTipo(valor)
    emitir({ tipo: valor })
  }

  // Ao escolher só a data inicial, filtra aquele dia; para ver "a partir de", limpe a data final
  const handleDataInicio = (e) => {
    const valor = e.target.value
    // acompanha a data final enquanto ela for igual à inicial (filtro de um único dia)
    const acompanhar = !dataFim || dataFim === dataInicio
    const novoFim = acompanhar ? valor : dataFim
    setDataInicio(valor)
    setDataFim(novoFim)
    emitir({ dataInicio: valor, dataFim: novoFim })
  }

  const limpar = () => {
    setBusca('')
    setTipo('TODOS')
    setCategoria('TODAS')
    setDataInicio('')
    setDataFim('')
    onFiltrar({ busca: '', tipo: 'TODOS', categoria: 'TODAS', dataInicio: '', dataFim: '' })
  }

  return (
    <div className="card mb-4 filtros-movimentacoes">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          {mostrarBusca && <div className="col-12 col-lg-4">
            <label className="form-label small fw-medium">Buscar movimentacao</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite a descricao..."
              value={busca}
              onChange={handleBusca}
            />
          </div>}
          <div className="col-12 col-sm-6 col-lg-2">
            <label className="form-label small fw-medium">Filtrar por tipo</label>
            <select
              className="form-select"
              value={tipo}
              onChange={handleTipo}
            >
              <option value="TODOS">Todos</option>
              <option value="RECEITA">Receitas</option>
              <option value="DESPESA">Despesas</option>
            </select>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <label className="form-label small fw-medium">Categoria</label>
            <select className="form-select" value={categoria} onChange={e => { setCategoria(e.target.value); emitir({ categoria: e.target.value }) }}>
              <option value="TODAS">Todas</option>
              {categorias.map(item => <option key={item.id_categoria} value={item.id_categoria}>{item.nome}</option>)}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <label className="form-label small fw-medium">Data inicial</label>
            <input type="date" className={`form-control ${periodoInvalido ? 'is-invalid' : ''}`} value={dataInicio} max={dataFim || undefined} onChange={handleDataInicio} />
          </div>
          <div className="col-6 col-lg-2">
            <label className="form-label small fw-medium">Data final</label>
            <input type="date" className={`form-control ${periodoInvalido ? 'is-invalid' : ''}`} value={dataFim} min={dataInicio || undefined} onChange={e => { setDataFim(e.target.value); emitir({ dataFim: e.target.value }) }} />
          </div>
          {periodoInvalido && (
            <div className="col-12 text-danger small">A data inicial não pode ser maior que a data final.</div>
          )}
          <div className="col-12 d-flex justify-content-end">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={limpar}>Limpar filtros</button>
          </div>
        </div>
      </div>
    </div>
  )
}
