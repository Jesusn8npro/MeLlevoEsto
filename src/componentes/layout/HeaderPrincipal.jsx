import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  User, 
  Menu, 
  X,
  Truck,
  RotateCcw,
  Smartphone,
  Phone,
  ChevronDown,
  MapPin,
  Clock,
  FileText,
  Info,
  Mail,
  Shield,
  LogOut,
  Settings,
  Package
} from 'lucide-react'
import ModalAutenticacion from '../autenticacion/ModalAutenticacion'
import ModalBusqueda from '../busqueda/ModalBusqueda'
import './HeaderPrincipal.css'

export default function HeaderPrincipal() {
  const navigate = useNavigate()
  const { usuario, sesionIniciada, esAdmin, cerrarSesion } = useAuth()
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const [modalAutenticacionAbierto, setModalAutenticacionAbierto] = useState(false)
  const [modalBusquedaAbierto, setModalBusquedaAbierto] = useState(false)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false)
  const [menuPaginasAbierto, setMenuPaginasAbierto] = useState(false)
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const buscadorRef = useRef(null)
  const categoriasRef = useRef(null)
  const paginasRef = useRef(null)
  const usuarioRef = useRef(null)
  const categoriasTimeoutRef = useRef(null)
  const paginasTimeoutRef = useRef(null)
  const usuarioTimeoutRef = useRef(null)

  // Datos temporales (después conectaremos con Supabase)
  const cantidadCarrito = 3
  const cantidadFavoritos = 5

  const categoriasPrincipales = [
    { nombre: 'Ofertas Flash', icono: '🔥', destacado: true, ruta: '/ofertas' },
    { nombre: 'Electrónicos', icono: '📱', ruta: '/electronica' },
    { nombre: 'Ropa y Moda', icono: '👕', ruta: '/ropa' },
    { nombre: 'Hogar y Jardín', icono: '🏠', ruta: '/hogar' },
    { nombre: 'Deportes', icono: '⚽', ruta: '/deportes' },
    { nombre: 'Belleza', icono: '💄', ruta: '/belleza' },
    { nombre: 'Vehículos', icono: '🚗', ruta: '/vehiculos' },
    { nombre: 'Juguetes', icono: '🧸', ruta: '/juguetes' }
  ]

  const paginasEmpresa = [
    { nombre: 'Quiénes Somos', icono: <Info size={16} />, ruta: '/quienes-somos' },
    { nombre: 'Contacto', icono: <Mail size={16} />, ruta: '/contacto' },
    { nombre: 'Términos y Condiciones', icono: <FileText size={16} />, ruta: '/terminos-condiciones' },
    { nombre: 'Política de Privacidad', icono: <Shield size={16} />, ruta: '/politica-privacidad' },
    { nombre: 'Preguntas Frecuentes', icono: <FileText size={16} />, ruta: '/preguntas-frecuentes' },
    { nombre: 'Trabaja con Nosotros', icono: <User size={16} />, ruta: '/trabaja-con-nosotros' }
  ]

  // Sugerencias de búsqueda inteligentes
  const sugerenciasPopulares = [
    'iPhone 15 Pro Max',
    'Samsung Galaxy S24',
    'MacBook Air M3',
    'AirPods Pro',
    'PlayStation 5',
    'Nintendo Switch',
    'Ropa deportiva Nike',
    'Zapatos Adidas',
    'Smart TV 4K',
    'Auriculares Bluetooth'
  ]

  const manejarBusqueda = (e) => {
    e.preventDefault()
    setModalBusquedaAbierto(true)
  }

  const abrirModalBusqueda = () => {
    setModalBusquedaAbierto(true)
  }

  const manejarCambioBusqueda = (e) => {
    const valor = e.target.value
    setTerminoBusqueda(valor)
    setSugerenciasAbiertas(valor.length > 0)
  }

  const seleccionarSugerencia = (sugerencia) => {
    setTerminoBusqueda(sugerencia)
    setSugerenciasAbiertas(false)
  }

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setSugerenciasAbiertas(false)
      }
      // Cerrar dropdowns si se hace click fuera
      if (!event.target.closest('.todas-categorias')) {
        setCategoriasAbiertas(false)
      }
      if (!event.target.closest('.menu-enlace-dropdown')) {
        setMenuPaginasAbierto(false)
      }
      if (!event.target.closest('.usuario-item')) {
        setMenuUsuarioAbierto(false)
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => {
      document.removeEventListener('mousedown', manejarClickFuera)
      // Limpiar timeouts al desmontar
      if (categoriasTimeoutRef.current) {
        clearTimeout(categoriasTimeoutRef.current)
      }
      if (paginasTimeoutRef.current) {
        clearTimeout(paginasTimeoutRef.current)
      }
      if (usuarioTimeoutRef.current) {
        clearTimeout(usuarioTimeoutRef.current)
      }
    }
  }, [])

  const sugerenciasFiltradas = terminoBusqueda.length > 0 
    ? sugerenciasPopulares.filter(sugerencia =>
        sugerencia.toLowerCase().includes(terminoBusqueda.toLowerCase())
      ).slice(0, 6)
    : sugerenciasPopulares.slice(0, 4)

  // Función para obtener la posición del elemento
  const obtenerPosicionDropdown = (ref) => {
    if (!ref.current) return { top: 0, left: 0 }
    const rect = ref.current.getBoundingClientRect()
    return {
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    }
  }

  // Funciones para manejar hover con delay
  const abrirCategorias = () => {
    if (categoriasTimeoutRef.current) {
      clearTimeout(categoriasTimeoutRef.current)
    }
    setCategoriasAbiertas(true)
  }

  const cerrarCategorias = () => {
    categoriasTimeoutRef.current = setTimeout(() => {
      setCategoriasAbiertas(false)
    }, 150) // 150ms de delay
  }

  const abrirPaginas = () => {
    if (paginasTimeoutRef.current) {
      clearTimeout(paginasTimeoutRef.current)
    }
    setMenuPaginasAbierto(true)
  }

  const cerrarPaginas = () => {
    paginasTimeoutRef.current = setTimeout(() => {
      setMenuPaginasAbierto(false)
    }, 150) // 150ms de delay
  }

  const abrirUsuario = () => {
    if (usuarioTimeoutRef.current) {
      clearTimeout(usuarioTimeoutRef.current)
    }
    setMenuUsuarioAbierto(true)
  }

  const cerrarUsuario = () => {
    usuarioTimeoutRef.current = setTimeout(() => {
      setMenuUsuarioAbierto(false)
    }, 150) // 150ms de delay
  }

  // Funciones para manejar navegación en Portals
  const manejarNavegacionCategoria = (ruta) => {
    setCategoriasAbiertas(false)
    navigate(ruta)
  }

  const manejarNavegacionPagina = (ruta) => {
    setMenuPaginasAbierto(false)
    navigate(ruta)
  }

  const manejarCerrarSesion = async () => {
    try {
      setMenuUsuarioAbierto(false)
      const resultado = await cerrarSesion()
      if (resultado.success) {
        navigate('/')
      }
    } catch (error) {
      // Error silencioso
    }
  }



  return (
    <header className="header-principal">
      {/* Barra superior promocional mejorada */}
      <div className="barra-promocional">
        <div className="contenedor-promocional">
          {/* Redes sociales */}
          <div className="redes-sociales">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="red-social facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="red-social instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="red-social twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="red-social youtube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Promociones centrales */}
          <div className="promociones-lista">
            <div className="promocion-item">
              <Truck className="promocion-icono" />
              <span>Envío gratis</span>
            </div>
            <div className="promocion-item">
              <RotateCcw className="promocion-icono" />
              <span>Devoluciones gratis</span>
            </div>
            <div className="promocion-item">
              <Smartphone className="promocion-icono" />
              <span>Descarga nuestra app</span>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="info-contacto">
            <div className="contacto-item">
              <Phone size={14} />
              <span>301-234-5678</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="header-contenido">
        <div className="contenedor-header">
          {/* Logo */}
          <Link to="/" className="logo-contenedor">
            <div className="logo-principal">
              <span className="logo-icono">🛍️</span>
              <div className="logo-texto">
                <h1>ME LLEVO ESTO</h1>
                <span className="logo-dominio">.com</span>
              </div>
            </div>
          </Link>

          {/* Buscador central mejorado */}
          <div className="buscador-contenedor" ref={buscadorRef}>
            <form onSubmit={manejarBusqueda} className="buscador-form">
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                onClick={abrirModalBusqueda}
                placeholder="Busca productos increíbles..."
                className="buscador-input"
                autoComplete="off"
                readOnly
              />
              <button type="submit" className="buscador-boton">
                <Search className="buscador-icono" />
              </button>
            </form>

            {/* Sugerencias dinámicas */}
            {sugerenciasAbiertas && (
              <div className="buscador-dropdown">
                <div className="sugerencias-header">
                  <span>Sugerencias populares</span>
                </div>
                <div className="sugerencias-lista">
                  {sugerenciasFiltradas.map((sugerencia, index) => (
                    <button
                      key={index}
                      onClick={() => seleccionarSugerencia(sugerencia)}
                      className="sugerencia-item"
                    >
                      <Search size={16} className="sugerencia-icono" />
                      <span>{sugerencia}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags populares para escritorio */}
            <div className="buscador-sugerencias ocultar-movil">
              <span>Populares:</span>
              <button 
                onClick={() => seleccionarSugerencia('iPhone')}
                className="sugerencia-tag"
              >
                iPhone
              </button>
              <button 
                onClick={() => seleccionarSugerencia('Samsung')}
                className="sugerencia-tag"
              >
                Samsung
              </button>
              <button 
                onClick={() => seleccionarSugerencia('Ropa deportiva')}
                className="sugerencia-tag"
              >
                Ropa
              </button>
              <button 
                onClick={() => seleccionarSugerencia('Zapatos')}
                className="sugerencia-tag"
              >
                Zapatos
              </button>
            </div>
          </div>

          {/* Iconos de acción */}
          <div className="acciones-contenedor">
            {/* Teléfono */}
            <div className="accion-item telefono-item">
              <Phone className="accion-icono" />
              <div className="telefono-info">
                <span className="telefono-numero">📞 301-234-5678</span>
                <small>Atención 24/7</small>
              </div>
            </div>

            {/* Usuario */}
            {sesionIniciada ? (
              <div 
                ref={usuarioRef}
                className="accion-item usuario-item usuario-logueado"
                onMouseEnter={abrirUsuario}
                onMouseLeave={cerrarUsuario}
              >
                <User className="accion-icono" />
                <div className="usuario-info">
                  <span>Hola, {usuario?.nombre?.split(' ')[0] || 'Usuario'}</span>
                  <small>{esAdmin() ? 'Administrador' : 'Mi Cuenta'}</small>
                </div>
                <ChevronDown className={`usuario-dropdown-icono ${menuUsuarioAbierto ? 'rotado' : ''}`} />
              </div>
            ) : (
              <button 
                onClick={() => setModalAutenticacionAbierto(true)}
                className="accion-item usuario-item"
              >
                <User className="accion-icono" />
                <div className="usuario-info">
                  <span>Iniciar sesión/Registrar</span>
                  <small>Pedidos y cuenta</small>
                </div>
              </button>
            )}

            {/* Búsqueda móvil */}
            <button 
              onClick={abrirModalBusqueda}
              className="accion-item busqueda-item mostrar-movil"
            >
              <Search className="accion-icono" />
            </button>

            {/* Favoritos - Solo escritorio */}
            <Link to="/favoritos" className="accion-item favoritos-item ocultar-movil">
              <div className="icono-contenedor">
                <Heart className="accion-icono" />
                {cantidadFavoritos > 0 && (
                  <span className="contador-badge">{cantidadFavoritos}</span>
                )}
              </div>
            </Link>

            {/* Carrito */}
            <Link to="/carrito" className="accion-item carrito-item">
              <div className="icono-contenedor">
                <ShoppingCart className="accion-icono" />
                {cantidadCarrito > 0 && (
                  <span className="contador-badge">{cantidadCarrito}</span>
                )}
              </div>
              <div className="carrito-info">
                <span>MI CARRITO</span>
                <small>$0.00</small>
              </div>
            </Link>

            {/* Menú móvil */}
            <button 
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="menu-movil-boton"
            >
              {menuMovilAbierto ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú de navegación mejorado */}
      <nav className="menu-navegacion">
        <div className="contenedor-menu">
        {/* Todas las categorías con dropdown */}
        <div 
          ref={categoriasRef}
          className="todas-categorias"
          onMouseEnter={abrirCategorias}
          onMouseLeave={cerrarCategorias}
        >
          <Menu className="categorias-icono" />
          <span>TODAS LAS CATEGORÍAS</span>
          <ChevronDown className={`dropdown-icono ${categoriasAbiertas ? 'rotado' : ''}`} />
          
          {/* Dropdown de categorías - placeholder para ref */}
        </div>

          {/* Menú principal */}
          <div className="menu-principal">
            <Link to="/" className="menu-enlace activo">INICIO</Link>
            <Link to="/ofertas" className="menu-enlace destacado">
              <span className="etiqueta-nuevo">HOT</span>
              OFERTAS FLASH
            </Link>
            <Link to="/electronica" className="menu-enlace">ELECTRÓNICOS</Link>
            <Link to="/ropa" className="menu-enlace">ROPA</Link>
            <Link to="/hogar" className="menu-enlace">HOGAR</Link>
            <Link to="/vehiculos" className="menu-enlace">
              <span className="etiqueta-nuevo">NUEVO</span>
              VEHÍCULOS
            </Link>
            
            {/* Menú Páginas con dropdown */}
            <div 
              ref={paginasRef}
              className="menu-enlace-dropdown"
              onMouseEnter={abrirPaginas}
              onMouseLeave={cerrarPaginas}
            >
              <button className="menu-enlace menu-enlace-boton">
                PÁGINAS
                <ChevronDown size={16} className={`menu-dropdown-icono ${menuPaginasAbierto ? 'rotado' : ''}`} />
              </button>
              
              {/* Dropdown de páginas - placeholder para ref */}
            </div>
            
            <Link to="/blog" className="menu-enlace">BLOG</Link>
            <Link to="/ayuda" className="menu-enlace">AYUDA</Link>
          </div>

          {/* Ofertas especiales */}
          <div className="ofertas-especiales">
            <span className="oferta-texto">Ofertas Especiales</span>
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {menuMovilAbierto && (
        <div className={`menu-movil-overlay ${menuMovilAbierto ? 'mostrar' : ''}`}>
          <div className="menu-movil-contenido">
            <div className="menu-movil-header">
              <h3>Menú</h3>
              <button 
                onClick={() => setMenuMovilAbierto(false)}
                className="cerrar-menu-movil"
              >
                <X />
              </button>
            </div>
            
            {/* Buscador móvil mejorado */}
            <div className="menu-movil-busqueda">
              <form onSubmit={manejarBusqueda} className="busqueda-movil-form">
                <input
                  type="text"
                  value={terminoBusqueda}
                  onChange={manejarCambioBusqueda}
                  placeholder="Buscar productos..."
                  className="menu-movil-input"
                  autoComplete="off"
                />
                <button type="submit" className="menu-movil-buscar">
                  <Search />
                </button>
              </form>
              
              {/* Sugerencias rápidas móvil */}
              <div className="sugerencias-movil">
                <span className="sugerencias-titulo">Búsquedas populares:</span>
                <div className="sugerencias-tags-movil">
                  {['iPhone', 'Samsung', 'Ropa', 'Zapatos'].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTerminoBusqueda(tag)
                        manejarBusqueda({ preventDefault: () => {} })
                      }}
                      className="sugerencia-tag-movil"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Categorías principales móvil */}
            <div className="menu-movil-seccion">
              <h4 className="seccion-titulo">Categorías</h4>
              <div className="menu-movil-categorias">
                {categoriasPrincipales.map((categoria, index) => (
                  <Link
                    key={index}
                    to={categoria.ruta}
                    className="menu-movil-categoria"
                    onClick={() => setMenuMovilAbierto(false)}
                  >
                    <span className="categoria-icono">{categoria.icono}</span>
                    <span className="categoria-nombre">{categoria.nombre}</span>
                    {categoria.destacado && <span className="categoria-badge">HOT</span>}
                  </Link>
                ))}
              </div>
            </div>

            {/* Páginas de la empresa móvil */}
            <div className="menu-movil-seccion">
              <h4 className="seccion-titulo">Páginas</h4>
              <div className="menu-movil-paginas">
                {paginasEmpresa.map((pagina, index) => (
                  <Link
                    key={index}
                    to={pagina.ruta}
                    className="menu-movil-pagina"
                    onClick={() => setMenuMovilAbierto(false)}
                  >
                    {pagina.icono}
                    <span>{pagina.nombre}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="menu-movil-acciones">
              <button 
                onClick={() => {
                  setModalBusquedaAbierto(true)
                  setMenuMovilAbierto(false)
                }}
                className="menu-movil-accion"
              >
                <Search />
                <span>Buscar Productos</span>
              </button>
              <button 
                onClick={() => {
                  setModalAutenticacionAbierto(true)
                  setMenuMovilAbierto(false)
                }}
                className="menu-movil-accion"
              >
                <User />
                <span>Mi Cuenta</span>
              </button>
              <Link 
                to="/favoritos" 
                className="menu-movil-accion"
                onClick={() => setMenuMovilAbierto(false)}
              >
                <Heart />
                <span>Favoritos ({cantidadFavoritos})</span>
              </Link>
              <Link 
                to="/carrito" 
                className="menu-movil-accion"
                onClick={() => setMenuMovilAbierto(false)}
              >
                <ShoppingCart />
                <span>Carrito ({cantidadCarrito})</span>
              </Link>
            </div>

            {/* Footer premium del menú móvil */}
            <div className="menu-movil-footer">
              <div className="menu-movil-footer-logo">🛍️</div>
              <h4>ME LLEVO ESTO</h4>
              <p>La tienda más vendedora del mercado.<br />¡Ofertas increíbles te esperan!</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de autenticación */}
      <ModalAutenticacion 
        abierto={modalAutenticacionAbierto}
        onCerrar={() => setModalAutenticacionAbierto(false)}
      />


            {/* Modal de búsqueda */}
            <ModalBusqueda 
              abierto={modalBusquedaAbierto}
              onCerrar={() => setModalBusquedaAbierto(false)}
            />

            {/* React Portals para dropdowns */}
            {categoriasAbiertas && createPortal(
              <div 
                className="categorias-dropdown"
                style={{
                  position: 'fixed',
                  top: obtenerPosicionDropdown(categoriasRef).top,
                  left: obtenerPosicionDropdown(categoriasRef).left,
                  zIndex: 9999
                }}
                onMouseEnter={abrirCategorias}
                onMouseLeave={cerrarCategorias}
              >
                {categoriasPrincipales.map((categoria, index) => (
                  <button
                    key={index}
                    className="categoria-dropdown-item"
                    onMouseDown={() => manejarNavegacionCategoria(categoria.ruta)}
                  >
                    <span className="categoria-icono-dropdown">{categoria.icono}</span>
                    <span>{categoria.nombre}</span>
                    {categoria.destacado && <span className="categoria-badge-small">HOT</span>}
                  </button>
                ))}
              </div>,
              document.body
            )}

            {menuPaginasAbierto && createPortal(
              <div 
                className="paginas-dropdown"
                style={{
                  position: 'fixed',
                  top: obtenerPosicionDropdown(paginasRef).top,
                  left: obtenerPosicionDropdown(paginasRef).left,
                  zIndex: 9999
                }}
                onMouseEnter={abrirPaginas}
                onMouseLeave={cerrarPaginas}
              >
                {paginasEmpresa.map((pagina, index) => (
                  <button
                    key={index}
                    className="pagina-dropdown-item"
                    onMouseDown={() => manejarNavegacionPagina(pagina.ruta)}
                  >
                    {pagina.icono}
                    <span>{pagina.nombre}</span>
                  </button>
                ))}
              </div>,
              document.body
            )}

            {menuUsuarioAbierto && sesionIniciada && createPortal(
              <div 
                className="usuario-dropdown"
                style={{
                  position: 'fixed',
                  top: obtenerPosicionDropdown(usuarioRef).top,
                  left: obtenerPosicionDropdown(usuarioRef).left,
                  zIndex: 9999
                }}
                onMouseEnter={abrirUsuario}
                onMouseLeave={cerrarUsuario}
              >
                <div className="usuario-dropdown-header">
                  <div className="usuario-avatar">
                    <User size={20} />
                  </div>
                  <div className="usuario-datos">
                    <span className="usuario-nombre">{usuario?.nombre}</span>
                    <span className="usuario-email">{usuario?.email}</span>
                  </div>
                </div>
                
                <div className="usuario-dropdown-divider"></div>
                
                <button
                  className="usuario-dropdown-item"
                  onMouseDown={() => {
                    setMenuUsuarioAbierto(false)
                    navigate('/perfil')
                  }}
                >
                  <Settings size={16} />
                  <span>Mi Perfil</span>
                </button>
                
                <button
                  className="usuario-dropdown-item"
                  onMouseDown={() => {
                    setMenuUsuarioAbierto(false)
                    navigate('/pedidos')
                  }}
                >
                  <Package size={16} />
                  <span>Mis Pedidos</span>
                </button>
                
                {esAdmin() && (
                  <button
                    className="usuario-dropdown-item admin-item"
                    onMouseDown={() => {
                      setMenuUsuarioAbierto(false)
                      navigate('/admin')
                    }}
                  >
                    <Shield size={16} />
                    <span>Dashboard Admin</span>
                  </button>
                )}
                
                <div className="usuario-dropdown-divider"></div>
                
                <button
                  className="usuario-dropdown-item logout-item"
                  onMouseDown={manejarCerrarSesion}
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>,
              document.body
            )}
          </header>
        )
      }
