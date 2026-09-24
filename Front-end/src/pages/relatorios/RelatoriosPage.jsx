import { useEffect, useMemo, useState } from 'react'
import ExcelJS from 'exceljs'

import { Header } from '../../components/layout/Header.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { api } from '../../services/api.jsx'
import { FiltroBusca } from '../../components/shared/FiltroBusca.jsx'
import { mostrarToast } from '../../components/shared/Toast.jsx'

const moeda = valor =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor) || 0)

const dataFormatada = data =>
  data
    ? new Date(`${String(data).slice(0, 10)}T12:00:00`).toLocaleDateString(
        'pt-BR'
      )
    : '-'

function GraficoComparativo({ receitas, despesas }) {
  const maior = Math.max(receitas, despesas, 1)

  const itens = [
    {
      rotulo: 'Entradas',
      valor: receitas,
      classe: 'grafico-entrada',
    },
    {
      rotulo: 'Saidas',
      valor: despesas,
      classe: 'grafico-saida',
    },
  ]

  return (
    <div className="card relatorio-grafico mb-4">
      <div className="card-body">
        <h2 className="h5 mb-4">
          Comparativo de movimentacoes
        </h2>

        <div className="d-flex flex-column gap-3">
          {itens.map(item => (
            <div
              className="grafico-linha"
              key={item.rotulo}
            >
              <div className="d-flex justify-content-between small fw-medium mb-1">
                <span>{item.rotulo}</span>
                <span>{moeda(item.valor)}</span>
              </div>

              <div className="grafico-trilho">
                <div
                  className={`grafico-barra ${item.classe}`}
                  style={{
                    width: `${(item.valor / maior) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RelatoriosPage() {
  const [dados, setDados] = useState({
    categorias: [],
    lancamentos: [],
  })

  const [carregando, setCarregando] = useState(true)

  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'TODOS',
    categoria: 'TODAS',
    dataInicio: '',
    dataFim: '',
  })

  useEffect(() => {
    async function carregar() {
      try {
        const [categoriasResp, receitasResp, despesasResp,] = await Promise.all([
          api.get('/categorias'),
          api.get('/receitas'),
          api.get('/despesas'),
        ])

        const categorias = categoriasResp.dados || []

        const nomes = new Map(
          categorias.map(c => [
            String(c.id_categoria),
            c.nome,
          ])
        )

        const normalizar = ( lista, tipo, chave) =>
          (lista.dados || []).map(item => ({
            ...item,
            tipo,
            id: item[chave],
            categoriaNome: nomes.get(String(item.id_categoria)
              ) || 'Sem categoria',
          }))

        setDados({
          categorias,
          lancamentos: [
            ...normalizar(receitasResp,'RECEITA','id_receita'
            ),
            ...normalizar(despesasResp,'DESPESA','id_despesa'
            ),
          ].sort((a, b) =>
            String(b.data_lancamento).localeCompare(String(a.data_lancamento))
          ),
        })
      } catch (erro) {
        mostrarToast('erro', erro.message || 'Erro ao carregar relatórios')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  const lancamentos = useMemo(
    () =>
      dados.lancamentos.filter(item => {
        const data = String(
          item.data_lancamento || ''
        ).slice(0, 10)

        const texto = `${item.descricao || ''} ${
          item.origem || ''
        } ${item.categoriaNome}`.toLowerCase()

        return (
          (filtros.tipo === 'TODOS' ||
            item.tipo === filtros.tipo) &&
          (filtros.categoria === 'TODAS' ||
            String(item.id_categoria) ===
              String(filtros.categoria)) &&
          (!filtros.dataInicio ||
            data >= filtros.dataInicio) &&
          (!filtros.dataFim ||
            data <= filtros.dataFim) &&
          (!filtros.busca ||
            texto.includes( filtros.busca.toLowerCase()
            ))
        )
      }),
    [dados.lancamentos, filtros]
  )

  const totais = useMemo(
    () =>
      lancamentos.reduce(
        (acc, item) => {
          acc[
            item.tipo === 'RECEITA' ? 'receitas': 'despesas'] += Number(item.valor) || 0
          return acc
        },
        {
          receitas: 0,
          despesas: 0,
        }),[lancamentos]
  )

  const exportarPlanilha = async () => {
    const planilha = new ExcelJS.Workbook()
    const aba = planilha.addWorksheet('Relatorio financeiro', { views: [{ state: 'frozen', ySplit: 4 }] })

    aba.columns = [
      { key: 'tipo', width: 14 }, { key: 'descricao', width: 36 }, { key: 'categoria', width: 24 },
      { key: 'valor', width: 16 }, { key: 'data', width: 14 }, { key: 'pagamento', width: 24 },
    ]
    aba.mergeCells('A1:F1')
    const titulo = aba.getCell('A1')
    titulo.value = 'Relatorio financeiro'
    titulo.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } }
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1976D2' } }
    titulo.alignment = { horizontal: 'center', vertical: 'middle' }
    aba.getRow(1).height = 28
    aba.mergeCells('A2:F2')
    aba.getCell('A2').value = `Entradas: ${moeda(totais.receitas)} | Saidas: ${moeda(totais.despesas)} | Saldo: ${moeda(totais.receitas - totais.despesas)}`
    aba.getCell('A2').font = { bold: true, color: { argb: 'FF1F2937' } }
    aba.getCell('A2').alignment = { horizontal: 'center' }

    const cabecalho = aba.getRow(4)
    cabecalho.values = ['Tipo', 'Descricao', 'Categoria', 'Valor', 'Data', 'Forma de pagamento']
    cabecalho.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cabecalho.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1565C0' } }
    cabecalho.height = 22

    lancamentos.forEach((item, indice) => {
      const linha = aba.addRow({
        tipo: item.tipo === 'RECEITA' ? 'Entrada' : 'Saida', descricao: item.descricao || item.origem || '-',
        categoria: item.categoriaNome, valor: Number(item.valor) || 0,
        data: item.data_lancamento ? new Date(`${String(item.data_lancamento).slice(0, 10)}T12:00:00`) : null,
        pagamento: item.forma_pagamento || '-',
      })
      linha.getCell('valor').numFmt = 'R$ #,##0.00'
      linha.getCell('data').numFmt = 'dd/mm/yyyy'
      linha.getCell('tipo').font = { bold: true, color: { argb: item.tipo === 'RECEITA' ? 'FF1E8E3E' : 'FFD93025' } }
      if (indice % 2 === 0) linha.eachCell(celula => { celula.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F7FC' } } })
    })

    aba.autoFilter = { from: 'A4', to: `F${Math.max(4, lancamentos.length + 4)}` }
    aba.eachRow({ includeEmpty: false }, linha => linha.eachCell(celula => {
      celula.border = { bottom: { style: 'thin', color: { argb: 'FFD9E2EC' } } }
      celula.alignment = { vertical: 'middle' }
    }))
    const conteudo = await planilha.xlsx.writeBuffer()
    const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'relatorio-financeiro.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Header rotaAtiva="/relatorios" />
      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 relatorio-cabecalho" style={{ gap: 12 }}>
          <div>
            <h1 className="h3 mb-1">Relatorios</h1>
            <p className="text-secondary-soft mb-0">Analise e exporte as movimentacoes do periodo.</p>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-primary" onClick={() => window.print()}>Exportar PDF</button>

            <button type="button" className="btn btn-primary" onClick={exportarPlanilha}> Exportar Excel </button>
          </div>
        </div>

        <FiltroBusca categorias={dados.categorias} onFiltrar={setFiltros}/>

        {carregando ? (
          <div className="text-center py-5">
            <div className="spinner mx-auto" />
            <p className="text-secondary-soft mt-3"> Gerando relatório...</p>
          </div>
        ) : (
          <section id="relatorio-impressao">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="value-card revenue">
                  <div className="card-title">Entradas</div>
                  <div className="card-value">
                    {moeda(totais.receitas)}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="value-card expense">
                  <div className="card-title">Saidas</div>
                  <div className="card-value">
                    {moeda(totais.despesas)}
                  </div>
                </div>
              </div>
            </div>

            <GraficoComparativo receitas={totais.receitas} despesas={totais.despesas}/>
            <div className="card relatorio-detalhes">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 mb-0">Movimentacoes ({lancamentos.length})</h2>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Descricao</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th className="text-end">Valor</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lancamentos.length ? (lancamentos.map(item => (
                            <tr key={`${item.tipo}-${item.id}`}><td>
                                {dataFormatada(item.data_lancamento)}
                              </td>

                              <td>{item.descricao || item.origem ||'-'}</td>
                              <td>{item.categoriaNome}</td>

                              <td>
                                <span className={`badge ${item.tipo === 'RECEITA' ? 'bg-success' : 'bg-danger'}`}>
                                  {item.tipo === 'RECEITA' ? 'Receita' : 'Despesa'} </span>
                              </td>

                              <td className={`text-end ${ item.tipo === 'RECEITA' ? 'value-positive' : 'value-negative'}`}>
                                {item.tipo === 'RECEITA' ? '+' : '-'}{' '} {moeda(item.valor)}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-secondary-soft py-4">Nenhuma movimentacao encontrada para estes filtros.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
