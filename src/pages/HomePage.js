import { Header } from '../components/layout/Header.js'
import { APP_NAME } from '../config/constants.js'

export function HomePage() {
  const page = document.createElement('div')

  const header = Header('/')
  page.appendChild(header)

  const main = document.createElement('main')
  main.style.cssText = 'min-height:calc(100vh - 76px);background:var(--color-bg)'

  const container = document.createElement('div')
  container.className = 'container py-5'

  const row = document.createElement('div')
  row.className = 'row justify-content-center'

  const col = document.createElement('div')
  col.className = 'col-12 col-lg-7'

  const card = document.createElement('div')
  card.className = 'card shadow-sm border-0'

  const cardBody = document.createElement('div')
  cardBody.className = 'card-body p-4 p-md-5 text-center'

  const iconCircle = document.createElement('span')
  iconCircle.className = 'd-inline-flex align-items-center justify-content-center mb-4'
  iconCircle.style.cssText = 'width:72px;height:72px;border-radius:18px;background:var(--color-primary);color:#fff;font-size:1.8rem;font-weight:700;box-shadow:var(--shadow-md)'
  iconCircle.textContent = APP_NAME.charAt(0)

  const title = document.createElement('h1')
  title.className = 'fw-bold mb-2'
  title.style.color = 'var(--color-text-title)'
  title.textContent = `Bem-vindo ao ${APP_NAME}`

  const divider = document.createElement('hr')
  divider.className = 'divider divider-center'

  const subtitle = document.createElement('p')
  subtitle.style.cssText = 'color:var(--color-text-secondary);max-width:520px;margin:0 auto 2rem'
  subtitle.textContent = 'Gerencie suas receitas e despesas com segurança, clareza e praticidade em um único lugar.'

  const actions = document.createElement('div')
  actions.className = 'row g-3 justify-content-center'
  actions.innerHTML = `
    <div class="col-12 col-sm-6">
      <a href="/login" class="card h-100 text-center p-4 text-decoration-none" style="display:block;color:var(--color-text);transition:box-shadow .2s ease">
        <span class="d-inline-flex align-items-center justify-content-center fw-bold mb-3" style="width:52px;height:52px;border-radius:50%;background:var(--color-primary-light);color:var(--color-primary);font-size:1.3rem">Entrar</span>
        <h2 class="fw-bold mb-2" style="font-size:1.2rem;color:var(--color-text-title)">Login</h2>
        <p class="small mb-0" style="color:var(--color-text-secondary)">Já possui uma conta? Acesse o sistema agora.</p>
      </a>
    </div>
    <div class="col-12 col-sm-6">
      <a href="/cadastro" class="card h-100 text-center p-4 text-decoration-none" style="display:block;color:var(--color-text);transition:box-shadow .2s ease">
        <span class="d-inline-flex align-items-center justify-content-center fw-bold mb-3" style="width:52px;height:52px;border-radius:50%;background:var(--color-success-light);color:var(--color-success);font-size:1.3rem">Criar</span>
        <h2 class="fw-bold mb-2" style="font-size:1.2rem;color:var(--color-text-title)">Cadastro</h2>
        <p class="small mb-0" style="color:var(--color-text-secondary)">Ainda não tem conta? Cadastre-se em poucos minutos.</p>
      </a>
    </div>
  `

  const saibaMais = document.createElement('p')
  saibaMais.className = 'small mt-4 mb-0'
  saibaMais.style.color = 'var(--color-text-secondary)'
  saibaMais.innerHTML = 'Quer conhecer nossa história? <a href="/saiba-mais" class="fw-semibold">Saiba mais</a>'

  cardBody.appendChild(iconCircle)
  cardBody.appendChild(title)
  cardBody.appendChild(divider)
  cardBody.appendChild(subtitle)
  cardBody.appendChild(actions)
  cardBody.appendChild(saibaMais)
  card.appendChild(cardBody)
  col.appendChild(card)
  row.appendChild(col)
  container.appendChild(row)
  main.appendChild(container)
  page.appendChild(main)

  cardBody.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('navegar', { detail: a.getAttribute('href') }))
    })
  })

  return page
}
