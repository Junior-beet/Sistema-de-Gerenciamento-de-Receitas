import { storage } from '../storage/index.jsx'
import { STORAGE_KEYS, API_URL } from '../config/constants.jsx'

async function request(endpoint, options = {}) {
  const token = storage.get(STORAGE_KEYS.TOKEN)

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401 && token) {
      storage.remove(STORAGE_KEYS.TOKEN)
      if (location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
      }
    }
    throw new Error(data?.mensagem || `Erro ${res.status}`)
  }

  return data
}

export const api = {
  get(endpoint) {
    return request(endpoint, { method: 'GET' })
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  delete(endpoint) {
    return request(endpoint, { method: 'DELETE' })
  },
}