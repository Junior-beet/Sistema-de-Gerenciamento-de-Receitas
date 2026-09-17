import { useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { mostrarToast } from '../components/shared/Toast.jsx'
import { auth } from '../services/auth.jsx'
import { navegar } from '../services/navigation.jsx'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [alert, setAlert] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const aoEnviar = async e => {
    e.preventDefault()

    if (!email || !senha) {
      setAlert({ tipo: 'erro', mensagem: 'Preencha e-mail e senha.' })
      return
    }

    setCarregando(true)
    const result = await auth.login(email, senha)
    setCarregando(false)

    if (result.erro) {
      setAlert({ tipo: 'erro', mensagem: result.erro })
      mostrarToast('erro', result.erro)
    } else {
      setAlert({ tipo: 'sucesso', mensagem: `Bem-vindo, ${result.usuario.nome}!` })
      mostrarToast('sucesso', `Login efetuado com sucesso. Bem-vindo, ${result.usuario.nome}!`)
      setTimeout(() => navegar('/calculos'), 1200)
    }
  }

  return (
    <div>
      <Header rotaAtiva="/login" />
      <main className="auth-page">
        <div className="auth-card">
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <h1 className="auth-title">Acessar Sistema</h1>
          <p className="auth-subtitle">Insira suas credenciais para continuar</p>

          {alert && (
            <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
              {alert.mensagem}
            </div>
          )}

          <form noValidate onSubmit={aoEnviar}>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="loginEmail"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="loginSenha" className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                id="loginSenha"
                placeholder="Sua senha"
                required
                minLength="8"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <div className="text-center">
            <p className="small mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Ainda não tem conta? <a href="/cadastro" className="fw-semibold" onClick={e => { e.preventDefault(); navegar('/cadastro') }}>Cadastre-se</a>
            </p>
            <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>
              <a href="/esqueci-senha" className="fw-semibold" onClick={e => { e.preventDefault(); navegar('/esqueci-senha') }}>Esqueci minha senha</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}