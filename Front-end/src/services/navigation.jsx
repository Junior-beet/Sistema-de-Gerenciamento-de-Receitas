export function navegar(caminho) {
  window.dispatchEvent(new CustomEvent('navegar', { detail: caminho }))
}