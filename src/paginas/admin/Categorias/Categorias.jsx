import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import { useAuth } from '../../../contextos/ContextoAutenticacion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Tag, 
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  FolderOpen,
  Hash,
  Package
} from 'lucide-react'

import './Categorias.css'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [dragOverCategoriaId, setDragOverCategoriaId] = useState(null)
  const [asignando, setAsignando] = useState(false)
  // Selector de categorías por clic
  const [selectorCategoriasVisibleId, setSelectorCategoriasVisibleId] = useState(null)
  const [busquedaSelector, setBusquedaSelector] = useState('')

  // Productos para drag & drop
  const [productos, setProductos] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(false)
  const [busquedaProductos, setBusquedaProductos] = useState('')
  const [soloSinCategoria, setSoloSinCategoria] = useState(false)

  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    slug: '',
    imagen_url: '',
    icono: '',
    activo: true,
    destacado: false,
    orden: 0,
    
  })

  const [estadisticas, setEstadisticas] = useState({
    totalCategorias: 0,
    categoriasActivas: 0,
    categoriasConProductos: 0,
    categoriasSinProductos: 0
  })

  // Estado de autenticación/rol
  const { usuario, esAdmin } = useAuth()

  useEffect(() => {
    cargarCategorias()
    cargarEstadisticas()
    cargarProductos()
  }, [])

  const cargarCategorias = async () => {
    try {
      setCargando(true)
      
      const { data, error } = await clienteSupabase
        .from('categorias')
        .select('id,nombre,slug,descripcion,icono,imagen_url,destacado,orden,activo,total_productos')
        .order('orden', { ascending: true })

      if (error) throw error

      setCategorias(data || [])
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      setError('Error al cargar las categorías')
    } finally {
      setCargando(false)
    }
  }

  const cargarEstadisticas = async () => {
    try {
      // Total de categorías
      const { count: total } = await clienteSupabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })

      // Categorías activas
      const { count: activas } = await clienteSupabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })
        .eq('activo', true)

      // Categorías con productos (usando total_productos)
      const { data: categoriasConProductos } = await clienteSupabase
        .from('categorias')
        .select('id,total_productos')

      const conProductos = categoriasConProductos?.filter(cat => 
        (cat.total_productos || 0) > 0
      ).length || 0

      setEstadisticas({
        totalCategorias: total || 0,
        categoriasActivas: activas || 0,
        categoriasConProductos: conProductos,
        categoriasSinProductos: (total || 0) - conProductos
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const abrirModal = (categoria = null) => {
    if (categoria) {
      setCategoriaEditando(categoria)
      setFormulario({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        slug: categoria.slug,
        imagen_url: categoria.imagen_url || categoria.imagen || '',
        icono: categoria.icono || '',
        activo: categoria.activo,
        destacado: categoria.destacado || false,
        orden: categoria.orden || 0,
        
      })
    } else {
      setCategoriaEditando(null)
      setFormulario({
        nombre: '',
        descripcion: '',
        slug: '',
        imagen_url: '',
        icono: '',
        activo: true,
        destacado: false,
        orden: categorias.length
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setCategoriaEditando(null)
    setError(null)
  }

  const manejarCambio = (campo, valor) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }))

    // Auto-generar slug cuando cambia el nombre
    if (campo === 'nombre') {
      const slug = valor
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setFormulario(prev => ({ ...prev, slug }))
    }
  }

  const validarFormulario = () => {
    const errores = []

    if (!formulario.nombre.trim()) errores.push('El nombre es requerido')
    if (!formulario.slug.trim()) errores.push('El slug es requerido')
    if (formulario.orden < 0) errores.push('El orden debe ser mayor o igual a 0')

    return errores
  }

  const guardarCategoria = async (event) => {
    event.preventDefault()
    
    const errores = validarFormulario()
    if (errores.length > 0) {
      setError(errores.join(', '))
      return
    }

    setGuardando(true)
    setError(null)

    try {
      // Verificaciones de sesión y rol antes de intentar escribir (evita errores RLS)
      const { data: { session } } = await clienteSupabase.auth.getSession()
      if (!session?.user) {
        setError('Debes iniciar sesión para crear o actualizar categorías.')
        setGuardando(false)
        return
      }
      if (!esAdmin()) {
        setError('Tu usuario no tiene permisos para gestionar categorías.')
        setGuardando(false)
        return
      }

      const datosCategoria = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        slug: formulario.slug.trim(),
        imagen_url: formulario.imagen_url.trim(),
        icono: formulario.icono.trim(),
        activo: formulario.activo,
        destacado: formulario.destacado,
        orden: parseInt(formulario.orden)
      }

      if (categoriaEditando) {
        // Actualizar categoría existente
        const { error } = await clienteSupabase
          .from('categorias')
          .update(datosCategoria)
          .eq('id', categoriaEditando.id)

        if (error) throw error
      } else {
        // Crear nueva categoría
        const { error } = await clienteSupabase
          .from('categorias')
          .insert(datosCategoria)

        if (error) throw error
      }

      await cargarCategorias()
      await cargarEstadisticas()
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      const mensaje = (error?.message || '').includes('row-level security')
        ? 'Tu usuario no tiene permisos (RLS) para escribir en la tabla "categorias". Inicia sesión con un usuario administrador o ajusta las políticas en Supabase.'
        : 'Error al guardar la categoría: ' + error.message
      setError(mensaje)
    } finally {
      setGuardando(false)
    }
  }

  // Cargar productos para asignación por drag & drop
  const cargarProductos = async () => {
    try {
      setCargandoProductos(true)
      const { data, error } = await clienteSupabase
        .from('productos')
        .select('id,nombre,precio,categoria_id,activo,stock,creado_el')
        .order('creado_el', { ascending: false })
        .limit(200)

      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setCargandoProductos(false)
    }
  }

  const manejarDragInicio = (e, producto) => {
    e.dataTransfer.setData('text/productoId', String(producto.id))
    // Fallback para compatibilidad amplia
    e.dataTransfer.setData('text/plain', String(producto.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  // Asignar producto a categoría (reutilizable por drag y por clic)
  const asignarProductoACategoria = async (productoId, categoriaId) => {
    if (!productoId) return
    if (asignando) return
    setAsignando(true)
    try {
      // Verificar sesión mínima para evitar fallos de RLS silenciosos
      const { data: { session } } = await clienteSupabase.auth.getSession()
      if (!session?.user) {
        alert('Debes iniciar sesión para actualizar productos.')
        return
      }

      // Ejecutar update y recuperar la fila actualizada para validar que se afectó
      const { data: filaActualizada, error } = await clienteSupabase
        .from('productos')
        .update({ categoria_id: categoriaId })
        .eq('id', productoId)
        .select('id,categoria_id')
        .maybeSingle()

      if (error) throw error
      if (!filaActualizada) {
        throw new Error('La actualización no afectó ninguna fila. Verifica tus permisos (RLS) y el ID del producto.')
      }

      // Actualizar en memoria
      setProductos(prev => prev.map(p => 
        String(p.id) === String(productoId) ? { ...p, categoria_id: categoriaId } : p
      ))
      await cargarCategorias()
      await cargarProductos()
    } catch (error) {
      console.error('Error al asignar producto a categoría:', error)
      const msg = (error?.message || '').toLowerCase().includes('row level')
        ? 'Tu usuario no tiene permisos (RLS) para modificar la tabla "productos". Inicia sesión como admin o ajusta las políticas en Supabase.'
        : 'No se pudo asignar el producto a la categoría. ' + (error?.message || '')
      alert(msg)
    } finally {
      setAsignando(false)
      setDragOverCategoriaId(null)
    }
  }

  // Obtener nombre de categoría por id para mostrarlo en la etiqueta azul
  const obtenerNombreCategoria = (id) => {
    if (!id) return null
    const cat = categorias.find(c => String(c.id) === String(id))
    return cat?.nombre || null
  }

  const manejarDropEnCategoria = async (e, categoria) => {
    e.preventDefault()
    let productoId = e.dataTransfer.getData('text/productoId')
    if (!productoId) {
      // Fallback
      productoId = e.dataTransfer.getData('text/plain')
    }
    if (!productoId || !categoria?.id) return
    await asignarProductoACategoria(productoId, categoria.id)
  }

  const manejarDropSinCategoria = async (e) => {
    e.preventDefault()
    let productoId = e.dataTransfer.getData('text/productoId')
    if (!productoId) {
      productoId = e.dataTransfer.getData('text/plain')
    }
    if (!productoId) return
    await asignarProductoACategoria(productoId, null)
  }

  const eliminarCategoria = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

    try {
      // Verificar si tiene productos
      const { count } = await clienteSupabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', id)

      if (count > 0) {
        alert('No se puede eliminar una categoría que tiene productos asociados')
        return
      }

      const { error } = await clienteSupabase
        .from('categorias')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCategorias(categorias.filter(c => c.id !== id))
      cargarEstadisticas()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      alert('Error al eliminar la categoría')
    }
  }

  const alternarEstadoCategoria = async (id, estadoActual) => {
    try {
      const { error } = await clienteSupabase
        .from('categorias')
        .update({ activo: !estadoActual })
        .eq('id', id)

      if (error) throw error

      setCategorias(categorias.map(c => 
        c.id === id ? { ...c, activo: !estadoActual } : c
      ))
      cargarEstadisticas()
    } catch (error) {
      console.error('Error al cambiar estado de la categoría:', error)
      alert('Error al cambiar el estado de la categoría')
    }
  }

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Jerarquía padre-hijo deshabilitada por esquema actual
  // const categoriasRaiz = categorias

  if (error && !modalAbierto) {
    return (
      <div className="categorias-error">
        <AlertCircle className="error-icono" />
        <h3>Error al cargar categorías</h3>
        <p>{error}</p>
        <button onClick={cargarCategorias} className="boton-reintentar">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="categorias">
      {/* Header */}
      <div className="categorias-header">
        <div className="header-info">
          <h1 className="titulo-pagina">Gestión de Categorías</h1>
          <p className="subtitulo-pagina">
            Organiza tus productos en categorías para facilitar la navegación
          </p>
        </div>
        <div className="header-acciones">
          <button 
            onClick={() => abrirModal()}
            className="boton-primario"
          >
            <Plus className="boton-icono" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <div className="estadistica-icono">
            <FolderOpen />
          </div>
          <div className="estadistica-contenido">
            <h3>Total Categorías</h3>
            <p className="estadistica-numero">{estadisticas.totalCategorias}</p>
            <span className="estadistica-cambio">
              {estadisticas.categoriasActivas} activas
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Tag />
          </div>
          <div className="estadistica-contenido">
            <h3>Con Productos</h3>
            <p className="estadistica-numero">{estadisticas.categoriasConProductos}</p>
            <span className="estadistica-cambio positivo">
              {((estadisticas.categoriasConProductos / estadisticas.totalCategorias) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Hash />
          </div>
          <div className="estadistica-contenido">
            <h3>Sin Productos</h3>
            <p className="estadistica-numero">{estadisticas.categoriasSinProductos}</p>
            <span className="estadistica-cambio">
              Necesitan contenido
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Eye />
          </div>
          <div className="estadistica-contenido">
            <h3>Activas</h3>
            <p className="estadistica-numero">{estadisticas.categoriasActivas}</p>
            <span className="estadistica-cambio positivo">
              Visibles al público
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="categorias-filtros">
        <div className="filtro-busqueda">
          <Search className="filtro-icono" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="categorias-contenedor">
        {cargando ? (
          <div className="cargando-categorias">
            <div className="spinner"></div>
            <p>Cargando categorías...</p>
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="categorias-vacio">
            <FolderOpen className="vacio-icono" />
            <h3>No hay categorías</h3>
            <p>Comienza creando tu primera categoría</p>
            <button 
              onClick={() => abrirModal()}
              className="boton-primario"
            >
              <Plus className="boton-icono" />
              Nueva Categoría
            </button>
          </div>
        ) : (
          <div className="categorias-grid-lista">
            {categoriasFiltradas.map(categoria => (
              <div
                key={categoria.id}
                className={`categoria-card ${dragOverCategoriaId === categoria.id ? 'dropzone-activa' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragOverCategoriaId(categoria.id)}
                onDragLeave={() => setDragOverCategoriaId(null)}
                onDrop={(e) => manejarDropEnCategoria(e, categoria)}
              >
                <div className="categoria-imagen">
                  {categoria.imagen_url ? (
                    <img 
                      src={categoria.imagen_url} 
                      alt={categoria.nombre} 
                      className="categoria-imagen-img"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Sin+Imagen' }}
                    />
                  ) : (
                    <div className="categoria-imagen-placeholder">
                      <Tag size={24} />
                    </div>
                  )}
                  <div className="categoria-estado-overlay">
                    <button
                      onClick={() => alternarEstadoCategoria(categoria.id, categoria.activo)}
                      className={`estado-toggle ${categoria.activo ? 'activo' : 'inactivo'}`}
                      title={categoria.activo ? 'Desactivar categoría' : 'Activar categoría'}
                    >
                      {categoria.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div className="categoria-contenido">
                  <h4 className="categoria-nombre">{categoria.nombre}</h4>
                  <p className="categoria-slug">/{categoria.slug}</p>
                  {categoria.descripcion && (
                    <p className="categoria-descripcion">
                      {categoria.descripcion}
                    </p>
                  )}
                  
                  <div className="categoria-stats">
                    <div className="stat-item">
                      <Package size={14} />
                      <span className="stat-valor">
                        {categoria.total_productos || 0} productos
                      </span>
                    </div>
                    <div className="stat-item">
                      <Hash size={14} />
                      <span className="stat-valor">Orden {categoria.orden}</span>
                    </div>
                  </div>

                  {categoria.destacado && (
                    <div className="categoria-destacado-badge">
                      ⭐ Destacada
                    </div>
                  )}
                </div>

                <div className="categoria-card-acciones">
                  <button 
                    onClick={() => abrirModal(categoria)}
                    className="accion-boton editar"
                    title="Editar categoría"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarCategoria(categoria.id)}
                    className="accion-boton eliminar"
                    title="Eliminar categoría"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Asignación de productos por Drag & Drop */}
      <div className="asignacion-panel">
        <div className="asignacion-col izquierda">
          <div className="asignacion-header">
            <h3>Productos</h3>
            <div className="asignacion-filtros">
              <div className="filtro-busqueda">
                <Search className="filtro-icono" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busquedaProductos}
                  onChange={(e) => setBusquedaProductos(e.target.value)}
                  className="input-busqueda"
                />
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={soloSinCategoria}
                  onChange={(e) => setSoloSinCategoria(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-texto">Solo sin categoría</span>
              </label>
            </div>
          </div>

          <div className="productos-lista">
            {cargandoProductos ? (
              <div className="cargando-categorias">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : (
              productos
                .filter(p => 
                  p.nombre.toLowerCase().includes(busquedaProductos.toLowerCase()) &&
                  (!soloSinCategoria || !p.categoria_id)
                )
                .map(producto => (
                  <div
                    key={producto.id}
                    className="producto-item"
                    draggable
                    onDragStart={(e) => manejarDragInicio(e, producto)}
                    onDragEnd={() => setDragOverCategoriaId(null)}
                    title="Arrastra este producto a una categoría"
                  >
                    <div className="producto-miniatura">
                      {producto.fotos_principales?.[0] ? (
                        <img
                          src={producto.fotos_principales[0]}
                          alt={producto.nombre}
                          className="producto-miniatura-img"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Sin+Imagen' }}
                        />
                      ) : (
                        <div className="producto-miniatura-placeholder">
                          <Package />
                        </div>
                      )}
                    </div>
                    <div className="producto-detalles">
                      <div className="producto-nombre">{producto.nombre}</div>
                      <div className="producto-extra">
                        {producto.categoria_id ? (
                          <span className="categoria-texto" title={`Categoría: ${obtenerNombreCategoria(producto.categoria_id) || ''}`}>
                            <Tag className="categoria-icono-pequeno" />
                            {obtenerNombreCategoria(producto.categoria_id) || 'Asignado'}
                          </span>
                        ) : (
                          <span className="categoria-texto categoria-texto-sin">Sin categoría</span>
                        )}
                      </div>
                      <div className="producto-acciones">
                        <button
                          type="button"
                          className="btn-cambiar-categoria"
                          onClick={() => setSelectorCategoriasVisibleId(prev => prev === producto.id ? null : producto.id)}
                          title="Cambiar categoría por clic"
                        >
                          Cambiar
                        </button>
                      </div>
                      {selectorCategoriasVisibleId === producto.id && (
                        <div className="selector-categorias-popover" role="dialog" aria-label="Selector de categorías">
                          <div className="selector-header">
                            <input
                              type="text"
                              value={busquedaSelector}
                              onChange={(e) => setBusquedaSelector(e.target.value)}
                              placeholder="Buscar categoría..."
                              className="selector-busqueda"
                            />
                            <button
                              type="button"
                              className="selector-cerrar"
                              onClick={() => { setSelectorCategoriasVisibleId(null); setBusquedaSelector('') }}
                              title="Cerrar"
                            >
                              <X />
                            </button>
                          </div>
                          <div className="selector-lista">
                            <button
                              type="button"
                              className="selector-item selector-item-sin"
                              onClick={() => { asignarProductoACategoria(producto.id, null); setSelectorCategoriasVisibleId(null) }}
                            >
                              Sin categoría
                            </button>
                            {(
                              (busquedaSelector
                                ? categorias.filter(c => c.nombre.toLowerCase().includes(busquedaSelector.toLowerCase()))
                                : categoriasFiltradas
                              )
                            ).map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                className="selector-item"
                                onClick={() => { asignarProductoACategoria(producto.id, cat.id); setSelectorCategoriasVisibleId(null) }}
                              >
                                <Tag className="categoria-icono" />
                                {cat.nombre}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="asignacion-col derecha">
          <div className="asignacion-header">
            <h3>Soltar en una Categoría</h3>
          </div>
          {/* Lista de categorías como destinos de drop */}
          <div className="dropzones-categorias-lista">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((cat) => (
                <div
                  key={cat.id}
                  className={`dropzone-categoria ${dragOverCategoriaId === cat.id ? 'dropzone-activa' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDragOverCategoriaId(cat.id)}
                  onDragLeave={() => setDragOverCategoriaId(null)}
                  onDrop={(e) => manejarDropEnCategoria(e, cat)}
                  title={`Soltar para asignar a "${cat.nombre}"`}
                >
                  <span className="dropzone-categoria-nombre">
                    <Tag className="categoria-icono" />
                    {cat.nombre}
                  </span>
                  <span className="dropzone-categoria-count">{cat.total_productos || 0} prod.</span>
                </div>
              ))
            ) : (
              <div className="categorias-vacio">
                <p>No hay categorías para mostrar</p>
              </div>
            )}
          </div>
          <div
            className="dropzone-sin-categoria"
            onDragOver={(e) => e.preventDefault()}
            onDrop={manejarDropSinCategoria}
          >
            Soltar aquí para dejar sin categoría
          </div>
        </div>
      </div>

      {/* Modal para crear/editar categoría */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <div className="modal-header">
              <h3>
                {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button 
                onClick={cerrarModal}
                className="modal-cerrar"
              >
                <X />
              </button>
            </div>

            <form onSubmit={guardarCategoria} className="modal-formulario">
              {error && (
                <div className="alerta-error">
                  <AlertCircle className="alerta-icono" />
                  <span>{error}</span>
                </div>
              )}

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">Nombre *</label>
                  <input
                    type="text"
                    value={formulario.nombre}
                    onChange={(e) => manejarCambio('nombre', e.target.value)}
                    className="campo-input"
                    placeholder="Nombre de la categoría"
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Slug *</label>
                  <input
                    type="text"
                    value={formulario.slug}
                    onChange={(e) => manejarCambio('slug', e.target.value)}
                    className="campo-input"
                    placeholder="url-amigable"
                    required
                  />
                </div>
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Descripción</label>
                <textarea
                  value={formulario.descripcion}
                  onChange={(e) => manejarCambio('descripcion', e.target.value)}
                  className="campo-textarea"
                  placeholder="Descripción de la categoría"
                  rows={3}
                />
              </div>

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">Orden</label>
                  <input
                    type="number"
                    min="0"
                    value={formulario.orden}
                    onChange={(e) => manejarCambio('orden', e.target.value)}
                    className="campo-input"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Jerarquía padre-hijo deshabilitada por esquema actual */}

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">URL de Imagen</label>
                  <input
                    type="url"
                    value={formulario.imagen_url}
                    onChange={(e) => manejarCambio('imagen_url', e.target.value)}
                    className="campo-input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Icono (emoji o clase CSS)</label>
                  <input
                    type="text"
                    value={formulario.icono}
                    onChange={(e) => manejarCambio('icono', e.target.value)}
                    className="campo-input"
                    placeholder="📱 o fa-mobile"
                  />
                </div>
              </div>

              {/* Campos SEO eliminados por no existir en el esquema actual */}

              <div className="campo-grupo">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formulario.activo}
                    onChange={(e) => manejarCambio('activo', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-texto">Categoría activa</span>
                </label>
              </div>

              <div className="campo-grupo">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formulario.destacado}
                    onChange={(e) => manejarCambio('destacado', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-texto">Mostrar como destacada</span>
                </label>
              </div>

              <div className="modal-acciones">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="boton-cancelar"
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="boton-guardar"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <div className="spinner-pequeno"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="boton-icono" />
                      {categoriaEditando ? 'Actualizar' : 'Crear'} Categoría
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categorias
