import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useBarraLateral } from '../../../contextos/ContextoBarraLateral'
import {
  GridIcon,
  CalendarIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
  ChevronDownIcon,
  HorizontalDotsIcon,
  ChatIcon
} from '../iconos/IconosAdmin'
import WidgetBarraLateral from './WidgetBarraLateral'
import './BarraLateralAdmin.css'

const elementosNavegacion = [
  {
    icono: <GridIcon />,
    nombre: 'Dashboard',
    subItems: [{ nombre: 'Ecommerce', ruta: '/admin', pro: false }],
  },
  {
    icono: <BoxCubeIcon />,
    nombre: 'Ecommerce',
    subItems: [
      { nombre: 'Productos', ruta: '/admin/productos', pro: false },
      { nombre: 'Creador de productos', ruta: '/admin/productos/creador', pro: false },
      { nombre: 'Agregar Producto', ruta: '/admin/productos/agregar', pro: false },
      { nombre: 'Categorías', ruta: '/admin/categorias', pro: false },
      { nombre: 'Pedidos', ruta: '/admin/pedidos', pro: false },
      { nombre: 'Inventario', ruta: '/admin/inventario', pro: false },
    ],
  },
  {
    icono: <CalendarIcon />,
    nombre: 'Calendario',
    subItems: [
      { nombre: 'Calendario de Tareas', ruta: '/admin/calendario-tareas', pro: false },
      { nombre: 'Tablero de Tareas', ruta: '/admin/tablero-tareas', pro: false },
    ],
  },
  {
    icono: <UserCircleIcon />,
    nombre: 'USUARIOS',
    ruta: '/admin/usuarios',
  },
  {
    icono: <ChatIcon />,
    nombre: 'CHATS',
    ruta: '/admin/chats',
  },
  {
    nombre: 'Formularios',
    icono: <ListIcon />,
    subItems: [{ nombre: 'Elementos de Formulario', ruta: '/admin/elementos-formulario', pro: false }],
  },
  {
    nombre: 'Tablas',
    icono: <TableIcon />,
    subItems: [{ nombre: 'Tablas Básicas', ruta: '/admin/tablas-basicas', pro: false }],
  },
]

const otrosElementos = [
  {
    icono: <PieChartIcon />,
    nombre: 'Gráficos',
    subItems: [
      { nombre: 'Gráfico de Líneas', ruta: '/admin/grafico-lineas', pro: false },
      { nombre: 'Gráfico de Barras', ruta: '/admin/grafico-barras', pro: false },
    ],
  },
  {
    icono: <BoxCubeIcon />,
    nombre: 'Elementos UI',
    subItems: [
      { nombre: 'Alertas', ruta: '/admin/alertas', pro: false },
      { nombre: 'Avatares', ruta: '/admin/avatares', pro: false },
      { nombre: 'Insignias', ruta: '/admin/insignias', pro: false },
      { nombre: 'Botones', ruta: '/admin/botones', pro: false },
      { nombre: 'Imágenes', ruta: '/admin/imagenes', pro: false },
      { nombre: 'Videos', ruta: '/admin/videos', pro: false },
    ],
  },
  {
    icono: <PlugInIcon />,
    nombre: 'Autenticación',
    subItems: [
      { nombre: 'Iniciar Sesión', ruta: '/admin/iniciar-sesion', pro: false },
      { nombre: 'Registrarse', ruta: '/admin/registrarse', pro: false },
    ],
  },
]

