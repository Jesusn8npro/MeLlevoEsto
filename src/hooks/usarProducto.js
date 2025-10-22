import { useState, useEffect } from 'react'
import { clienteSupabase } from '../configuracion/supabase'
import { procesarImagenesProducto } from '../utilidades/googleDrive'

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
          promociones,
          categorias (
            id,
            nombre,
            icono,
            slug
          ),
          producto_imagenes (
            imagen_principal,
            imagen_secundaria_1,
            imagen_secundaria_2,
            imagen_secundaria_3,
            imagen_secundaria_4,
            imagen_punto_dolor_1,
            imagen_punto_dolor_2,
            imagen_solucion_1,
            imagen_solucion_2,
            imagen_testimonio_persona_1,
            imagen_testimonio_persona_2,
            imagen_testimonio_persona_3,
            imagen_testimonio_producto_1,
            imagen_testimonio_producto_2,
            imagen_testimonio_producto_3,
            imagen_caracteristicas,
            imagen_garantias,
            imagen_cta_final,
            estado,
            total_imagenes_generadas
          )
        `)
        .eq('slug', slug)
        .eq('activo', true)
        .single()

      if (errorConsulta) {
        throw errorConsulta
      }

      // Procesar los datos para incluir las imágenes correctamente
      if (data) {
        console.log('🎯 PRODUCTO CARGADO DESDE SUPABASE:', data.nombre)
        console.log('📦 DATOS COMPLETOS DEL PRODUCTO:', data)
        console.log('🎁 PROMOCIONES DEL PRODUCTO:', data.promociones)
        
        // Procesar imágenes del producto
        
        // Si hay datos de producto_imagenes, los agregamos al objeto producto
        if (data.producto_imagenes && data.producto_imagenes.length > 0) {
          const imagenesRaw = data.producto_imagenes[0] // Tomar el primer registro de imágenes
          
          // Usar la utilidad centralizada para procesar las imágenes
          data.imagenes = procesarImagenesProducto(imagenesRaw)
        } else {
          // Si no hay imágenes en la tabla producto_imagenes, crear objeto vacío
          data.imagenes = {}
        }
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












