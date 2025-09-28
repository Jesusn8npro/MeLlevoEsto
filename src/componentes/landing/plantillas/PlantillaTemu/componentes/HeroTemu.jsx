import React, { useEffect, useRef, useState, useMemo } from 'react'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2,
  Package,
  Truck,
  Shield,
  CheckCircle,
  Clock,
  Users,
  Award,
  Zap,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
// Eliminado ImagenConFallback - usaremos <img> directo
import './HeroTemu.css'

// Función local para formatear precios en pesos colombianos
const formatearPrecioCOP = (precio) => {
  if (!precio && precio !== 0) return '$0'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio)
}

/* ============== COMPONENTE STICKY GALERÍA LIMPIO ============== */
function GaleriaSticky({
  distanciaTop = 20,
  className = "",
  children,
  atributoContenedor = "data-contenedor-hero-temu"
}) {
  const ref = useRef(null)
  const [estilos, setEstilos] = useState({})
  const [modo, setModo] = useState("estatico") // estatico | fijo | abajo

  const alturaHeader = () => {
    const valor = getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "0px"
    return parseInt(valor, 10) || 0
  }

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return

    // Columna izquierda (padre directo)
    const columnaIzquierda = elemento.parentElement

    // Contenedor raíz = el ancestro más cercano con [data-contenedor-hero-temu]
    let contenedorRaiz = columnaIzquierda?.closest(`[${atributoContenedor}]`)
    if (!contenedorRaiz) contenedorRaiz = columnaIzquierda?.parentElement || document.body

    // Asegurar contexto para el modo "abajo"
    const estiloContenedor = getComputedStyle(contenedorRaiz)
    if (estiloContenedor.position === "static") contenedorRaiz.style.position = "relative"

    const medir = () => {
      const topSticky = alturaHeader() + distanciaTop

      // Geometría del contenedor raíz
      const rectContenedor = contenedorRaiz.getBoundingClientRect()
      const topContenedor = window.scrollY + rectContenedor.top
      const bottomContenedor = window.scrollY + rectContenedor.bottom

      // Geometría de la columna izquierda
      const rectIzquierda = columnaIzquierda.getBoundingClientRect()

      // Altura real del elemento sticky
      const alturaElemento = elemento.offsetHeight

      // Posición actual que debería ocupar
      const posicionActual = window.scrollY + topSticky

      if (posicionActual >= topContenedor && posicionActual <= bottomContenedor - alturaElemento) {
        // Fijo mientras no pase el fondo del contenedor
        setModo("fijo")
        setEstilos({
          position: "fixed",
          top: `${topSticky}px`,
          left: `${rectIzquierda.left + window.scrollX}px`,
          width: `${rectIzquierda.width}px`,
          boxSizing: "border-box",
          zIndex: 1000
        })
      } else if (posicionActual > bottomContenedor - alturaElemento) {
        // Pegado al fondo del contenedor
        setModo("abajo")
        const paddingTop = parseFloat(getComputedStyle(contenedorRaiz).paddingTop) || 0
        setEstilos({
          position: "absolute",
          top: `${contenedorRaiz.scrollHeight - elemento.offsetHeight - paddingTop}px`,
          left: "0",
          right: "0",
          width: "100%",
          boxSizing: "border-box"
        })
      } else {
        // Aún no alcanzó el umbral
        setModo("estatico")
        setEstilos({})
      }
    }

    // Medir en arranque y cambios
    medir()
    const alHacerScroll = () => medir()
    const alRedimensionar = () => medir()

    window.addEventListener("scroll", alHacerScroll, { passive: true })
    window.addEventListener("resize", alRedimensionar)

    const observadorRedimension = new ResizeObserver(medir)
    observadorRedimension.observe(elemento)
    observadorRedimension.observe(contenedorRaiz)
    observadorRedimension.observe(columnaIzquierda)

    return () => {
      window.removeEventListener("scroll", alHacerScroll)
      window.removeEventListener("resize", alRedimensionar)
      observadorRedimension.disconnect()
    }
  }, [distanciaTop, atributoContenedor])

  return (
    <div ref={ref} className={className} style={estilos} data-modo-hero-temu={modo}>
      {children}
    </div>
  )
}

