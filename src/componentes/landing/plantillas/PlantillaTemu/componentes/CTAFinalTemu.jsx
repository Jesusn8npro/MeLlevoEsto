import React, { useState, useEffect } from 'react'
import './CTAFinalTemu.css'

/**
 * CTAFinalTemu - CTA final con urgencia y escasez
 * 
 * Características:
 * - Timer de urgencia
 * - Contador de stock
 * - Botón principal destacado
 * - Diseño simple pero efectivo
 */

const CTAFinalTemu = ({ 
  ctaData = null,
  mostrarTimer = true,
  mostrarStock = true 
}) => {
  
  const [tiempoRestante, setTiempoRestante] = useState({
    horas: 23,
    minutos: 59,
    segundos: 59
  })
  
  const [stockRestante, setStockRestante] = useState(7)
  
  // Datos por defecto
  const datosDefecto = {
    titulo: "¡ÚLTIMA OPORTUNIDAD!",
    subtitulo: "No dejes pasar esta oferta única. Miles ya han transformado su vida.",
    descuento: "70% OFF",
    precioAnterior: "$199.900",
    precioActual: "$59.900",
    botonTexto: "¡QUIERO MI TRANSFORMACIÓN AHORA!",
    garantia: "🛡️ Garantía de satisfacción del 100% o te devolvemos tu dinero",
    urgencia: "⚡ Oferta válida solo por hoy",
    envio: "🚚 Envío GRATIS en 24-48 horas"
  }

  const datos = ctaData || datosDefecto

  // Timer countdown
  useEffect(() => {
    if (!mostrarTimer) return

    const interval = setInterval(() => {
      setTiempoRestante(prev => {
        let { horas, minutos, segundos } = prev
        
        if (segundos > 0) {
          segundos--
        } else if (minutos > 0) {
          minutos--
          segundos = 59
        } else if (horas > 0) {
          horas--
          minutos = 59
          segundos = 59
        }
        
        return { horas, minutos, segundos }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [mostrarTimer])

  // Simulador de stock decreciente
  useEffect(() => {
    if (!mostrarStock) return

    const interval = setInterval(() => {
      setStockRestante(prev => {
        const nuevoStock = prev - Math.floor(Math.random() * 2)
        return nuevoStock > 2 ? nuevoStock : Math.floor(Math.random() * 5) + 3
      })
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [mostrarStock])

  const formatearNumero = (num) => {
    return num.toString().padStart(2, '0')
  }

  return (
    <section className="cta-final-temu-seccion">
      
      <div className="cta-final-temu-contenedor">
        
        {/* HEADER CON URGENCIA */}
        <div className="cta-final-temu-header">
          <div className="cta-final-temu-badge-urgencia">
            {datos.urgencia}
          </div>
          
          <h2 className="cta-final-temu-titulo">
            {datos.titulo}
          </h2>
          
          <p className="cta-final-temu-subtitulo">
            {datos.subtitulo}
          </p>
        </div>

        {/* TIMER DE CUENTA REGRESIVA */}
        {mostrarTimer && (
          <div className="cta-final-temu-timer">
            <div className="cta-final-temu-timer-titulo">
              ⏰ Esta oferta termina en:
            </div>
            <div className="cta-final-temu-timer-numeros">
              <div className="cta-final-temu-timer-item">
                <span className="cta-final-temu-timer-numero">
                  {formatearNumero(tiempoRestante.horas)}
                </span>
                <span className="cta-final-temu-timer-label">Horas</span>
              </div>
              <div className="cta-final-temu-timer-separador">:</div>
              <div className="cta-final-temu-timer-item">
                <span className="cta-final-temu-timer-numero">
                  {formatearNumero(tiempoRestante.minutos)}
                </span>
                <span className="cta-final-temu-timer-label">Min</span>
              </div>
              <div className="cta-final-temu-timer-separador">:</div>
              <div className="cta-final-temu-timer-item">
                <span className="cta-final-temu-timer-numero">
                  {formatearNumero(tiempoRestante.segundos)}
                </span>
                <span className="cta-final-temu-timer-label">Seg</span>
              </div>
            </div>
          </div>
        )}

        {/* PRECIOS */}
        <div className="cta-final-temu-precios">
          <div className="cta-final-temu-descuento">
            {datos.descuento}
          </div>
          <div className="cta-final-temu-precio-anterior">
            {datos.precioAnterior}
          </div>
          <div className="cta-final-temu-precio-actual">
            {datos.precioActual}
          </div>
        </div>

        {/* STOCK LIMITADO */}
        {mostrarStock && (
          <div className="cta-final-temu-stock">
            <div className="cta-final-temu-stock-texto">
              🔥 ¡Solo quedan <strong>{stockRestante} unidades</strong> disponibles!
            </div>
            <div className="cta-final-temu-stock-barra">
              <div 
                className="cta-final-temu-stock-progreso"
                style={{ width: `${(stockRestante / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* BOTÓN PRINCIPAL */}
        <div className="cta-final-temu-boton-container">
          <button className="cta-final-temu-boton">
            {datos.botonTexto}
          </button>
        </div>

        {/* GARANTÍAS FINALES */}
        <div className="cta-final-temu-garantias">
          <div className="cta-final-temu-garantia-item">
            {datos.garantia}
          </div>
          <div className="cta-final-temu-garantia-item">
            {datos.envio}
          </div>
        </div>

      </div>

    </section>
  )
}

export default CTAFinalTemu

