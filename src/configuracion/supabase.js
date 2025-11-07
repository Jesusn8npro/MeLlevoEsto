
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Configuración simplificada para garantizar persistencia de sesión
export const clienteSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuración básica y confiable
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    
    // Usar localStorage estándar sin customización
    storage: window.localStorage,
    
    // Usar flujo implícito que es más confiable para SPAs
    flowType: 'implicit',
    
    // Configuración de debug
    debug: import.meta.env.VITE_DEBUG === 'true'
  }
})

// Función auxiliar para obtener session ID solo cuando sea necesario
export const obtenerSessionId = () => {
  try {
    let sessionId = localStorage.getItem('me-llevo-esto-session-id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('me-llevo-esto-session-id', sessionId)
    }
    return sessionId
  } catch (error) {
    console.warn('Error obteniendo session ID:', error)
    return crypto.randomUUID()
  }
}

// Cliente con session ID para operaciones específicas (carrito, etc.)
export const obtenerClienteConSesion = () => {
  const sessionId = obtenerSessionId()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      flowType: 'implicit'
    },
    global: {
      headers: {
        'x-session-id': sessionId
      }
    }
  })
}

// Log de inicialización
console.log('🚀 Cliente Supabase inicializado con configuración simplificada')
