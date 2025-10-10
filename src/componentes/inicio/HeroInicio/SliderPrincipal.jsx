import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * SliderPrincipal - Slider funcional para el hero de inicio
 * 
 * Características:
 * - Auto-play cada 5 segundos
 * - Navegación con flechas
 * - Indicadores de puntos
 * - Transiciones suaves
 * - Totalmente responsivo
 */

const SliderPrincipal = ({ slides: slidesProp }) => {
  const [slideActual, setSlideActual] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)

  // Dataset por defecto si no se envían props
  const defaultSlides = [
    {
      id: 1,
      titulo: "COLECCIÓN ESCANDINAVA",
      subtitulo: "Limited Edition",
      descripcion: "PARA TU DORMITORIO SOLO",
      precio: "$599",
      textoBoton: "Comprar Ahora",
      link: "/tienda",
      imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
      colorFondo: "#f8f9fa"
    },
    {
      id: 2,
      titulo: "TECNOLOGÍA AVANZADA",
      subtitulo: "Nueva Generación",
      descripcion: "PARA TU HOGAR INTELIGENTE",
      precio: "$899",
      textoBoton: "Ver Más",
      link: "/productos/tecnologia",
      imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
      colorFondo: "#e3f2fd"
    },
    {
      id: 3,
      titulo: "ESTILO MODERNO",
      subtitulo: "Diseño Exclusivo",
      descripcion: "PARA TU ESPACIO PERFECTO",
      precio: "$1299",
      textoBoton: "Descubrir",
      link: "/colecciones/moderno",
      imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
      colorFondo: "#f3e5f5"
    }
  ]

  const slides = Array.isArray(slidesProp) && slidesProp.length > 0 ? slidesProp : defaultSlides

  // Auto-play del slider
  // Auto-play con pausa por hover y pestaña oculta
  useEffect(() => {
    let intervalo
    if (!isPaused && !document.hidden) {
      intervalo = setInterval(() => {
        setSlideActual((prev) => (prev + 1) % slides.length)
      }, 5000)
    }

    const onVisibility = () => {
      if (document.hidden) {
        setIsPaused(true)
      } else {
        setIsPaused(false)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      if (intervalo) clearInterval(intervalo)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [isPaused, slides.length])

  // Funciones de navegación
  const irAlSlideAnterior = () => {
    setSlideActual((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const irAlSlideSiguiente = () => {
    setSlideActual((prev) => (prev + 1) % slides.length)
  }

  const irAlSlide = (indice) => {
    setSlideActual(indice)
  }

  // Preload de la próxima imagen para transiciones suaves
  useEffect(() => {
    const siguiente = slides[(slideActual + 1) % slides.length]
    if (siguiente?.imagen) {
      const img = new Image()
      img.src = siguiente.imagen
    }
  }, [slideActual, slides])

  // Gestos táctiles (swipe)
  const onTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX)
  }
  const onTouchEnd = (e) => {
    if (touchStartX === null) return
    const delta = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(delta) > 50) {
      if (delta < 0) irAlSlideSiguiente()
      else irAlSlideAnterior()
    }
    setTouchStartX(null)
  }

  const slideActivo = slides[slideActual]

  return (
    <div 
      className="slider-principal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') irAlSlideAnterior()
        if (e.key === 'ArrowRight') irAlSlideSiguiente()
      }}
      aria-roledescription="carousel"
    >
      {/* Contenido del slide */}
      <div 
        className="slider-contenido"
        style={{ backgroundColor: slideActivo.colorFondo }}
      >
        {/* Imagen de fondo */}
        <div className="slider-imagen">
          <img 
            src={slideActivo.imagen}
            srcSet={`${slideActivo.imagen.replace('w=1200', 'w=600')} 600w, ${slideActivo.imagen} 1200w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={slideActivo.titulo}
            loading="lazy"
          />
        </div>

        {/* Contenido de texto */}
        <div className="slider-texto">
          <span className="slider-subtitulo">{slideActivo.subtitulo}</span>
          <h2 className="slider-titulo">{slideActivo.titulo}</h2>
          <p className="slider-descripcion">{slideActivo.descripcion}</p>
          <div className="slider-precio">{slideActivo.precio}</div>
          <a 
            className="slider-boton"
            href={slideActivo.link || '#'}
            aria-label={`Ir a ${slideActivo.titulo}`}
          >
            {slideActivo.textoBoton}
          </a>
        </div>
      </div>

      {/* Controles de navegación */}
      <button 
        className="slider-flecha slider-flecha-izquierda"
        onClick={irAlSlideAnterior}
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        className="slider-flecha slider-flecha-derecha"
        onClick={irAlSlideSiguiente}
        aria-label="Slide siguiente"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores de puntos */}
      <div className="slider-indicadores">
        {slides.map((_, indice) => (
          <button
            key={indice}
            className={`slider-punto ${indice === slideActual ? 'activo' : ''}`}
            onClick={() => irAlSlide(indice)}
            aria-label={`Ir al slide ${indice + 1}`}
            aria-current={indice === slideActual ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  )
}

export default SliderPrincipal

