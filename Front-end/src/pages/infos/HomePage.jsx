import { Header } from '../../components/layout/Header.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { auth } from '../../services/auth.jsx'
import { navegar } from '../../services/navigation.jsx'

const BENEFITS = [
  { num: '01', title: 'Cadastro simples', desc: 'Crie sua conta em poucos minutos e comece a registrar suas receitas imediatamente.' },
  { num: '02', title: 'Acesso seguro', desc: 'Login protegido com criptografia e sessão segura para a sua conta.' },
  { num: '03', title: 'Relatórios claros', desc: 'Acompanhe seus ganhos com visualizações simples e objetivas.' },
]

const FEATURES = [
  { letra: '$', titulo: 'Receitas e Despesas', desc: 'Crie categorias de receita e despesa em poucos cliques para organizar ganhos e gastos.', bg: 'var(--color-success-light)', fg: 'var(--color-success)' },
  { letra: 'R', titulo: 'Subcategorias', desc: 'Detalhe cada categoria com subcategorias para um controle ainda mais preciso.', bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
  { letra: 'S', titulo: 'Acesso seguro', desc: 'Login protegido com criptografia e sessão segura para a sua conta.', bg: 'var(--color-danger-light)', fg: 'var(--color-danger)' },
]

function CtaLink({ href, children, className, style }) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={e => {
        e.preventDefault()
        navegar(href)
      }}
    >
      {children}
    </a>
  )
}

