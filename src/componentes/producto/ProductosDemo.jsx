import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../configuracion/supabase'
import TarjetaProductoVendedora from './TarjetaProductoVendedora'
import { Loader, AlertCircle } from 'lucide-react'
import './ProductosDemo.css'

/**
 * ProductosDemo - Componente para mostrar productos reales de la base de datos
 * Muestra las tarjetas ultra vendedoras con datos reales de Supabase
 */

const ProductosDemo = () => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarProductosReales()
  }, [])

  const cargarProductosReales = async () => {
    try {
      setCargando(true)
      setError(null)

      console.log('🔍 Cargando productos reales desde Supabase...')

      const { data, error: errorQuery } = await clienteSupabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre,
            icono
          ),
          producto_imagenes (
            imagen_principal,
            imagen_secundaria_1,
            imagen_secundaria_2,
            imagen_secundaria_3,
            imagen_secundaria_4
          )
        `)
        .eq('activo', true)
        .limit(8)
        .order('creado_el', { ascending: false })

      if (errorQuery) {
        throw errorQuery
      }

      console.log('📦 Productos cargados:', data?.length || 0)

      // Procesar productos para usar imágenes reales de la base de datos
      const productosConImagenes = data?.map(producto => {
        const imagenesReales = []
        
        // Si tiene producto_imagenes, procesarlas
        if (producto.producto_imagenes && producto.producto_imagenes.length > 0) {
          const imagenes = producto.producto_imagenes[0]
          
          // Función para convertir URLs de Google Drive
          const convertirUrlGoogleDrive = (url) => {
            if (!url) return null
            
            let fileId = null
            if (url.includes('drive.google.com/file/d/')) {
              const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
              fileId = match?.[1]
            } else if (url.includes('drive.google.com/thumbnail?id=')) {
              const match = url.match(/id=([a-zA-Z0-9_-]+)/)
              fileId = match?.[1]
            }
            
            if (fileId) {
              return `https://lh3.googleusercontent.com/d/${fileId}=w1000?authuser=0`
            }
            return url
          }
          
          // Agregar imágenes en orden de prioridad
          if (imagenes.imagen_principal) imagenesReales.push(convertirUrlGoogleDrive(imagenes.imagen_principal))
          if (imagenes.imagen_secundaria_1) imagenesReales.push(convertirUrlGoogleDrive(imagenes.imagen_secundaria_1))
          if (imagenes.imagen_secundaria_2) imagenesReales.push(convertirUrlGoogleDrive(imagenes.imagen_secundaria_2))
          if (imagenes.imagen_secundaria_3) imagenesReales.push(convertirUrlGoogleDrive(imagenes.imagen_secundaria_3))
          if (imagenes.imagen_secundaria_4) imagenesReales.push(convertirUrlGoogleDrive(imagenes.imagen_secundaria_4))
        }
        
        // Si no hay imágenes reales, usar fotos_principales del producto o fallback
        if (imagenesReales.length === 0) {
          if (producto.fotos_principales && producto.fotos_principales.length > 0) {
            imagenesReales.push(...producto.fotos_principales)
          } else {
            // Fallback a imágenes de ejemplo
            imagenesReales.push(
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
              "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop"
            )
          }
        }
        
        return {
          ...producto,
          fotos_principales: imagenesReales.filter(Boolean) // Filtrar nulls/undefined
        }
      }) || []

      setProductos(productosConImagenes)

    } catch (error) {
      console.error('❌ Error cargando productos:', error)
      setError(error.message)
      
      // Fallback a productos de ejemplo si hay error
      setProductos([
        {
          id: 1,
          nombre: "Smartphone Galaxy Pro Max 256GB",
          slug: "smartphone-galaxy-pro-max-256gb",
          precio: 2499000,
          precio_original: 3199000,
          stock: 15,
          fotos_principales: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop"
          ],
          descripcion: "El smartphone más avanzado del mercado con tecnología de última generación.",
          destacado: true,
          activo: true
        },
        {
          id: 2,
          nombre: "Auriculares Bluetooth Premium",
          slug: "auriculares-bluetooth-premium",
          precio: 299000,
          precio_original: 499000,
          stock: 8,
          fotos_principales: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
          ],
          descripcion: "Auriculares inalámbricos con cancelación de ruido activa.",
          destacado: false,
          activo: true
        }
      ])
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return (
      <div className="productos-demo">
        <div className="productos-demo-header">
          <h2 className="productos-demo-titulo">🔥 ¡CARGANDO PRODUCTOS REALES!</h2>
          <p className="productos-demo-subtitulo">Obteniendo productos desde tu base de datos...</p>
        </div>
        <div className="productos-demo-cargando">
          <Loader className="spinner" size={48} />
          <p>Cargando productos desde Supabase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="productos-demo">
      <div className="productos-demo-header">
        <h2 className="productos-demo-titulo">🔥 ¡TARJETAS ULTRA VENDEDORAS EN ACCIÓN!</h2>
        <p className="productos-demo-subtitulo">
          {error ? 'Productos de ejemplo (error conectando a BD)' : 'Productos reales desde tu base de datos'}
        </p>
        {error && (
          <div className="productos-demo-error">
            <AlertCircle size={16} />
            <span>Usando productos de ejemplo: {error}</span>
          </div>
        )}
      </div>

      <div className="productos-demo-grid">
        {productos.map((producto) => (
          <TarjetaProductoVendedora
            key={producto.id}
            producto={producto}
            mostrarDescuento={true}
            mostrarUrgencia={true}
            mostrarPruebaSocial={true}
            mostrarBadges={true}
            tamaño="normal"
            animaciones={true}
          />
        ))}
      </div>

      <div className="productos-demo-info">
        <div className="info-card">
          <h3>✨ Características Implementadas</h3>
          <ul>
            <li>🏷️ Badges dinámicos de ofertas y urgencia</li>
            <li>💰 Precios tachados con descuentos llamativos</li>
            <li>⭐ Ratings y prueba social automática</li>
            <li>⏰ Contadores de tiempo de urgencia</li>
            <li>🎯 Animaciones que generan FOMO</li>
            <li>📱 Diseño responsive perfecto</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🚀 Próximos Pasos</h3>
          <ul>
            <li>📊 Agrega productos reales a tu base de datos</li>
            <li>🎨 Personaliza colores y animaciones</li>
            <li>📈 Implementa analytics de conversión</li>
            <li>🔄 Configura actualizaciones automáticas</li>
            <li>💡 Testea diferentes variaciones A/B</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductosDemo
