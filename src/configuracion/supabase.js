
import { createClient } from '@supabase/supabase-js'

const urlSupabase = import.meta.env.VITE_SUPABASE_URL
const claveAnonimaSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables de entorno estén definidas
if (!urlSupabase) {
  throw new Error('VITE_SUPABASE_URL no está definida en las variables de entorno')
}

if (!claveAnonimaSupabase) {
  throw new Error('VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno')
}

// Configuración de Supabase cargada correctamente

// Crear cliente con configuración mejorada para RLS
export const supabase = createClient(urlSupabase, claveAnonimaSupabase, {
  auth: {
    // Mantener sesión activa
    persistSession: true,
    // Auto refresh de tokens
    autoRefreshToken: true,
    // Detectar cambios de sesión
    detectSessionInUrl: true,
    // Storage key personalizado
    storageKey: 'me-llevo-esto-auth',
    // Configuración de storage
    storage: window.localStorage,
    // Configuración de flow type
    flowType: 'pkce'
  },
  // Configuración de la base de datos
  db: {
    schema: 'public'
  },
  // Configuración global con headers mejorados
  global: {
    headers: {
      'X-Client-Info': 'me-llevo-esto-web',
      'apikey': claveAnonimaSupabase
    }
  },
  // Configuración de realtime
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// También exportar como clienteSupabase para compatibilidad
export const clienteSupabase = supabase

// Función helper para verificar conexión
export const verificarConexionSupabase = async () => {
  try {
    const { data, error } = await supabase.from('usuarios').select('count').limit(1)
    if (error) {
      console.error('❌ Error verificando conexión:', error)
      return false
    }
    console.log('✅ Conexión a Supabase verificada')
    return true
  } catch (error) {
    console.error('💥 Error en verificación:', error)
    return false
  }
}

// Función para debug completo de sesión y RLS
export const debugSesionSupabase = async () => {
  try {
    console.log('🔍 === DEBUG SESIÓN SUPABASE COMPLETO ===')
    
    // 1. Verificar sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('📡 Sesión actual:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      email: session?.user?.email,
      accessToken: session?.access_token ? 'PRESENTE' : 'AUSENTE',
      refreshToken: session?.refresh_token ? 'PRESENTE' : 'AUSENTE',
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A',
      error: sessionError?.message
    })

    // 2. Verificar usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('👤 Usuario actual:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      lastSignIn: user?.last_sign_in_at,
      error: userError?.message
    })

    // 3. Probar acceso RLS a tabla usuarios
    if (session?.user) {
      console.log('🔐 Probando acceso RLS a tabla usuarios...')
      
      // Test 1: Lectura general (debería funcionar con usuarios_lectura_publica)
      const { data: allUsers, error: allError } = await supabase
        .from('usuarios')
        .select('id, email, nombre, rol')
        .limit(3)
      
      console.log('📊 Lectura general usuarios (RLS):', {
        success: !allError,
        count: allUsers?.length || 0,
        data: allUsers?.map(u => ({ id: u.id, email: u.email, rol: u.rol })),
        error: allError?.message,
        errorCode: allError?.code,
        errorDetails: allError?.details
      })

      // Test 2: Lectura específica del usuario actual
      const { data: currentUser, error: currentError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      console.log('🎯 Lectura usuario actual (RLS):', {
        success: !currentError,
        hasData: !!currentUser,
        userData: currentUser ? { 
          id: currentUser.id, 
          email: currentUser.email, 
          rol: currentUser.rol,
          nombre: currentUser.nombre 
        } : null,
        error: currentError?.message,
        errorCode: currentError?.code,
        errorDetails: currentError?.details
      })

      // Test 3: Probar con diferentes filtros
      const { data: userByEmail, error: emailError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', session.user.email)
        .single()
      
      console.log('📧 Lectura por email (RLS):', {
        success: !emailError,
        hasData: !!userByEmail,
        error: emailError?.message
      })

      // Test 4: Verificar si es admin
      if (currentUser) {
        console.log('👑 Verificación de admin:', {
          isAdmin: currentUser.rol === 'admin',
          role: currentUser.rol,
          canAccessAdminFeatures: currentUser.rol === 'admin'
        })
      }
    }

    console.log('🔍 === FIN DEBUG SESIÓN COMPLETO ===')
    return { session, error: sessionError }
  } catch (error) {
    console.error('💥 Error en debug de sesión:', error)
    return { session: null, error }
  }
}
