import { Header } from '../components/layout/Header.js'
import { APP_NAME } from '../config/constants.js'

export function SaibaMaisPage() {
  const page = document.createElement('div')

  const header = Header('/saiba-mais')
  page.appendChild(header)

  const main = document.createElement('main')
  main.style.cssText = 'min-height:calc(100vh - 76px);background:var(--color-bg)'

  const container = document.createElement('div')
  container.className = 'container py-5'

  const row = document.createElement('div')
  row.className = 'row justify-content-center'

  const col = document.createElement('div')
  col.className = 'col-12 col-lg-8'

  const card = document.createElement('div')
  card.className = 'card shadow-sm'

  const cardBody = document.createElement('div')
  cardBody.className = 'card-body p-4 p-md-5'

  const iconDiv = document.createElement('div')
  iconDiv.className = 'text-center mb-3'
  const iconCircle = document.createElement('span')
  iconCircle.className = 'd-inline-flex align-items-center justify-content-center'
  iconCircle.style.cssText = 'width:52px;height:52px;border-radius:50%;background:var(--color-primary-light);color:var(--color-primary);font-size:1.4rem;font-weight:700'
  iconCircle.textContent = 'S'
  iconDiv.appendChild(iconCircle)

  const title = document.createElement('h1')
  title.className = 'text-center fw-bold mb-1'
  title.style.color = 'var(--color-text-title)'
  title.textContent = 'Nossa Hist\u00f3ria'

  const divider = document.createElement('hr')
  divider.className = 'divider divider-center'

  const subtitle = document.createElement('p')
  subtitle.className = 'text-center mb-5'
  subtitle.style.color = 'var(--color-text-secondary)'
  subtitle.textContent = 'Como transformamos desafios em oportunidades'

  const story = document.createElement('div')
  story.style.cssText = 'color:var(--color-text);line-height:1.9'

  const textos = [
    {
      type: 'p',
      content: `Tudo começou em uma pequena sala comercial, com seis profissionais que compartilhavam a mesma inquieta\u00e7\u00e3o: <strong style="color:var(--color-primary)">por que gerenciar as finan\u00e7as de uma empresa ainda era t\u00e3o arcaico e fragmentado?</strong> Relat\u00f3rios espalhados em planilhas, informa\u00e7\u00f5es defasadas, decis\u00f5es tomadas no escuro.`
    },
    {
      type: 'p',
      content: `Foi dessa insatisfa\u00e7\u00e3o que nasceu o <strong style="color:var(--color-primary)">${APP_NAME}</strong>. N\u00e3o como uma empresa de tecnologia qualquer, mas como uma resposta direta \u00e0 pergunta que ecoava nas salas de reuni\u00e3o: <em>"Onde est\u00e1 o dinheiro da empresa e para onde ele est\u00e1 indo?"</em>`
    },
    { type: 'h2', content: 'O Primeiro Passo' },
    {
      type: 'p',
      content: `Em 2026, depois de meses de desenvolvimento silencioso, a primeira vers\u00e3o da plataforma foi implantada em uma rede de pequenos restaurantes. Os resultados vieram r\u00e1pido: redu\u00e7\u00e3o de <strong style="color:var(--color-primary)">37% no tempo gasto com fechamento financeiro</strong> e um aumento de 22% na precis\u00e3o das proje\u00e7\u00f5es de receita. O boca a boca fez o resto.`
    },
    {
      type: 'p',
      content: `O que come\u00e7ou como uma ferramenta modesta rapidamente se tornou o sistema central de dezenas de empresas. A cada nova funcionalidade, a confian\u00e7a crescia. E com ela, a responsabilidade.`
    },
    { type: 'h2', content: 'Nossos Valores' },
  ]

  textos.forEach(t => {
    if (t.type === 'h2') {
      const h2 = document.createElement('h2')
      h2.className = 'fw-bold mt-5 mb-3'
      h2.style.color = 'var(--color-text-title)'
      h2.textContent = t.content

      const hDivider = document.createElement('hr')
      hDivider.className = 'divider'

      const wrapper = document.createElement('div')
      wrapper.appendChild(h2)
      wrapper.appendChild(hDivider)
      story.appendChild(wrapper)
    } else {
      const p = document.createElement('p')
      p.className = 'mb-3'
      p.innerHTML = t.content
      story.appendChild(p)
    }
  })

  const valuesGrid = document.createElement('div')
  valuesGrid.className = 'row g-3 my-4'

  const valores = [
    { letter: 'C', title: 'Clareza', desc: 'Transformamos dados complexos em decis\u00f5es claras e acion\u00e1veis.' },
    { letter: 'S', title: 'Seguran\u00e7a', desc: 'A informa\u00e7\u00e3o financeira da sua empresa protegida em cada camada.' },
    { letter: 'I', title: 'Inova\u00e7\u00e3o', desc: 'Evolu\u00edmos constantemente para antecipar as necessidades do mercado.' },
    { letter: 'P', title: 'Parceria', desc: 'N\u00e3o somos apenas um software \u2014 somos um time ao lado do seu.' },
  ]

  valores.forEach(v => {
    const div = document.createElement('div')
    div.className = 'col-6 col-lg-3'

    div.innerHTML = `
      <div class="card h-100 text-center p-3">
        <div class="card-body">
          <div class="d-inline-flex align-items-center justify-content-center fw-bold mb-3" style="width:40px;height:40px;border-radius:50%;background:var(--color-primary-light);color:var(--color-primary);font-size:1.1rem">${v.letter}</div>
          <h5 class="fw-semibold mb-2" style="color:var(--color-text);font-size:0.9rem">${v.title}</h5>
          <p class="small mb-0" style="color:var(--color-text-secondary)">${v.desc}</p>
        </div>
      </div>
    `
    valuesGrid.appendChild(div)
  })

  story.appendChild(valuesGrid)

  const continuacao = [
    { type: 'h2', content: 'Onde Estamos Hoje' },
    {
      type: 'p',
      content: `Atualmente, o ${APP_NAME} est\u00e1 presente em <strong style="color:var(--color-primary)">mais de 200 empresas</strong> em todo o Brasil, processando mais de R$ 2,5 bilh\u00f5es em receita anualmente. Nossa equipe cresceu e hoje conta com profissionais dedicados a transformar a gest\u00e3o financeira em uma vantagem competitiva real para nossos clientes.`
    },
    {
      type: 'p',
      content: `Mais do que uma plataforma, somos um ecossistema de intelig\u00eancia financeira. Do CEO ao analista, cada usu\u00e1rio encontra no ${APP_NAME} as ferramentas para enxergar o futuro com clareza e agir com confian\u00e7a.`
    },
    { type: 'h2', content: 'O Pr\u00f3ximo Cap\u00edtulo' },
    {
      type: 'p',
      content: `Estamos apenas no come\u00e7o. A cada dia, novas funcionalidades nascem da escuta atenta aos nossos clientes. Acreditamos que a gest\u00e3o de receitas n\u00e3o \u00e9 apenas sobre n\u00fameros \u2014 \u00e9 sobre <strong style="color:var(--color-primary)">potencial humano, estrat\u00e9gia e crescimento sustent\u00e1vel</strong>.`
    },
  ]

  continuacao.forEach(t => {
    if (t.type === 'h2') {
      const h2 = document.createElement('h2')
      h2.className = 'fw-bold mt-5 mb-3'
      h2.style.color = 'var(--color-text-title)'
      h2.textContent = t.content

      const hDivider = document.createElement('hr')
      hDivider.className = 'divider'

      const wrapper = document.createElement('div')
      wrapper.appendChild(h2)
      wrapper.appendChild(hDivider)
      story.appendChild(wrapper)
    } else {
      const p = document.createElement('p')
      p.className = 'mb-3'
      p.innerHTML = t.content
      story.appendChild(p)
    }
  })

  const quoteWrapper = document.createElement('div')
  quoteWrapper.className = 'text-center mt-5 pt-4'
  quoteWrapper.style.borderTop = '1px solid var(--color-border)'

  const quoteDash = document.createElement('hr')
  quoteDash.className = 'divider-center'
  quoteDash.style.cssText = 'width:60px;height:3px;background:var(--color-primary);border-radius:2px;border:0;margin:0 auto 1.5rem'

  const quote = document.createElement('p')
  quote.style.cssText = 'color:var(--color-primary);font-style:italic;font-size:1.1rem;max-width:500px;margin:0 auto'
  quote.textContent = 'O melhor momento para come\u00e7ar foi ontem. O segundo melhor \u00e9 agora.'

  quoteWrapper.appendChild(quoteDash)
  quoteWrapper.appendChild(quote)
  story.appendChild(quoteWrapper)

  const ctaDiv = document.createElement('div')
  ctaDiv.className = 'text-center mt-4'

  const ctaBtn = document.createElement('a')
  ctaBtn.href = '/cadastro'
  ctaBtn.className = 'btn btn-primary btn-lg px-5'

  ctaBtn.textContent = 'Fazer Parte'

  ctaBtn.addEventListener('click', e => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/cadastro' }))
  })

  ctaDiv.appendChild(ctaBtn)
  story.appendChild(ctaDiv)

  cardBody.appendChild(iconDiv)
  cardBody.appendChild(title)
  cardBody.appendChild(divider)
  cardBody.appendChild(subtitle)
  cardBody.appendChild(story)
  card.appendChild(cardBody)
  col.appendChild(card)
  row.appendChild(col)
  container.appendChild(row)
  main.appendChild(container)
  page.appendChild(main)

  return page
}
