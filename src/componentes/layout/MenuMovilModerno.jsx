import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  X, 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Home,
  Smartphone,
  Shirt,
  Car,
  Gamepad2,
  Palette,
  Sofa,
  Dumbbell,
  Tag,
  ChevronRight,
  Star
} from 'lucide-react'
import './MenuMovilModerno.css'

/**
 * MenuMovilModerno - Menú móvil moderno estilo XStore
 * 
 * Características:
 * - Diseño moderno con tabs (MENU/CATEGORIES)
 * - Lista de categorías con iconos
 * - Sección de cuenta
 * - Animaciones suaves
 * - Diseño limpio y profesional
 */

const MenuMovilModerno = ({ 
  abierto, 
  onCerrar, 
  terminoBusqueda, 
  onCambioBusqueda, 
  onBuscar, 
  sesionIniciada,
  cantidadCarrito = 0,
  cantidadFavoritos = 0
}) => {
  const [tabActivo, setTabActivo] = useState('menu')

  // Categorías con iconos modernos
  const categorias = [
    { nombre: 'Todas las Categorías', icono: <Home size={20} />, ruta: '/categorias', destacado: true },
    { nombre: 'Audio', icono: <Smartphone size={20} />, ruta: '/categoria/audio' },
    { nombre: 'Cámara y Drones', icono: <Smartphone size={20} />, ruta: '/categoria/camara-drones' },
    { nombre: 'Celulares', icono: <Smartphone size={20} />, ruta: '/categoria/celulares' },
    { nombre: 'Computadores', icono: <Smartphone size={20} />, ruta: '/categoria/computadores' },
    { nombre: 'Ofertas del Día', icono: <Tag size={20} />, ruta: '/categoria/ofertas', destacado: true },
    { nombre: 'iPad y Tablets', icono: <Smartphone size={20} />, ruta: '/categoria/tablets' },
    { nombre: 'Altavoces Portátiles', icono: <Smartphone size={20} />, ruta: '/categoria/altavoces' },
    { nombre: 'Casa Inteligente', icono: <Sofa size={20} />, ruta: '/categoria/casa-inteligente' },
    { nombre: 'TV y Audio', icono: <Smartphone size={20} />, ruta: '/categoria/tv-audio' },
    { nombre: 'Tecnología Wearable', icono: <Smartphone size={20} />, ruta: '/categoria/wearables' }
  ]

  const menuItems = [
    { nombre: 'Inicio', icono: <Home size={20} />, ruta: '/' },
    { nombre: 'Ofertas Flash', icono: <Tag size={20} />, ruta: '/ofertas', badge: 'HOT' },
    { nombre: 'Electrónicos', icono: <Smartphone size={20} />, ruta: '/electronica' },
    { nombre: 'Ropa y Moda', icono: <Shirt size={20} />, ruta: '/ropa' },
    { nombre: 'Hogar y Jardín', icono: <Sofa size={20} />, ruta: '/hogar' },
    { nombre: 'Deportes', icono: <Dumbbell size={20} />, ruta: '/deportes' },
    { nombre: 'Vehículos', icono: <Car size={20} />, ruta: '/vehiculos', badge: 'NUEVO' },
    { nombre: 'Gaming', icono: <Gamepad2 size={20} />, ruta: '/gaming' },
    { nombre: 'Belleza', icono: <Palette size={20} />, ruta: '/belleza' }
  ]

  const handleItemClick = () => {
    onCerrar()
  }

  if (!abierto) return null

  return (
    <div className="menu-movil-moderno-overlay">
      <div className="menu-movil-moderno">
        {/* Header con logo y botón cerrar */}
        <div className="menu-movil-header">
          <div className="menu-movil-logo">
            <div className="logo-icono">🛍️</div>
            <span className="logo-texto">ME LLEVO ESTO</span>
          </div>
          <button 
            onClick={onCerrar}
            className="menu-movil-cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Buscador */}
        <div className="menu-movil-busqueda">
          <form onSubmit={onBuscar} className="busqueda-form">
            <div className="busqueda-input-container">
              <Search size={20} className="busqueda-icono" />
              <input
                type="text"
                value={terminoBusqueda}
                onChange={onCambioBusqueda}
                placeholder="Buscar productos..."
                className="busqueda-input"
              />
            </div>
          </form>
        </div>

        {/* Tabs MENU / CATEGORIES */}
        <div className="menu-movil-tabs">
          <button 
            className={`tab-button ${tabActivo === 'menu' ? 'activo' : ''}`}
            onClick={() => setTabActivo('menu')}
          >
            MENÚ
          </button>
          <button 
            className={`tab-button ${tabActivo === 'categorias' ? 'activo' : ''}`}
            onClick={() => setTabActivo('categorias')}
          >
            CATEGORÍAS
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="menu-movil-contenido">
          {tabActivo === 'menu' && (
            <div className="tab-contenido">
              {/* Lista de menú */}
              <div className="menu-lista">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.ruta}
                    className="menu-item"
                    onClick={handleItemClick}
                  >
                    <div className="menu-item-contenido">
                      <div className="menu-item-izquierda">
                        <div className="menu-item-icono">
                          {item.icono}
                        </div>
                        <span className="menu-item-texto">{item.nombre}</span>
                      </div>
                      <div className="menu-item-derecha">
                        {item.badge && (
                          <span className={`menu-badge ${item.badge === 'HOT' ? 'hot' : 'nuevo'}`}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight size={16} className="menu-chevron" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tabActivo === 'categorias' && (
            <div className="tab-contenido">
              {/* Lista de categorías */}
              <div className="categorias-lista">
                {categorias.map((categoria, index) => (
                  <Link
                    key={index}
                    to={categoria.ruta}
                    className={`categoria-item ${categoria.destacado ? 'destacado' : ''}`}
                    onClick={handleItemClick}
                  >
                    <div className="categoria-item-contenido">
                      <div className="categoria-item-izquierda">
                        <div className="categoria-item-icono">
                          {categoria.icono}
                        </div>
                        <span className="categoria-item-texto">{categoria.nombre}</span>
                      </div>
                      <ChevronRight size={16} className="categoria-chevron" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sección de cuenta */}
        <div className="menu-movil-cuenta">
          <div className="cuenta-divider"></div>
          
          {sesionIniciada ? (
            <div className="cuenta-usuario">
              <div className="usuario-info">
                <div className="usuario-avatar">
                  <User size={20} />
                </div>
                <div className="usuario-datos">
                  <span className="usuario-nombre">Mi Cuenta</span>
                  <span className="usuario-estado">Usuario registrado</span>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="cuenta-login" onClick={handleItemClick}>
              <div className="login-icono">
                <User size={20} />
              </div>
              <span>Iniciar Sesión / Registrarse</span>
            </Link>
          )}

          {/* Acciones rápidas */}
          <div className="cuenta-acciones">
            <Link to="/favoritos" className="cuenta-accion" onClick={handleItemClick}>
              <div className="accion-icono">
                <Heart size={20} />
                {cantidadFavoritos > 0 && (
                  <span className="accion-badge">{cantidadFavoritos}</span>
                )}
              </div>
              <span>Favoritos</span>
            </Link>

            <Link to="/carrito" className="cuenta-accion" onClick={handleItemClick}>
              <div className="accion-icono">
                <ShoppingCart size={20} />
                {cantidadCarrito > 0 && (
                  <span className="accion-badge">{cantidadCarrito}</span>
                )}
              </div>
              <span>Carrito</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuMovilModerno
