import { useState, useEffect } from 'react'
import { clienteSupabase } from '../configuracion/supabase'

export function usarProducto(slug) {
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      cargarProducto()
    }
  }, [slug])

  const cargarProducto = async () => {
    setCargando(true)
    setError(null)

    try {
      const { data, error: errorConsulta } = await clienteSupabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre,
            slug
          ),
          imagenes (
            id,
            url,
            orden,
            alt_text
          ),
          reseñas (
            id,
            calificacion,
            comentario,
            created_at,
            usuarios (
              nombre,
              avatar_url
            )
          )
        `)
        .eq('slug', slug)
        .eq('activo', true)
        .single()

      if (errorConsulta) {
        throw errorConsulta
      }

      setProducto(data)
    } catch (err) {
      console.error('Error al cargar producto:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return {
    producto,
    cargando,
    error,
    recargar: cargarProducto
  }
}



