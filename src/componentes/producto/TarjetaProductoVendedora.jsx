import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye, Star, Clock, Zap, Flame, Users, Truck, Shield, CreditCard, Ticket } from 'lucide-react'
import { useFavoritos } from '../../contextos/FavoritosContext'
import { useCarrito } from '../../contextos/CarritoContext'
import BotonCarritoAnimado from '../ui/BotonCarritoAnimado'
import EtiquetaVendido from './EtiquetaVendido'
import './TarjetaProductoVendedora.css'

// 🚀 OPTIMIZACIÓN DE IMÁGENES ACTIVADA
import ImagenOptimizada from '../ImagenOptimizada'

/**
 * TarjetaProductoVendedora - Tarjeta ultra vendedora estilo Temu/Shein
 * 
 * Características:
 * - Gatillos mentales extremos
 * - Urgencia y escasez visual
 * - Animaciones que generan FOMO
 * - Precios tachados y descuentos llamativos
 * - Badges dinámicos y llamativos
 * - Hover effects profesionales
 * - Responsive design
 */

const TarjetaProductoVendedora = ({ 
  producto, 
  mostrarDescuento = true,
  mostrarUrgencia = true,
  mostrarPruebaSocial = true,
  mostrarBadges = true,
  tamaño = 'normal', // 'pequeño', 'normal', 'grande'
  animaciones = true,
  vistaLista = false // Nueva prop para vista de lista
}) => {
  const { esFavorito, alternarFavorito } = useFavoritos()
  const { agregarAlCarrito, alternarModal, mostrarNotificacion } = useCarrito()
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const [hover, setHover] = useState(false)
  const [imagenActual, setImagenActual] = useState(0)
  const [descripcionExpandida, setDescripcionExpandida] = useState(false)
  
  // Verificar si el producto es favorito
  const favorito = esFavorito(producto?.id)

  // Calcular descuento
  const descuento = producto?.precio_original && producto?.precio 
    ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100)
    : 0

  // Generar tiempo restante aleatorio para urgencia
  useEffect(() => {
    if (mostrarUrgencia) {
      const horas = Math.floor(Math.random() * 24) + 1
      const minutos = Math.floor(Math.random() * 60)
      setTiempoRestante({ horas, minutos })
    }
  }, [mostrarUrgencia])

  // Formatear precio
  const formatearPrecio = (precio) => {
    if (!precio && precio !== 0) return '$0'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio)
  }

  // Generar stock aleatorio para urgencia
  const stockUrgente = Math.floor(Math.random() * 5) + 1
  const ventasRecientes = Math.floor(Math.random() * 500) + 50
  const leerNumeroVentas = () => {
    const candidatos = [
      producto?.numero_de_ventas,
      producto?.ventas_totales,
      producto?.total_ventas,
      producto?.ventas,
      producto?.vendidos
    ]
    const valor = candidatos.find((v) => v !== undefined && v !== null)
    if (valor === undefined || valor === null) return null
    if (typeof valor === 'number') return valor
    if (typeof valor === 'string') {
      const limpio = valor.replace(/[^\d.-]/g, '')
      const num = Number(limpio)
      return Number.isNaN(num) ? null : num
    }
    return null
  }
  const numeroVentasReal = leerNumeroVentas()
  const formatearAbreviado = (n) => {
    const num = Number(n)
    if (!num || num < 0) return null
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`
    }
    if (num >= 10_000) {
      return `${Math.round(num / 1_000)}k`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}k`
    }
    return new Intl.NumberFormat('es-CO').format(num)
  }
  const ventasTexto = formatearAbreviado(numeroVentasReal ?? ventasRecientes)

  // Determinar badges estilo Temu
  const badges = []
  if (descuento > 50) badges.push({ texto: 'MEGA OFERTA', tipo: 'mega-oferta' })
  if (descuento > 30) badges.push({ texto: `${descuento}% OFF`, tipo: 'descuento' })
  if (stockUrgente <= 3) badges.push({ texto: 'SOLO QUEDAN 9', tipo: 'urgencia' })
  if ((numeroVentasReal ?? ventasRecientes) > 300) badges.push({ texto: 'Vendedor estrella', tipo: 'vendedor-estrella' })
  if (producto?.destacado) badges.push({ texto: 'Ahorro extra', tipo: 'ahorro-extra' })
  
  // Badges adicionales estilo Temu
  const badgesExtra = ['Cupón de la tienda', 'Más de $37.898 ahorro', 'Ahorro extra']
  if (Math.random() > 0.5) {
    badges.push({ texto: badgesExtra[Math.floor(Math.random() * badgesExtra.length)], tipo: 'cupon' })
  }

  const toggleFavorito = (e) => {
    e.preventDefault()
    e.stopPropagation()
    alternarFavorito(producto)
  }

  const manejarAgregarCarrito = async (producto, cantidad, variante) => {
    if (!producto) return
    
    try {
      console.log('🛒 Agregando producto al carrito:', producto)
      
      // Usar el producto completo tal como viene de la base de datos
      const resultado = await agregarAlCarrito(producto, cantidad || 1, variante)
      
      console.log('✅ Resultado de agregar al carrito:', resultado)
      
      if (resultado.success) {
        // Abrir el modal del carrito para mostrar confirmación
        alternarModal()
        return resultado
      } else {
        // Mostrar error al usuario
        mostrarNotificacion('error', 'Error al agregar', resultado.message || 'Error al agregar al carrito')
        throw new Error(resultado.message || 'Error al agregar al carrito')
      }
    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error)
      mostrarNotificacion('error', 'Error al agregar', 'Error al agregar al carrito. Por favor, inténtalo de nuevo.')
      throw error
    }
  }

  // Efecto de cambio de imagen en hover más suave
  useEffect(() => {
    if (!hover || !producto?.fotos_principales || producto.fotos_principales.length <= 1) return
    
    const interval = setInterval(() => {
      setImagenActual(prev => (prev + 1) % producto.fotos_principales.length)
    }, 1200) // Cambia cada 1.2s para ser más suave
    
    return () => clearInterval(interval)
  }, [hover, producto?.fotos_principales])

  // Resetear imagen cuando no hay hover
  useEffect(() => {
    if (!hover) {
      setImagenActual(0)
    }
  }, [hover])

  if (!producto) return null

  // Renderizado especial para vista de lista
  if (vistaLista) {
    return (
      <div className="tarjeta-producto-lista">
        {/* Imagen a la izquierda */}
        <div className="lista-imagen-container">
          <Link to={`/producto/${producto.slug}`}>
            {producto.fotos_principales?.[0] ? (
              <ImagenOptimizada 
                src={producto.fotos_principales[0]} 
                alt={producto.nombre}
                className="lista-imagen"
                tamaño="thumbnail"
                lazy={true}
                placeholder="blur"
              />
            ) : (
              <div className="imagen-placeholder">
                <ShoppingCart size={48} />
              </div>
            )}
          </Link>
          {descuento > 0 && (
            <div className="lista-descuento-badge">-{descuento}%</div>
          )}
        </div>

        {/* Contenido central */}
        <div className="lista-contenido">
          {/* Título */}
          <Link to={`/producto/${producto.slug}`} className="lista-titulo-link">
            <h3 className="lista-titulo">{producto.nombre}</h3>
          </Link>

          {/* Rating */}
          <div className="lista-rating">
            <div className="rating-estrellas">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < 4 ? '#ffd700' : 'none'} 
                  color={i < 4 ? '#ffd700' : '#ddd'} 
                />
              ))}
              <span className="rating-texto">4.8 (1 Review)</span>
            </div>
          </div>

          {/* Descripción (soporta JSON { titulo, contenido } y string) */}
          <div className="lista-descripcion">
            {(() => {
              const esObjeto = producto?.descripcion && typeof producto.descripcion === 'object'
              const textoDescripcion = esObjeto
                ? (producto.descripcion.contenido || '')
                : (typeof producto?.descripcion === 'string' ? producto.descripcion : '')

              const textoFallback = 'Descubre sus características clave y calidad premium.'
              const textoFinal = textoDescripcion || textoFallback

              return (
                <>
                  <p className={descripcionExpandida ? 'expandida' : 'truncada'}>
                    {textoFinal}
                  </p>
                  {textoDescripcion && textoDescripcion.length > 150 && (
                    <button 
                      className="btn-show-more"
                      onClick={() => setDescripcionExpandida(!descripcionExpandida)}
                    >
                      {descripcionExpandida ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </>
              )
            })()}
          </div>

          {/* Características (si las hay) */}
          {producto.ventajas && producto.ventajas.length > 0 && (
            <ul className="lista-caracteristicas">
              {producto.ventajas.slice(0, 3).map((ventaja, index) => (
                <li key={index}>{ventaja}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Sección derecha con precio y botones */}
        <div className="lista-acciones">
          <div className="lista-precio-container">
            <div className="lista-precio-actual">
              {formatearPrecio(producto.precio)}
            </div>
            {producto.precio_original && producto.precio_original > producto.precio && (
              <div className="lista-precio-original">
                {formatearPrecio(producto.precio_original)}
              </div>
            )}
          </div>

          <div className="lista-botones">
            <Link 
              to={`/producto/${producto.slug}`}
              className="btn-quick-view"
            >
              Quick View
            </Link>
            <button 
              className="btn-add-cart"
              onClick={agregarAlCarrito}
            >
              Add to cart
            </button>
          </div>

          {/* Iconos de comparar y wishlist */}
          <div className="lista-iconos">
            <button className="icono-btn" title="Compare">
              <Eye size={18} />
              <span>Compare</span>
            </button>
            <button 
              className={`icono-btn ${favorito ? 'activo' : ''}`}
              onClick={toggleFavorito}
              title="Wishlist"
            >
              <Heart 
                size={18} 
                fill={favorito ? '#ff4757' : 'none'} 
                color={favorito ? '#ff4757' : '#6c757d'} 
              />
              <span>Wishlist</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizado normal para vista de grid
  return (
    <div 
      className={`tarjeta-producto-vendedora ${tamaño} ${animaciones ? 'con-animaciones' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Badges superiores */}
      {mostrarBadges && badges.length > 0 && (
        <div className="badges-container">
          {badges.slice(0, 2).map((badge, index) => (
            <div key={index} className={`badge badge-${badge.tipo}`}>
              {badge.texto}
            </div>
          ))}
        </div>
      )}

      {/* Imagen del producto */}
      <div className="imagen-container">
        {/* Etiqueta VENDIDO */}
        {producto.estado === 'vendido' && (
          <EtiquetaVendido 
            tamaño={tamaño === 'pequeño' ? 'pequeño' : 'normal'}
            posicion="superior-derecha"
            mostrarIcono={true}
          />
        )}
        
        <Link to={`/producto/${producto.slug}`} className="imagen-link">
          {producto.fotos_principales?.[imagenActual] ? (
            <ImagenOptimizada 
              src={producto.fotos_principales[imagenActual]} 
              alt={producto.nombre}
              className="imagen-producto"
              tamaño="mediano"
              lazy={true}
              placeholder="blur"
              mostrarInfo={false}
            />
          ) : (
            <div className="imagen-placeholder">
              <ShoppingCart size={48} />
              <span>Sin imagen</span>
            </div>
          )}
          
          {/* Overlay con acciones */}
          <div className={`imagen-overlay ${hover ? 'visible' : ''}`}>
            <button 
              className="accion-btn favorito"
              onClick={toggleFavorito}
              title={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart 
                size={20} 
                fill={favorito ? '#ff4757' : 'none'} 
                color={favorito ? '#ff4757' : '#fff'} 
              />
            </button>
            
            <Link 
              to={`/producto/${producto.slug}`}
              className="accion-btn ver"
              title="Ver producto"
            >
              <Eye size={20} />
            </Link>
            
            <BotonCarritoAnimado
              producto={producto}
              cantidad={1}
              className="accion-btn carrito"
              onAgregar={manejarAgregarCarrito}
              onError={(error) => console.error('Error en overlay:', error)}
            >
              <ShoppingCart size={20} />
            </BotonCarritoAnimado>
          </div>
        </Link>

        {/* Indicador de descuento grande */}
        {mostrarDescuento && descuento > 0 && (
          <div className="descuento-circular">
            <span className="descuento-porcentaje">-{descuento}%</span>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="info-container">
        {/* Título del producto */}
        <Link to={`/producto/${producto.slug}`} className="titulo-link">
          <h3 className="producto-titulo">
            {producto.nombre}
          </h3>
        </Link>

        {/* Rating y ventas */}
        {mostrarPruebaSocial && (
          <div className="rating-ventas">
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < 4 ? '#ffd700' : 'none'} 
                  color={i < 4 ? '#ffd700' : '#ddd'} 
                />
              ))}
              <span className="rating-numero">4.8</span>
            </div>
            <div className="ventas-recientes">
              <Users size={12} />
              <span>{ventasTexto} ventas</span>
            </div>
          </div>
        )}

        {/* Precios */}
        <div className="precios-container">
          <div className="precio-actual">
            {formatearPrecio(producto.precio)}
          </div>
          {producto.precio_original && producto.precio_original > producto.precio && (
            <div className="precio-original">
              {formatearPrecio(producto.precio_original)}
            </div>
          )}
        </div>

        {/* Urgencia de tiempo */}
        {mostrarUrgencia && tiempoRestante && (
          <div className="urgencia-tiempo">
            <Clock size={12} />
            <span>¡Oferta termina en {tiempoRestante.horas}h {tiempoRestante.minutos}m!</span>
          </div>
        )}

        {/* Stock urgente */}
        {stockUrgente <= 3 && (
          <div className="stock-urgente">
            <Zap size={12} />
            <span>¡Solo quedan {stockUrgente} unidades!</span>
          </div>
        )}

        {/* Cupón adicional estilo Temu */}
        <div className="cupon-tienda">
          <Ticket size={12} className="cupon-icono" />
          <span>Cupón de la tienda: Más de $37.898 ahorro</span>
        </div>

        {/* Beneficios rápidos */}
        <div className="beneficios-rapidos">
          <div className="beneficio">
            <Truck size={14} className="beneficio-icono" />
            <span>Envío gratis</span>
          </div>
          <div className="beneficio">
            <Shield size={14} className="beneficio-icono" />
            <span>Garantía</span>
          </div>
          <div className="beneficio">
            <CreditCard size={14} className="beneficio-icono" />
            <span>Pago seguro</span>
          </div>
        </div>

        {/* Botón de compra */}
        <div className="acciones-principales">
          <BotonCarritoAnimado
            producto={producto}
            cantidad={1}
            className="btn-comprar"
            onAgregar={manejarAgregarCarrito}
            onError={(error) => console.error('Error en botón principal:', error)}
          >
            ¡COMPRAR AHORA!
          </BotonCarritoAnimado>
        </div>

        {/* Indicador de popularidad */}
        {ventasRecientes > 200 && (
          <div className="indicador-popularidad">
            <Flame size={12} />
            <span>¡Producto viral!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TarjetaProductoVendedora
