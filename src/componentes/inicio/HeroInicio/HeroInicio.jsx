import React from 'react'
import SliderPrincipal from './SliderPrincipal'
import TarjetasPromocionales from './TarjetasPromocionales'
import './HeroInicio.css'

/**
 * HeroInicio - Sección principal de la página de inicio
 * 
 * Replica exactamente el diseño de Martfury:
 * - Slider funcional en el lado izquierdo
 * - Dos tarjetas promocionales en el lado derecho
 * - Totalmente responsivo
 */

const HeroInicio = () => {
  return (
    <section className="hero-inicio">
      <div className="hero-inicio-contenedor">
        {/* Slider Principal - Lado Izquierdo */}
        <div className="hero-inicio-slider">
          <SliderPrincipal />
        </div>

        {/* Tarjetas Promocionales - Lado Derecho */}
        <div className="hero-inicio-promociones">
          <TarjetasPromocionales />
        </div>
      </div>
    </section>
  )
}

export default HeroInicio
