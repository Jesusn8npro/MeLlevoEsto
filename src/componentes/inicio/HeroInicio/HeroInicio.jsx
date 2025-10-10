import React, { useEffect, useState } from 'react'
import './HeroInicio.css'
import TarjetasPromocionales from './TarjetasPromocionales'

/**
 * HeroInicio - HERO de inicio a pantalla completa con textos en español
 * - Imagen ocupa 100% del ancho y alto del contenedor
 * - Texto superpuesto con jerarquía clara y legible
 * - Mantiene el mismo patrón de disposición (desktop y móvil)
 */

const defaultSlides = [
  {
    id: 1,
    marca: 'Vehículos',
    titulo: 'Vehículos certificados y listos para ti',
    promocion: 'Financiación y entrega rápida',
    cta: 'Ver vehículos',
    link: '/tienda/vehiculos',
    imagen:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    marca: 'Segunda Mano',
    titulo: 'Productos de segunda como nuevos',
    promocion: 'Ahorra hasta 60% de descuento',
    cta: 'Ver segunda mano',
    link: '/tienda/segunda-mano',
    imagen:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    marca: 'Innovación',
    titulo: 'Productos innovadores y únicos',
    promocion: 'Descubre lo último en tecnología',
    cta: 'Explorar innovación',
    link: '/tienda/innovacion',
    imagen:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  },
]

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
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + dataset.length) % dataset.length)
            if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % dataset.length)
          }}
          aria-roledescription="carousel"
        >
        {/* Imagen full-width/height */}
        <img
          className="hero-img"
          src={slide.imagen}
          srcSet={`${slide.imagen.replace('w=1200', 'w=600')} 600w, ${slide.imagen} 1200w`}
          sizes="(max-width: 768px) 100vw, 100vw"
          alt={slide.titulo}
          loading="lazy"
        />

        {/* Textos sobre la imagen (jerarquía clara) */}
        <div className="hero-text">
          {slide.marca && <span className="hero-brand">{slide.marca}</span>}
          <h2 className="hero-title">{slide.titulo}</h2>
          {slide.promocion && <div className="hero-sale">{slide.promocion}</div>}
          <a className="hero-cta" href={slide.link || '#'} aria-label={`Ir a ${slide.titulo}`}>
            {slide.cta || 'Comprar'}
          </a>
        </div>

        {/* Flechas de navegación */}
        <button
          className="hero-arrow hero-arrow-left"
          onClick={() => setIndex((i) => (i - 1 + dataset.length) % dataset.length)}
          aria-label="Slide anterior"
        >
          <span aria-hidden>‹</span>
        </button>

        <button
          className="hero-arrow hero-arrow-right"
          onClick={() => setIndex((i) => (i + 1) % dataset.length)}
          aria-label="Slide siguiente"
        >
          <span aria-hidden>›</span>
        </button>

        {/* Indicadores de puntos */}
        <div className="hero-indicators">
          {dataset.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === index ? 'activo' : ''}`}
              onClick={() => setIndex(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
              aria-current={idx === index ? 'true' : 'false'}
            />
          ))}
        </div>
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

