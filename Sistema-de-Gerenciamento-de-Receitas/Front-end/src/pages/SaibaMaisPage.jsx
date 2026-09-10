import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'

const VALORES = [
  { letter: 'C', title: 'Clareza', desc: 'Informações transparentes e fáceis de entender.' },
  { letter: 'S', title: 'Segurança', desc: 'Proteção total dos dados em cada etapa.' },
  { letter: 'I', title: 'Inovação', desc: 'Soluções modernas e tecnológicas.' },
  { letter: 'P', title: 'Parceria', desc: 'Trabalho em equipe e colaboração.' },
]

export function SaibaMaisPage() {
  const page = document.createElement('div')

  page.appendChild(Header('/saiba-mais'))

  const main = document.createElement('main')

  const hero = document.createElement('section')
  hero.className = 'hero-section'
  hero.innerHTML = `
    <div class="container py-5">
      <div class="row align-items-center gy-5 py-2 py-lg-4">
        <div class="col-12 col-lg-6">
          <span class="hero-badge mb-3">Sobre o projeto</span>
          <h1 class="hero-title mt-3 mb-3">Nossa História</h1>
          <p class="hero-subtitle mb-0">
            Conheça quem está por trás do <strong style="color:var(--color-primary)">SGR</strong> e a
            jornada que nos levou a construir um sistema de gerenciamento de receitas
            para o nosso Trabalho de Conclusão de Curso.
          </p>
        </div>
        <div class="col-12 col-lg-6">
          <img src="/assets/hero-dashboard.svg" alt="Dashboard do SGR" class="hero-img">
        </div>
      </div>
    </div>
  `
  main.appendChild(hero)

  const container = document.createElement('div')
  container.className = 'container py-5'

  const row = document.createElement('div')
  row.className = 'row justify-content-center'

  const col = document.createElement('div')
  col.className = 'col-12 col-lg-9'

  const card = document.createElement('div')
  card.className = 'card'

  const cardBody = document.createElement('div')
  cardBody.className = 'card-body p-4 p-md-5'

  const story = document.createElement('div')
  story.style.cssText = 'color:var(--color-text);line-height:1.9'

  const textos = [
    `Somos um grupo de seis estudantes do SENAI unidos pelo objetivo de desenvolver soluções tecnológicas que contribuam para a organização e o controle financeiro das pessoas. Como tema do nosso Trabalho de Conclusão de Curso (TCC), estamos desenvolvendo um sistema de <strong style="color:var(--color-primary)">Gerenciamento de Receitas</strong>, pensado para facilitar o acompanhamento de ganhos, entradas financeiras e o planejamento econômico de forma prática e acessível.`,
    `Nosso projeto busca oferecer uma plataforma intuitiva que permita aos usuários registrar receitas, visualizar relatórios, acompanhar sua evolução financeira e tomar decisões mais conscientes sobre seus recursos. Além disso, aplicamos conceitos de desenvolvimento de software, banco de dados, análise de requisitos e experiência do usuário para criar uma solução eficiente e segura.`,
    `Este projeto representa a aplicação prática dos conhecimentos adquiridos ao longo do curso, unindo tecnologia, trabalho em equipe e inovação para desenvolver uma solução de gerenciamento de receitas. Conheça nossas funcionalidades, objetivos e os resultados alcançados durante essa jornada.`,
  ]

  textos.forEach(t => {
    const p = document.createElement('p')
    p.className = 'mb-4'
    p.innerHTML = t
    story.appendChild(p)
  })

  const h2 = document.createElement('h2')
  h2.className = 'fw-bold mt-5 mb-3'
  h2.style.color = 'var(--color-text-title)'
  h2.textContent = 'Nossos Valores'

  const hDivider = document.createElement('hr')
  hDivider.className = 'divider'

  const headingWrap = document.createElement('div')
  headingWrap.appendChild(h2)
  headingWrap.appendChild(hDivider)
  story.appendChild(headingWrap)

  const valuesGrid = document.createElement('div')
  valuesGrid.className = 'row g-4 my-3'

  VALORES.forEach(v => {
    const div = document.createElement('div')
    div.className = 'col-6 col-lg-3'

    div.innerHTML = `
      <div class="feature-card text-center p-3">
        <span class="feature-icon d-inline-flex align-items-center justify-content-center fw-bold mb-2" style="width:44px;height:44px;border-radius:12px;background:var(--color-primary-light);color:var(--color-primary);font-size:1.1rem;margin-bottom:8px">${v.letter}</span>
        <h5 class="fw-bold mb-2" style="color:var(--color-text);font-size:1rem">${v.title}</h5>
        <p class="small mb-0" style="color:var(--color-text-secondary)">${v.desc}</p>
      </div>
    `
    valuesGrid.appendChild(div)
  })

  story.appendChild(valuesGrid)

  const ctaDiv = document.createElement('div')
  ctaDiv.className = 'text-center mt-5'

  if (!auth.estaLogado()) {
    const ctaBtn = document.createElement('a')
    ctaBtn.href = '/cadastro'
    ctaBtn.className = 'btn btn-primary btn-lg px-5'
    ctaBtn.style.borderRadius = '999px'
    ctaBtn.textContent = 'Fazer Parte'

    ctaBtn.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: '/cadastro' }))
    })

    ctaDiv.appendChild(ctaBtn)
  }
  story.appendChild(ctaDiv)

  cardBody.appendChild(story)
  card.appendChild(cardBody)
  col.appendChild(card)
  row.appendChild(col)
  container.appendChild(row)
  main.appendChild(container)
  page.appendChild(main)

  page.appendChild(Footer())

  return page
}
