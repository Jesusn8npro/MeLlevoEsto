import React, { createContext, useContext, useEffect, useState } from 'react'
import { clienteSupabase, debugSesionSupabase } from '../configuracion/supabase'

const ContextoAutenticacion = createContext({})

export const useAuth = () => {
  const context = useContext(ContextoAutenticacion)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un ProveedorAutenticacion')
  }
  return context
}

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [sesionIniciada, setSesionIniciada] = useState(false)
  const [inicializado, setInicializado] = useState(false)

  useEffect(() => {
    let montado = true

    // NUEVO: Verificar sesión INMEDIATAMENTE al cargar
    const inicializarAuth = async () => {
      console.log('🚀 === INICIANDO CONTEXTO DE AUTENTICACIÓN ===')
      
      try {
        // PASO 1: Obtener sesión actual INMEDIATAMENTE
        console.log('📡 Obteniendo sesión actual...')
        const { data: { session }, error } = await clienteSupabase.auth.getSession()
        
        console.log('📡 Sesión obtenida:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: error?.message
        })

        if (session?.user && montado) {
          // HAY SESIÓN - Establecer usuario inmediatamente
          const usuarioFallback = {
            id: session.user.id,
            email: session.user.email,
            nombre: session.user.user_metadata?.nombre || session.user.email.split('@')[0],
            rol: session.user.email === 'shalom@gmail.com' ? 'admin' : 'cliente'
          }

          setUsuario(usuarioFallback)
          setSesionIniciada(true)
          setCargando(false)
          setInicializado(true)
          
          console.log('✅ Usuario establecido inmediatamente:', usuarioFallback)
        } else if (montado) {
          // NO HAY SESIÓN
          console.log('🚫 No hay sesión activa')
          setUsuario(null)
          setSesionIniciada(false)
          setCargando(false)
          setInicializado(true)
        }
      } catch (error) {
        console.error('💥 Error obteniendo sesión inicial:', error)
        if (montado) {
          setUsuario(null)
          setSesionIniciada(false)
          setCargando(false)
          setInicializado(true)
        }
      }
    }

    // Función para manejar cambios de autenticación
    const manejarCambioAuth = async (evento, sesion) => {
      if (!montado) return

      console.log('🔄 Cambio de estado de auth:', evento, !!sesion?.user)

      switch (evento) {
        case 'SIGNED_IN':
          if (sesion?.user) {
            const usuarioFallback = {
              id: sesion.user.id,
              email: sesion.user.email,
              nombre: sesion.user.user_metadata?.nombre || sesion.user.email.split('@')[0],
              rol: sesion.user.email === 'shalom@gmail.com' ? 'admin' : 'cliente'
            }

            setUsuario(usuarioFallback)
            setSesionIniciada(true)
            setCargando(false)
            setInicializado(true)
            
            console.log('✅ Usuario logueado:', usuarioFallback)
          }
          break

        case 'SIGNED_OUT':
          console.log('🚫 Usuario deslogueado')
          setUsuario(null)
          setSesionIniciada(false)
          setCargando(false)
          setInicializado(true)
          break

        case 'TOKEN_REFRESHED':
          console.log('🔄 Token refrescado')
          // No hacer nada, mantener estado actual
          break

        default:
          console.log('🔄 Evento de auth:', evento)
      }
    }

    // EJECUTAR INICIALIZACIÓN INMEDIATA
    inicializarAuth()

    // Configurar listener para cambios futuros
    const { data: { subscription } } = clienteSupabase.auth.onAuthStateChange(manejarCambioAuth)

    // Timeout de seguridad (más corto)
    setTimeout(() => {
      if (montado && !inicializado) {
        console.log('⏰ Timeout de seguridad - forzando inicialización')
        setCargando(false)
        setInicializado(true)
      }
    }, 1000) // Solo 1 segundo

    return () => {
      montado = false
      subscription?.unsubscribe()
    }
  }, [])

  // Función para iniciar sesión
  const iniciarSesion = async (email, password) => {
    try {
      setCargando(true)
      const { data, error } = await clienteSupabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error iniciando sesión:', error)
      return { success: false, error: error.message }
    } finally {
      setCargando(false)
    }
  }

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    try {
      setCargando(true)
      const { error } = await clienteSupabase.auth.signOut()
      
      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      return { success: false, error: error.message }
    } finally {
      setCargando(false)
    }
  }

  // Función para verificar si es admin
  const esAdmin = () => {
    return usuario?.rol === 'admin'
  }

  const value = {
    usuario,
    cargando,
    sesionIniciada,
    inicializado,
    iniciarSesion,
    cerrarSesion,
    esAdmin
  }

  return (
    <ContextoAutenticacion.Provider value={value}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}