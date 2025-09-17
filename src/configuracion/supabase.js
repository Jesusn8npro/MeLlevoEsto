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

console.log('🔧 Supabase configurado:', {
  url: urlSupabase,
  key: claveAnonimaSupabase ? `${claveAnonimaSupabase.substring(0, 20)}...` : 'NO DEFINIDA'
})

export const clienteSupabase = createClient(urlSupabase, claveAnonimaSupabase)
