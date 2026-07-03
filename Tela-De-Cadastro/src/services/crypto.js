import { JWT_SECRET } from '../config/constants.js'

function base64url(str) {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function fromBase64url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

async function hmacSign(data) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return base64url(String.fromCharCode(...new Uint8Array(sig)))
}

export const jwt = {
  async criar(payload) {
    const header = { alg: 'HS256', typ: 'JWT' }
    const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60
    const data = { ...payload, exp, iat: Math.floor(Date.now() / 1000) }

    const headerB64 = base64url(JSON.stringify(header))
    const payloadB64 = base64url(JSON.stringify(data))
    const sig = await hmacSign(`${headerB64}.${payloadB64}`)

    return `${headerB64}.${payloadB64}.${sig}`
  },

  async verificar(token) {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const expected = await hmacSign(`${parts[0]}.${parts[1]}`)
      if (parts[2] !== expected) return null

      const payload = JSON.parse(fromBase64url(parts[1]))
      if (payload.exp && payload.exp * 1000 < Date.now()) return null

      return payload
    } catch {
      return null
    }
  },

  decodificar(token) {
    try {
      const parts = token.split('.')
      return JSON.parse(fromBase64url(parts[1]))
    } catch {
      return null
    }
  },
}

export async function hashSenha(senha) {
  const encoder = new TextEncoder()
  const data = encoder.encode(senha + JWT_SECRET)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64url(String.fromCharCode(...new Uint8Array(hash)))
}
