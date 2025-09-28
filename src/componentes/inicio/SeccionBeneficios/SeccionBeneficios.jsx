import React, { useState, useEffect } from 'react'
import { Package, RotateCcw, Shield, Headphones, CreditCard } from 'lucide-react'
import './SeccionBeneficios.css'

/**
 * SeccionBeneficios - Sección de beneficios estilo XStore
 * 
 * Replica exactamente las 5 tarjetas de beneficios:
 * - Log in get up to 50% discounts
 * - Open new stores in your city
 * - Free fast express delivery with tracking
 * - Equipment loose and damage insurance
 * - Installment without overpayments
 */

const SeccionBeneficios = () => {
  const [esMobile, setEsMobile] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setEsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Datos de los beneficios
  const beneficios = [
    {
      id: 1,
      icono: <CreditCard size={24} />,
      titulo: "Inicia sesión y obtén hasta",
      subtitulo: "50% de descuentos",
      descripcion: "Descuentos exclusivos para miembros registrados",
      color: "#2196F3"
    },
    {
      id: 2,
      icono: <Package size={24} />,
      titulo: "Abrimos nuevas tiendas",
      subtitulo: "en tu ciudad",
      descripcion: "Encuentra nuestras tiendas más cerca de ti",
      color: "#4CAF50"
    },
    {
      id: 3,
      icono: <Package size={24} />,
      titulo: "Envío rápido y gratuito",
      subtitulo: "con seguimiento",
      descripcion: "Entrega express con tracking en tiempo real",
      color: "#FF9800"
    },
    {
      id: 4,
      icono: <Shield size={24} />,
      titulo: "Seguro contra daños",
      subtitulo: "y pérdida de equipos",
      descripcion: "Protección total para tus compras",
      color: "#9C27B0"
    },
    {
      id: 5,
      icono: <CreditCard size={24} />,
      titulo: "Cuotas sin",
      subtitulo: "sobrepagos",
      descripcion: "Financia tus compras sin intereses adicionales",
      color: "#F44336"
    }
  ]

  // Filtrar beneficios según el dispositivo
  const beneficiosMostrar = esMobile ? beneficios.slice(0, 3) : beneficios

  return (
    <section className="seccion-beneficios">
      <div className="beneficios-contenedor">
        {beneficiosMostrar.map((beneficio) => (
          <div 
            key={beneficio.id}
            className="beneficio-tarjeta"
          >
            {/* Icono */}
            <div 
              className="beneficio-icono"
              style={{ color: beneficio.color }}
            >
              {beneficio.icono}
            </div>

            {/* Contenido */}
            <div className="beneficio-contenido">
              <div className="beneficio-titulo">
                {beneficio.titulo}
              </div>
              <div 
                className="beneficio-subtitulo"
                style={{ color: beneficio.color }}
              >
                {beneficio.subtitulo}
              </div>
              <div className="beneficio-descripcion">
                {beneficio.descripcion}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SeccionBeneficios
