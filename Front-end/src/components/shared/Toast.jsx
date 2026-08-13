export function mostrarToast(tipo, mensagem) {
  const tipoConfig = {
    sucesso: { icone: '✓', titulo: 'Sucesso!', classe: 'toast-success' },
    erro: { icone: '✕', titulo: 'Erro!', classe: 'toast-error' },
    info: { icone: 'ℹ', titulo: 'Aviso', classe: 'toast-info' },
  }

  const cfg = tipoConfig[tipo] || tipoConfig.info

  let container = document.getElementById('toastContainer')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toastContainer'
    container.className = 'toast-container'
    document.body.appendChild(container)
  }

  const toast = document.createElement('div')
  toast.className = `toast balloon ${cfg.classe}`

  const icon = document.createElement('span')
  icon.className = 'toast-icon'
  icon.textContent = cfg.icone

  const body = document.createElement('div')
  body.className = 'toast-body'

  const title = document.createElement('div')
  title.className = 'toast-title'
  title.textContent = cfg.titulo

  const text = document.createElement('div')
  text.className = 'toast-msg'
  text.textContent = mensagem

  const close = document.createElement('button')
  close.className = 'toast-close'
  close.type = 'button'
  close.setAttribute('aria-label', 'Fechar')
  close.innerHTML = '&times;'

  const progress = document.createElement('div')
  progress.className = 'toast-progress'

  body.appendChild(title)
  body.appendChild(text)

  toast.appendChild(icon)
  toast.appendChild(body)
  toast.appendChild(close)
  toast.appendChild(progress)

  container.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('toast-show'))

  const fechar = () => {
    toast.classList.remove('toast-show')
    toast.classList.add('toast-hide')
    setTimeout(() => toast.remove(), 300)
  }

  close.addEventListener('click', fechar)

  const duracao = 4000
  setTimeout(() => fechar(), duracao)
}
