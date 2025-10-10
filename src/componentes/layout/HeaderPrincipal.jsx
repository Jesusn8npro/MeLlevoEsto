import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown, 
  Home, 
  Store, 
  Heart, 
  UserCircle,
  Package,
  LayoutGrid,
  ChevronRight,
  Tag,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Gamepad2,
  Shirt,
  Zap,
  MapPin,
  Globe,
  Phone,
  LogOut,
  Settings,
  ShoppingBag
} from 'lucide-react'
import { clienteSupabase } from '../../configuracion/supabase'
import ModalBusqueda from '../busqueda/ModalBusqueda'
import ModalAutenticacion from '../autenticacion/ModalAutenticacion'
import ModalCarrito from '../carrito/CarritoFlotante'
import { useFavoritos } from '../../contextos/FavoritosContext'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { useCarrito } from '../../contextos/CarritoContext'
import './HeaderPrincipal.css'
import MenuMovilOverlay from './MenuMovilOverlay'
import SliderInformacion from './SliderInformacion'

const HeaderPrincipal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { favoritos } = useFavoritos()
const { usuario, sesionInicializada, cerrarSesion, esAdmin } = useAuth()
  const { totalItems, modalAbierto, alternarModal } = useCarrito()
  const [busqueda, setBusqueda] = useState('')
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const [departamentosAbierto, setDepartamentosAbierto] = useState(false)
  const [homeLayoutAbierto, setHomeLayoutAbierto] = useState(false)
  const [categoryAbierto, setCategoryAbierto] = useState(false)
  const [productAbierto, setProductAbierto] = useState(false)
  const [blogAbierto, setBlogAbierto] = useState(false)
  const [modalBusquedaAbierto, setModalBusquedaAbierto] = useState(false)
  const [modalAutenticacionAbierto, setModalAutenticacionAbierto] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false)
  const [cargandoCategorias, setCargandoCategorias] = useState(false)
  const [headerSticky, setHeaderSticky] = useState(false)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  
  const headerRef = useRef(null)

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (evento) => {
      if (headerRef.current && !headerRef.current.contains(evento.target)) {
        setDepartamentosAbierto(false)
        setHomeLayoutAbierto(false)
        setCategoryAbierto(false)
        setProductAbierto(false)
        setBlogAbierto(false)
        setMenuUsuarioAbierto(false)
      }
    }

    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [])

  // Cargar categorías para el menú móvil
  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    setCargandoCategorias(true)
    try {
      // Cargar categorías
      const { data: categoriasData, error: categoriasError } = await clienteSupabase
        .from('categorias')
        .select('id, nombre, slug, icono, descripcion')
        .eq('activo', true)
        .order('nombre')

      if (categoriasError) throw categoriasError

      // Contar productos por categoría
      const categoriasConConteo = await Promise.all(
        (categoriasData || []).map(async (categoria) => {
          const { count, error: countError } = await clienteSupabase
            .from('productos')
            .select('*', { count: 'exact', head: true })
            .eq('categoria_id', categoria.id)
            .eq('activo', true)

          if (countError) {
            console.error(`Error contando productos para categoría ${categoria.nombre}:`, countError)
            return { ...categoria, cantidad: 0 }
          }

          // Si la categoría no tiene slug, generarlo desde el nombre
          const slugFinal = categoria.slug || categoria.nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')

          return { ...categoria, slug: slugFinal, cantidad: count || 0 }
        })
      )

      setCategorias(categoriasConConteo.filter(cat => cat.cantidad > 0))
    } catch (error) {
      console.error('Error cargando categorías:', error)
      setCategorias([])
    } finally {
      setCargandoCategorias(false)
    }
  }

  // Función para obtener icono de categoría
  const obtenerIconoCategoria = (categoria) => {
    const nombre = categoria.nombre?.toLowerCase() || ''
    const icono = categoria.icono?.toLowerCase() || ''
    
    if (nombre.includes('electrón') || nombre.includes('tecnolog') || icono.includes('smartphone')) {
      return <Smartphone size={20} />
    }
    if (nombre.includes('computador') || nombre.includes('laptop') || icono.includes('laptop')) {
      return <Laptop size={20} />
    }
    if (nombre.includes('audio') || nombre.includes('audífono') || icono.includes('headphones')) {
      return <Headphones size={20} />
    }
    if (nombre.includes('cámara') || nombre.includes('foto') || icono.includes('camera')) {
      return <Camera size={20} />
    }
    if (nombre.includes('reloj') || nombre.includes('watch') || icono.includes('watch')) {
      return <Watch size={20} />
    }
    if (nombre.includes('juego') || nombre.includes('gaming') || icono.includes('gamepad')) {
      return <Gamepad2 size={20} />
    }
    if (nombre.includes('ropa') || nombre.includes('moda') || icono.includes('shirt')) {
      return <Shirt size={20} />
    }
    if (nombre.includes('hogar') || nombre.includes('casa') || icono.includes('home')) {
      return <Home size={20} />
    }
    
    // Icono por defecto
    return <Tag size={20} />
  }

  const manejarNavegacionCategoria = (categoria) => {
    setMenuMovilAbierto(false)
    navigate(`/tienda/categoria/${categoria.slug}`)
  }

  // Manejar búsqueda
  const manejarBusqueda = (e) => {
    e.preventDefault()
    console.log('Búsqueda:', busqueda)
  }

  // Detectar si estamos en una página de producto para desactivar sticky
  const esPaginaProducto = location.pathname.startsWith('/producto/')

  // Detectar scroll para header sticky (solo si NO estamos en página de producto)
  useEffect(() => {
    if (esPaginaProducto) {
      setHeaderSticky(false) // Forzar no sticky en páginas de producto
      return
    }

    const manejarScroll = () => {
      const scrollY = window.scrollY
      const shouldBeSticky = scrollY > 100 // Activar sticky después de 100px de scroll
      
      if (shouldBeSticky !== headerSticky) {
        setHeaderSticky(shouldBeSticky)
      }
    }

    window.addEventListener('scroll', manejarScroll, { passive: true })
    return () => window.removeEventListener('scroll', manejarScroll)
  }, [headerSticky, esPaginaProducto])

  // Alternar menú móvil
  const alternarMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto)
  }

  // Manejar cierre de sesión
  const manejarCerrarSesion = async () => {
    try {
      if (typeof cerrarSesionTotal === 'function') {
        await cerrarSesionTotal()
      } else {
        await cerrarSesion()
        navigate('/sesion-cerrada')
      }
      setMenuUsuarioAbierto(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Detectar si estamos en área admin o cliente
  const estaEnAdmin = location?.pathname?.startsWith('/admin')

  // Navegar a admin
  const navegarAAdmin = () => {
    setMenuUsuarioAbierto(false)
    navigate('/admin')
  }

  // Navegar a productos admin
  const navegarAProductosAdmin = () => {
    setMenuUsuarioAbierto(false)
    navigate('/admin/productos')
  }

  // Navegar a agregar producto
  const navegarAAgregarProducto = () => {
    setMenuUsuarioAbierto(false)
    navigate('/admin/productos/agregar')
  }

  // Navegaciones cliente
  const navegarAPerfil = () => {
    setMenuUsuarioAbierto(false)
    navigate('/perfil')
  }

  const navegarAFavoritos = () => {
    setMenuUsuarioAbierto(false)
    navigate('/favoritos')
  }

  return (
    <header className={`header-principal ${headerSticky ? 'sticky' : ''}`} ref={headerRef}>
      {/* Barra Promocional Superior eliminada por solicitud */}

      {/* Barra de Información Superior - Componente encapsulado */}
      <SliderInformacion
        items={[
          '✅ Contra entrega disponible',
          '🛍️ Plataforma Multiproductos',
          '🚚 Envío rápido a todo el país',
          '💳 Pagos seguros 100%',
          '📞 Atención al cliente 24/7',
          '🔥 Ofertas nuevas cada día',
        ]}
        speed={35}
      />

      {/* Header Principal */}
      <div className="header-contenido">
        <div className="contenedor-header">
          {/* Contenedor Menú + Logo (Solo Móvil) */}
          <div className="menu-logo-contenedor">
            <button className="menu-movil-boton" onClick={alternarMenuMovil}>
              <Menu size={24} />
            </button>
            <Link to="/" className="logo-contenedor">
              <div className="logo">
                <span className="logo-texto">MeLlevo</span>
                <span className="logo-destacado">Esto</span>
              </div>
            </Link>
          </div>

          {/* Logo para Escritorio */}
          <Link to="/" className="logo-contenedor logo-escritorio">
            <div className="logo">
              <span className="logo-texto">MeLlevo</span>
              <span className="logo-destacado">Esto</span>
            </div>
          </Link>

          {/* Buscador Central (Desktop) */}
          <div className="buscador-contenedor">
            <div className="buscador-form">
              <input
                type="text"
                placeholder="Busca lo que necesitas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="buscador-input"
                onClick={() => setModalBusquedaAbierto(true)}
                readOnly
              />
              <button type="button" className="buscador-boton" onClick={() => setModalBusquedaAbierto(true)}>
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Acciones del Header (Derecha) */}
          <div className="acciones-header">
            {/* Ícono de búsqueda sticky (solo visible al hacer scroll) */}
            <button className="buscar-icono-sticky" onClick={() => setModalBusquedaAbierto(true)}>
              <Search size={20} />
            </button>
            
            <Link to="/favoritos" className="accion-item favoritos-enlace">
              <div className="favoritos-contenedor">
                <Heart size={24} />
                {favoritos.length > 0 && (
                  <span className="favoritos-contador">{favoritos.length}</span>
                )}
              </div>
            </Link>
            <button 
              className="accion-item carrito-enlace" 
              onClick={alternarModal}
              title="Abrir carrito"
            >
              <div className="carrito-contenedor">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="carrito-contador">{totalItems}</span>
                )}
              </div>
            </button>
            {!sesionInicializada ? (
              <div className="usuario-logueado">
                <button className="accion-item" disabled>
                  <User className="icono-usuario-header" />
                  <div className="usuario-info">
                    <span className="usuario-texto">Cargando…</span>
                    <span className="usuario-subtexto">Mi Cuenta</span>
                  </div>
                </button>
              </div>
            ) : sesionInicializada && usuario ? (
              <div className="usuario-logueado">
                <button 
                  className="accion-item" 
                  onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                >
                  <User className="icono-usuario-header" />
                  <div className="usuario-info">
                    <span className="usuario-texto">
                      {usuario.nombre || usuario.email?.split('@')[0] || usuario.user_metadata?.nombre || 'Usuario'}
                    </span>
                    <span className="usuario-subtexto">Mi Cuenta</span>
                  </div>
                  <ChevronDown size={12} className={`flecha-usuario ${menuUsuarioAbierto ? 'rotado' : ''}`} />
                </button>
                
                {menuUsuarioAbierto && (
                  <div className="dropdown-usuario">
                    {esAdmin?.() ? (
                      <>
                        <button className="dropdown-item" onClick={navegarAAdmin}>
                          <Settings size={16} />
                          Panel Admin
                        </button>
                        <button className="dropdown-item" onClick={navegarAProductosAdmin}>
                          <ShoppingBag size={16} />
                          Productos
                        </button>
                        <button className="dropdown-item" onClick={navegarAAgregarProducto}>
                          <Package size={16} />
                          Agregar Producto
                        </button>
                        <div className="dropdown-divider"></div>
                      </>
                    ) : (
                      <>
                        <button className="dropdown-item" onClick={navegarAPerfil}>
                          <UserCircle size={16} />
                          Perfil
                        </button>
                        <button className="dropdown-item" onClick={navegarAFavoritos}>
                          <Heart size={16} />
                          Favoritos
                        </button>
                        {esAdmin?.() && (
                          <>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={navegarAAdmin}>
                              <Settings size={16} />
                              Ir al Panel Admin
                            </button>
                          </>
                        )}
                        <div className="dropdown-divider"></div>
                      </>
                    )}
                    <button className="dropdown-item logout-item" onClick={manejarCerrarSesion}>
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="accion-item usuario-enlace" onClick={() => setModalAutenticacionAbierto(true)}>
                <User className="icono-usuario-header" />
                <div className="usuario-info">
                  <span className="usuario-texto">Iniciar Sesión</span>
                  <span className="usuario-subtexto">Registrarse</span>
                </div>
              </button>
            )}

            {import.meta.env.DEV && (
              <div
                title="Estado de autenticación (solo dev)"
                style={{
                  marginLeft: '8px',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  background: sesionInicializada && usuario ? '#e6ffed' : '#ffecec',
                  color: sesionInicializada && usuario ? '#1a7f37' : '#d93025',
                  border: `1px solid ${sesionInicializada && usuario ? '#1a7f37' : '#d93025'}`
                }}
              >
                auth: init={String(sesionInicializada)} user={usuario?.id || usuario?.email || 'null'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda Móvil */}
      <div className="buscador-movil">
        <div className="buscador-movil-form">
          <input
            type="text"
            placeholder="Busca lo que necesitas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador-movil-input"
            onClick={() => setModalBusquedaAbierto(true)}
            readOnly
          />
          <button type="button" className="buscador-movil-boton" onClick={() => setModalBusquedaAbierto(true)}>
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="menu-navegacion">
        <div className="contenedor-menu">
          {/* Comprar por Departamento */}
          <div className="menu-departamentos">
            <button 
              className="boton-departamentos"
              onClick={() => setDepartamentosAbierto(!departamentosAbierto)}
            >
              <Menu size={18} />
              <span>Comprar por categorias</span>
              <ChevronDown size={16} className={departamentosAbierto ? 'rotado' : ''} />
            </button>
            {departamentosAbierto && (
              <div className="dropdown-departamentos">
                <Link to="/categoria/electronica" className="dropdown-item">Electrónicos</Link>
                <Link to="/categoria/ropa" className="dropdown-item">Ropa</Link>
                <Link to="/categoria/hogar" className="dropdown-item">Hogar</Link>
                <Link to="/categoria/deportes" className="dropdown-item">Deportes</Link>
                <Link to="/categoria/libros" className="dropdown-item">Libros</Link>
              </div>
            )}
          </div>

          {/* Menú Principal */}
          <div className="menu-principal">
            <div className="menu-item dropdown">
              <button 
                className="menu-enlace"
                onClick={() => setHomeLayoutAbierto(!homeLayoutAbierto)}
              >
                Diseño de Inicio
                <ChevronDown size={14} className={homeLayoutAbierto ? 'rotado' : ''} />
              </button>
              {homeLayoutAbierto && (
                <div className="dropdown-menu">
                  <Link to="/" className="dropdown-item">Inicio 1</Link>
                  <Link to="/home-2" className="dropdown-item">Inicio 2</Link>
                  <Link to="/home-3" className="dropdown-item">Inicio 3</Link>
                </div>
              )}
            </div>

            <div className="menu-item dropdown">
              <button 
                className="menu-enlace"
                onClick={() => setCategoryAbierto(!categoryAbierto)}
              >
                Categorías
                <ChevronDown size={14} className={categoryAbierto ? 'rotado' : ''} />
              </button>
              {categoryAbierto && (
                <div className="dropdown-menu">
                  <Link to="/categoria/electronica" className="dropdown-item">Electrónicos</Link>
                  <Link to="/categoria/ropa" className="dropdown-item">Ropa</Link>
                  <Link to="/categoria/hogar" className="dropdown-item">Hogar</Link>
                </div>
              )}
            </div>

            <div className="menu-item dropdown">
              <button 
                className="menu-enlace"
                onClick={() => setProductAbierto(!productAbierto)}
              >
                Productos
                <ChevronDown size={14} className={productAbierto ? 'rotado' : ''} />
              </button>
              {productAbierto && (
                <div className="dropdown-menu">
                  <Link to="/productos" className="dropdown-item">Todos los Productos</Link>
                  <Link to="/productos/nuevos" className="dropdown-item">Nuevos</Link>
                  <Link to="/productos/ofertas" className="dropdown-item">Ofertas</Link>
                </div>
              )}
            </div>

            <div className="menu-item dropdown">
              <button 
                className="menu-enlace"
                onClick={() => setBlogAbierto(!blogAbierto)}
              >
                Blog
                <ChevronDown size={14} className={blogAbierto ? 'rotado' : ''} />
              </button>
              {blogAbierto && (
                <div className="dropdown-menu">
                  <Link to="/blog" className="dropdown-item">Blog Principal</Link>
                  <Link to="/blog/noticias" className="dropdown-item">Noticias</Link>
                  <Link to="/blog/tutoriales" className="dropdown-item">Tutoriales</Link>
                </div>
              )}
            </div>

            <Link to="/contacto" className="menu-enlace">Contacto</Link>
          </div>

          {/* Información de Contacto */}
          <div className="info-contacto">
            <Phone size={16} />
            <span>Línea Directa: 1-800-234-5678</span>
          </div>
        </div>
      </nav>

      {/* Menú móvil overlay extraído a componente */}
      <MenuMovilOverlay
        abierto={menuMovilAbierto}
        onCerrar={() => setMenuMovilAbierto(false)}
        onAbrirBusqueda={() => setModalBusquedaAbierto(true)}
        categorias={categorias}
        cargandoCategorias={cargandoCategorias}
        obtenerIconoCategoria={obtenerIconoCategoria}
        onNavegarCategoria={manejarNavegacionCategoria}
        onAbrirAutenticacion={() => setModalAutenticacionAbierto(true)}
        totalItems={totalItems}
        onAlternarCarrito={alternarModal}
        sesionInicializada={sesionInicializada}
        usuario={usuario}
      />

      {/* Navegación Móvil Inferior */}
      <div className="navegacion-movil-inferior">
        <button className="nav-movil-item" onClick={alternarMenuMovil}>
          <div className="nav-icono-contenedor">
            <Menu size={22} />
          </div>
          <span>Menú</span>
        </button>
        
        <button className="nav-movil-item" onClick={() => setModalBusquedaAbierto(true)}>
          <div className="nav-icono-contenedor">
            <Search size={22} />
          </div>
          <span>Buscar</span>
        </button>
        
        <Link to="/tienda" className="nav-movil-item nav-movil-destacado">
          <div className="nav-icono-contenedor-destacado">
            <Store size={24} />
          </div>
          <span>Tienda</span>
        </Link>
        
        <button className="nav-movil-item" onClick={alternarModal}>
          <div className="nav-icono-contenedor carrito-contenedor-movil">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="carrito-contador-movil">{totalItems}</span>
            )}
          </div>
          <span>Carrito</span>
        </button>
        
        <Link to="/favoritos" className="nav-movil-item">
          <div className="nav-icono-contenedor">
            <Heart size={22} />
          </div>
          <span>Favoritos</span>
        </Link>
      </div>

      {/* Modales */}
      <ModalBusqueda 
        abierto={modalBusquedaAbierto} 
        onCerrar={() => setModalBusquedaAbierto(false)} 
      />
      <ModalAutenticacion 
        abierto={modalAutenticacionAbierto} 
        onCerrar={() => setModalAutenticacionAbierto(false)} 
      />
      <ModalCarrito abierto={modalAbierto} onCerrar={alternarModal} />
    </header>
  )
}

export default HeaderPrincipal
