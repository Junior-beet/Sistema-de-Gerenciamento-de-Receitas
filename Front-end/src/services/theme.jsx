import { STORAGE_KEYS } from '../config/constants.jsx'

export function getTheme() {
  const salvo = localStorage.getItem(STORAGE_KEYS.TEMA)
  if (salvo === 'light' || salvo === 'dark') return salvo
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', t)
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem(STORAGE_KEYS.TEMA, t)
  window.dispatchEvent(new CustomEvent('tema-alterado', { detail: t }))
  return t
}

export function toggleTheme() {
  const atual = document.documentElement.getAttribute('data-bs-theme') || getTheme()
  return applyTheme(atual === 'dark' ? 'light' : 'dark')
}

export function initTheme() {
  applyTheme(getTheme())
}