import React from 'react'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0)
}

export function KpiCard({ titulo, valor, cor, icone }) {
  const corFundo = cor || '#1A73E8'
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="value-card">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="card-title">{titulo}</div>
            <div className="card-value" style={{ color: corFundo }}>
              {formatarMoeda(valor)}
            </div>
          </div>
          <div className="card-icon" style={{ background: `${corFundo}22` }}>
            {icone || (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 1v20M5 5h6a3 3 0 010 6H5M5 11h7a3 3 0 010 6H5" stroke={corFundo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
