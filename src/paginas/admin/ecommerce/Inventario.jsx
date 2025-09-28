import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import { 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  Edit,
  Eye,
  BarChart3,
  Warehouse,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'

const Inventario = () => {
  const [inventario, setInventario] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroStock, setFiltroStock] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [categorias, setCategorias] = useState([])
  const [modalAjusteAbierto, setModalAjusteAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [ajusteStock, setAjusteStock] = useState({ tipo: 'entrada', cantidad: '', motivo: '' })

  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    valorInventario: 0,
    productosBajoStock: 0,
    productosAgotados: 0,
    movimientosHoy: 0
  })

  useEffect(() => {
    cargarInventario()
    cargarCategorias()
    cargarEstadisticas()
  }, [busqueda, filtroStock, filtroCategoria])

  const cargarInventario = async () => {
    try {
      setCargando(true)
      
      let query = clienteSupabase
        .from('inventario')
        .select(`
          *,
          productos(
            id,
            nombre,
            sku,
            precio,
            imagenes,
            categoria_id,
            categorias(nombre)
          )
        `)

      // Aplicar filtros
      if (busqueda) {
        query = query.or(`productos.nombre.ilike.%${busqueda}%,productos.sku.ilike.%${busqueda}%`)
      }

      if (filtroCategoria) {
        query = query.eq('productos.categoria_id', filtroCategoria)
      }

      const { data, error } = await query.order('actualizado_el', { ascending: false })

      if (error) throw error

      let inventarioFiltrado = data || []

      // Filtrar por estado de stock
      if (filtroStock) {
        inventarioFiltrado = inventarioFiltrado.filter(item => {
          switch (filtroStock) {
            case 'agotado':
              return item.cantidad === 0
            case 'bajo':
              return item.cantidad > 0 && item.cantidad <= item.stock_minimo
            case 'disponible':
              return item.cantidad > item.stock_minimo
            default:
              return true
          }
        })
      }

      setInventario(inventarioFiltrado)
    } catch (error) {
      console.error('Error al cargar inventario:', error)
      setError('Error al cargar el inventario')
    } finally {
      setCargando(false)
    }
  }

  const cargarCategorias = async () => {
    try {
      const { data, error } = await clienteSupabase
        .from('categorias')
        .select('id, nombre')
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      setCategorias(data || [])
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  const cargarEstadisticas = async () => {
    try {
      // Total de productos en inventario
      const { count: total } = await clienteSupabase
        .from('inventario')
        .select('*', { count: 'exact', head: true })

      // Valor del inventario
      const { data: inventarioData } = await clienteSupabase
        .from('inventario')
        .select(`
          cantidad,
          productos(precio)
        `)

      let valorInventario = 0
      if (inventarioData) {
        valorInventario = inventarioData.reduce((total, item) => {
          return total + (item.cantidad * (item.productos?.precio || 0))
        }, 0)
      }

      // Productos bajo stock
      const { count: bajoStock } = await clienteSupabase
        .from('inventario')
        .select('*', { count: 'exact', head: true })
        .filter('cantidad', 'lte', 'stock_minimo')
        .gt('cantidad', 0)

      // Productos agotados
      const { count: agotados } = await clienteSupabase
        .from('inventario')
        .select('*', { count: 'exact', head: true })
        .eq('cantidad', 0)

      // Movimientos de hoy
      const hoy = new Date()
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const { count: movimientosHoy } = await clienteSupabase
        .from('movimientos_inventario')
        .select('*', { count: 'exact', head: true })
        .gte('creado_el', inicioHoy.toISOString())

      setEstadisticas({
        totalProductos: total || 0,
        valorInventario,
        productosBajoStock: bajoStock || 0,
        productosAgotados: agotados || 0,
        movimientosHoy: movimientosHoy || 0
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const obtenerEstadoStock = (item) => {
    if (item.cantidad === 0) {
      return { estado: 'agotado', texto: 'Agotado', clase: 'stock-agotado', icono: AlertCircle }
    }
    if (item.cantidad <= item.stock_minimo) {
      return { estado: 'bajo', texto: 'Bajo Stock', clase: 'stock-bajo', icono: AlertTriangle }
    }
    return { estado: 'disponible', texto: 'Disponible', clase: 'stock-disponible', icono: CheckCircle }
  }

  const abrirModalAjuste = (producto) => {
    setProductoSeleccionado(producto)
    setAjusteStock({ tipo: 'entrada', cantidad: '', motivo: '' })
    setModalAjusteAbierto(true)
  }

  const cerrarModalAjuste = () => {
    setModalAjusteAbierto(false)
    setProductoSeleccionado(null)
    setAjusteStock({ tipo: 'entrada', cantidad: '', motivo: '' })
  }

  const procesarAjusteStock = async (event) => {
    event.preventDefault()
    
    if (!ajusteStock.cantidad || ajusteStock.cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0')
      return
    }

    if (!ajusteStock.motivo.trim()) {
      alert('El motivo es requerido')
      return
    }

    try {
      const cantidadAjuste = parseInt(ajusteStock.cantidad)
      const nuevaCantidad = ajusteStock.tipo === 'entrada' 
        ? productoSeleccionado.cantidad + cantidadAjuste
        : Math.max(0, productoSeleccionado.cantidad - cantidadAjuste)

      // Actualizar inventario
      const { error: errorInventario } = await clienteSupabase
        .from('inventario')
        .update({ 
          cantidad: nuevaCantidad,
          actualizado_el: new Date().toISOString()
        })
        .eq('id', productoSeleccionado.id)

      if (errorInventario) throw errorInventario

      // Registrar movimiento
      const { error: errorMovimiento } = await clienteSupabase
        .from('movimientos_inventario')
        .insert({
          producto_id: productoSeleccionado.productos.id,
          tipo: ajusteStock.tipo,
          cantidad: cantidadAjuste,
          cantidad_anterior: productoSeleccionado.cantidad,
          cantidad_nueva: nuevaCantidad,
          motivo: ajusteStock.motivo.trim(),
          usuario_id: null // Aquí iría el ID del usuario logueado
        })

      if (errorMovimiento) throw errorMovimiento

      // Actualizar la lista local
      setInventario(inventario.map(item => 
        item.id === productoSeleccionado.id 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ))

      cargarEstadisticas()
      cerrarModalAjuste()
    } catch (error) {
      console.error('Error al procesar ajuste de stock:', error)
      alert('Error al procesar el ajuste de stock')
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio)
  }

  if (error) {
    return (
      <div className="inventario-error">
        <AlertCircle className="error-icono" />
        <h3>Error al cargar inventario</h3>
        <p>{error}</p>
        <button onClick={cargarInventario} className="boton-reintentar">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="inventario">
      {/* Header */}
      <div className="inventario-header">
        <div className="header-info">
          <h1 className="titulo-pagina">Gestión de Inventario</h1>
          <p className="subtitulo-pagina">
            Controla el stock y movimientos de tus productos
          </p>
        </div>
        <div className="header-acciones">
          <button 
            onClick={cargarInventario}
            className="boton-secundario"
          >
            <RefreshCw className="boton-icono" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Package />
          </div>
          <div className="estadistica-contenido">
            <h3>Total Productos</h3>
            <p className="estadistica-numero">{estadisticas.totalProductos}</p>
            <span className="estadistica-cambio">
              En inventario
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <BarChart3 />
          </div>
          <div className="estadistica-contenido">
            <h3>Valor Inventario</h3>
            <p className="estadistica-numero">{formatearPrecio(estadisticas.valorInventario)}</p>
            <span className="estadistica-cambio">
              Valor total
            </span>
          </div>
        </div>

        <div className="estadistica-card estadistica-alerta">
          <div className="estadistica-icono">
            <AlertTriangle />
          </div>
          <div className="estadistica-contenido">
            <h3>Bajo Stock</h3>
            <p className="estadistica-numero">{estadisticas.productosBajoStock}</p>
            <span className="estadistica-cambio warning">
              Requieren reposición
            </span>
          </div>
        </div>

        <div className="estadistica-card estadistica-critica">
          <div className="estadistica-icono">
            <AlertCircle />
          </div>
          <div className="estadistica-contenido">
            <h3>Agotados</h3>
            <p className="estadistica-numero">{estadisticas.productosAgotados}</p>
            <span className="estadistica-cambio error">
              Sin stock
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-inventario">
        <div className="filtro-busqueda">
          <Search className="filtro-icono" />
          <input
            type="text"
            placeholder="Buscar productos por nombre o SKU..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>

        <div className="filtros-selectores">
          <select
            value={filtroStock}
            onChange={(e) => setFiltroStock(e.target.value)}
            className="selector-filtro"
          >
            <option value="">Todos los stocks</option>
            <option value="disponible">Disponible</option>
            <option value="bajo">Bajo Stock</option>
            <option value="agotado">Agotado</option>
          </select>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="selector-filtro"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <button className="boton-filtro">
            <Filter className="boton-icono" />
            Filtros
          </button>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="tabla-inventario-contenedor">
        {cargando ? (
          <div className="cargando-inventario">
            <div className="spinner"></div>
            <p>Cargando inventario...</p>
          </div>
        ) : inventario.length === 0 ? (
          <div className="inventario-vacio">
            <Warehouse className="vacio-icono" />
            <h3>No hay productos en inventario</h3>
            <p>Los productos aparecerán aquí cuando agregues stock</p>
          </div>
        ) : (
          <table className="tabla-inventario">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
                <th>Valor</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map(item => {
                const estadoStock = obtenerEstadoStock(item)
                const IconoEstado = estadoStock.icono
                const valorTotal = item.cantidad * (item.productos?.precio || 0)
                
                return (
                  <tr key={item.id} className="fila-inventario">
                    <td className="celda-producto">
                      <div className="producto-info">
                        <div className="producto-imagen">
                          {item.productos?.imagenes?.[0] ? (
                            <img 
                              src={item.productos.imagenes[0]} 
                              alt={item.productos.nombre}
                              className="imagen-miniatura"
                            />
                          ) : (
                            <div className="imagen-placeholder">
                              <Package />
                            </div>
                          )}
                        </div>
                        <div className="producto-detalles">
                          <h4 className="producto-nombre">{item.productos?.nombre}</h4>
                          <p className="producto-precio">
                            {formatearPrecio(item.productos?.precio || 0)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="celda-sku">
                      <code className="sku-codigo">{item.productos?.sku}</code>
                    </td>
                    <td className="celda-categoria">
                      <span className="categoria-badge">
                        {item.productos?.categorias?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="celda-stock-actual">
                      <div className="stock-cantidad">
                        <span className="cantidad-numero">{item.cantidad}</span>
                        <span className="cantidad-unidad">unidades</span>
                      </div>
                    </td>
                    <td className="celda-stock-minimo">
                      <span className="stock-minimo">{item.stock_minimo}</span>
                    </td>
                    <td className="celda-estado">
                      <span className={`estado-badge ${estadoStock.clase}`}>
                        <IconoEstado className="estado-icono" />
                        {estadoStock.texto}
                      </span>
                    </td>
                    <td className="celda-valor">
                      <span className="valor-total">
                        {formatearPrecio(valorTotal)}
                      </span>
                    </td>
                    <td className="celda-ubicacion">
                      <span className="ubicacion-texto">
                        {item.ubicacion || 'No especificada'}
                      </span>
                    </td>
                    <td className="celda-acciones">
                      <div className="acciones-inventario">
                        <button 
                          onClick={() => abrirModalAjuste(item)}
                          className="accion-boton ajustar"
                          title="Ajustar stock"
                        >
                          <Edit />
                        </button>
                        <button 
                          className="accion-boton ver"
                          title="Ver historial"
                        >
                          <Eye />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para ajustar stock */}
      {modalAjusteAbierto && productoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-contenido modal-ajuste-stock">
            <div className="modal-header">
              <h3>Ajustar Stock</h3>
              <button 
                onClick={cerrarModalAjuste}
                className="modal-cerrar"
              >
                ×
              </button>
            </div>

            <div className="modal-cuerpo">
              <div className="producto-seleccionado">
                <div className="producto-imagen">
                  {productoSeleccionado.productos?.imagenes?.[0] ? (
                    <img 
                      src={productoSeleccionado.productos.imagenes[0]} 
                      alt={productoSeleccionado.productos.nombre}
                    />
                  ) : (
                    <Package />
                  )}
                </div>
                <div className="producto-info">
                  <h4>{productoSeleccionado.productos?.nombre}</h4>
                  <p>SKU: {productoSeleccionado.productos?.sku}</p>
                  <p>Stock actual: <strong>{productoSeleccionado.cantidad} unidades</strong></p>
                </div>
              </div>

              <form onSubmit={procesarAjusteStock} className="formulario-ajuste">
                <div className="campo-grupo">
                  <label className="campo-label">Tipo de Movimiento</label>
                  <div className="radio-grupo">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="entrada"
                        checked={ajusteStock.tipo === 'entrada'}
                        onChange={(e) => setAjusteStock({...ajusteStock, tipo: e.target.value})}
                        className="radio-input"
                      />
                      <Plus className="radio-icono" />
                      <span>Entrada (Agregar stock)</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="salida"
                        checked={ajusteStock.tipo === 'salida'}
                        onChange={(e) => setAjusteStock({...ajusteStock, tipo: e.target.value})}
                        className="radio-input"
                      />
                      <Minus className="radio-icono" />
                      <span>Salida (Reducir stock)</span>
                    </label>
                  </div>
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={ajusteStock.cantidad}
                    onChange={(e) => setAjusteStock({...ajusteStock, cantidad: e.target.value})}
                    className="campo-input"
                    placeholder="Ingresa la cantidad"
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Motivo</label>
                  <select
                    value={ajusteStock.motivo}
                    onChange={(e) => setAjusteStock({...ajusteStock, motivo: e.target.value})}
                    className="campo-select"
                    required
                  >
                    <option value="">Seleccionar motivo</option>
                    {ajusteStock.tipo === 'entrada' ? (
                      <>
                        <option value="compra">Compra de mercancía</option>
                        <option value="devolucion">Devolución de cliente</option>
                        <option value="ajuste_positivo">Ajuste de inventario</option>
                        <option value="produccion">Producción interna</option>
                        <option value="otro_entrada">Otro motivo</option>
                      </>
                    ) : (
                      <>
                        <option value="venta">Venta</option>
                        <option value="dano">Producto dañado</option>
                        <option value="perdida">Pérdida</option>
                        <option value="ajuste_negativo">Ajuste de inventario</option>
                        <option value="devolucion_proveedor">Devolución a proveedor</option>
                        <option value="otro_salida">Otro motivo</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="resumen-ajuste">
                  <div className="resumen-item">
                    <span>Stock actual:</span>
                    <strong>{productoSeleccionado.cantidad} unidades</strong>
                  </div>
                  <div className="resumen-item">
                    <span>Cambio:</span>
                    <strong className={ajusteStock.tipo === 'entrada' ? 'positivo' : 'negativo'}>
                      {ajusteStock.tipo === 'entrada' ? '+' : '-'}{ajusteStock.cantidad || 0} unidades
                    </strong>
                  </div>
                  <div className="resumen-item">
                    <span>Nuevo stock:</span>
                    <strong>
                      {ajusteStock.cantidad ? (
                        ajusteStock.tipo === 'entrada' 
                          ? productoSeleccionado.cantidad + parseInt(ajusteStock.cantidad)
                          : Math.max(0, productoSeleccionado.cantidad - parseInt(ajusteStock.cantidad))
                      ) : productoSeleccionado.cantidad} unidades
                    </strong>
                  </div>
                </div>

                <div className="modal-acciones">
                  <button
                    type="button"
                    onClick={cerrarModalAjuste}
                    className="boton-cancelar"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="boton-confirmar"
                  >
                    Confirmar Ajuste
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario
