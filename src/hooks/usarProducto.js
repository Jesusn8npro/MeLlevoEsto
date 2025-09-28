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
            imagen_punto_dolor_3,
            imagen_punto_dolor_4,
            imagen_solucion_1,
            imagen_solucion_2,
            imagen_solucion_3,
            imagen_solucion_4,
            imagen_testimonio_persona_1,
            imagen_testimonio_persona_2,
            imagen_testimonio_persona_3,
            imagen_testimonio_persona_4,
            imagen_testimonio_persona_5,
            imagen_testimonio_persona_6,
            imagen_testimonio_producto_1,
            imagen_testimonio_producto_2,
            imagen_testimonio_producto_3,
            imagen_testimonio_producto_4,
            imagen_testimonio_producto_5,
            imagen_testimonio_producto_6,
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
        // Procesar imágenes del producto
        
        // Si hay datos de producto_imagenes, los agregamos al objeto producto
        if (data.producto_imagenes && data.producto_imagenes.length > 0) {
          const imagenesRaw = data.producto_imagenes[0] // Tomar el primer registro de imágenes
          
          // CONVERTIR TODAS LAS URLs DE GOOGLE DRIVE AL FORMATO QUE SÍ FUNCIONA
          const imagenesConvertidas = {}
          Object.keys(imagenesRaw).forEach(key => {
            const url = imagenesRaw[key]
            if (url && typeof url === 'string') {
              let fileId = null
              
              // Extraer ID de diferentes formatos de Google Drive
              if (url.includes('drive.google.com/file/d/')) {
                const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
                fileId = match?.[1]
              } else if (url.includes('drive.google.com/thumbnail?id=')) {
                const match = url.match(/id=([a-zA-Z0-9_-]+)/)
                fileId = match?.[1]
              }
              
              if (fileId) {
                // USAR EL FORMATO QUE SÍ FUNCIONA: lh3.googleusercontent.com
                imagenesConvertidas[key] = `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
              } else {
                // Si no es de Google Drive, dejar como está
                imagenesConvertidas[key] = url
              }
            } else {
              imagenesConvertidas[key] = url
            }
          })
          data.imagenes = imagenesConvertidas
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












