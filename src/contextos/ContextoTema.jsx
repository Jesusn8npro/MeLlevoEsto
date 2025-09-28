import { createContext, useState, useContext, useEffect } from 'react'

const ContextoTema = createContext(undefined)

export const useTema = () => {
  const contexto = useContext(ContextoTema)
  if (contexto === undefined) {
    throw new Error('useTema debe ser usado dentro de un ProveedorTema')
  }
  return contexto
}

export const ProveedorTema = ({ children }) => {
  const [tema, setTema] = useState('light')
  const [estaInicializado, setEstaInicializado] = useState(false)

  useEffect(() => {
    // Este código solo se ejecuta en el cliente
    const temaGuardado = localStorage.getItem('tema')
    const temaInicial = temaGuardado || 'light' // Por defecto tema claro

    setTema(temaInicial)
    setEstaInicializado(true)
  }, [])

  useEffect(() => {
    if (estaInicializado) {
      localStorage.setItem('tema', tema)
      if (tema === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [tema, estaInicializado])

  const alternarTema = () => {
    setTema((temaAnterior) => (temaAnterior === 'light' ? 'dark' : 'light'))
  }

  return (
    <ContextoTema.Provider value={{ tema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  )
}
