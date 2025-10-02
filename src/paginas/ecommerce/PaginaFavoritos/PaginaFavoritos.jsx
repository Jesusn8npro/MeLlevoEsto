import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, Grid, List, ShoppingCart, Eye, Trash2, Star } from 'lucide-react'
import { useFavoritos } from '../../../contextos/FavoritosContext'
import TarjetaProductoVendedora from '../../../componentes/producto/TarjetaProductoVendedora'
import './PaginaFavoritos.css'

const PaginaFavoritos = () => {
  const { favoritos, cargando, quitarFavorito } = useFavoritos()
  
  const [busqueda, setBusqueda] = useState('')
  const [ordenamiento, setOrdenamiento] = useState('reciente')
  const [vistaActual, setVistaActual] = useState('grid')
  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 12

  // Filtrar y ordenar favoritos
  const favoritosFiltrados = useMemo(() => {
    let resultado = favoritos.filter(favorito =>
      favorito && favorito.nombre && favorito.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    switch (ordenamiento) {
      case 'precio-asc':
        resultado.sort((a, b) => (a.precio || 0) - (b.precio || 0))
        break
      case 'precio-desc':
        resultado.sort((a, b) => (b.precio || 0) - (a.precio || 0))
        break
      case 'nombre':
        resultado.sort((a, b) => {
          const nombreA = a.nombre || ''
          const nombreB = b.nombre || ''
          return nombreA.localeCompare(nombreB)
        })
        break
      case 'reciente':
      default:
        resultado.sort((a, b) => {
          const fechaA = a.fecha_agregado ? new Date(a.fecha_agregado) : new Date(0)
          const fechaB = b.fecha_agregado ? new Date(b.fecha_agregado) : new Date(0)
          return fechaB - fechaA
        })
        break
    }

    return resultado
  }, [favoritos, busqueda, ordenamiento])

  // Paginación
  const totalPaginas = Math.ceil(favoritosFiltrados.length / productosPorPagina)
  const favoritosPaginados = favoritosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  )

  const manejarEliminarFavorito = (productoId) => {
    quitarFavorito(productoId)
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }



  // Función para generar slug válido desde el nombre
  const generarSlugDesdeNombre = (nombre, id) => {
    if (!nombre) return `producto-${id}`
    
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .replace(/^-|-$/g, '') // Remover guiones al inicio y final
      || `producto-${id}` // Fallback si el resultado está vacío
  }

  // Convertir favorito a formato de producto para TarjetaProductoVendedora
  const convertirFavoritoAProducto = (favorito) => {
    // Replicar exactamente la lógica de procesamiento de imágenes de GridProductosVendedor
    let imagenesReales = []
    
    // Procesar producto_imagenes si está disponible (prioridad máxima)
    if (favorito.producto_imagenes && favorito.producto_imagenes.length > 0) {
      const imagenes = favorito.producto_imagenes[0] // Tomar el primer objeto de imágenes
      
      // Agregar imágenes en orden de prioridad (ImagenInteligente maneja la conversión automáticamente)
      if (imagenes.imagen_principal) imagenesReales.push(imagenes.imagen_principal)
      if (imagenes.imagen_secundaria_1) imagenesReales.push(imagenes.imagen_secundaria_1)
      if (imagenes.imagen_secundaria_2) imagenesReales.push(imagenes.imagen_secundaria_2)
      if (imagenes.imagen_secundaria_3) imagenesReales.push(imagenes.imagen_secundaria_3)
      if (imagenes.imagen_secundaria_4) imagenesReales.push(imagenes.imagen_secundaria_4)
    }
    
    // Si no hay imágenes reales, usar fotos_principales del favorito
    if (imagenesReales.length === 0 && favorito.fotos_principales && favorito.fotos_principales.length > 0) {
      imagenesReales.push(...favorito.fotos_principales)
    }
    
    // Si aún no hay imágenes, usar la imagen principal del favorito
    if (imagenesReales.length === 0 && favorito.imagen) {
      imagenesReales.push(favorito.imagen)
    }
    
    console.log(`🖼️ Favorito "${favorito.nombre}" - Imágenes procesadas:`, imagenesReales.length)
    
    return {
      id: favorito.producto_id || favorito.id,
      nombre: favorito.nombre || 'Producto sin nombre',
      precio: favorito.precio || 0,
      precio_original: favorito.precio_original,
      fotos_principales: imagenesReales.length > 0 ? imagenesReales : favorito.fotos_principales || [],
      imagen_principal: imagenesReales[0] || null, // Primera imagen como principal
      slug: favorito.slug || generarSlugDesdeNombre(favorito.nombre, favorito.producto_id || favorito.id), // Usar slug real o generar uno válido
      disponible: favorito.activo !== false,
      descripcion: favorito.descripcion || 'Descripción no disponible',
      destacado: false,
      // Agregar propiedades adicionales que puede necesitar TarjetaProductoVendedora
      ventajas: favorito.ventajas || [],
      categoria: favorito.categoria || 'General'
    }
  }

  if (cargando) {
    return (
      <div className="favoritos-cargando">
        <div className="spinner-favoritos"></div>
        <p>Cargando favoritos...</p>
      </div>
    )
  }

  return (
    <div className="pagina-favoritos">
      {/* Hero Section de Favoritos */}
      <div className="favoritos-hero">
        <div className="favoritos-hero-contenido">
          <div className="favoritos-hero-texto">
            <div className="favoritos-hero-badge">
              <Heart className="icono-badge" />
              <span>Lista de Deseos</span>
            </div>
            <h1>Tus Productos Favoritos</h1>
            <p>Guarda y organiza los productos que más te gustan. Mantén un registro de todo lo que deseas comprar y no pierdas de vista esas ofertas especiales.</p>
            <div className="favoritos-estadisticas">
              <div className="estadistica">
                <span className="numero">{favoritos.length}</span>
                <span className="etiqueta">Productos guardados</span>
              </div>
              <div className="estadistica">
                <span className="numero">{favoritos.filter(f => f.precio).length}</span>
                <span className="etiqueta">Con precio</span>
              </div>
            </div>
          </div>
          <div className="favoritos-hero-visual">
            <div className="favoritos-hero-cards">
              <div className="hero-card card-1">
                <Heart className="card-icon" />
                <span>Guarda</span>
              </div>
              <div className="hero-card card-2">
                <ShoppingCart className="card-icon" />
                <span>Compra</span>
              </div>
              <div className="hero-card card-3">
                <Star className="card-icon" />
                <span>Disfruta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {favoritos.length === 0 ? (
        <div className="favoritos-vacio">
          <div className="favoritos-vacio-contenido">
            <Heart className="favoritos-vacio-icono" />
            <h2>No tienes favoritos aún</h2>
            <p>Explora nuestros productos y guarda tus favoritos aquí</p>
            <Link to="/tienda" className="boton-explorar">
              Explorar productos
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="favoritos-herramientas">
            <div className="favoritos-toolbar-izquierda">
              <div className="busqueda-favoritos">
                <Search className="icono-busqueda" />
                <input
                  type="text"
                  placeholder="Buscar en favoritos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="favoritos-toolbar-derecha">
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="selector-ordenamiento"
              >
                <option value="reciente">Más recientes</option>
                <option value="nombre">Nombre A-Z</option>
                <option value="precio-asc">Precio menor a mayor</option>
                <option value="precio-desc">Precio mayor a menor</option>
              </select>

              <div className="controles-vista">
                <button
                  className={`boton-vista ${vistaActual === 'grid' ? 'activo' : ''}`}
                  onClick={() => setVistaActual('grid')}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`boton-vista ${vistaActual === 'list' ? 'activo' : ''}`}
                  onClick={() => setVistaActual('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>



          <div className={`favoritos-contenido ${vistaActual}`}>
            {favoritosPaginados.map((favorito) => (
              <TarjetaProductoVendedora
                key={favorito.producto_id || favorito.id}
                producto={convertirFavoritoAProducto(favorito)}
                mostrarDescuento={true}
                mostrarUrgencia={false}
                mostrarPruebaSocial={true}
                mostrarBadges={true}
                tamaño="normal"
                animaciones={true}
                vistaLista={vistaActual === 'list'}
              />
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="favoritos-paginacion">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="boton-paginacion"
              >
                Anterior
              </button>
              
              <div className="numeros-pagina">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                  <button
                    key={numero}
                    onClick={() => setPaginaActual(numero)}
                    className={`numero-pagina ${paginaActual === numero ? 'activo' : ''}`}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="boton-paginacion"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PaginaFavoritos