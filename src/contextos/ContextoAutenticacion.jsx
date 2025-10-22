import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { clienteSupabase } from '../configuracion/supabase'

const ContextoAutenticacion = createContext({})

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [sesionInicializada, setSesionInicializada] = useState(false)
  
  // CACHE: Referencias para evitar re-inicializaciones innecesarias
  const authInitialized = useRef(false)
  const lastAuthState = useRef(null)

  // Función optimizada para obtener datos del usuario desde la base de datos
  const obtenerDatosUsuario = useCallback(async (userId) => {
    try {
      const { data, error } = await clienteSupabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error obteniendo datos del usuario:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error en obtenerDatosUsuario:', error)
      return null
    }
  }, [])

  // Función optimizada para manejar cambios de autenticación
  const manejarCambioAuth = useCallback(async (event, session) => {
    // CACHE: Evitar procesamiento duplicado del mismo estado
    const currentAuthState = session?.user?.id || 'no-session'
    if (lastAuthState.current === currentAuthState && authInitialized.current) {
      console.log('🔄 Estado de auth sin cambios, omitiendo procesamiento')
      return
    }
    
    console.log('🔄 Cambio de autenticación:', event, session?.user?.email)
    lastAuthState.current = currentAuthState

    if (session?.user) {
      try {
        // Verificar si el token es válido antes de proceder
        const { data: { user }, error } = await clienteSupabase.auth.getUser()
        
        if (error) {
          console.error('❌ Error verificando token:', error.message)
          // Si hay error de token inválido, cerrar sesión
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('refresh_token_not_found')) {
            console.log('🔄 Token inválido detectado, cerrando sesión...')
            await clienteSupabase.auth.signOut()
            setUsuario(null)
            setCargando(false)
            setSesionInicializada(true)
            return
          }
        }

        // Crear usuario básico inmediatamente para evitar parpadeos
        const usuarioBasico = {
          id: session.user.id,
          email: session.user.email,
          nombre:
            session.user.user_metadata?.nombre ||
            session.user.user_metadata?.full_name ||
            (session.user.email ? session.user.email.split('@')[0] : 'Usuario'),
          rol: session.user.email === 'shalom@gmail.com' ? 'admin' : 'cliente' // Rol por defecto
        }

        // NAVEGACIÓN FLUIDA: Actualizar estado inmediatamente
        setUsuario(usuarioBasico)
        setCargando(false)
        setSesionInicializada(true)
        authInitialized.current = true

        // Cargar datos completos en segundo plano sin bloquear la UI
        try {
          const datosUsuario = await obtenerDatosUsuario(session.user.id)
          if (datosUsuario) {
            setUsuario(prevUsuario => ({
              ...datosUsuario,
              email: session.user.email,
              nombre: datosUsuario.nombre || prevUsuario.nombre,
              rol: datosUsuario.rol || prevUsuario.rol
            }))
            console.log('✅ Usuario enriquecido desde BD:', datosUsuario.email)
          }
        } catch (error) {
          console.error('Error cargando datos completos del usuario:', error)
          // Mantener usuario básico si falla la carga de BD
        }
      } catch (error) {
        console.error('💥 Error procesando usuario:', error)
        setUsuario(null)
        setCargando(false)
        setSesionInicializada(true)
        authInitialized.current = true
      }
    } else {
      // No hay sesión
      setUsuario(null)
      setCargando(false)
      setSesionInicializada(true)
      authInitialized.current = true
    }
  }, [obtenerDatosUsuario])

  // Inicializar autenticación una sola vez
  useEffect(() => {
    // CACHE: Evitar re-inicialización si ya está inicializado
    if (authInitialized.current) {
      console.log('🔄 Auth ya inicializado, omitiendo re-inicialización')
      return
    }

    console.log('🚀 Inicializando autenticación...')
    let unsubscribe

    const init = async () => {
      try {
        // Obtener sesión inicial
        const { data: { session } } = await clienteSupabase.auth.getSession()
        await manejarCambioAuth('INITIAL_SESSION', session)

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = clienteSupabase.auth.onAuthStateChange(manejarCambioAuth)
        unsubscribe = () => subscription.unsubscribe()
      } catch (error) {
        console.error('Error obteniendo sesión inicial:', error)
        setCargando(false)
        setSesionInicializada(true)
        authInitialized.current = true
      }
    }

    init()

    // Cleanup
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [manejarCambioAuth])

  // Función de login optimizada
  const iniciarSesion = useCallback(async (email, password) => {
    try {
      setCargando(true)
      console.log('🔐 Intentando iniciar sesión:', email)

      const { data, error } = await clienteSupabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Error en login:', error.message)
        setCargando(false)
        return { error: error.message }
      }

      console.log('✅ Login exitoso:', data.user.email)
      // No necesitamos setCargando(false) aquí porque manejarCambioAuth lo hará
      return { data }
    } catch (error) {
      console.error('💥 Error inesperado en login:', error)
      setCargando(false)
      return { error: 'Error inesperado al iniciar sesión' }
    }
  }, [])

  // Función de registro optimizada
  const registrarse = useCallback(async (email, password, nombre) => {
    try {
      setCargando(true)
      console.log('📝 Intentando registrar usuario:', email)

      const { data, error } = await clienteSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombre
          }
        }
      })

      if (error) {
        console.error('❌ Error en registro:', error.message)
        setCargando(false)
        return { error: error.message }
      }

      console.log('✅ Registro exitoso:', data.user.email)
      // No necesitamos setCargando(false) aquí porque manejarCambioAuth lo hará
      return { data }
    } catch (error) {
      console.error('💥 Error inesperado en registro:', error)
      setCargando(false)
      return { error: 'Error inesperado al registrarse' }
    }
  }, [])

  // Función de cierre de sesión optimizada
  const cerrarSesion = useCallback(async () => {
    try {
      setCargando(true)
      console.log('🚪 Cerrando sesión...')

      const { error } = await clienteSupabase.auth.signOut()

      if (error) {
        console.error('❌ Error cerrando sesión:', error.message)
        setCargando(false)
        return { error: error.message }
      }

      console.log('✅ Sesión cerrada exitosamente')
      // Reset cache
      authInitialized.current = false
      lastAuthState.current = null
      // manejarCambioAuth se encargará de limpiar el estado
      return { success: true }
    } catch (error) {
      console.error('💥 Error inesperado cerrando sesión:', error)
      setCargando(false)
      return { error: 'Error inesperado al cerrar sesión' }
    }
  }, [])

  // Funciones de utilidad optimizadas
  const esAdmin = useCallback(() => usuario?.rol === 'admin', [usuario?.rol])
  const esCliente = useCallback(() => usuario?.rol === 'cliente', [usuario?.rol])
  const estaAutenticado = useCallback(() => !!usuario && sesionInicializada, [usuario, sesionInicializada])
  
  // Función para obtener la ruta de redirección después del login
  const obtenerRutaRedireccion = useCallback(() => {
    if (!usuario) return '/'
    
    // Si es admin, redirigir al dashboard de admin
    if (usuario.rol === 'admin') {
      return '/admin'
    }
    
    // Si es cliente, redirigir al perfil o página principal
    return '/perfil'
  }, [usuario])

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const valorContexto = useMemo(() => ({
    usuario,
    cargando,
    sesionInicializada,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    esAdmin,
    esCliente,
    estaAutenticado,
    obtenerRutaRedireccion
  }), [
    usuario,
    cargando,
    sesionInicializada,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    esAdmin,
    esCliente,
    estaAutenticado,
    obtenerRutaRedireccion
  ])

  return (
    <ContextoAutenticacion.Provider value={valorContexto}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export const useAuth = () => {
  const contexto = useContext(ContextoAutenticacion)
  if (contexto === undefined) {
    throw new Error('useAuth debe ser usado dentro de un ProveedorAutenticacion')
  }
  return contexto
}

export default ContextoAutenticacion