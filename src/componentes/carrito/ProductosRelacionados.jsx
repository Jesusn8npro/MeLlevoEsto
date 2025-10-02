import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Star, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useCarrito } from '../../contextos/CarritoContext'
import BotonCarritoAnimado from '../ui/BotonCarritoAnimado'
import './ProductosRelacionados.css'

const ProductosRelacionados = ({ categoriaId, onCerrarModal }) => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [indiceActual, setIndiceActual] = useState(0)
  const { agregarItem, alternarModal, mostrarNotificacion } = useCarrito()

  // Formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  // Cargar productos relacionados
  useEffect(() => {
    const cargarProductosRelacionados = async () => {
      try {
        setCargando(true)
        
        // Simulación de carga de productos relacionados
        // En una implementación real, esto vendría de Supabase
        const productosSimulados = [
          {
            id: 'prod-rel-1',
            nombre: 'Producto Relacionado 1',
            precio: 25000,
            precio_original: 35000,
            imagen_url: '/placeholder-product.jpg',
            rating: 4.5,
            total_resenas: 128,
            categoria_id: categoriaId,
            stock: 15,
            envio_gratis: true
          },
          {
            id: 'prod-rel-2',
            nombre: 'Producto Relacionado 2',
            precio: 18000,
            imagen_url: '/placeholder-product.jpg',
            rating: 4.2,
            total_resenas: 89,
            categoria_id: categoriaId,
            stock: 8,
            envio_gratis: false
          },
          {
            id: 'prod-rel-3',
            nombre: 'Producto Relacionado 3',
            precio: 42000,
            precio_original: 55000,
            imagen_url: '/placeholder-product.jpg',
            rating: 4.8,
            total_resenas: 256,
            categoria_id: categoriaId,
            stock: 3,
            envio_gratis: true
          },
          {
            id: 'prod-rel-4',
            nombre: 'Producto Relacionado 4',
            precio: 32000,
            imagen_url: '/placeholder-product.jpg',
            rating: 4.3,
            total_resenas: 167,
            categoria_id: categoriaId,
            stock: 12,
            envio_gratis: true
          }
        ]

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setProductos(productosSimulados)
      } catch (error) {
        console.error('Error al cargar productos relacionados:', error)
      } finally {
        setCargando(false)
      }
    }

    if (categoriaId) {
      cargarProductosRelacionados()
    }
  }, [categoriaId])

  // Manejar agregar al carrito
  const manejarAgregarCarrito = async (producto, cantidad, variante) => {
    try {
      console.log('🛒 Agregando producto relacionado al carrito:', producto)
      
      // Usar el producto completo tal como viene de la base de datos
      const resultado = await agregarItem(producto, cantidad || 1, variante)
      
      console.log('✅ Resultado de agregar producto relacionado:', resultado)
      
      if (resultado.success) {
        // Abrir modal del carrito para confirmar
        alternarModal()
        return resultado
      } else {
        // Mostrar error al usuario
        mostrarNotificacion('error', 'Error al agregar', resultado.message || 'Error al agregar al carrito')
        throw new Error(resultado.message || 'Error al agregar al carrito')
      }
    } catch (error) {
      console.error('❌ Error al agregar producto relacionado:', error)
      mostrarNotificacion('error', 'Error al agregar', 'Error al agregar al carrito. Por favor, inténtalo de nuevo.')
      throw error
    }
  }

  // Navegación del carrusel
  const irAnterior = () => {
    setIndiceActual(prev => 
      prev === 0 ? Math.max(0, productos.length - 2) : prev - 1
    )
  }

  const irSiguiente = () => {
    setIndiceActual(prev => 
      prev >= productos.length - 2 ? 0 : prev + 1
    )
  }

  if (cargando) {
    return (
      <div className="productos-relacionados">
        <div className="productos-relacionados-header">
          <Sparkles className="icono-sparkles" />
          <h3>Productos que te pueden interesar</h3>
        </div>
        
        <div className="productos-relacionados-cargando">
          <div className="skeleton-producto"></div>
          <div className="skeleton-producto"></div>
        </div>
      </div>
    )
  }

  if (!productos.length) {
    return null
  }

  return (
    <div className="productos-relacionados">
      <div className="productos-relacionados-header">
        <Sparkles className="icono-sparkles" />
        <h3>Productos que te pueden interesar</h3>
        <span className="productos-count">
          {productos.length} productos
        </span>
      </div>

      <div className="productos-carrusel-container">
        {productos.length > 2 && (
          <button 
            className="carrusel-boton anterior"
            onClick={irAnterior}
            disabled={indiceActual === 0}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="productos-carrusel">
          <div 
            className="productos-lista"
            style={{ 
              transform: `translateX(-${indiceActual * 50}%)`,
              transition: 'transform 0.3s ease'
            }}
          >
            {productos.map((producto) => {
              const tieneDescuento = producto.precio_original && 
                producto.precio_original > producto.precio
              const porcentajeDescuento = tieneDescuento ? 
                Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100) : 0

              return (
                <div key={producto.id} className="producto-relacionado">
                  <div className="producto-imagen-container">
                    <Link to={`/producto/${producto.id}`} onClick={onCerrarModal}>
                      <img 
                        src={producto.imagen_url} 
                        alt={producto.nombre}
                        className="producto-imagen"
                        loading="lazy"
                      />
                    </Link>
                    
                    {tieneDescuento && (
                      <div className="producto-descuento">
                        -{porcentajeDescuento}%
                      </div>
                    )}

                    {producto.stock < 5 && (
                      <div className="producto-stock-bajo">
                        ¡Solo {producto.stock}!
                      </div>
                    )}

                    <BotonCarritoAnimado
                      producto={producto}
                      cantidad={1}
                      className="boton-agregar-rapido"
                      onAgregar={manejarAgregarCarrito}
                      onError={(error) => console.error('Error en botón rápido:', error)}
                    >
                      <Plus size={14} />
                    </BotonCarritoAnimado>
                  </div>

                  <div className="producto-info">
                    <Link 
                      to={`/producto/${producto.id}`}
                      className="producto-nombre"
                      onClick={onCerrarModal}
                    >
                      {producto.nombre}
                    </Link>

                    {producto.rating && (
                      <div className="producto-rating">
                        <div className="estrellas">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              className={i < Math.floor(producto.rating) ? 'estrella-llena' : 'estrella-vacia'}
                            />
                          ))}
                        </div>
                        <span className="rating-numero">
                          {producto.rating} ({producto.total_resenas})
                        </span>
                      </div>
                    )}

                    <div className="producto-precios">
                      {tieneDescuento && (
                        <span className="precio-original">
                          {formatearPrecio(producto.precio_original)}
                        </span>
                      )}
                      <span className="precio-actual">
                        {formatearPrecio(producto.precio)}
                      </span>
                    </div>

                    <div className="producto-beneficios">
                      {producto.envio_gratis && (
                        <span className="beneficio envio-gratis">
                          <ShoppingCart size={10} />
                          Envío gratis
                        </span>
                      )}
                    </div>

                    <BotonCarritoAnimado
                      producto={producto}
                      cantidad={1}
                      className="boton-agregar-completo"
                      onAgregar={manejarAgregarCarrito}
                      onError={(error) => console.error('Error en botón completo:', error)}
                    >
                      <Plus size={14} />
                      Agregar
                    </BotonCarritoAnimado>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {productos.length > 2 && (
          <button 
            className="carrusel-boton siguiente"
            onClick={irSiguiente}
            disabled={indiceActual >= productos.length - 2}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="productos-relacionados-footer">
        <Link 
          to="/tienda" 
          className="ver-mas-productos"
          onClick={onCerrarModal}
        >
          Ver más productos
        </Link>
      </div>
    </div>
  )
}

export default ProductosRelacionados