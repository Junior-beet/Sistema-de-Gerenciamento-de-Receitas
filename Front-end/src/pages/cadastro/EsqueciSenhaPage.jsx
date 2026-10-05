import { useState } from 'react'
import { Header } from '../../components/layout/Header.jsx'
import { mostrarToast } from '../../components/shared/Toast.jsx'
import { auth } from '../../services/auth.jsx'
import { navegar } from '../../services/navigation.jsx'

export function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const aoEnviar = async e => {
    e.preventDefault()

    if (!email) {
      setAlert({ tipo: 'erro', mensagem: 'Informe seu e-mail.' })
      return
    }

    setCarregando(true)
    await auth.gerarTokenReset(email)
    setCarregando(false)

    setAlert({ tipo: 'sucesso', mensagem: 'Se o e-mail informado existir em nossa base, você receberá um link de redefinição de senha.' })
    mostrarToast('sucesso', 'Se o e-mail existir em nossa base, o link foi enviado.')
    setEnviado(true)
  }

  return (
    <div>
      <Header rotaAtiva="/esqueci-senha" />
      <main className="auth-page">
        <div className="auth-card">
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <h1 className="auth-title">Recuperar Senha</h1>
          <p className="auth-subtitle">Insira seu e-mail para receber o link de redefinição</p>

          {alert && (
            <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
              {alert.mensagem}
            </div>
          )}

          {!enviado && (
            <form noValidate onSubmit={aoEnviar}>
              <div className="mb-4">
                <label htmlFor="resetEmail" className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  id="resetEmail"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={carregando}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={carregando}>
                {carregando ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
          )}

          <div className="auth-divider">ou</div>

          <div className="text-center">
            <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>
              <a href="/login" className="fw-semibold" onClick={e => { e.preventDefault(); navegar('/login') }}>Voltar ao login</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}