import { useState } from 'react'

const REQUISITOS = [
  { texto: 'Pelo menos 8 caracteres', teste: s => s.length >= 8 },
  { texto: 'Pelo menos uma letra maiúscula', teste: s => /[A-Z]/.test(s) },
  { texto: 'Pelo menos uma letra minúscula', teste: s => /[a-z]/.test(s) },
  { texto: 'Pelo menos um número', teste: s => /\d/.test(s) },
  { texto: 'Pelo menos um símbolo (!@#$...)', teste: s => /[^A-Za-z0-9]/.test(s) },
]

export function SenhaInput({ id, value, onChange, placeholder, disabled, mostrarRequisitos = false }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div>
      <div className="input-group">
        <input
          type={visivel ? 'text' : 'password'}
          className="form-control"
          id={id}
          placeholder={placeholder}
          required
          minLength="8"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setVisivel(v => !v)}
          disabled={disabled}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visivel ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>
      {mostrarRequisitos && (
        <ul className="mt-2 mb-0 ps-3" style={{ fontSize: 12 }}>
          {REQUISITOS.map(req => {
            const ok = req.teste(value)
            return (
              <li key={req.texto} style={{ color: ok ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {ok ? '✓' : '○'} {req.texto}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function validarSenhaForte(senha) {
  return REQUISITOS.every(r => r.teste(senha))
}
