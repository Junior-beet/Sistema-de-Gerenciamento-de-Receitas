import { useEffect, useState } from 'react'

const TOAST_EVENT = 'sgr:toast'

const TIPOS = {
  sucesso: { icone: '✓', titulo: 'Sucesso!', classe: 'toast-success' },
  erro: { icone: '✕', titulo: 'Erro!', classe: 'toast-error' },
  info: { icone: 'ℹ', titulo: 'Aviso', classe: 'toast-info' },
}

export function mostrarToast(tipo, mensagem) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { tipo, mensagem } }))
}

export function ToastHost() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const aoToast = e => {
      const { tipo = 'info', mensagem = '' } = e.detail || {}
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev, { id, tipo, mensagem }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }
    window.addEventListener(TOAST_EVENT, aoToast)
    return () => window.removeEventListener(TOAST_EVENT, aoToast)
  }, [])

  const fechar = id => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map(t => {
        const cfg = TIPOS[t.tipo] || TIPOS.info
        return (
          <div key={t.id} className={`toast balloon ${cfg.classe} toast-show`} role="alert">
            <span className="toast-icon">{cfg.icone}</span>
            <div className="toast-body">
              <div className="toast-title">{cfg.titulo}</div>
              <div className="toast-msg">{t.mensagem}</div>
            </div>
            <button type="button" className="toast-close" aria-label="Fechar" onClick={() => fechar(t.id)}>&times;</button>
            <div className="toast-progress"></div>
          </div>
        )
      })}
    </div>
  )
}