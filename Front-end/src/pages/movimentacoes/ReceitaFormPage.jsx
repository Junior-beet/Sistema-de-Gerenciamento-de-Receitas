import { Header } from '../../components/layout/Header.jsx'
import { Footer } from '../../components/layout/Footer.jsx'
import { LancamentoForm } from '../../components/shared/LancamentoForm.jsx'

export function ReceitaFormPage() {
  return (
    <div>
      <Header rotaAtiva="/calculos" />
      <main className="auth-page">
        <div className="auth-card" style={{ maxWidth: 640 }}>
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <LancamentoForm tipo="RECEITA" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