export function HomePage() {
  const logado = auth.estaLogado()

  return (
    <div>
      <Header rotaAtiva="/" />
      <main>
        <section className="hero-section">
          <div className="container py-4">
            <div className="row align-items-center gy-0 py-0 py-lg-0">
              <div className="col-12 col-lg-6">
                <span className="hero-badge mb-3">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#34A853" /><path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Gestão de Receitas Empresariais
                </span>
                <h1 className="hero-title mt-3 mb-3">
                  Organize suas receitas<br />
                  <span style={{ background: 'linear-gradient(120deg,#1A73E8,#34A853)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>de forma simples e segura</span>
                </h1>
                <p className="hero-subtitle mb-4">
                  Uma plataforma completa para registrar, acompanhar e analisar as receitas
                  da sua empresa — com segurança, clareza e foco no que importa.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                  {logado ? (
                    <CtaLink href="/saiba-mais" className="btn btn-primary btn-lg px-5 cta-link">Saiba Mais</CtaLink>
                  ) : (
                    <>
                      <CtaLink href="/login" className="btn btn-primary btn-lg px-5 cta-link">Entrar</CtaLink>
                      <CtaLink href="/cadastro" className="btn btn-outline-primary btn-lg px-5 cta-link">Criar Conta</CtaLink>
                    </>
                  )}
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex">
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF6D01', color: '#fff', fontSize: 11, fontWeight: 700, border: '2px solid #fff', marginLeft: -6 }}>L</span>
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', background: '#4285F4', color: '#fff', fontSize: 11, fontWeight: 700, border: '2px solid #fff', marginLeft: -6 }}>A</span>
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', background: '#EA4335', color: '#fff', fontSize: 11, fontWeight: 700, border: '2px solid #fff', marginLeft: -6 }}>J</span>
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', background: '#FBBC04', color: '#fff', fontSize: 11, fontWeight: 700, border: '2px solid #fff', marginLeft: -6 }}>M</span>
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', background: '#34A853', color: '#fff', fontSize: 11, fontWeight: 700, border: '2px solid #fff', marginLeft: -6 }}>N</span>
                    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A73E8', color: '#fff', fontSize: 11, fontWeight: 700, border: '2px solid #fff', marginLeft: -6 }}>S</span>
                  </div>
                  <small className="text-secondary-soft">Feito pela equipe TechSolutions</small>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="position-relative">
                  <img src="/assets/hero-dashboard.svg" alt="Dashboard do SGR" className="hero-img" />
                  <div className="hero-float-card" style={{ top: '18%', left: '-22px' }}>
                    <span className="fc-icon" style={{ background: 'var(--color-green-light)', color: 'var(--color-green)' }}>R$</span>
                  </div>
                  <div className="hero-float-card" style={{ bottom: '14%', right: '-18px' }}>
                    <span className="fc-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-row">
          <div className="container py-5">
            <div className="row text-center g-4">
              <div className="col-6 col-lg-3"><div className="stat-number">100%</div><div className="stat-label">Segurança dos dados</div></div>
              <div className="col-6 col-lg-3"><div className="stat-number">3</div><div className="stat-label">Tipos de acesso (cargos)</div></div>
              <div className="col-6 col-lg-3"><div className="stat-number">24/7</div><div className="stat-label">Disponibilidade</div></div>
              <div className="col-6 col-lg-3"><div className="stat-number">6</div><div className="stat-label">Membros na equipe</div></div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="section-title mb-2">Tudo o que a sua gestão precisa</h2>
              <p className="text-secondary-soft mx-auto mb-0" style={{ maxWidth: 560 }}>
                Recursos pensados para acompanhar a saúde financeira do seu negócio com simplicidade e eficiência.
              </p>
            </div>
            <div className="row g-4 justify-content-center">
              {FEATURES.map(f => (
                <div className="col-12 col-md-6 col-lg-4" key={f.titulo}>
                  <div className="feature-card">
                    <span className="feature-icon" style={{ background: f.bg, color: f.fg }}>{f.letra}</span>
                    <h3 className="h5 fw-bold mb-2">{f.titulo}</h3>
                    <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5" style={{ background: 'var(--color-surface-muted)' }}>
          <div className="container py-4">
            <div className="row align-items-center gy-5">
              <div className="col-12 col-lg-6">
                <h2 className="section-title mb-3">Comece em 3 passos simples</h2>
                <p className="text-secondary-soft mb-4" style={{ maxWidth: 480 }}>
                  Do primeiro acesso à análise das suas receitas, todo o caminho foi pensado para ser direto e intuitivo.
                </p>
                {BENEFITS.map(b => (
                  <div className="d-flex gap-3 mb-4" key={b.num}>
                    <span className="d-inline-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>{b.num}</span>
                    <div>
                      <h3 className="fw-bold mb-1" style={{ fontSize: '1.05rem' }}>{b.title}</h3>
                      <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-12 col-lg-6">
                <div className="position-relative">
                  <img src="/assets/hero-dashboard.svg" alt="Painel de controle do SGR" className="hero-img" style={{ transform: 'rotate(-1.5deg)' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container py-3">
            <p className="text-center text-uppercase mb-4" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>Tecnologias e conceitos aplicados</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <span className="logo-pill"><span className="lp-dot" style={{ background: '#4285F4' }}>R</span> Receitas</span>
              <span className="logo-pill"><span className="lp-dot" style={{ background: '#EA4335' }}>B</span> Banco de Dados</span>
              <span className="logo-pill"><span className="lp-dot" style={{ background: '#FBBC04' }}>A</span> Análise de Requisitos</span>
              <span className="logo-pill"><span className="lp-dot" style={{ background: '#34A853' }}>U</span> UX &amp; UI</span>
              <span className="logo-pill"><span className="lp-dot" style={{ background: '#1A73E8' }}>S</span> Segurança</span>
            </div>
          </div>
        </section>

        {!logado && (
          <section className="pb-5">
            <div className="container pb-4">
              <div className="cta-banner text-center text-lg-start">
                <div className="row align-items-center position-relative">
                  <div className="col-12 col-lg-8 mb-4 mb-lg-0">
                    <h2 className="mb-2" style={{ color: '#fff', fontSize: 'clamp(24px,3vw,34px)' }}>Pronto para organizar suas receitas?</h2>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Crie sua conta gratuitamente e descubra uma forma mais simples de gerir suas finanças.</p>
                  </div>
                  <div className="col-12 col-lg-4 text-lg-end position-relative">
                    <CtaLink href="/cadastro" className="btn btn-white btn-lg px-5 cta-link" style={{ borderRadius: 999 }}>Criar Conta</CtaLink>
                  </div>
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
