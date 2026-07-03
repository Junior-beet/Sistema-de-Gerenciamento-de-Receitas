import { storage } from '../storage/index.js'
import { STORAGE_KEYS } from '../config/constants.js'
import { api } from './api.js'
import { jwt } from './crypto.js'

export const auth = {
  estaLogado() {
    return !!storage.get(STORAGE_KEYS.TOKEN)
  },

  async cadastrar({ nome, email, senha, cargo }) {
    try {
      const data = await api.post('/usuarios', { nome, email, senha_usuario: senha, cargo })
      return { sucesso: true, usuario: data.usuario }
    } catch (err) {
      return { erro: err.message }
    }
  },

  async login(email, senha) {
    try {
      const data = await api.post('/auth/login', { email, senha_usuario: senha })
      storage.set(STORAGE_KEYS.TOKEN, data.token)
      return { sucesso: true, token: data.token, usuario: data.usuario }
    } catch (err) {
      return { erro: err.message }
    }
  },

  logout() {
    storage.remove(STORAGE_KEYS.TOKEN)
  },

  async sessao() {
    const token = storage.get(STORAGE_KEYS.TOKEN)
    if (!token) return null

    try {
      const data = await api.get('/sessao')
      return data.usuario
    } catch {
      this.logout()
      return null
    }
  },

  sessaoLocal() {
    const token = storage.get(STORAGE_KEYS.TOKEN)
    if (!token) return null
    const payload = jwt.decodificar(token)
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      this.logout()
      return null
    }
    return { id_usuario: payload.id_usuario, nome: payload.nome, email: payload.email, cargo: payload.cargo }
  },

  async gerarTokenReset(email) {
    try {
      await api.post('/senha/recuperar', { email })
      return true
    } catch {
      return false
    }
  },

  async redefinirSenha(token, novaSenha) {
    try {
      await api.post('/senha/redefinir', { token, nova_senha: novaSenha, confirmar_senha: novaSenha })
      return { sucesso: true }
    } catch (err) {
      return { erro: err.message }
    }
  },
}