const BarraLateralAdmin = () => {
  const { estaExpandida, movilAbierto, estaEnHover, setEstaEnHover, alternarSubmenu, submenuAbierto, setSubmenuAbierto } = useBarraLateral()
  const ubicacion = useLocation()

  const [alturaSubmenu, setAlturaSubmenu] = useState({})
  const refsSubmenu = useRef({})

  const estaActivo = useCallback(
    (ruta) => ubicacion.pathname === ruta,
    [ubicacion.pathname]
  )

  useEffect(() => {
    // No forzar la apertura basada en ruta si el usuario ya abrió un submenu manualmente.
    if (submenuAbierto !== null) return

    let encontrado = false
    const tipos = ['principal', 'otros']
    for (const tipoMenu of tipos) {
      const items = tipoMenu === 'principal' ? elementosNavegacion : otrosElementos
      for (let index = 0; index < items.length; index++) {
        const nav = items[index]
        if (nav.subItems) {
          for (const subItem of nav.subItems) {
            if (estaActivo(subItem.ruta)) {
              alternarSubmenu(index, tipoMenu)
              encontrado = true
              break
            }
          }
        }
        if (encontrado) break
      }
      if (encontrado) break
    }
  }, [ubicacion.pathname, estaActivo, alternarSubmenu, submenuAbierto])

  useEffect(() => {
    if (submenuAbierto !== null) {
      const clave = `${submenuAbierto.tipo}-${submenuAbierto.index}`
      if (refsSubmenu.current[clave]) {
        setAlturaSubmenu((prevAlturas) => ({
          ...prevAlturas,
          [clave]: refsSubmenu.current[clave]?.scrollHeight || 0,
        }))
      }
    }
  }, [submenuAbierto])

  const manejarAlternarSubmenu = (index, tipoMenu) => {
    alternarSubmenu(index, tipoMenu)
  }

  const renderizarElementosMenu = (items, tipoMenu) => (
    <ul className="barra-lateral-menu-lista">
      {items.map((nav, index) => (
        <li key={nav.nombre}>
          {nav.subItems ? (
            <button
              onClick={() => manejarAlternarSubmenu(index, tipoMenu)}
              className={`barra-lateral-menu-item ${
                submenuAbierto && submenuAbierto.tipo === tipoMenu && submenuAbierto.index === index
                  ? 'barra-lateral-menu-item-activo'
                  : 'barra-lateral-menu-item-inactivo'
              } ${
                !estaExpandida && !estaEnHover
                  ? 'barra-lateral-menu-item-centrado'
                  : ''
              }`}
              data-tooltip={nav.nombre}
            >
              <span
                className={`barra-lateral-menu-icono ${
                  submenuAbierto && submenuAbierto.tipo === tipoMenu && submenuAbierto.index === index
                    ? 'barra-lateral-menu-icono-activo'
                    : 'barra-lateral-menu-icono-inactivo'
                }`}
              >
                {nav.icono}
              </span>
              {(estaExpandida || estaEnHover || movilAbierto) && (
                <span className="barra-lateral-menu-texto">{nav.nombre}</span>
              )}
              {(estaExpandida || estaEnHover || movilAbierto) && (
                <ChevronDownIcon
                  className={`barra-lateral-menu-flecha ${
                    submenuAbierto && submenuAbierto.tipo === tipoMenu && submenuAbierto.index === index
                      ? 'barra-lateral-chevron-rotado'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.ruta && (
              <Link
                to={nav.ruta}
                className={`barra-lateral-menu-item ${
                  estaActivo(nav.ruta) ? 'barra-lateral-menu-item-activo' : 'barra-lateral-menu-item-inactivo'
                }`}
                data-tooltip={nav.nombre}
              >
                <span
                  className={`barra-lateral-menu-icono ${
                    estaActivo(nav.ruta)
                      ? 'barra-lateral-menu-icono-activo'
                      : 'barra-lateral-menu-icono-inactivo'
                  }`}
                >
                  {nav.icono}
                </span>
                {(estaExpandida || estaEnHover || movilAbierto) && (
                  <span className="barra-lateral-menu-texto">{nav.nombre}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (estaExpandida || estaEnHover || movilAbierto) && (
            <div
              ref={(el) => {
                refsSubmenu.current[`${tipoMenu}-${index}`] = el
              }}
              className="barra-lateral-submenu-contenedor"
              style={{
                height:
                  submenuAbierto && submenuAbierto.tipo === tipoMenu && submenuAbierto.index === index
                    ? `${(refsSubmenu.current[`${tipoMenu}-${index}`]?.scrollHeight || 0)}px`
                    : '0px',
              }}
            >
              <ul className="barra-lateral-submenu-lista">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.nombre}>
                    <Link
                      to={subItem.ruta}
                      className={`barra-lateral-submenu-item ${
                        estaActivo(subItem.ruta)
                          ? 'barra-lateral-submenu-item-activo'
                          : 'barra-lateral-submenu-item-inactivo'
                      }`}
                    >
                      {subItem.nombre}
                      <span className="barra-lateral-submenu-insignias">
                        {subItem.new && (
                          <span
                            className={`barra-lateral-submenu-insignia ${
                              estaActivo(subItem.ruta)
                                ? 'barra-lateral-submenu-insignia-activa'
                                : 'barra-lateral-submenu-insignia-inactiva'
                            }`}
                          >
                            nuevo
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`barra-lateral-submenu-insignia ${
                              estaActivo(subItem.ruta)
                                ? 'barra-lateral-submenu-insignia-activa'
                                : 'barra-lateral-submenu-insignia-inactiva'
                            }`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <aside
      className={`barra-lateral-admin ${
        estaExpandida || movilAbierto
          ? 'barra-lateral-expandida'
          : estaEnHover
          ? 'barra-lateral-hover'
          : 'barra-lateral-colapsada'
      } ${movilAbierto ? 'barra-lateral-movil-abierta' : 'barra-lateral-movil-cerrada'}`}
      onMouseEnter={() => !estaExpandida && setEstaEnHover(true)}
      onMouseLeave={() => setEstaEnHover(false)}
    >
      <div
        className={`barra-lateral-logo-contenedor ${
          !estaExpandida && !estaEnHover ? 'barra-lateral-logo-colapsado' : 'barra-lateral-logo-expandido'
        }`}
      >
        <Link to="/admin">
          {estaExpandida || estaEnHover || movilAbierto ? (
            <div className="barra-lateral-logo-completo">
              <span className="barra-lateral-logo-texto">ME LLEVO ESTO</span>
              <span className="barra-lateral-logo-subtitulo">Admin</span>
            </div>
          ) : (
            <div className="barra-lateral-logo-icono">
              <span>🛍️</span>
            </div>
          )}
        </Link>
      </div>
      
      <div className="barra-lateral-contenido">
        <nav className="barra-lateral-nav">
          <div className="barra-lateral-nav-secciones">
            <div>
              <h3
                className={`barra-lateral-seccion-titulo ${
                  !estaExpandida && !estaEnHover ? 'barra-lateral-seccion-titulo-oculto' : ''
                }`}
              >
                MENÚ
              </h3>
              {renderizarElementosMenu(elementosNavegacion, 'principal')}
            </div>

            <div>
              <h3
                className={`barra-lateral-seccion-titulo ${
                  !estaExpandida && !estaEnHover ? 'barra-lateral-seccion-titulo-oculto' : ''
                }`}
              >
                OTROS
              </h3>
              {renderizarElementosMenu(otrosElementos, 'otros')}
            </div>
          </div>
        </nav>
        
        {/* Widget del sidebar */}
        {(estaExpandida || estaEnHover || movilAbierto) && (
          <div className="barra-lateral-widget-contenedor">
            <WidgetBarraLateral />
          </div>
        )}
      </div>
    </aside>
  )
}

export default BarraLateralAdmin
