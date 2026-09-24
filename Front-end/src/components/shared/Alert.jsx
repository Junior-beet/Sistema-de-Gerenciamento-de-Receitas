export function Alert({ tipo, mensagem }) {
  const wrapper = document.createElement('div')
  const alertClass = tipo === 'erro' ? 'alert-danger' : tipo === 'sucesso' ? 'alert-success' : 'alert-info'
  wrapper.className = `alert ${alertClass} d-none`
  wrapper.textContent = mensagem || ''
  return wrapper
}

export function mostrarAlerta(el, tipo, mensagem) {
  const alertClass = tipo === 'erro' ? 'alert-danger' : tipo === 'sucesso' ? 'alert-success' : 'alert-info'
  el.className = `alert ${alertClass}`
  el.textContent = mensagem
}

export function esconderAlerta(el) {
  el.className = 'alert d-none'
  el.textContent = ''
}
