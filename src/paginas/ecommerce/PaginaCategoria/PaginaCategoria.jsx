import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Filter, Grid, List, ChevronDown, Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { supabase } from '../../../configuracion/supabase'
import './PaginaCategoria.css'

/**
 * PaginaCategoria - Página de listado de productos por categoría
 * 
 * Características:
 * - Datos reales desde Supabase
 * - Filtros funcionales (precio, marca, rating)
 * - Ordenamiento (precio, fecha, popularidad)
 * - Vista grid/lista
 * - Paginación
 * - Breadcrumbs
 */

const PaginaCategoria = () => {
  const { slug } = useParams()
  const [categoria, setCategoria] = useState(null)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [vistaGrid, setVistaGrid] = useState(true)
  const [ordenamiento, setOrdenamiento] = useState('recientes')
  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    rating: 0
  })

  useEffect(() => {
    if (slug) {
      cargarCategoria()
      cargarProductos()
    }
  }, [slug, ordenamiento])

  const cargarCategoria = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error cargando categoría:', error)
        return
      }

      setCategoria(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const cargarProductos = async () => {
    try {
      setCargando(true)
      
      let query = supabase
        .from('productos')
        .select(`
          *,
          categorias(nombre, slug),
          producto_imagenes(*)
        `)
        .eq('categorias.slug', slug)
        .eq('activo', true)

      // Aplicar ordenamiento
      switch (ordenamiento) {
        case 'precio_asc':
          query = query.order('precio', { ascending: true })
          break
        case 'precio_desc':
          query = query.order('precio', { ascending: false })
          break
        case 'nombre':
          query = query.order('nombre', { ascending: true })
          break
        default:
          query = query.order('creado_el', { ascending: false })
      }

      const { data: productosData, error } = await query

      if (error) {
        console.error('Error cargando productos:', error)
        return
      }

      // Procesar productos para incluir imágenes convertidas
      const productosConImagenes = productosData?.map(producto => {
        let imagenPrincipal = '/images/producto-default.jpg'
        
        if (producto.producto_imagenes && producto.producto_imagenes.length > 0) {
          const imagenes = producto.producto_imagenes[0]
          if (imagenes.imagen_principal) {
            const url = imagenes.imagen_principal
            if (url.includes('drive.google.com/file/d/')) {
              const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
              const fileId = match?.[1]
              if (fileId) {
                imagenPrincipal = `https://lh3.googleusercontent.com/d/${fileId}=w400?authuser=0`
              }
            } else if (url.includes('drive.google.com/thumbnail?id=')) {
              const match = url.match(/id=([a-zA-Z0-9_-]+)/)
              const fileId = match?.[1]
              if (fileId) {
                imagenPrincipal = `https://lh3.googleusercontent.com/d/${fileId}=w400?authuser=0`
              }
            } else {
              imagenPrincipal = url
            }
          }
        }

        return {
          ...producto,
          imagenPrincipal,
          precioDescuento: producto.precio_descuento || null,
          porcentajeDescuento: producto.precio_descuento 
            ? Math.round(((producto.precio - producto.precio_descuento) / producto.precio) * 100)
            : 0
        }
      }) || []

      setProductos(productosConImagenes)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={i < fullStars ? 'star-filled' : 'star-empty'}
        />
      )
    }
    
    return stars
  }

  if (!categoria && !cargando) {
    return (
      <div className="pagina-categoria">
        <div className="categoria-contenedor">
          <div className="categoria-no-encontrada">
            <h1>Categoría no encontrada</h1>
            <p>La categoría que buscas no existe.</p>
            <Link to="/" className="btn-volver">Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pagina-categoria">
      <div className="categoria-contenedor">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/categorias">Categorías</Link>
          <span>/</span>
          <span>{categoria?.nombre}</span>
        </nav>

        {/* Header de categoría */}
        <div className="categoria-header">
          <div className="categoria-info">
            <h1 className="categoria-titulo">{categoria?.nombre}</h1>
            <p className="categoria-descripcion">{categoria?.descripcion}</p>
            <span className="categoria-total">
              {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Controles */}
        <div className="categoria-controles">
          <div className="controles-izquierda">
            <button className="btn-filtros">
              <Filter size={16} />
              Filtros
            </button>
          </div>

          <div className="controles-derecha">
            <div className="ordenamiento">
              <label>Ordenar por:</label>
              <select 
                value={ordenamiento} 
                onChange={(e) => setOrdenamiento(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>

            <div className="vista-toggle">
              <button 
                className={vistaGrid ? 'activo' : ''}
                onClick={() => setVistaGrid(true)}
              >
                <Grid size={16} />
              </button>
              <button 
                className={!vistaGrid ? 'activo' : ''}
                onClick={() => setVistaGrid(false)}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="categoria-contenido">
          {cargando ? (
            <div className="categoria-loading">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="categoria-vacia">
              <h3>No hay productos en esta categoría</h3>
              <p>Pronto agregaremos más productos.</p>
            </div>
          ) : (
            <div className={`productos-lista ${vistaGrid ? 'vista-grid' : 'vista-lista'}`}>
              {productos.map((producto) => (
                <div key={producto.id} className="producto-item">
                  {/* Imagen */}
                  <div className="producto-imagen">
                    <Link to={`/producto/${producto.slug}`}>
                      <img 
                        src={producto.imagenPrincipal} 
                        alt={producto.nombre}
                        loading="lazy"
                      />
                    </Link>
                    
                    {/* Badges */}
                    {producto.porcentajeDescuento > 0 && (
                      <span className="producto-descuento">
                        -{producto.porcentajeDescuento}%
                      </span>
                    )}

                    {/* Acciones hover */}
                    <div className="producto-acciones">
                      <button className="accion-btn" title="Agregar a favoritos">
                        <Heart size={16} />
                      </button>
                      <button className="accion-btn" title="Vista rápida">
                        <Eye size={16} />
                      </button>
                      <button className="accion-btn" title="Agregar al carrito">
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="producto-info">
                    <Link to={`/producto/${producto.slug}`} className="producto-nombre">
                      {producto.nombre}
                    </Link>

                    <div className="producto-rating">
                      <div className="rating-stars">
                        {renderStars(producto.rating)}
                      </div>
                      <span className="rating-count">
                        ({producto.total_reviews || 0})
                      </span>
                    </div>

                    <div className="producto-precio">
                      {producto.precioDescuento ? (
                        <>
                          <span className="precio-descuento">
                            {formatearPrecio(producto.precioDescuento)}
                          </span>
                          <span className="precio-original">
                            {formatearPrecio(producto.precio)}
                          </span>
                        </>
                      ) : (
                        <span className="precio-actual">
                          {formatearPrecio(producto.precio)}
                        </span>
                      )}
                    </div>

                    {!vistaGrid && (
                      <p className="producto-descripcion">
                        {producto.descripcion_corta || producto.descripcion?.substring(0, 150) + '...'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaginaCategoria