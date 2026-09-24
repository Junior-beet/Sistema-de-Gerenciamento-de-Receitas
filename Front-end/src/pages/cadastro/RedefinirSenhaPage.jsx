import { useState } from 'react'
import { Header } from '../../components/layout/Header.jsx'
import { mostrarToast } from '../../components/shared/Toast.jsx'
import { auth } from '../../services/auth.jsx'
import { navegar } from '../../services/navigation.jsx'

function dicaSenha(senha) {
  if (senha.length > 0 && senha.length < 8) {
    return { texto: 'A senha deve ter ao menos 8 caracteres', cor: 'var(--color-danger)' }
  }
  if (senha.length >= 8) {
    return { texto: 'Senha válida', cor: 'var(--color-success)' }
  }
  return { texto: 'Use ao menos 8 caracteres', cor: 'var(--color-text-muted)' }
}

export function RedefinirSenhaPage() {
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [alert, setAlert] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const dica = dicaSenha(novaSenha)

  const aoEnviar = async e => {
    e.preventDefault()

    if (novaSenha.length < 8) {
      setAlert({ tipo: 'erro', mensagem: 'A nova senha deve ter ao menos 8 caracteres.' })
      return
    }

    if (novaSenha !== confirmarSenha) {
      setAlert({ tipo: 'erro', mensagem: 'As senhas não conferem.' })
      return
    }

    setCarregando(true)
    const result = await auth.redefinirSenha(token, novaSenha)
    setCarregando(false)

    if (result.erro) {
      setAlert({ tipo: 'erro', mensagem: result.erro })
      mostrarToast('erro', result.erro)
    } else {
      setAlert({ tipo: 'sucesso', mensagem: 'Senha redefinida com sucesso!' })
      mostrarToast('sucesso', 'Senha redefinida com sucesso!')
      setTimeout(() => navegar('/login'), 2000)
    }
  }

  const corpo = token ? (
    <>
      <p className="auth-subtitle">Escolha sua nova senha</p>
      {alert && (
        <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
          {alert.mensagem}
        </div>
      )}
      <form noValidate onSubmit={aoEnviar}>
        <div className="mb-3">
          <label htmlFor="novaSenha" className="form-label">Nova Senha</label>
          <input
            type="password"
            className="form-control"
            id="novaSenha"
            placeholder="Mínimo 8 caracteres"
            required
            minLength="8"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            disabled={carregando}
          />
          <div className="form-text" style={{ fontSize: 12, marginTop: 4, color: dica.cor }}>
            {dica.texto}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmSenha" className="form-label">Confirmar Senha</label>
          <input
            type="password"
            className="form-control"
            id="confirmSenha"
            placeholder="Repita a senha"
            required
            minLength="8"
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            disabled={carregando}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={carregando}>
          {carregando ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
      </form>
      <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>
          <a href="/login" className="fw-semibold" onClick={e => { e.preventDefault(); navegar('/login') }}>Voltar ao login</a>
        </p>
      </div>
    </>
  ) : (
    <>
      <p className="text-center mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        Token de redefinição não encontrado.
      </p>
      <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>
          <a href="/esqueci-senha" className="fw-semibold" onClick={e => { e.preventDefault(); navegar('/esqueci-senha') }}>Solicitar novo link</a>
        </p>
      </div>
    </>
  )

  return (
    <div>
      <Header rotaAtiva="/redefinir-senha" />
      <main className="auth-page">
        <div className="auth-card">
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <h1 className="auth-title">Redefinir Senha</h1>
          {corpo}
        </div>
      </main>
    </div>
  )
}
