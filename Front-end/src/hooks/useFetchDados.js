import { useState, useEffect, useCallback, useRef } from 'react'

export function useFetchDados(requisicao, dependencias = []) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const primeiroCarregamento = useRef(true)

  const carregar = useCallback(async () => {
    if (primeiroCarregamento.current) {
      setCarregando(true)
    }
    setErro(null)
    try {
      const resultado = await requisicao()
      setDados(resultado)
      primeiroCarregamento.current = false
      setCarregando(false)
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados')
      setCarregando(false)
    }
  }, dependencias)

  useEffect(() => {
    carregar()
    const intervalo = setInterval(carregar, 30000)
    return () => clearInterval(intervalo)
  }, [carregar])

  return { dados, carregando, erro, recarregar: carregar }
}
