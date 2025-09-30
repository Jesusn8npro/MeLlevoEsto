import React, { useState, useEffect } from 'react'
import { Truck, Clock, RotateCcw, Headphones, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import './SeccionBeneficios.css'

/**
 * SeccionBeneficios - Sección de beneficios estilo WoodMart
 * 
 * Barra horizontal oscura con 5 beneficios:
 * - Envío gratis rápido
 * - Entrega al día siguiente  
 * - Devoluciones gratuitas
 * - Servicio al cliente experto
 * - Marcas exclusivas
 */

const SeccionBeneficios = () => {
  const [esMobile, setEsMobile] = useState(false)
  const [indiceActual, setIndiceActual] = useState(0)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setEsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-slider para móvil
  useEffect(() => {
    if (!esMobile) return

    const interval = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % 5) // Cicla entre los 5 beneficios
    }, 3000) // Cambia cada 3 segundos

    return () => clearInterval(interval)
  }, [esMobile])

  // Funciones de navegación manual
  const siguienteBeneficio = () => {
    setIndiceActual((prev) => (prev + 1) % 5)
  }

  const anteriorBeneficio = () => {
    setIndiceActual((prev) => (prev - 1 + 5) % 5)
  }

  // Datos de los beneficios estilo WoodMart
  const beneficios = [
    {
      id: 1,
      icono: <Truck size={24} />,
      titulo: "Envío Gratis Rápido",
      subtitulo: "En pedidos superiores a $50",
      color: "#3498db"
    },
    {
      id: 2,
      icono: <Clock size={24} />,
      titulo: "Entrega al Día Siguiente",
      subtitulo: "Gratis - gasta más de $99",
      color: "#3498db"
    },
    {
      id: 3,
      icono: <RotateCcw size={24} />,
      titulo: "Devoluciones Gratuitas",
      subtitulo: "Todos los métodos de envío",
      color: "#3498db"
    },
    {
      id: 4,
      icono: <Headphones size={24} />,
      titulo: "Servicio al Cliente Experto",
      subtitulo: "Elige chat o llámanos",
      color: "#3498db"
    },
    {
      id: 5,
      icono: <Heart size={24} />,
      titulo: "Marcas Exclusivas",
      subtitulo: "Más productos exclusivos",
      color: "#3498db"
    }
  ]

  return (
    <section className="seccion-beneficios">
      <div className={`beneficios-contenedor ${esMobile ? 'beneficios-mobile' : ''}`}>
        {esMobile ? (
          // Versión móvil - Un beneficio a la vez con flechas
          <div className="beneficio-slider-mobile">
            {/* Flecha izquierda */}
            <button 
              className="beneficio-flecha beneficio-flecha-izq"
              onClick={anteriorBeneficio}
              aria-label="Beneficio anterior"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Contenido del beneficio */}
            <div 
              className="beneficio-tarjeta beneficio-mobile-activo"
              key={beneficios[indiceActual].id}
            >
              {/* Icono a la izquierda */}
              <div className="beneficio-icono">
                {beneficios[indiceActual].icono}
              </div>

              {/* Contenido a la derecha */}
              <div className="beneficio-contenido">
                <div className="beneficio-titulo">
                  {beneficios[indiceActual].titulo}
                </div>
                <div className="beneficio-subtitulo">
                  {beneficios[indiceActual].subtitulo}
                </div>
              </div>
            </div>

            {/* Flecha derecha */}
            <button 
              className="beneficio-flecha beneficio-flecha-der"
              onClick={siguienteBeneficio}
              aria-label="Siguiente beneficio"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Indicadores de puntos */}
            <div className="beneficios-indicadores">
              {beneficios.map((_, index) => (
                <div 
                  key={index}
                  className={`indicador ${index === indiceActual ? 'activo' : ''}`}
                  onClick={() => setIndiceActual(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Versión desktop - Todos los beneficios
          beneficios.map((beneficio) => (
            <div 
              key={beneficio.id}
              className="beneficio-tarjeta"
            >
              {/* Icono */}
              <div className="beneficio-icono">
                {beneficio.icono}
              </div>

              {/* Contenido */}
              <div className="beneficio-contenido">
                <div className="beneficio-titulo">
                  {beneficio.titulo}
                </div>
                <div className="beneficio-subtitulo">
                  {beneficio.subtitulo}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default SeccionBeneficios
