import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { auth } from '../services/auth.jsx'
import { navegar } from '../services/navigation.jsx'

const VALORES = [
  { letter: 'C', title: 'Clareza', desc: 'Informações transparentes e fáceis de entender.' },
  { letter: 'S', title: 'Segurança', desc: 'Proteção total dos dados em cada etapa.' },
  { letter: 'I', title: 'Inovação', desc: 'Soluções modernas e tecnológicas.' },
  { letter: 'P', title: 'Parceria', desc: 'Trabalho em equipe e colaboração.' },
]

const TEXTOS = [
  `Somos um grupo de seis estudantes do SENAI unidos pelo objetivo de desenvolver soluções tecnológicas que contribuam para a organização e o controle financeiro das pessoas. Como tema do nosso Trabalho de Conclusão de Curso (TCC), estamos desenvolvendo um sistema de <strong style="color:var(--color-primary)">Gerenciamento de Receitas</strong>, pensado para facilitar o acompanhamento de ganhos, entradas financeiras e o planejamento econômico de forma prática e acessível.`,
  `Nosso projeto busca oferecer uma plataforma intuitiva que permita aos usuários registrar receitas, visualizar relatórios, acompanhar sua evolução financeira e tomar decisões mais conscientes sobre seus recursos. Além disso, aplicamos conceitos de desenvolvimento de software, banco de dados, análise de requisitos e experiência do usuário para criar uma solução eficiente e segura.`,
  `Este projeto representa a aplicação prática dos conhecimentos adquiridos ao longo do curso, unindo tecnologia, trabalho em equipe e inovação para desenvolver uma solução de gerenciamento de receitas. Conheça nossas funcionalidades, objetivos e os resultados alcançados durante essa jornada.`,
]

export function SaibaMaisPage() {
  return (
    <div>
      <Header rotaAtiva="/saiba-mais" />
      <main>
        <section className="hero-section">
          <div className="container py-5">
            <div className="row align-items-center gy-5 py-2 py-lg-4">
              <div className="col-12 col-lg-6">
                <span className="hero-badge mb-3">Sobre o projeto</span>
                <h1 className="hero-title mt-3 mb-3">Nossa História</h1>
                <p className="hero-subtitle mb-0">
                  Conheça quem está por trás do <strong style={{ color: 'var(--color-primary)' }}>SGR</strong> e a
                  jornada que nos levou a construir um sistema de gerenciamento de receitas
                  para o nosso Trabalho de Conclusão de Curso.
                </p>
              </div>
              <div className="col-12 col-lg-6">
                <img src="/assets/hero-dashboard.svg" alt="Dashboard do SGR" className="hero-img" />
              </div>
            </div>
          </div>
        </section>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <div className="card">
                <div className="card-body p-4 p-md-5">
                  <div style={{ color: 'var(--color-text)', lineHeight: 1.9 }}>
                    {TEXTOS.map((t, i) => (
                      <p key={i} className="mb-4" dangerouslySetInnerHTML={{ __html: t }} />
                    ))}

                    <h2 className="fw-bold mt-5 mb-3" style={{ color: 'var(--color-text-title)' }}>Nossos Valores</h2>
                    <hr className="divider" />

                    <div className="row g-4 my-3">
                      {VALORES.map(v => (
                        <div className="col-6 col-lg-3" key={v.letter}>
                          <div className="feature-card text-center p-3">
                            <span className="feature-icon d-inline-flex align-items-center justify-content-center fw-bold mb-2" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '1.1rem' }}>{v.letter}</span>
                            <h5 className="fw-bold mb-2" style={{ color: 'var(--color-text)', fontSize: '1rem' }}>{v.title}</h5>
                            <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{v.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!auth.estaLogado() && (
                      <div className="text-center mt-5">
                        <a href="/cadastro" className="btn btn-primary btn-lg px-5" style={{ borderRadius: 999 }} onClick={e => { e.preventDefault(); navegar('/cadastro') }}>Fazer Parte</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}