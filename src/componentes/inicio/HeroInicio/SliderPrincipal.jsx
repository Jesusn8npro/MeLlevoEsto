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

const SliderPrincipal = () => {
  const [slideActual, setSlideActual] = useState(0)

  // Datos de los slides (puedes modificar según tus necesidades)
  const slides = [
    {
      id: 1,
      titulo: "COLECCIÓN ESCANDINAVA",
      subtitulo: "Limited Edition",
      descripcion: "PARA TU DORMITORIO SOLO",
      precio: "$599",
      textoBoton: "Comprar Ahora",
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
      imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
      colorFondo: "#f3e5f5"
    }
  ]

  // Auto-play del slider
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSlideActual((prev) => (prev + 1) % slides.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(intervalo)
  }, [slides.length])

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

  const slideActivo = slides[slideActual]

  return (
    <div className="slider-principal">
      {/* Contenido del slide */}
      <div 
        className="slider-contenido"
        style={{ backgroundColor: slideActivo.colorFondo }}
      >
        {/* Imagen de fondo */}
        <div className="slider-imagen">
          <img 
            src={slideActivo.imagen} 
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
          <button className="slider-boton">
            {slideActivo.textoBoton}
          </button>
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
          />
        ))}
      </div>
    </div>
  )
}

export default SliderPrincipal
