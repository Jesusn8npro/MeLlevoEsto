import React, { useState, useEffect } from 'react'
import { Truck, Clock, RotateCcw, Headphones, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import './SeccionBeneficios.css'

const SeccionBeneficios = () => {
  const [esMobile, setEsMobile] = useState(false)
  const [indiceActual, setIndiceActual] = useState(0)

  const beneficios = [
    { id: 1, icono: <Truck size={24} />, titulo: "Envío Gratis Rápido", subtitulo: "En pedidos superiores a $50" },
    { id: 2, icono: <Clock size={24} />, titulo: "Entrega al Día Siguiente", subtitulo: "Gratis - gasta más de $99" },
    { id: 3, icono: <RotateCcw size={24} />, titulo: "Devoluciones Gratuitas", subtitulo: "Todos los métodos de envío" },
    { id: 4, icono: <Headphones size={24} />, titulo: "Servicio al Cliente Experto", subtitulo: "Elige chat o llámanos" },
    { id: 5, icono: <Heart size={24} />, titulo: "Marcas Exclusivas", subtitulo: "Más productos exclusivos" }
  ]

  useEffect(() => {
    const checkMobile = () => setEsMobile(window.innerWidth <= 450)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!esMobile) return
    const interval = setInterval(() => setIndiceActual(prev => (prev + 1) % 5), 3000)
    return () => clearInterval(interval)
  }, [esMobile])

  const cambiarBeneficio = (direccion) => {
    setIndiceActual(prev => direccion === 'siguiente' ? (prev + 1) % 5 : (prev - 1 + 5) % 5)
  }

  const BeneficioTarjeta = ({ beneficio, esMobileActivo = false }) => (
    <div className={`beneficio-tarjeta ${esMobileActivo ? 'beneficio-mobile-activo' : ''}`}>
      <div className="beneficio-icono">{beneficio.icono}</div>
      <div className="beneficio-contenido">
        <div className="beneficio-titulo">{beneficio.titulo}</div>
        <div className="beneficio-subtitulo">{beneficio.subtitulo}</div>
      </div>
    </div>
  )

  return (
    <section className="seccion-beneficios">
      <div className={`beneficios-contenedor ${esMobile ? 'beneficios-mobile' : ''}`}>
        {esMobile ? (
          <div className="beneficio-slider-mobile">
            <button className="beneficio-flecha beneficio-flecha-izq" onClick={() => cambiarBeneficio('anterior')}>
              <ChevronLeft size={20} />
            </button>
            <BeneficioTarjeta beneficio={beneficios[indiceActual]} esMobileActivo />
            <button className="beneficio-flecha beneficio-flecha-der" onClick={() => cambiarBeneficio('siguiente')}>
              <ChevronRight size={20} />
            </button>
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
          beneficios.map(beneficio => <BeneficioTarjeta key={beneficio.id} beneficio={beneficio} />)
        )}
      </div>
    </section>
  )
}

export default SeccionBeneficios
