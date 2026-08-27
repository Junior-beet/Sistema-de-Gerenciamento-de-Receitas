import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { APP_NAME } from '../config/constants.jsx'
import { auth } from '../services/auth.jsx'

const BENEFITS = [
  { num: '01', title: 'Cadastro simples', desc: 'Crie sua conta em poucos minutos e comece a registrar suas receitas imediatamente.' },
  { num: '02', title: 'Acesso seguro', desc: 'Login protegido com criptografia e sessão segura para a sua conta.' },
  { num: '03', title: 'Relatórios claros', desc: 'Acompanhe seus ganhos com visualizações simples e objetivas.' },
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

  const logado = auth.estaLogado()

  const heroBtns = logado
    ? `<a href="/saiba-mais" class="btn btn-primary btn-lg px-5 cta-link">Saiba Mais</a>`
    : `<a href="/login" class="btn btn-primary btn-lg px-5 cta-link">Entrar</a>
       <a href="/cadastro" class="btn btn-outline-primary btn-lg px-5 cta-link">Criar Conta</a>`

  const ctaSection = logado
    ? ''
    : `
      <section class="pb-5">
        <div class="container pb-4">
          <div class="cta-banner text-center text-lg-start">
            <div class="row align-items-center position-relative">
              <div class="col-12 col-lg-8 mb-4 mb-lg-0">
                <h2 class="mb-2" style="color:#fff;font-size:clamp(24px,3vw,34px)">Pronto para organizar suas receitas?</h2>
                <p class="mb-0" style="color:rgba(255,255,255,0.85);font-size:16px">Crie sua conta gratuitamente e descubra uma forma mais simples de gerir suas finanças.</p>
              </div>
              <div class="col-12 col-lg-4 text-lg-end position-relative">
                <a href="/cadastro" class="btn btn-white btn-lg px-5 cta-link" style="border-radius:999px">Criar Conta</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `

  page.insertAdjacentHTML('beforeend', `
    <main>
      <!-- HERO -->
      <section class="hero-section">
<<<<<<< HEAD
        <div class="container py-4">
          <div class="row align-items-center gy-0 py-0 py-lg-0">
=======
        <div class="container py-5">
          <div class="row align-items-center gy-5 py-3 py-lg-5">
>>>>>>> bde6a628fc4775ed468de38184d9671064a97e01
            <div class="col-12 col-lg-6">
              <span class="hero-badge mb-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#34A853"/><path d="M4 7l2 2 4-4" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Gestão de Receitas Empresariais
              </span>
              <h1 class="hero-title mt-3 mb-3">
                Organize suas receitas<br>
                <span style="background:linear-gradient(120deg,#1A73E8,#34A853);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">de forma simples e segura</span>
              </h1>
              <p class="hero-subtitle mb-4">
                Uma plataforma completa para registrar, acompanhar e analisar as receitas
                da sua empresa — com segurança, clareza e foco no que importa.
              </p>
              <div class="d-flex flex-column flex-sm-row gap-3 mb-4">
                ${heroBtns}
              </div>
              <div class="d-flex align-items-center gap-3">
                <div class="d-flex">
                  <span class="d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px;border-radius:50%;background:#FF6D01;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;margin-left:-6px">L</span>
                  <span class="d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px;border-radius:50%;background:#4285F4;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;margin-left:-6px">A</span>
                  <span class="d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px;border-radius:50%;background:#EA4335;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;margin-left:-6px">J</span>
                  <span class="d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px;border-radius:50%;background:#FBBC04;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;margin-left:-6px">M</span>
                  <span class="d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px;border-radius:50%;background:#34A853;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;margin-left:-6px">N</span>
                  <span class="d-inline-flex align-items-center justify-content-center" style="width:28px;height:28px;border-radius:50%;background:#1A73E8;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;margin-left:-6px">S</span>
                </div>
                <small class="text-secondary-soft">Feito pela equipe TechSolutions · TCC 2026</small>
              </div>
            </div>

            <div class="col-12 col-lg-6">
              <div class="position-relative">
                <img src="/assets/hero-dashboard.svg" alt="Dashboard do SGR" class="hero-img">
                <div class="hero-float-card" style="top:18%;left:-22px">
                  <span class="fc-icon" style="background:var(--color-green-light);color:var(--color-green)">R$</span>
                </div>
                <div class="hero-float-card" style="bottom:14%;right:-18px">
                  <span class="fc-icon" style="background:var(--color-primary-light);color:var(--color-primary)">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12l4-4 3 3 5-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <section class="stats-row">
        <div class="container py-5">
          <div class="row text-center g-4">
            <div class="col-6 col-lg-3">
              <div class="stat-number">100%</div>
              <div class="stat-label">Segurança dos dados</div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-number">3</div>
              <div class="stat-label">Tipos de acesso (cargos)</div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Disponibilidade</div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-number">6</div>
              <div class="stat-label">Membros na equipe</div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="py-5">
        <div class="container py-4">
          <div class="text-center mb-5">
            <h2 class="section-title mb-2">Tudo o que a sua gestão precisa</h2>
            <p class="text-secondary-soft mx-auto mb-0" style="max-width:560px">
              Recursos pensados para acompanhar a saúde financeira do seu negócio com simplicidade e eficiência.
            </p>
          </div>
          <div class="row g-4 justify-content-center">
    
    
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="py-5" style="background:var(--color-surface-muted)">
        <div class="container py-4">
          <div class="row align-items-center gy-5">
            <div class="col-12 col-lg-6">
              <h2 class="section-title mb-3">Comece em 3 passos simples</h2>
              <p class="text-secondary-soft mb-4" style="max-width:480px">
                Do primeiro acesso à análise das suas receitas, todo o caminho foi pensado para ser direto e intuitivo.
              </p>
              ${BENEFITS.map(b => `
                <div class="d-flex gap-3 mb-4">
                  <span class="d-inline-flex align-items-center justify-content-center fw-bold flex-shrink-0" style="width:44px;height:44px;border-radius:12px;background:var(--color-primary-light);color:var(--color-primary);font-family:var(--font-heading)">${b.num}</span>
                  <div>
                    <h3 class="fw-bold mb-1" style="font-size:1.05rem">${b.title}</h3>
                    <p class="small mb-0" style="color:var(--color-text-secondary)">${b.desc}</p>
                  </div>
                </div>`).join('')}
            </div>
            <div class="col-12 col-lg-6">
              <div class="position-relative">
                <img src="/assets/hero-dashboard.svg" alt="Painel de controle do SGR" class="hero-img" style="transform:rotate(-1.5deg)">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LOGOS / TRUST -->
      <section class="py-5">
        <div class="container py-3">
          <p class="text-center text-uppercase mb-4" style="font-size:12px;font-weight:700;letter-spacing:0.08em;color:var(--color-text-muted)">Tecnologias e conceitos aplicados</p>
          <div class="d-flex flex-wrap justify-content-center gap-3">
            <span class="logo-pill"><span class="lp-dot" style="background:#4285F4">R</span> Receitas</span>
            <span class="logo-pill"><span class="lp-dot" style="background:#EA4335">B</span> Banco de Dados</span>
            <span class="logo-pill"><span class="lp-dot" style="background:#FBBC04">A</span> Análise de Requisitos</span>
            <span class="logo-pill"><span class="lp-dot" style="background:#34A853">U</span> UX &amp; UI</span>
            <span class="logo-pill"><span class="lp-dot" style="background:#1A73E8">S</span> Segurança</span>
          </div>
        </div>
      </section>

      <!-- CTA -->
      ${ctaSection}
    </main>
  `)

  page.querySelectorAll('.cta-link').forEach(navegar)

  page.appendChild(Footer())

  return page
}