/* ============== INDICADOR MODO STICKY ============== */
function IndicadorModoSticky() {
  const [modo, setModo] = useState("ESTATICO")
  
  useEffect(() => {
    const verificar = () => {
      const elemento = document.querySelector("[data-modo-hero-temu]")
      if (elemento) {
        setModo((elemento.getAttribute("data-modo-hero-temu") || "estatico").toUpperCase())
      }
    }
    
    const intervalo = setInterval(verificar, 120)
    return () => clearInterval(intervalo)
  }, [])
  
  return (
    <div className="hero-temu-indicador-modo">
      Sticky: {modo}
    </div>
  )
}

/* ============== COMPONENTE PRINCIPAL HERO TEMU ============== */
const HeroTemu = ({ producto, config, reviews, notificaciones }) => {
  // Estados del componente
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null)
  const [enFavoritos, setEnFavoritos] = useState(false)
  const [tiempoRestante, setTiempoRestante] = useState('04:15:08:52')
  const [descripcionExpandida, setDescripcionExpandida] = useState(false)
  const [popupGaleriaAbierto, setPopupGaleriaAbierto] = useState(false)
  const [mostrarFlechas, setMostrarFlechas] = useState(false)

  // Configurar altura del header
  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", "0px")
  }, [])

  // Contador de tiempo dinámico
  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date()
      const horas = String(4 - (ahora.getHours() % 5)).padStart(2, '0')
      const minutos = String(59 - ahora.getMinutes()).padStart(2, '0')
      const segundos = String(59 - ahora.getSeconds()).padStart(2, '0')
      setTiempoRestante(`${horas}:${minutos}:${segundos}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Procesar imágenes del producto con useMemo para evitar re-renders
  const imagenesFinales = useMemo(() => {
    const imagenes = []
    
    // Agregar imágenes desde la tabla producto_imagenes si existen
    if (producto?.imagenes) {
      const camposImagenes = [
        'imagen_principal',
        'imagen_secundaria_1', 
        'imagen_secundaria_2',
        'imagen_secundaria_3',
        'imagen_secundaria_4'
      ]
      
      camposImagenes.forEach(campo => {
        const imagen = producto.imagenes[campo]
        if (imagen && imagen.trim() !== '') {
          imagenes.push(imagen.trim())
        }
      })
    }
    
    // Si no hay imágenes válidas, usar placeholders
    return imagenes.length > 0 ? imagenes : [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
    ]
  }, [producto?.imagenes])

  // Calcular descuento con useMemo
  const descuento = useMemo(() => {
    return producto?.precio_original && producto?.precio 
      ? Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100)
      : 0
  }, [producto?.precio_original, producto?.precio])

  // Generar variantes basadas en datos reales con useMemo
  const variantes = useMemo(() => {
    const vars = []
    if (producto?.color) {
      vars.push({ 
        id: 'color', 
        nombre: producto.color, 
        tipo: 'Color'
      })
    }
    if (producto?.material) {
      vars.push({ 
        id: 'material', 
        nombre: producto.material, 
        tipo: 'Material'
      })
    }
    if (producto?.talla) {
      vars.push({ 
        id: 'talla', 
        nombre: producto.talla, 
        tipo: 'Talla'
      })
    }
    return vars
  }, [producto?.color, producto?.material, producto?.talla])

  // Manejadores de eventos
  const manejarCambioImagen = (index) => {
    setImagenSeleccionada(index)
  }

  const manejarImagenAnterior = () => {
    setImagenSeleccionada(prev => 
      prev === 0 ? imagenesFinales.length - 1 : prev - 1
    )
  }

  const manejarImagenSiguiente = () => {
    setImagenSeleccionada(prev => 
      prev === imagenesFinales.length - 1 ? 0 : prev + 1
    )
  }

  const abrirPopupGaleria = () => {
    setPopupGaleriaAbierto(true)
  }

  const cerrarPopupGaleria = () => {
    setPopupGaleriaAbierto(false)
  }

  const manejarCambioCantidad = (operacion) => {
    if (operacion === 'incrementar') {
      setCantidad(prev => Math.min(prev + 1, producto?.stock || 99))
    } else {
      setCantidad(prev => Math.max(prev - 1, 1))
    }
  }

  const manejarAgregarCarrito = () => {
    // Lógica del carrito
    // Aquí iría la lógica real del carrito
  }

  const manejarComprarAhora = () => {
    // Lógica de compra directa
    // Aquí iría la lógica real de compra
  }

  // Función para truncar texto a 120 palabras
  const truncarTexto = (texto, limitePalabras = 120) => {
    if (!texto) return ''
    const palabras = texto.split(' ')
    if (palabras.length <= limitePalabras) return texto
    return palabras.slice(0, limitePalabras).join(' ') + '...'
  }

  if (!producto) {
    return (
      <div className="hero-temu-producto-no-encontrado">
        <Package size={64} color="#6c757d" />
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no está disponible</p>
      </div>
    )
  }

  return (
    <div className="hero-temu-contenedor">
      {/* DEBUG eliminado */}

      {/* Indicador del modo sticky */}
      <IndicadorModoSticky />

      {/* CONTENEDOR PRINCIPAL CON STICKY */}
      <div className="hero-temu-contenido-principal" data-contenedor-hero-temu>
        
        {/* COLUMNA IZQUIERDA - GALERÍA STICKY */}
        <div className="hero-temu-columna-izquierda">
          <GaleriaSticky distanciaTop={20} className="hero-temu-galeria-sticky">
            
            {/* Contenedor de galería con miniaturas a la izquierda */}
            <div className="hero-temu-contenedor-galeria">
              
              {/* Miniaturas verticales a la izquierda */}
              {imagenesFinales.length > 1 && (
                <div className="hero-temu-miniaturas-verticales">
                  {imagenesFinales.map((imagen, index) => (
                      <button
                        key={index}
                        className={`hero-temu-miniatura-vertical ${index === imagenSeleccionada ? 'activa' : ''}`}
                        onMouseEnter={() => manejarCambioImagen(index)}
                        onClick={() => manejarCambioImagen(index)}
                      >
                        <img
                          src={imagen}
                          alt={`Vista ${index + 1}`}
                          onError={() => {
                            // Error cargando miniatura
                          }}
                          onLoad={() => {
                            // Miniatura cargada exitosamente
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </button>
                  ))}
                </div>
              )}

              {/* Imagen Principal */}
              <div 
                className="hero-temu-imagen-principal"
                onMouseEnter={() => setMostrarFlechas(true)}
                onMouseLeave={() => setMostrarFlechas(false)}
                onClick={abrirPopupGaleria}
              >
                <img
                  src={imagenesFinales[imagenSeleccionada]}
                  alt={producto?.nombre || 'Producto'}
                  className="hero-temu-imagen-principal-img"
                  onError={() => {
                    // Error cargando imagen principal
                  }}
                  onLoad={() => {
                    // Imagen principal cargada
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Badge de descuento */}
                {descuento > 0 && (
                  <div className="hero-temu-badge-descuento">
                    -{descuento}%
                  </div>
                )}
                
                {/* Botón de favoritos */}
                <button 
                  className={`hero-temu-boton-favoritos ${enFavoritos ? 'activo' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEnFavoritos(!enFavoritos)
                  }}
                >
                  <Heart size={20} fill={enFavoritos ? '#ff4757' : 'none'} />
                </button>

                {/* Flechas de navegación en hover */}
                {mostrarFlechas && imagenesFinales.length > 1 && (
                  <>
                    <button 
                      className="hero-temu-flecha-navegacion hero-temu-flecha-izquierda"
                      onClick={(e) => {
                        e.stopPropagation()
                        manejarImagenAnterior()
                      }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      className="hero-temu-flecha-navegacion hero-temu-flecha-derecha"
                      onClick={(e) => {
                        e.stopPropagation()
                        manejarImagenSiguiente()
                      }}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
          </GaleriaSticky>
        </div>

        {/* COLUMNA DERECHA - CONTENIDO SCROLLABLE */}
        <div className="hero-temu-columna-derecha">
          
          {/* BANNER MEGA OFERTA - COPIA EXACTA DE TEMU */}
          <div className="hero-temu-banner-mega-oferta">
            <div className="hero-temu-etiqueta-mega">
              MEGA<br/>OFERTA
            </div>
            <div className="hero-temu-beneficios-container">
              <span className="hero-temu-beneficio-texto">
                <span className="hero-temu-check-verde">✓</span> Envío gratis
              </span>
              <span className="hero-temu-beneficio-texto">
                <span className="hero-temu-check-verde">✓</span> $4.000 de crédito por retraso
              </span>
            </div>
          </div>
          
          {/* Título del producto mejorado */}
          <h1 className="hero-temu-titulo-producto">
            {producto?.nombre || 'Bolso Morral al vacío viral Amazon'}
          </h1>
          
          {/* Características clave del producto */}
          <div className="hero-temu-caracteristicas-clave">
            <div className="hero-temu-caracteristicas-lista">
              {/* Mostrar ganchos del producto si existen */}
              {producto?.ganchos && producto.ganchos.length > 0 ? (
                producto.ganchos.slice(0, 4).map((gancho, index) => (
                  <div key={index} className="hero-temu-caracteristica-item">
                    <span className="hero-temu-icono-caracteristica">
                      {index === 0 ? '⚡' : index === 1 ? '🛡️' : index === 2 ? '🔒' : '🚚'}
                    </span>
                    <span>{gancho.replace(/^[🔥💎⭐🚨✅🎯💰🇨🇴]\s*/, '')}</span>
                  </div>
                ))
              ) : (
                // Fallback por defecto si no hay ganchos
                <>
                  <div className="hero-temu-caracteristica-item">
                    <span className="hero-temu-icono-caracteristica">⚡</span>
                    <span>Calidad premium garantizada</span>
                  </div>
                  <div className="hero-temu-caracteristica-item">
                    <span className="hero-temu-icono-caracteristica">🛡️</span>
                    <span>Garantía total incluida</span>
                  </div>
                  <div className="hero-temu-caracteristica-item">
                    <span className="hero-temu-icono-caracteristica">🔒</span>
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="hero-temu-caracteristica-item">
                    <span className="hero-temu-icono-caracteristica">🚚</span>
                    <span>Envío gratis a toda Colombia</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sección de valoración mejorada */}
          <div className="hero-temu-seccion-valoracion">
            <div className="hero-temu-valoracion-principal">
              <div className="hero-temu-estrellas-grandes">
                <span className="hero-temu-estrella">⭐</span>
                <span className="hero-temu-estrella">⭐</span>
                <span className="hero-temu-estrella">⭐</span>
                <span className="hero-temu-estrella">⭐</span>
                <span className="hero-temu-estrella">⭐</span>
              </div>
              <span className="hero-temu-rating-numero">
                {producto?.testimonios?.estadisticas?.satisfaccion || 4.9}/5.0
              </span>
              <span className="hero-temu-total-resenas">
                | +{producto?.testimonios?.estadisticas?.totalClientes?.toLocaleString() || '2.547'} Clientes felices
              </span>
            </div>
          </div>

          {/* Nueva llegada y categoría */}
          <div className="hero-temu-seccion-nueva-llegada">
            <span className="hero-temu-badge-nueva-llegada">#1 NUEVA LLEGADA</span>
            <div className="hero-temu-info-ventas">
              <span>7.8K+ ventas | Vendido por 😊</span>
              <span className="hero-temu-vendedor-estrella">⭐ Vendedor estrella</span>
            </div>
          </div>
          
          {/* Sección de precios súper vendedora */}
          <div className="hero-temu-seccion-precios-vendedora">
            <div className="hero-temu-precio-principal-container">
              <span className="hero-temu-precio-actual-grande">
                {formatearPrecioCOP(producto?.precio || 8498)}
              </span>
              <span className="hero-temu-precio-original-tachado">
                {formatearPrecioCOP(producto?.precio_original || 22480)}
              </span>
              <span className="hero-temu-badge-descuento-grande">
                -62% DE DESCUENTO tiempo limitado
              </span>
            </div>
            
            <div className="hero-temu-opciones-pago">
              <span>36 × $236</span>
              <span>💳 💳 💳 ❓</span>
            </div>
          </div>

          {/* Oferta relámpago mejorada */}
          <div className="hero-temu-oferta-relampago">
            <div className="hero-temu-oferta-header">
              <span className="hero-temu-oferta-titulo">⚡ Oferta relámpago</span>
              <div className="hero-temu-contador-tiempo">
                <span className="hero-temu-icono-reloj">⏰</span>
                <span>Termina en</span>
                <span className="hero-temu-tiempo-numero">{tiempoRestante}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción principales */}
          <div className="hero-temu-botones-accion">
            <button 
              onClick={manejarAgregarCarrito}
              className="hero-temu-boton-carrito"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>
            
            <button 
              onClick={() => console.log('Pago contra entrega')}
              className="hero-temu-boton-contra-entrega"
            >
              <Truck size={18} />
              Contra entrega
            </button>
            
            <button 
              onClick={manejarComprarAhora}
              className="hero-temu-boton-pagar-plataforma"
            >
              <Zap size={18} />
              Pagar plataforma
            </button>
          </div>

          {/* Imagen de métodos de pago */}
          <div className="hero-temu-metodos-pago">
            <img 
              src="/images/Imagen para los pagos.jpg" 
              alt="Métodos de pago disponibles"
              className="hero-temu-imagen-pagos"
            />
          </div>

          {/* Descripción expandible */}
          {producto?.descripcion && (
            <div className="hero-temu-seccion-descripcion">
              <h3 className="hero-temu-titulo-descripcion">
                📝 Descripción del Producto
              </h3>
              <div className="hero-temu-texto-descripcion">
                {descripcionExpandida 
                  ? producto.descripcion 
                  : truncarTexto(producto.descripcion, 120)
                }
              </div>
              {producto.descripcion.split(' ').length > 120 && (
                <button 
                  className="hero-temu-boton-expandir"
                  onClick={() => setDescripcionExpandida(!descripcionExpandida)}
                >
                  <span className={`hero-temu-icono-expandir ${descripcionExpandida ? 'expandido' : ''}`}>
                    🔽
                  </span>
                  {descripcionExpandida ? 'Ver menos' : 'Ver descripción completa'}
                </button>
              )}
            </div>
          )}

          {/* Especificaciones técnicas */}
          <div className="hero-temu-especificaciones-tecnicas">
            <h3 className="hero-temu-titulo-especificaciones">
              🔧 Especificaciones Técnicas
            </h3>
            <div className="hero-temu-grid-especificaciones">
              {producto?.marca && <div><strong>Marca:</strong> {producto.marca}</div>}
              {producto?.modelo && <div><strong>Modelo:</strong> {producto.modelo}</div>}
              {producto?.material && <div><strong>Material:</strong> {producto.material}</div>}
              {producto?.peso && <div><strong>Peso:</strong> {producto.peso} kg</div>}
              {producto?.color && <div><strong>Color:</strong> {producto.color}</div>}
              {producto?.talla && <div><strong>Talla:</strong> {producto.talla}</div>}
              {producto?.garantia_meses && <div><strong>Garantía:</strong> {producto.garantia_meses} meses</div>}
              {producto?.origen_pais && <div><strong>Origen:</strong> {producto.origen_pais}</div>}
            </div>
          </div>

          {/* Por qué elegir este producto */}
          <div className="hero-temu-seccion-porque-elegir">
            <h3 className="hero-temu-titulo-porque-elegir">
              ⭐ Por qué elegir este producto
            </h3>
            <div className="hero-temu-beneficios-grid">
              <div className="hero-temu-beneficio-item">
                <span className="hero-temu-icono-beneficio">🚀</span>
                <div className="hero-temu-contenido-beneficio">
                  <h4>Alto Rendimiento</h4>
                  <p>Motor potente de 200cc que garantiza un rendimiento excepcional en cualquier terreno</p>
                </div>
              </div>
              
              <div className="hero-temu-beneficio-item">
                <span className="hero-temu-icono-beneficio">🛡️</span>
                <div className="hero-temu-contenido-beneficio">
                  <h4>Máxima Seguridad</h4>
                  <p>Sistema de frenos ABS, tablero digital y luces LED para tu seguridad total</p>
                </div>
              </div>
              
              <div className="hero-temu-beneficio-item">
                <span className="hero-temu-icono-beneficio">🔒</span>
                <div className="hero-temu-contenido-beneficio">
                  <h4>Garantía Extendida</h4>
                  <p>2 años de garantía completa para tu tranquilidad y confianza</p>
                </div>
              </div>
              
              <div className="hero-temu-beneficio-item">
                <span className="hero-temu-icono-beneficio">🚚</span>
                <div className="hero-temu-contenido-beneficio">
                  <h4>Envío Gratis</h4>
                  <p>Entrega gratuita a toda Colombia sin costo adicional</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* POPUP DE GALERÍA ESTILO TEMU */}
      {popupGaleriaAbierto && (
        <div className="hero-temu-popup-galeria" onClick={cerrarPopupGaleria}>
          <div className="hero-temu-popup-contenido" onClick={(e) => e.stopPropagation()}>
            
            {/* Header del popup */}
            <div className="hero-temu-popup-header">
              <span className="hero-temu-popup-contador">
                {imagenSeleccionada + 1}/{imagenesFinales.length}
              </span>
              <button 
                className="hero-temu-popup-cerrar"
                onClick={cerrarPopupGaleria}
              >
                <X size={24} />
              </button>
            </div>

            {/* Imagen principal del popup */}
            <div className="hero-temu-popup-imagen-container">
              <img 
                src={imagenesFinales[imagenSeleccionada]} 
                alt={producto?.nombre || 'Producto'}
                className="hero-temu-popup-imagen"
              />
              
              {/* Flechas de navegación */}
              {imagenesFinales.length > 1 && (
                <>
                  <button 
                    className="hero-temu-popup-flecha hero-temu-popup-flecha-izquierda"
                    onClick={manejarImagenAnterior}
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    className="hero-temu-popup-flecha hero-temu-popup-flecha-derecha"
                    onClick={manejarImagenSiguiente}
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            {/* Botón de añadir al carrito en popup */}
            <div className="hero-temu-popup-acciones">
              <button 
                className="hero-temu-popup-boton-carrito"
                onClick={() => {
                  manejarAgregarCarrito()
                  cerrarPopupGaleria()
                }}
              >
                <ShoppingCart size={20} />
                Añadir al carrito
              </button>
            </div>

            {/* Miniaturas en el popup (solo en desktop) */}
            {imagenesFinales.length > 1 && (
              <div className="hero-temu-popup-miniaturas">
                {imagenesFinales.map((imagen, index) => (
                  <button
                    key={index}
                    className={`hero-temu-popup-miniatura ${index === imagenSeleccionada ? 'activa' : ''}`}
                    onClick={() => manejarCambioImagen(index)}
                  >
                    <img src={imagen} alt={`Vista ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroTemu
