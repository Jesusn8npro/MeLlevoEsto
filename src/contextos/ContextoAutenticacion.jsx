import React, { createContext, useContext, useEffect, useState } from 'react'
import { clienteSupabase } from '../configuracion/supabase'

const ContextoAutenticacion = createContext({})

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [sesionInicializada, setSesionInicializada] = useState(false)

  // Función para obtener datos del usuario desde la base de datos
  const obtenerDatosUsuario = async (userId) => {
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
  }

  // Función para manejar cambios de autenticación
  const manejarCambioAuth = async (event, session) => {
    console.log('🔄 Cambio de autenticación:', event, session?.user?.email)

    if (session?.user) {
      // 1) Hidratar inmediatamente con datos básicos del auth (evita parpadeo)
      const usuarioBasico = {
        id: session.user.id,
        email: session.user.email,
        nombre:
          session.user.user_metadata?.nombre ||
          session.user.user_metadata?.full_name ||
          (session.user.email ? session.user.email.split('@')[0] : 'Usuario')
      }

      setUsuario(usuarioBasico)
      setCargando(false)
      setSesionInicializada(true)

      // 2) Cargar datos completos en segundo plano y actualizar sin bloquear UI
      ;(async () => {
        try {
          const datosUsuario = await obtenerDatosUsuario(session.user.id)
          if (datosUsuario) {
            setUsuario({
              ...datosUsuario,
              email: session.user.email,
              nombre:
                datosUsuario.nombre ||
                usuarioBasico.nombre
            })
            console.log('✅ Usuario enriquecido desde BD:', datosUsuario.email)
          }
        } catch (error) {
          console.warn('⚠️ No se pudo enriquecer usuario, usando datos básicos:', error)
        }
      })()
    } else {
      // Usuario no autenticado
      setUsuario(null)
      setCargando(false)
      setSesionInicializada(true)
      console.log('🚪 Usuario desautenticado')
    }
  }

  // Inicializar autenticación
  useEffect(() => {
    console.log('🚀 Inicializando autenticación...')
    let unsubscribe
    const init = async () => {
      try {
        // 1) Hidratar sesión desde localStorage de forma inmediata
        const { data: { session } } = await clienteSupabase.auth.getSession()
        await manejarCambioAuth('INITIAL_SESSION', session)
      } catch (error) {
        console.error('Error obteniendo sesión inicial:', error)
        setCargando(false)
        setSesionInicializada(true)
      }

      // 2) Suscribirse a cambios de autenticación
      const { data: { subscription } } = clienteSupabase.auth.onAuthStateChange(manejarCambioAuth)
      unsubscribe = () => subscription.unsubscribe()
    }

    init()

    // Cleanup
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  // Función de login
  const iniciarSesion = async (email, password) => {
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
      setCargando(false)
      return { data }
    } catch (error) {
      console.error('💥 Error inesperado en login:', error)
      setCargando(false)
      return { error: 'Error inesperado al iniciar sesión' }
    }
  }

  // Función de registro
  const registrarse = async (email, password, nombre) => {
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
      setCargando(false)
      return { data }
    } catch (error) {
      console.error('💥 Error inesperado en registro:', error)
      setCargando(false)
      return { error: 'Error inesperado al registrarse' }
    }
  }

  // Función de logout
  const cerrarSesion = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      const { error } = await clienteSupabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error cerrando sesión:', error.message)
        return { error: error.message }
      }

      console.log('✅ Sesión cerrada exitosamente')
      return { success: true }
    } catch (error) {
      console.error('💥 Error inesperado cerrando sesión:', error)
      return { error: 'Error inesperado al cerrar sesión' }
    }
  }

  // Función para reenviar verificación de email
  const reenviarVerificacionEmail = async (email) => {
    try {
      console.log('📧 Reenviando verificación de email:', email)
      
      const { error } = await clienteSupabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        console.error('❌ Error reenviando verificación:', error.message)
        return { error: error.message }
      }

      console.log('✅ Verificación reenviada exitosamente')
      return { success: true }
    } catch (error) {
      console.error('💥 Error inesperado reenviando verificación:', error)
      return { error: 'Error inesperado al reenviar verificación' }
    }
  }

  // Función para determinar si el usuario es admin
  const esAdmin = () => {
    if (!usuario) return false
    return usuario.rol === 'admin'
  }

  // Función para obtener la ruta de redirección basada en el rol
  const obtenerRutaRedireccion = () => {
    if (!usuario) return '/'
    
    if (esAdmin()) {
      console.log('🔑 Usuario admin detectado - redirigiendo a /admin')
      return '/admin'
    } else {
      console.log('👤 Usuario cliente detectado - redirigiendo a /perfil')
      return '/perfil'
    }
  }

  const valor = {
    usuario,
    cargando,
    sesionInicializada,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    reenviarVerificacionEmail,
    esAdmin,
    obtenerRutaRedireccion
  }

  return (
    <ContextoAutenticacion.Provider value={valor}>
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