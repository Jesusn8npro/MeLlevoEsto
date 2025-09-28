import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Truck, 
  Package, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Download,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false)
  const pedidosPorPagina = 15

  const [estadisticas, setEstadisticas] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    pedidosCompletados: 0,
    ingresosTotales: 0,
    ingresosMes: 0,
    pedidosHoy: 0
  })

  const estadosPedido = {
    'pendiente': { label: 'Pendiente', color: 'warning', icono: Clock },
    'confirmado': { label: 'Confirmado', color: 'info', icono: CheckCircle },
    'procesando': { label: 'Procesando', color: 'primary', icono: Package },
    'enviado': { label: 'Enviado', color: 'success', icono: Truck },
    'entregado': { label: 'Entregado', color: 'success', icono: CheckCircle },
    'cancelado': { label: 'Cancelado', color: 'error', icono: XCircle }
  }

  useEffect(() => {
    cargarPedidos()
    cargarEstadisticas()
  }, [paginaActual, busqueda, filtroEstado, filtroFecha])

  const cargarPedidos = async () => {
    try {
      setCargando(true)
      
      let query = clienteSupabase
        .from('pedidos')
        .select(`
          *,
          usuarios(nombre, email, telefono),
          pedido_items(
            cantidad,
            precio_unitario,
            productos(nombre, imagenes)
          )
        `)

      // Aplicar filtros
      if (busqueda) {
        query = query.or(`numero_pedido.ilike.%${busqueda}%,usuarios.email.ilike.%${busqueda}%,usuarios.nombre.ilike.%${busqueda}%`)
      }

      if (filtroEstado) {
        query = query.eq('estado', filtroEstado)
      }

      if (filtroFecha) {
        const hoy = new Date()
        let fechaInicio

        switch (filtroFecha) {
          case 'hoy':
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
            break
          case 'semana':
            fechaInicio = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'mes':
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
            break
          default:
            fechaInicio = null
        }

        if (fechaInicio) {
          query = query.gte('creado_el', fechaInicio.toISOString())
        }
      }

      // Paginación
      const desde = (paginaActual - 1) * pedidosPorPagina
      const hasta = desde + pedidosPorPagina - 1

      const { data, error, count } = await query
        .range(desde, hasta)
        .order('creado_el', { ascending: false })

      if (error) throw error

      setPedidos(data || [])
      setTotalPedidos(count || 0)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
      setError('Error al cargar los pedidos')
    } finally {
      setCargando(false)
    }
  }

  const cargarEstadisticas = async () => {
    try {
      // Total de pedidos
      const { count: total } = await clienteSupabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })

      // Pedidos pendientes
      const { count: pendientes } = await clienteSupabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .in('estado', ['pendiente', 'confirmado', 'procesando'])

      // Pedidos completados
      const { count: completados } = await clienteSupabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'entregado')

      // Ingresos totales
      const { data: ingresos } = await clienteSupabase
        .from('pedidos')
        .select('total')
        .eq('estado', 'entregado')

      const ingresosTotales = ingresos?.reduce((sum, pedido) => sum + pedido.total, 0) || 0

      // Ingresos del mes actual
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const { data: ingresosMes } = await clienteSupabase
        .from('pedidos')
        .select('total')
        .eq('estado', 'entregado')
        .gte('creado_el', inicioMes.toISOString())

      const ingresosMesActual = ingresosMes?.reduce((sum, pedido) => sum + pedido.total, 0) || 0

      // Pedidos de hoy
      const hoy = new Date()
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const { count: pedidosHoy } = await clienteSupabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .gte('creado_el', inicioHoy.toISOString())

      setEstadisticas({
        totalPedidos: total || 0,
        pedidosPendientes: pendientes || 0,
        pedidosCompletados: completados || 0,
        ingresosTotales,
        ingresosMes: ingresosMesActual,
        pedidosHoy: pedidosHoy || 0
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const { error } = await clienteSupabase
        .from('pedidos')
        .update({ 
          estado: nuevoEstado,
          actualizado_el: new Date().toISOString()
        })
        .eq('id', pedidoId)

      if (error) throw error

      setPedidos(pedidos.map(p => 
        p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
      ))

      if (pedidoSeleccionado?.id === pedidoId) {
        setPedidoSeleccionado({ ...pedidoSeleccionado, estado: nuevoEstado })
      }

      cargarEstadisticas()
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error)
      alert('Error al cambiar el estado del pedido')
    }
  }

  const verDetallePedido = async (pedidoId) => {
    try {
      const { data, error } = await clienteSupabase
        .from('pedidos')
        .select(`
          *,
          usuarios(nombre, email, telefono),
          pedido_items(
            cantidad,
            precio_unitario,
            productos(nombre, imagenes, sku)
          )
        `)
        .eq('id', pedidoId)
        .single()

      if (error) throw error

      setPedidoSeleccionado(data)
      setModalDetalleAbierto(true)
    } catch (error) {
      console.error('Error al cargar detalle del pedido:', error)
      alert('Error al cargar el detalle del pedido')
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio)
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const obtenerEstadoPedido = (estado) => {
    return estadosPedido[estado] || { label: estado, color: 'default', icono: Package }
  }

  const totalPaginas = Math.ceil(totalPedidos / pedidosPorPagina)

  if (error && !modalDetalleAbierto) {
    return (
      <div className="pedidos-error">
        <AlertCircle className="error-icono" />
        <h3>Error al cargar pedidos</h3>
        <p>{error}</p>
        <button onClick={cargarPedidos} className="boton-reintentar">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="pedidos">
      {/* Header */}
      <div className="pedidos-header">
        <div className="header-info">
          <h1 className="titulo-pagina">Gestión de Pedidos</h1>
          <p className="subtitulo-pagina">
            Administra y da seguimiento a todos los pedidos de tu tienda
          </p>
        </div>
        <div className="header-acciones">
          <button className="boton-secundario">
            <Download className="boton-icono" />
            Exportar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-grid">
        <div className="estadistica-card estadistica-total">
          <div className="estadistica-icono">
            <Package />
          </div>
          <div className="estadistica-contenido">
            <h3>Total Pedidos</h3>
            <p className="estadistica-numero">{estadisticas.totalPedidos}</p>
            <span className="estadistica-cambio">
              {estadisticas.pedidosHoy} hoy
            </span>
          </div>
        </div>

        <div className="estadistica-card estadistica-pendientes">
          <div className="estadistica-icono">
            <Clock />
          </div>
          <div className="estadistica-contenido">
            <h3>Pendientes</h3>
            <p className="estadistica-numero">{estadisticas.pedidosPendientes}</p>
            <span className="estadistica-cambio warning">
              Requieren atención
            </span>
          </div>
        </div>

        <div className="estadistica-card estadistica-completados">
          <div className="estadistica-icono">
            <CheckCircle />
          </div>
          <div className="estadistica-contenido">
            <h3>Completados</h3>
            <p className="estadistica-numero">{estadisticas.pedidosCompletados}</p>
            <span className="estadistica-cambio positivo">
              {((estadisticas.pedidosCompletados / estadisticas.totalPedidos) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="estadistica-card estadistica-ingresos">
          <div className="estadistica-icono">
            <DollarSign />
          </div>
          <div className="estadistica-contenido">
            <h3>Ingresos Mes</h3>
            <p className="estadistica-numero">{formatearPrecio(estadisticas.ingresosMes)}</p>
            <span className="estadistica-cambio">
              Total: {formatearPrecio(estadisticas.ingresosTotales)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-pedidos">
        <div className="filtro-busqueda">
          <Search className="filtro-icono" />
          <input
            type="text"
            placeholder="Buscar por número, cliente o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>

        <div className="filtros-selectores">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="selector-filtro"
          >
            <option value="">Todos los estados</option>
            {Object.entries(estadosPedido).map(([valor, config]) => (
              <option key={valor} value={valor}>
                {config.label}
              </option>
            ))}
          </select>

          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="selector-filtro"
          >
            <option value="">Todas las fechas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Última semana</option>
            <option value="mes">Este mes</option>
          </select>

          <button className="boton-filtro">
            <Filter className="boton-icono" />
            Filtros
          </button>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="tabla-pedidos-contenedor">
        {cargando ? (
          <div className="cargando-pedidos">
            <div className="spinner"></div>
            <p>Cargando pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="pedidos-vacio">
            <Package className="vacio-icono" />
            <h3>No hay pedidos</h3>
            <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
          </div>
        ) : (
          <>
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(pedido => {
                  const estadoPedido = obtenerEstadoPedido(pedido.estado)
                  const IconoEstado = estadoPedido.icono
                  
                  return (
                    <tr key={pedido.id} className="fila-pedido">
                      <td className="celda-pedido">
                        <div className="pedido-info">
                          <h4 className="pedido-numero">#{pedido.numero_pedido}</h4>
                          <p className="pedido-id">ID: {pedido.id.slice(0, 8)}</p>
                        </div>
                      </td>
                      <td className="celda-cliente">
                        <div className="cliente-info">
                          <h5 className="cliente-nombre">
                            {pedido.usuarios?.nombre || 'Cliente Invitado'}
                          </h5>
                          <p className="cliente-email">
                            {pedido.usuarios?.email || pedido.email_cliente}
                          </p>
                        </div>
                      </td>
                      <td className="celda-productos">
                        <div className="productos-resumen">
                          <span className="productos-cantidad">
                            {pedido.pedido_items?.length || 0} productos
                          </span>
                          <div className="productos-imagenes">
                            {pedido.pedido_items?.slice(0, 3).map((item, index) => (
                              <div key={index} className="producto-imagen-mini">
                                {item.productos?.imagenes?.[0] ? (
                                  <img 
                                    src={item.productos.imagenes[0]} 
                                    alt={item.productos.nombre}
                                  />
                                ) : (
                                  <Package />
                                )}
                              </div>
                            ))}
                            {pedido.pedido_items?.length > 3 && (
                              <div className="productos-mas">
                                +{pedido.pedido_items.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="celda-total">
                        <span className="pedido-total">
                          {formatearPrecio(pedido.total)}
                        </span>
                      </td>
                      <td className="celda-estado">
                        <div className="estado-contenedor">
                          <span className={`estado-badge estado-${estadoPedido.color}`}>
                            <IconoEstado className="estado-icono" />
                            {estadoPedido.label}
                          </span>
                          <select
                            value={pedido.estado}
                            onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                            className="estado-selector"
                          >
                            {Object.entries(estadosPedido).map(([valor, config]) => (
                              <option key={valor} value={valor}>
                                {config.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="celda-fecha">
                        <div className="fecha-info">
                          <span className="fecha-principal">
                            {formatearFecha(pedido.creado_el)}
                          </span>
                        </div>
                      </td>
                      <td className="celda-acciones">
                        <div className="acciones-pedido">
                          <button 
                            onClick={() => verDetallePedido(pedido.id)}
                            className="accion-boton ver"
                            title="Ver detalle"
                          >
                            <Eye />
                          </button>
                          <button 
                            className="accion-boton editar"
                            title="Editar pedido"
                          >
                            <Edit />
                          </button>
                          <button className="accion-boton mas">
                            <MoreHorizontal />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="paginacion">
                <div className="paginacion-info">
                  Mostrando {((paginaActual - 1) * pedidosPorPagina) + 1} a {Math.min(paginaActual * pedidosPorPagina, totalPedidos)} de {totalPedidos} pedidos
                </div>
                <div className="paginacion-controles">
                  <button
                    onClick={() => setPaginaActual(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="boton-paginacion"
                  >
                    Anterior
                  </button>
                  
                  {[...Array(Math.min(totalPaginas, 5))].map((_, i) => {
                    const pagina = i + 1
                    return (
                      <button
                        key={pagina}
                        onClick={() => setPaginaActual(pagina)}
                        className={`boton-paginacion ${paginaActual === pagina ? 'activo' : ''}`}
                      >
                        {pagina}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setPaginaActual(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="boton-paginacion"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalle del pedido */}
      {modalDetalleAbierto && pedidoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-contenido modal-detalle-pedido">
            <div className="modal-header">
              <h3>Detalle del Pedido #{pedidoSeleccionado.numero_pedido}</h3>
              <button 
                onClick={() => setModalDetalleAbierto(false)}
                className="modal-cerrar"
              >
                ×
              </button>
            </div>

            <div className="modal-cuerpo">
              <div className="detalle-grid">
                {/* Información del pedido */}
                <div className="detalle-seccion">
                  <h4>Información del Pedido</h4>
                  <div className="info-lista">
                    <div className="info-item">
                      <span className="info-label">Número:</span>
                      <span className="info-valor">#{pedidoSeleccionado.numero_pedido}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estado:</span>
                      <span className={`estado-badge estado-${obtenerEstadoPedido(pedidoSeleccionado.estado).color}`}>
                        {obtenerEstadoPedido(pedidoSeleccionado.estado).label}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Fecha:</span>
                      <span className="info-valor">{formatearFecha(pedidoSeleccionado.creado_el)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total:</span>
                      <span className="info-valor precio">{formatearPrecio(pedidoSeleccionado.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Información del cliente */}
                <div className="detalle-seccion">
                  <h4>Información del Cliente</h4>
                  <div className="info-lista">
                    <div className="info-item">
                      <User className="info-icono" />
                      <span className="info-valor">
                        {pedidoSeleccionado.usuarios?.nombre || 'Cliente Invitado'}
                      </span>
                    </div>
                    <div className="info-item">
                      <Mail className="info-icono" />
                      <span className="info-valor">
                        {pedidoSeleccionado.usuarios?.email || pedidoSeleccionado.email_cliente}
                      </span>
                    </div>
                    {pedidoSeleccionado.usuarios?.telefono && (
                      <div className="info-item">
                        <Phone className="info-icono" />
                        <span className="info-valor">{pedidoSeleccionado.usuarios.telefono}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dirección de envío */}
                {pedidoSeleccionado.direccion_envio && (
                  <div className="detalle-seccion">
                    <h4>Dirección de Envío</h4>
                    <div className="direccion-info">
                      <MapPin className="direccion-icono" />
                      <div className="direccion-texto">
                        <p>{pedidoSeleccionado.direccion_envio.direccion}</p>
                        <p>{pedidoSeleccionado.direccion_envio.ciudad}, {pedidoSeleccionado.direccion_envio.codigo_postal}</p>
                        <p>{pedidoSeleccionado.direccion_envio.pais}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Productos del pedido */}
                <div className="detalle-seccion productos-seccion">
                  <h4>Productos ({pedidoSeleccionado.pedido_items?.length || 0})</h4>
                  <div className="productos-detalle">
                    {pedidoSeleccionado.pedido_items?.map((item, index) => (
                      <div key={index} className="producto-detalle-item">
                        <div className="producto-imagen">
                          {item.productos?.imagenes?.[0] ? (
                            <img 
                              src={item.productos.imagenes[0]} 
                              alt={item.productos.nombre}
                            />
                          ) : (
                            <Package />
                          )}
                        </div>
                        <div className="producto-info">
                          <h5>{item.productos?.nombre}</h5>
                          <p>SKU: {item.productos?.sku}</p>
                        </div>
                        <div className="producto-cantidad">
                          <span>Cantidad: {item.cantidad}</span>
                        </div>
                        <div className="producto-precio">
                          <span>{formatearPrecio(item.precio_unitario)}</span>
                          <small>c/u</small>
                        </div>
                        <div className="producto-total">
                          <strong>{formatearPrecio(item.cantidad * item.precio_unitario)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cambiar estado */}
              <div className="modal-acciones">
                <div className="cambiar-estado">
                  <label>Cambiar Estado:</label>
                  <select
                    value={pedidoSeleccionado.estado}
                    onChange={(e) => cambiarEstadoPedido(pedidoSeleccionado.id, e.target.value)}
                    className="estado-selector-modal"
                  >
                    {Object.entries(estadosPedido).map(([valor, config]) => (
                      <option key={valor} value={valor}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pedidos
