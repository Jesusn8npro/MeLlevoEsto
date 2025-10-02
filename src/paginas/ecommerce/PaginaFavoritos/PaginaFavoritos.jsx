import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, Grid, List, ShoppingCart, Eye, Trash2, Star } from 'lucide-react'
import { useFavoritos } from '../../../contextos/FavoritosContext'
import TarjetaProductoVendedora from '../../../componentes/producto/TarjetaProductoVendedora'
import { convertirUrlGoogleDrive } from '../../../utilidades/googleDrive'
import './PaginaFavoritos.css'

const PaginaFavoritos = () => {
  const { favoritos, quitarFavorito, cargando } = useFavoritos()
  const [busqueda, setBusqueda] = useState('')
  const [ordenamiento, setOrdenamiento] = useState('recientes')
  const [vistaActual, setVistaActual] = useState('grid')
  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 12

  // 🔍 LOGS DE DEBUGGING
  console.log('🚀 PaginaFavoritos - Renderizando componente')
  console.log('📦 Favoritos del contexto:', favoritos)
  console.log('📊 Cantidad de favoritos:', favoritos?.length || 0)
  console.log('🔍 Búsqueda actual:', busqueda)
  console.log('📋 Ordenamiento actual:', ordenamiento)

  // Filtrar y ordenar favoritos
  const favoritosFiltrados = useMemo(() => {
    console.log('🔄 Procesando filtros y ordenamiento...')
    
    if (!favoritos || favoritos.length === 0) {
      console.log('❌ No hay favoritos para procesar')
      return []
    }
    
    console.log('✅ Favoritos disponibles para filtrar:', favoritos.length)
    
    // Filtrar por búsqueda
    let filtrados = favoritos.filter(favorito =>
      favorito.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      favorito.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    )
    
    console.log('🔍 Después del filtro de búsqueda:', filtrados.length)
    
    // Ordenar
    switch (ordenamiento) {
      case 'nombre':
        filtrados.sort((a, b) => a.nombre?.localeCompare(b.nombre || ''))
        break
      case 'precio_asc':
        filtrados.sort((a, b) => (a.precio || 0) - (b.precio || 0))
        break
      case 'precio_desc':
        filtrados.sort((a, b) => (b.precio || 0) - (a.precio || 0))
        break
      case 'recientes':
      default:
        filtrados.sort((a, b) => new Date(b.fecha_agregado || 0) - new Date(a.fecha_agregado || 0))
        break
    }
    
    console.log('📋 Después del ordenamiento:', filtrados.length)
    console.log('📋 Favoritos filtrados:', filtrados)
    
    return filtrados
  }, [favoritos, busqueda, ordenamiento])

  // Paginación
  const totalPaginas = Math.ceil(favoritosFiltrados.length / productosPorPagina)
  const indiceInicio = (paginaActual - 1) * productosPorPagina
  const indiceFin = indiceInicio + productosPorPagina
  const favoritosPaginados = favoritosFiltrados.slice(indiceInicio, indiceFin)

  console.log('📄 Paginación:')
  console.log('  - Total páginas:', totalPaginas)
  console.log('  - Página actual:', paginaActual)
  console.log('  - Índice inicio:', indiceInicio)
  console.log('  - Índice fin:', indiceFin)
  console.log('  - Favoritos paginados:', favoritosPaginados.length)
  console.log('  - Datos paginados:', favoritosPaginados)

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
  // Adaptado para la estructura de vista_favoritos
  const convertirFavoritoAProducto = (favorito) => {
    console.log(`🔄 Convirtiendo favorito a producto:`, favorito)
    
    const imagenesReales = []
    
    // Procesar imágenes directamente desde la vista_favoritos
    if (favorito.imagen_principal) {
      console.log(`📸 Agregando imagen_principal:`, favorito.imagen_principal)
      const imagenConvertida = convertirUrlGoogleDrive(favorito.imagen_principal)
      if (imagenConvertida && imagenConvertida !== favorito.imagen_principal) {
        imagenesReales.push(imagenConvertida)
      } else {
        imagenesReales.push(favorito.imagen_principal)
      }
    }
    if (favorito.imagen_secundaria_1) {
      console.log(`📸 Agregando imagen_secundaria_1:`, favorito.imagen_secundaria_1)
      const imagenConvertida = convertirUrlGoogleDrive(favorito.imagen_secundaria_1)
      if (imagenConvertida && imagenConvertida !== favorito.imagen_secundaria_1) {
        imagenesReales.push(imagenConvertida)
      } else {
        imagenesReales.push(favorito.imagen_secundaria_1)
      }
    }
    if (favorito.imagen_secundaria_2) {
      console.log(`📸 Agregando imagen_secundaria_2:`, favorito.imagen_secundaria_2)
      const imagenConvertida = convertirUrlGoogleDrive(favorito.imagen_secundaria_2)
      if (imagenConvertida && imagenConvertida !== favorito.imagen_secundaria_2) {
        imagenesReales.push(imagenConvertida)
      } else {
        imagenesReales.push(favorito.imagen_secundaria_2)
      }
    }
    if (favorito.imagen_secundaria_3) {
      console.log(`📸 Agregando imagen_secundaria_3:`, favorito.imagen_secundaria_3)
      const imagenConvertida = convertirUrlGoogleDrive(favorito.imagen_secundaria_3)
      if (imagenConvertida && imagenConvertida !== favorito.imagen_secundaria_3) {
        imagenesReales.push(imagenConvertida)
      } else {
        imagenesReales.push(favorito.imagen_secundaria_3)
      }
    }
    if (favorito.imagen_secundaria_4) {
      console.log(`📸 Agregando imagen_secundaria_4:`, favorito.imagen_secundaria_4)
      const imagenConvertida = convertirUrlGoogleDrive(favorito.imagen_secundaria_4)
      if (imagenConvertida && imagenConvertida !== favorito.imagen_secundaria_4) {
        imagenesReales.push(imagenConvertida)
      } else {
        imagenesReales.push(favorito.imagen_secundaria_4)
      }
    }
    
    console.log(`🖼️ Favorito "${favorito.producto_nombre}" - Imágenes procesadas:`, imagenesReales)
    
    // Calcular descuento si no está presente
    const descuento = favorito.descuento || (favorito.precio_original && favorito.precio ? 
      Math.round(((favorito.precio_original - favorito.precio) / favorito.precio_original) * 100) : 0)
    
    // Retornar producto con el mismo formato que GridProductosVendedor
    const productoConvertido = {
      id: favorito.producto_id,
      nombre: favorito.producto_nombre || 'Producto sin nombre',
      precio: favorito.precio || 0,
      precio_original: favorito.precio_original,
      descuento: descuento,
      stock: favorito.stock || 0,
      fotos_principales: imagenesReales.length > 0 ? imagenesReales : [],
      slug: favorito.producto_slug || generarSlugDesdeNombre(favorito.producto_nombre, favorito.producto_id),
      disponible: favorito.producto_activo !== false,
      descripcion: favorito.descripcion || 'Descripción no disponible',
      destacado: false,
      ventajas: favorito.ventajas || [],
      categoria: favorito.categoria_nombre || 'General',
      // Mantener datos del favorito
      favorito_id: favorito.id,
      fecha_agregado: favorito.fecha_agregado
    }
    
    console.log(`✅ Producto convertido:`, productoConvertido)
    return productoConvertido
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
                <option value="recientes">Más recientes</option>
                <option value="nombre">Nombre A-Z</option>
                <option value="precio_asc">Precio menor a mayor</option>
                <option value="precio_desc">Precio mayor a menor</option>
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
            {favoritosPaginados.length === 0 ? (
              <div className="favoritos-sin-resultados">
                <Heart className="icono-sin-resultados" />
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar tu búsqueda o explorar más productos</p>
              </div>
            ) : (
              favoritosPaginados.map((favorito) => {
                const productoConvertido = convertirFavoritoAProducto(favorito)
                console.log(`🎨 Renderizando producto convertido:`, productoConvertido)
                return (
                  <TarjetaProductoVendedora
                    key={favorito.producto_id || favorito.id}
                    producto={productoConvertido}
                    tamaño="normal"
                    mostrarDescuento={true}
                    mostrarUrgencia={true}
                    mostrarPruebaSocial={true}
                    mostrarBadges={true}
                    animaciones={true}
                    vistaLista={vistaActual === 'list'}
                  />
                )
              })
            )}
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