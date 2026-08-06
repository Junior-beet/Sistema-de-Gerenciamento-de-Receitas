import { Header } from '../components/layout/Header.jsx'
import { APP_NAME } from '../config/constants.jsx'

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


  const story = document.createElement('div')
  story.style.cssText = 'color:var(--color-text);line-height:1.9'

  const textos = [
    {
      type: 'p',
      content: `Somos um grupo de seis estudantes do SENAI unidos pelo objetivo de desenvolver soluções tecnológicas que contribuam para a organização e o controle financeiro das pessoas. Como tema do nosso Trabalho de Conclusão de Curso (TCC), estamos desenvolvendo um sistema de: <strong style="color:var(--color-primary)">Gerenciamento de Receitas</strong>, pensado para facilitar o acompanhamento de ganhos, entradas financeiras e o planejamento econômico de forma prática e acessível.`
    },
    {
      type: 'p',
      content: `Nosso projeto busca oferecer uma plataforma intuitiva que permita aos usuários registrar receitas, visualizar relatórios, acompanhar sua evolução financeira e tomar decisões mais conscientes sobre seus recursos. Além disso, aplicamos conceitos de desenvolvimento de software, banco de dados, análise de requisitos e experiência do usuário para criar uma solução eficiente e segura.`
    },
    {
    type: 'p',
      content: `Este projeto representa a aplicação prática dos conhecimentos adquiridos ao longo do curso, unindo tecnologia, trabalho em equipe e inovação para desenvolver uma solução de gerenciamento de receitas. Conheça nossas funcionalidades, objetivos e os resultados alcançados durante essa jornada.`
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
  valuesGrid.className = 'row g-1 my-4'

  const valores = [
    { letter: 'C', title: 'Clareza', desc: []},
    { letter: 'S', title: 'Segurança', desc: []},
    { letter: 'I', title: 'Inovação', desc: []},
    { letter: 'P', title: 'Parceria', desc: []},
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


  const quoteWrapper = document.createElement('div')
  quoteWrapper.className = 'text-center mt-5 pt-4'
  quoteWrapper.style.borderTop = '1px solid var(--color-border)'

  const quoteDash = document.createElement('hr')
  quoteDash.className = 'divider-center'
  quoteDash.style.cssText = 'width:60px;height:3px;background:var(--color-primary);border-radius:2px;border:0;margin:0 auto 1.5rem'


  quoteWrapper.appendChild(quoteDash)
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
  cardBody.appendChild(story)
  card.appendChild(cardBody)
  col.appendChild(card)
  row.appendChild(col)
  container.appendChild(row)
  main.appendChild(container)
  page.appendChild(main)

  // Footer
  const footer = document.createElement('footer')
  footer.className = 'footer-section'

  footer.innerHTML = `
    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-4">
          <div class="footer-brand">
            <span class="footer-logo">S</span>
            <span class="footer-brand-name">${APP_NAME}</span>
          </div>
          <p class="footer-about">
            Sistema de Gerenciamento de Receitas desenvolvido por alunos do SENAI para
            auxiliar no controle financeiro e na organização de ganhos de forma prática e segura.
          </p>
        </div>

        <div class="col-6 col-lg-2 offset-lg-1">
          <h6>Navegação</h6>
          <ul class="footer-links mb-0">
            <li><a href="/home">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/cadastro">Cadastro</a></li>
            <li><a href="/saiba-mais">Saiba Mais</a></li>
          </ul>
        </div>

        <div class="col-6 col-lg-2">
          <h6>Equipe</h6>
          <ul class="footer-links mb-0">
            <li>Luiz Felipe</li>
            <li>Akila Maria</li>
            <li>Jasiel Junior</li>
            <li>Miguel Vallim</li>
            <li>Nicolas Bryan</li>
            <li>Samuel Rabelo</li>
          </ul>
        </div>

        <div class="col-lg-3">
          <h6>Contato</h6>
          <ul class="footer-contact mb-0">
            <li><span class="contact-label">E-mail</span> contato@sgr.com.br</li>
            <li><span class="contact-label">Instituição</span> SENAI</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 ${APP_NAME}. Todos os direitos reservados.</span>
        <span>Desenvolvido por equipe SENAI</span>
      </div>
    </div>
  `

  footer.querySelectorAll('a[href^="/"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: anchor.getAttribute('href') }))
    })
  })

  page.appendChild(footer)

  return page
}
