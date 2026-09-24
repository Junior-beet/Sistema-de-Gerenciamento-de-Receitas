import { useState } from 'react'
import { Header } from '../../components/layout/Header.jsx'
import { mostrarToast } from '../../components/shared/Toast.jsx'
import { CARGOS } from '../../config/constants.jsx'
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

export function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cargo, setCargo] = useState('')
  const [alert, setAlert] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const dica = dicaSenha(senha)

  const aoEnviar = async e => {
    e.preventDefault()

    if (senha.length < 8) {
      setAlert({ tipo: 'erro', mensagem: 'A senha deve ter ao menos 8 caracteres.' })
      return
    }

    setCarregando(true)
    const result = await auth.cadastrar({ nome, email, senha, cargo })
    setCarregando(false)

    if (result.erro) {
      setAlert({ tipo: 'erro', mensagem: result.erro })
      mostrarToast('erro', result.erro)
    } else {
      setAlert({ tipo: 'sucesso', mensagem: `Conta criada! Bem-vindo, ${nome}.` })
      mostrarToast('sucesso', `Cadastro efetuado com sucesso. Bem-vindo, ${nome}!`)
      setNome('')
      setEmail('')
      setSenha('')
      setCargo('')
      setTimeout(() => navegar('/login'), 1600)
    }
  }

  return (
    <div>
      <Header rotaAtiva="/cadastro" />
      <main className="auth-page">
        <div className="auth-card">
          <img src="/assets/logo-sgr.svg" alt="Logo do SGR" className="auth-logo" />
          <h1 className="auth-title">Criar Conta</h1>
          <p className="auth-subtitle">Preencha os dados para se registrar</p>

          {alert && (
            <div className={`alert ${alert.tipo === 'erro' ? 'alert-danger' : 'alert-success'}`}>
              {alert.mensagem}
            </div>
          )}

          <form noValidate onSubmit={aoEnviar}>
            <div className="mb-3">
              <label htmlFor="cadNome" className="form-label">Nome completo</label>
              <input
                type="text"
                className="form-control"
                id="cadNome"
                placeholder="Seu nome"
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cadEmail" className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="cadEmail"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cadSenha" className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                id="cadSenha"
                placeholder="Crie uma senha segura"
                required
                minLength="8"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <div className="form-text" style={{ fontSize: 12, marginTop: 4, color: dica.cor }}>
                {dica.texto}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="cadCargo" className="form-label">Cargo</label>
              <select
                className="form-select"
                id="cadCargo"
                required
                value={cargo}
                onChange={e => setCargo(e.target.value)}
              >
                <option value="" disabled>Selecione seu cargo</option>
                {CARGOS.map(c => (
                  <option value={c.value} key={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <div className="text-center">
            <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>
              Já possui conta? <a href="/login" className="fw-semibold" onClick={e => { e.preventDefault(); navegar('/login') }}>Faça login</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}