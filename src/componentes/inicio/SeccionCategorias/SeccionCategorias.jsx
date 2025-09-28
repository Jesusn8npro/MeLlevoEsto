import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../../configuracion/supabase'
import './SeccionCategorias.css'

/**
 * SeccionCategorias - Sección de categorías populares
 * 
 * Características:
 * - Datos reales desde Supabase
 * - Slider horizontal con controles
 * - Contador de productos por categoría
 * - Enlaces funcionales a páginas de categoría
 * - Diseño marketplace responsivo
 */

const SeccionCategorias = () => {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Cargar categorías desde Supabase
  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      setCargando(true)
      
      // Obtener categorías con conteo de productos
      const { data: categoriasData, error } = await supabase
        .from('categorias')
        .select(`
          *,
          productos!inner(id)
        `)
        .eq('activo', true)
        .order('orden', { ascending: true })

      if (error) {
        console.error('Error cargando categorías:', error)
        return
      }

      // Procesar datos para incluir conteo
      const categoriasConConteo = categoriasData?.map(categoria => ({
        ...categoria,
        totalProductos: categoria.productos?.length || 0
      })) || []

      setCategorias(categoriasConConteo)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  // Funciones de navegación del slider
  const scrollLeft = () => {
    const container = document.querySelector('.categorias-slider')
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = document.querySelector('.categorias-slider')
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  if (cargando) {
    return (
      <section className="seccion-categorias">
        <div className="categorias-contenedor">
          <div className="categorias-header">
            <h2 className="categorias-titulo">Categorías Populares</h2>
          </div>
          <div className="categorias-loading">
            <div className="loading-spinner"></div>
            <p>Cargando categorías...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="seccion-categorias">
      <div className="categorias-contenedor">
        {/* Header */}
        <div className="categorias-header">
          <h2 className="categorias-titulo">Categorías Populares</h2>
          <Link to="/categorias" className="categorias-ver-todas">
            Ver todas las categorías
          </Link>
        </div>

        {/* Slider de categorías */}
        <div className="categorias-slider-contenedor">
          <button 
            className="categorias-flecha categorias-flecha-izq"
            onClick={scrollLeft}
            aria-label="Categorías anteriores"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="categorias-slider">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/categoria/${categoria.slug}`}
                className="categoria-card"
              >
                {/* Imagen de la categoría */}
                <div className="categoria-imagen">
                  <img 
                    src={categoria.imagen_url || '/images/categoria-default.jpg'} 
                    alt={categoria.nombre}
                    loading="lazy"
                  />
                  {categoria.destacado && (
                    <span className="categoria-badge">Popular</span>
                  )}
                </div>

                {/* Información */}
                <div className="categoria-info">
                  <h3 className="categoria-nombre">{categoria.nombre}</h3>
                  <p className="categoria-productos">
                    {categoria.totalProductos} producto{categoria.totalProductos !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <button 
            className="categorias-flecha categorias-flecha-der"
            onClick={scrollRight}
            aria-label="Categorías siguientes"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default SeccionCategorias
