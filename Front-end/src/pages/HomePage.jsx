import { Header } from '../components/layout/Header.jsx'
import { APP_NAME } from '../config/constants.jsx'

const FEATURES = [
  { icon: 'R', title: 'Receitas', desc: 'Registre e acompanhe todas as entradas da sua empresa em um só lugar.' },
  { icon: 'S', title: 'Segurança', desc: 'Seus dados protegidos com autenticação e criptografia em cada etapa.' },
  { icon: 'D', title: 'Decisões', desc: 'Informações claras para apoiar decisões financeiras com confiança.' },
]

function navegar(el) {
  el.addEventListener('click', e => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('navegar', { detail: el.getAttribute('href') }))
  })
}

export function HomePage() {
  const page = document.createElement('div')
  page.appendChild(Header('/'))

  page.insertAdjacentHTML('beforeend', `
    <main style="min-height:calc(100vh - 76px);background:var(--color-bg)">
      <section class="text-center py-5" style="background:linear-gradient(135deg,var(--color-primary-light),var(--color-surface))">
        <div class="container py-4">
          <span class="brand-logo d-inline-flex align-items-center justify-content-center mb-4" style="width:64px;height:64px;font-size:1.6rem;border-radius:16px">S</span>
          <h1 class="fw-bold mb-3">${APP_NAME} — Gestão de Receitas</h1>
          <p class="mx-auto mb-5" style="color:var(--color-text-secondary);max-width:560px;font-size:1.1rem">Organize, acompanhe e decida com clareza. Uma plataforma simples e segura para gerenciar as receitas da sua empresa.</p>
          <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <a href="/login" class="btn btn-primary btn-lg px-5 cta-link">Entrar</a>
            <a href="/cadastro" class="btn btn-outline-primary btn-lg px-5 cta-link">Criar Conta</a>
          </div>
        </div>
      </section>
      <section class="container py-5">
        <h2 class="text-center fw-bold mb-4">Tudo o que a sua gestão precisa</h2>
        <p class="text-center mb-5" style="color:var(--color-text-secondary)">Recursos pensados para acompanhar a saúde financeira do seu negócio</p>
        <div class="row g-4 justify-content-center">
          ${FEATURES.map(f => `
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 text-center p-3">
                <div class="card-body">
                  <span class="d-inline-flex align-items-center justify-content-center fw-bold mb-3" style="width:48px;height:48px;border-radius:50%;background:var(--color-primary-light);color:var(--color-primary);font-size:1.2rem">${f.icon}</span>
                  <h3 class="fw-semibold mb-2" style="color:var(--color-text-title);font-size:1.05rem">${f.title}</h3>
                  <p class="small mb-0" style="color:var(--color-text-secondary)">${f.desc}</p>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </section>
      <section class="text-center py-5">
        <div class="container">
          <p class="mb-3" style="color:var(--color-text-secondary);font-size:1.1rem">Pronto para começar?</p>
          <a href="/cadastro" class="btn btn-primary btn-lg px-5 cta-link">Criar Conta</a>
        </div>
      </section>
    </main>
  `)

  page.querySelectorAll('.cta-link').forEach(navegar)

  return page
}
