import React, { useState } from 'react'

export function FiltroBusca({ onFiltrar }) {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('TODOS')

  const handleBusca = (e) => {
    const valor = e.target.value
    setBusca(valor)
    onFiltrar({ busca: valor, tipo })
  }

  const handleTipo = (e) => {
    const valor = e.target.value
    setTipo(valor)
    onFiltrar({ busca, tipo: valor })
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-8">
            <label className="form-label small fw-medium">Buscar movimentacao</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite a descricao..."
              value={busca}
              onChange={handleBusca}
            />
          </div>
          <div className="col-12 col-md-4">
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
        </div>
      </div>
    </div>
  )
}
