import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Search, Package, ExternalLink, Clock, TrendingUp } from 'lucide-react'
import { clienteSupabase } from '../../configuracion/supabase'
import './ModalBusqueda.css'

export default function ModalBusqueda({ abierto, onCerrar }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [productos, setProductos] = useState([])
  const [paginasSugeridas, setPaginasSugeridas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [busquedaReciente, setBusquedaReciente] = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Páginas disponibles en la aplicación
  const paginasDisponibles = [
    { nombre: 'Inicio', ruta: '/', descripcion: 'Página principal del sitio' },
    { nombre: 'Tienda', ruta: '/tienda', descripcion: 'Explora todos nuestros productos' },
    { nombre: 'Favoritos', ruta: '/favoritos', descripcion: 'Tus productos favoritos' },
    { nombre: 'Carrito', ruta: '/carrito', descripcion: 'Revisa tu carrito de compras' },
    { nombre: 'Contacto', ruta: '/contacto', descripcion: 'Contáctanos para cualquier consulta' },
    { nombre: 'Nosotros', ruta: '/nosotros', descripcion: 'Conoce más sobre nuestra empresa' },
    { nombre: 'Categorías', ruta: '/tienda/categorias', descripcion: 'Navega por categorías' },
    { nombre: 'Ofertas', ruta: '/tienda/ofertas', descripcion: 'Productos en oferta' },
    { nombre: 'Nuevos', ruta: '/tienda/nuevos', descripcion: 'Productos recién llegados' },
    { nombre: 'Electrónicos', ruta: '/tienda/categoria/electronica', descripcion: 'Tecnología y electrónicos' },
    { nombre: 'Ropa', ruta: '/tienda/categoria/ropa', descripcion: 'Moda y vestimenta' },
    { nombre: 'Hogar', ruta: '/tienda/categoria/hogar', descripcion: 'Artículos para el hogar' },
    { nombre: 'Deportes', ruta: '/tienda/categoria/deportes', descripcion: 'Artículos deportivos' },
    { nombre: 'Términos y Condiciones', ruta: '/terminos', descripcion: 'Términos y condiciones de uso' },
    { nombre: 'Política de Privacidad', ruta: '/privacidad', descripcion: 'Política de privacidad del sitio' },
    { nombre: 'Preguntas Frecuentes', ruta: '/faq', descripcion: 'Respuestas a preguntas comunes' },
    { nombre: 'Mi Cuenta', ruta: '/mi-cuenta', descripcion: 'Gestiona tu cuenta y pedidos' },
    { nombre: 'Ayuda', ruta: '/ayuda', descripcion: 'Centro de ayuda y soporte' }
  ]

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    if (abierto) {
      const recientes = JSON.parse(localStorage.getItem('busquedas_recientes') || '[]')
      setBusquedaReciente(recientes.slice(0, 5))
      setTerminoBusqueda('')
      setProductos([])
      setPaginasSugeridas([])
      setMostrarSugerencias(false)
      
      // Focus en el input cuando se abre
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }, [abierto])

  // Buscar productos en tiempo real
  useEffect(() => {
    if (terminoBusqueda.length >= 2) {
      buscarProductos()
      buscarPaginas()
      setMostrarSugerencias(true)
    } else {
      setProductos([])
      setPaginasSugeridas([])
      setMostrarSugerencias(false)
    }
  }, [terminoBusqueda])

  const buscarProductos = async () => {
    setCargando(true)
    try {
      // Búsqueda principal en campos de texto
      const { data: productosTexto, error: errorTexto } = await clienteSupabase
        .from('productos')
        .select(`
          id, 
          nombre, 
          precio, 
          slug,
          descripcion,
          marca,
          modelo,
          palabras_clave,
          categorias!categoria_id(nombre),
          producto_imagenes(imagen_principal, imagen_secundaria_1)
        `)
        .or(`nombre.ilike.%${terminoBusqueda}%,descripcion.ilike.%${terminoBusqueda}%,marca.ilike.%${terminoBusqueda}%,modelo.ilike.%${terminoBusqueda}%`)
        .eq('activo', true)
        .limit(6)

      // Búsqueda en palabras clave usando contains
      const { data: productosPalabrasClave, error: errorPalabrasClave } = await clienteSupabase
        .from('productos')
        .select(`
          id, 
          nombre, 
          precio, 
          slug,
          descripcion,
          marca,
          modelo,
          palabras_clave,
          categorias!categoria_id(nombre),
          producto_imagenes(imagen_principal, imagen_secundaria_1)
        `)
        .contains('palabras_clave', [terminoBusqueda])
        .eq('activo', true)
        .limit(6)

      if (errorTexto && errorPalabrasClave) {
        return
      }

      // Combinar resultados y eliminar duplicados
      const todosLosProductos = [...(productosTexto || []), ...(productosPalabrasClave || [])]
      const productosUnicos = todosLosProductos.filter((producto, index, self) => 
        index === self.findIndex(p => p.id === producto.id)
      ).slice(0, 6)

      setProductos(productosUnicos)
    } catch (error) {
      // Error silencioso en producción
    } finally {
      setCargando(false)
    }
  }

  const buscarPaginas = () => {
    const paginasFiltradas = paginasDisponibles.filter(pagina =>
      pagina.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      pagina.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase())
    ).slice(0, 4)
    
    setPaginasSugeridas(paginasFiltradas)
  }

  const guardarBusquedaReciente = (termino) => {
    const recientes = JSON.parse(localStorage.getItem('busquedas_recientes') || '[]')
    const nuevasRecientes = [termino, ...recientes.filter(r => r !== termino)].slice(0, 10)
    localStorage.setItem('busquedas_recientes', JSON.stringify(nuevasRecientes))
  }

  const manejarBusqueda = (e) => {
    e.preventDefault()
    if (terminoBusqueda.trim()) {
      guardarBusquedaReciente(terminoBusqueda.trim())
      navigate(`/tienda/buscar?q=${encodeURIComponent(terminoBusqueda.trim())}`)
      onCerrar()
    }
  }

  const navegarAProducto = (producto) => {
    guardarBusquedaReciente(producto.nombre)
    navigate(`/producto/${producto.slug || producto.id}`)
    onCerrar()
  }

  const navegarAPagina = (ruta) => {
    navigate(ruta)
    onCerrar()
  }

  const usarBusquedaReciente = (termino) => {
    setTerminoBusqueda(termino)
  }

  const usarTagPopular = (tag) => {
    setTerminoBusqueda(tag)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  if (!abierto) return null

  return (
    <div className="modal-busqueda-overlay" onClick={onCerrar}>
      <div className="modal-busqueda-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-busqueda-header">
          <h2>Buscar Productos y Páginas</h2>
          <button onClick={onCerrar} className="cerrar-modal">
            <X />
          </button>
        </div>

        <form onSubmit={manejarBusqueda} className="modal-busqueda-form">
          <div className="busqueda-input-contenedor">
            <Search className="busqueda-icono" />
            <input
              ref={inputRef}
              type="text"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Busca productos, categorías o páginas..."
              className="modal-busqueda-input"
              autoComplete="off"
            />
            {cargando && <div className="busqueda-loading">Buscando...</div>}
          </div>
          <button type="submit" className="buscar-boton" disabled={!terminoBusqueda.trim()}>
            Buscar
          </button>
        </form>

        {/* Resultados de búsqueda */}
        {mostrarSugerencias && (productos.length > 0 || paginasSugeridas.length > 0) && (
          <div className="resultados-busqueda">
            {/* Productos encontrados */}
            {productos.length > 0 && (
              <div className="seccion-resultados">
                <h4><Package size={16} /> Productos ({productos.length})</h4>
                <div className="lista-productos">
                  {productos.map((producto) => (
                    <button
                      key={producto.id}
                      onClick={() => navegarAProducto(producto)}
                      className="item-producto"
                    >
                      <div className="producto-imagen">
                        {producto.producto_imagenes?.[0]?.imagen_principal ? (
                          <img src={producto.producto_imagenes[0].imagen_principal} alt={producto.nombre} />
                        ) : producto.producto_imagenes?.[0]?.imagen_secundaria_1 ? (
                          <img src={producto.producto_imagenes[0].imagen_secundaria_1} alt={producto.nombre} />
                        ) : (
                          <Package size={24} />
                        )}
                      </div>
                      <div className="producto-info">
                        <span className="producto-nombre">{producto.nombre}</span>
                        <span className="producto-categoria">{producto.categorias?.nombre || 'Sin categoría'}</span>
                        <span className="producto-precio">${producto.precio?.toLocaleString()}</span>
                      </div>
                      <ExternalLink size={16} className="producto-icono" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Páginas sugeridas */}
            {paginasSugeridas.length > 0 && (
              <div className="seccion-resultados">
                <h4><ExternalLink size={16} /> Páginas ({paginasSugeridas.length})</h4>
                <div className="lista-paginas">
                  {paginasSugeridas.map((pagina, index) => (
                    <button
                      key={index}
                      onClick={() => navegarAPagina(pagina.ruta)}
                      className="item-pagina"
                    >
                      <div className="pagina-info">
                        <span className="pagina-nombre">{pagina.nombre}</span>
                        <span className="pagina-descripcion">{pagina.descripcion}</span>
                      </div>
                      <ExternalLink size={16} className="pagina-icono" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Búsquedas recientes */}
        {!mostrarSugerencias && busquedaReciente.length > 0 && (
          <div className="busquedas-recientes">
            <h4><Clock size={16} /> Búsquedas recientes</h4>
            <div className="lista-recientes">
              {busquedaReciente.map((termino, index) => (
                <button
                  key={index}
                  onClick={() => usarBusquedaReciente(termino)}
                  className="item-reciente"
                >
                  <Clock size={14} />
                  <span>{termino}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags populares */}
        {!mostrarSugerencias && (
          <div className="sugerencias-populares">
            <h4><TrendingUp size={16} /> Búsquedas populares</h4>
            <div className="tags-populares">
              {['iPhone', 'Samsung', 'Ropa', 'Zapatos', 'Electrónicos', 'Toyota', 'Tecnología', 'Hogar'].map((tag, index) => (
                <button
                  key={index}
                  onClick={() => usarTagPopular(tag)}
                  className="tag-popular"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {mostrarSugerencias && productos.length === 0 && paginasSugeridas.length === 0 && !cargando && (
          <div className="sin-resultados">
            <Search size={48} />
            <h4>No se encontraron resultados</h4>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}