import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { supabase } from '../../../configuracion/supabase'
import './SeccionProductos.css'

/**
 * SeccionProductos - Sección de productos recientes
 * 
 * Características:
 * - Datos reales desde Supabase
 * - Grid responsivo de productos
 * - Información completa: precio, descuento, rating
 * - Botones de acción: favoritos, carrito, vista rápida
 * - Enlaces a páginas de producto
 */

const SeccionProductos = () => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      setCargando(true)
      
      // Obtener productos recientes con sus imágenes
      const { data: productosData, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias(nombre, slug),
          producto_imagenes(*)
        `)
        .eq('activo', true)
        .order('creado_el', { ascending: false })
        .limit(8)

      if (error) {
        console.error('Error cargando productos:', error)
        return
      }

      // Procesar productos para incluir imágenes convertidas
      const productosConImagenes = productosData?.map(producto => {
        let imagenPrincipal = '/images/producto-default.jpg'
        
        if (producto.producto_imagenes && producto.producto_imagenes.length > 0) {
          const imagenes = producto.producto_imagenes[0]
          if (imagenes.imagen_principal) {
            // Convertir URL de Google Drive si es necesario
            const url = imagenes.imagen_principal
            if (url.includes('drive.google.com/file/d/')) {
              const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
              const fileId = match?.[1]
              if (fileId) {
                imagenPrincipal = `https://lh3.googleusercontent.com/d/${fileId}=w400?authuser=0`
              }
            } else if (url.includes('drive.google.com/thumbnail?id=')) {
              const match = url.match(/id=([a-zA-Z0-9_-]+)/)
              const fileId = match?.[1]
              if (fileId) {
                imagenPrincipal = `https://lh3.googleusercontent.com/d/${fileId}=w400?authuser=0`
              }
            } else {
              imagenPrincipal = url
            }
          }
        }

        return {
          ...producto,
          imagenPrincipal,
          precioDescuento: producto.precio_original && producto.precio_original > producto.precio ? producto.precio : null,
          porcentajeDescuento: producto.precio_original && producto.precio_original > producto.precio
            ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100)
            : producto.descuento || 0
        }
      }) || []

      setProductos(productosConImagenes)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={i < fullStars ? 'star-filled' : 'star-empty'}
        />
      )
    }
    
    return stars
  }

  if (cargando) {
    return (
      <section className="seccion-productos">
        <div className="productos-contenedor">
          <div className="productos-header">
            <h2 className="productos-titulo">Nuevos Productos</h2>
          </div>
          <div className="productos-loading">
            <div className="loading-spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="seccion-productos">
      <div className="productos-contenedor">
        {/* Header */}
        <div className="productos-header">
          <h2 className="productos-titulo">Nuevos Productos</h2>
          <Link to="/productos" className="productos-ver-todos">
            Ver todos los productos
          </Link>
        </div>

        {/* Grid de productos */}
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              {/* Imagen */}
              <div className="producto-imagen">
                <Link to={`/producto/${producto.slug}`}>
                  <img 
                    src={producto.imagenPrincipal} 
                    alt={producto.nombre}
                    loading="lazy"
                  />
                </Link>
                
                {/* Badges */}
                {producto.porcentajeDescuento > 0 && (
                  <span className="producto-descuento">
                    -{producto.porcentajeDescuento}%
                  </span>
                )}
                
                {producto.destacado && (
                  <span className="producto-nuevo">Destacado</span>
                )}

                {/* Acciones hover */}
                <div className="producto-acciones">
                  <button className="accion-btn" title="Agregar a favoritos">
                    <Heart size={16} />
                  </button>
                  <button className="accion-btn" title="Vista rápida">
                    <Eye size={16} />
                  </button>
                  <button className="accion-btn" title="Agregar al carrito">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>

              {/* Información */}
              <div className="producto-info">
                {/* Categoría */}
                {producto.categorias && (
                  <Link 
                    to={`/categoria/${producto.categorias.slug}`}
                    className="producto-categoria"
                  >
                    {producto.categorias.nombre}
                  </Link>
                )}

                {/* Nombre */}
                <Link to={`/producto/${producto.slug}`} className="producto-nombre">
                  {producto.nombre}
                </Link>

                {/* Rating */}
                <div className="producto-rating">
                  <div className="rating-stars">
                    {renderStars(producto.rating)}
                  </div>
                  <span className="rating-count">
                    ({producto.total_reviews || 0})
                  </span>
                </div>

                {/* Precio */}
                <div className="producto-precio">
                  {producto.precio_original && producto.precio_original > producto.precio ? (
                    <>
                      <span className="precio-descuento">
                        {formatearPrecio(producto.precio)}
                      </span>
                      <span className="precio-original">
                        {formatearPrecio(producto.precio_original)}
                      </span>
                    </>
                  ) : (
                    <span className="precio-actual">
                      {formatearPrecio(producto.precio)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SeccionProductos
