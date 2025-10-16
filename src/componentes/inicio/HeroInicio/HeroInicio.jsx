import React, { useEffect, useState } from 'react'
import './HeroInicio.css'
import TarjetasPromocionales from './TarjetasPromocionales'

/**
 * HeroInicio - HERO de inicio a pantalla completa con textos en español
 * - Imagen ocupa 100% del ancho y alto del contenedor
 * - Texto superpuesto con jerarquía clara y legible
 * - Mantiene el mismo patrón de disposición (desktop y móvil)
 */

// Imágenes del Home desde public/images/Home
const homeImages = [
  '/images/Home/Imagen%20Principal%20HOME.jpg',
  '/images/Home/Banner%202.jpg',
  '/images/Home/Banner%202%20Oferta.jpg',
  '/images/Home/Banner%20de%20oferta%201.jpg',
  '/images/Home/Venta%20de%20camionetas.jpg',
]

const defaultSlides = homeImages.map((src, idx) => ({ id: idx + 1, imagen: src, alt: 'Imagen Home' }))

const HeroInicio = ({ slides }) => {
  const dataset = Array.isArray(slides) && slides.length > 0 ? slides : defaultSlides
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let t
    if (!paused && !document.hidden) {
      t = setInterval(() => setIndex((i) => (i + 1) % dataset.length), 5000)
    }
    const onVis = () => {
      // pausa si la pestaña se oculta
      // al volver, se reanuda
      if (document.hidden) setPaused(true)
      else setPaused(false)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      if (t) clearInterval(t)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [paused, dataset.length])

  // Preload siguiente
  useEffect(() => {
    const next = dataset[(index + 1) % dataset.length]
    if (next?.imagen) {
      const img = new Image()
      img.src = next.imagen
    }
  }, [index, dataset])

  const slide = dataset[index]

  return (
    <section className="hero-inicio hero-inicio--full">
      <div className="hero-grid">
        <div
          className="hero-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          tabIndex={0}
          aria-roledescription="carousel"
        >
        {/* Imagen full-width/height */}
        <img
          className="hero-img"
          src={slide.imagen}
          sizes="(max-width: 768px) 100vw, 100vw"
          alt={slide.alt || 'Imagen Home'}
          loading="lazy"
        />
        </div>

        {/* Tarjetas promocionales al lado derecho en escritorio */}
        <aside className="hero-promos">
          <TarjetasPromocionales />
        </aside>
      </div>
    </section>
  )
}

export default HeroInicio

