import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './SeccionCategorias.css'

/**
 * SeccionCategorias - Sección de Categorías Populares
 * 
 * Replica exactamente el diseño de WoodMart:
 * - Desktop: Grid de 7 categorías horizontales
 * - Móvil: Slider con 2 categorías visibles + navegación
 * - Imágenes de Unsplash para cada categoría
 * - Contador de productos por categoría
 */

const SeccionCategorias = () => {
  const navigate = useNavigate()
  const [esMobile, setEsMobile] = useState(false)
  const [indiceActual, setIndiceActual] = useState(0)
  
  // Constantes para el slider
  const CATEGORIAS_POR_VISTA = 2
  const TOTAL_CATEGORIAS = 7

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setEsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Datos de las categorías con imágenes de Unsplash
  const categorias = [
    {
      id: 1,
      nombre: "Apple iPhone",
      productos: 8,
      imagen: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop&crop=center",
      slug: "apple-iphone"
    },
    {
      id: 2,
      nombre: "Apple MacBook",
      productos: 7,
      imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center",
      slug: "apple-macbook"
    },
    {
      id: 3,
      nombre: "Motherboards",
      productos: 8,
      imagen: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop&crop=center",
      slug: "motherboards"
    },
    {
      id: 4,
      nombre: "Mirrorless",
      productos: 8,
      imagen: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop&crop=center",
      slug: "mirrorless"
    },
    {
      id: 5,
      nombre: "Headsets",
      productos: 8,
      imagen: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop&crop=center",
      slug: "headsets"
    },
    {
      id: 6,
      nombre: "Drones",
      productos: 8,
      imagen: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=300&fit=crop&crop=center",
      slug: "drones"
    },
    {
      id: 7,
      nombre: "Apple iPad",
      productos: 8,
      imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center",
      slug: "apple-ipad"
    }
  ]

  // Navegación del slider móvil (de 2 en 2)
  const siguienteSlide = () => {
    setIndiceActual((prev) => {
      const siguiente = prev + CATEGORIAS_POR_VISTA
      // Si llegamos al final o nos pasamos, volvemos al inicio
      if (siguiente >= TOTAL_CATEGORIAS) {
        return 0
      }
      return siguiente
    })
  }

  const anteriorSlide = () => {
    setIndiceActual((prev) => {
      const anterior = prev - CATEGORIAS_POR_VISTA
      // Si estamos al inicio o nos pasamos, vamos al último grupo válido
      if (anterior < 0) {
        // Calcular el último índice válido (múltiplo de 2)
        const ultimoIndice = Math.floor((TOTAL_CATEGORIAS - CATEGORIAS_POR_VISTA) / CATEGORIAS_POR_VISTA) * CATEGORIAS_POR_VISTA
        return ultimoIndice
      }
      return anterior
    })
  }

  // Manejar clic en categoría
  const manejarClickCategoria = (categoria) => {
    // Todas las categorías redirigen a la tienda general
    navigate('/tienda')
  }

  return (
    <section className="seccion-categorias">
      <div className="categorias-contenedor">
        <h2 className="categorias-titulo">Categorías Populares</h2>
        
        {esMobile ? (
          // Versión móvil - Slider
          <div className="categorias-slider-movil">
            <button 
              className="slider-btn slider-btn-izq"
              onClick={anteriorSlide}
              aria-label="Categoría anterior"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="categorias-slider-contenedor">
              <div 
                className="categorias-slider-track"
                style={{
                  transform: `translateX(-${(indiceActual / TOTAL_CATEGORIAS) * 100}%)`
                }}
              >
                {categorias.map((categoria) => (
                  <div 
                    key={categoria.id}
                    className="categoria-tarjeta-movil"
                    onClick={() => manejarClickCategoria(categoria)}
                  >
                    <div className="categoria-imagen-contenedor">
                      <img 
                        src={categoria.imagen}
                        alt={categoria.nombre}
                        className="categoria-imagen"
                        loading="lazy"
                      />
                    </div>
                    <div className="categoria-info">
                      <h3 className="categoria-nombre">{categoria.nombre}</h3>
                      <p className="categoria-productos">{categoria.productos} productos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="slider-btn slider-btn-der"
              onClick={siguienteSlide}
              aria-label="Siguiente categoría"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          // Versión desktop - Grid
          <div className="categorias-grid-desktop">
            {categorias.map((categoria) => (
              <div 
                key={categoria.id}
                className="categoria-tarjeta-desktop"
                onClick={() => manejarClickCategoria(categoria)}
              >
                <div className="categoria-imagen-contenedor">
                  <img 
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="categoria-imagen"
                    loading="lazy"
                  />
                </div>
                <div className="categoria-info">
                  <h3 className="categoria-nombre">{categoria.nombre}</h3>
                  <p className="categoria-productos">{categoria.productos} productos</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SeccionCategorias
