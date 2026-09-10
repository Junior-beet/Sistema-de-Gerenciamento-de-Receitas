import axios from 'axios'
import { storage } from '../storage/index.jsx'
import { STORAGE_KEYS, API_URL } from '../config/constants.jsx'

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(config => {
  const token = storage.get(STORAGE_KEYS.TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      storage.remove(STORAGE_KEYS.TOKEN)
      if (location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
      }
    }
    return Promise.reject(new Error(error.response?.data?.mensagem || `Erro ${error.response?.status || 'de rede'}`))
  }
)

export const dashboardService = {
  buscarCategorias(idUsuario) {
    return client.get(`/categorias/usuario/${idUsuario}`)
  },

  buscarReceitas() {
    return client.get('/receitas')
  },

  buscarDespesas() {
    return client.get('/despesas')
  },
}
