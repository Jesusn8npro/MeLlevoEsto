import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
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
  Hash
} from 'lucide-react'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    slug: '',
    imagen: '',
    icono: '',
    color: '#465fff',
    activo: true,
    orden: 0,
    seo_titulo: '',
    seo_descripcion: '',
    categoria_padre_id: null
  })

  const [estadisticas, setEstadisticas] = useState({
    totalCategorias: 0,
    categoriasActivas: 0,
    categoriasConProductos: 0,
    categoriasSinProductos: 0
  })

  useEffect(() => {
    cargarCategorias()
    cargarEstadisticas()
  }, [])

  const cargarCategorias = async () => {
    try {
      setCargando(true)
      
      const { data, error } = await clienteSupabase
        .from('categorias')
        .select(`
          *,
          categoria_padre:categoria_padre_id(nombre),
          _count_productos:productos(count)
        `)
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

      // Categorías con productos
      const { data: categoriasConProductos } = await clienteSupabase
        .from('categorias')
        .select(`
          id,
          productos(count)
        `)

      const conProductos = categoriasConProductos?.filter(cat => 
        cat.productos && cat.productos.length > 0
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
        imagen: categoria.imagen || '',
        icono: categoria.icono || '',
        color: categoria.color || '#465fff',
        activo: categoria.activo,
        orden: categoria.orden || 0,
        seo_titulo: categoria.seo_titulo || '',
        seo_descripcion: categoria.seo_descripcion || '',
        categoria_padre_id: categoria.categoria_padre_id || null
      })
    } else {
      setCategoriaEditando(null)
      setFormulario({
        nombre: '',
        descripcion: '',
        slug: '',
        imagen: '',
        icono: '',
        color: '#465fff',
        activo: true,
        orden: categorias.length,
        seo_titulo: '',
        seo_descripcion: '',
        categoria_padre_id: null
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
      
      // Auto-generar SEO título si no existe
      if (!formulario.seo_titulo) {
        setFormulario(prev => ({ ...prev, seo_titulo: valor }))
      }
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
      const datosCategoria = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        slug: formulario.slug.trim(),
        imagen: formulario.imagen.trim(),
        icono: formulario.icono.trim(),
        color: formulario.color,
        activo: formulario.activo,
        orden: parseInt(formulario.orden),
        seo_titulo: formulario.seo_titulo.trim(),
        seo_descripcion: formulario.seo_descripcion.trim(),
        categoria_padre_id: formulario.categoria_padre_id || null
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
      setError('Error al guardar la categoría: ' + error.message)
    } finally {
      setGuardando(false)
    }
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

  const categoriasRaiz = categorias.filter(cat => !cat.categoria_padre_id)

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
              <div key={categoria.id} className="categoria-card">
                <div className="categoria-header">
                  <div className="categoria-info">
                    <div 
                      className="categoria-color"
                      style={{ backgroundColor: categoria.color }}
                    ></div>
                    <div className="categoria-detalles">
                      <h4 className="categoria-nombre">{categoria.nombre}</h4>
                      <p className="categoria-slug">/{categoria.slug}</p>
                      {categoria.descripcion && (
                        <p className="categoria-descripcion">
                          {categoria.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="categoria-estado">
                    <button
                      onClick={() => alternarEstadoCategoria(categoria.id, categoria.activo)}
                      className={`estado-toggle ${categoria.activo ? 'activo' : 'inactivo'}`}
                    >
                      {categoria.activo ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div>

                <div className="categoria-stats">
                  <div className="stat-item">
                    <span className="stat-label">Productos:</span>
                    <span className="stat-valor">
                      {categoria._count_productos?.[0]?.count || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Orden:</span>
                    <span className="stat-valor">{categoria.orden}</span>
                  </div>
                  {categoria.categoria_padre && (
                    <div className="stat-item">
                      <span className="stat-label">Padre:</span>
                      <span className="stat-valor">{categoria.categoria_padre.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="categoria-acciones">
                  <button 
                    onClick={() => abrirModal(categoria)}
                    className="accion-boton editar"
                    title="Editar categoría"
                  >
                    <Edit />
                  </button>
                  <button 
                    onClick={() => eliminarCategoria(categoria.id)}
                    className="accion-boton eliminar"
                    title="Eliminar categoría"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                  <label className="campo-label">Color</label>
                  <input
                    type="color"
                    value={formulario.color}
                    onChange={(e) => manejarCambio('color', e.target.value)}
                    className="campo-color"
                  />
                </div>

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

              <div className="campo-grupo">
                <label className="campo-label">Categoría Padre</label>
                <select
                  value={formulario.categoria_padre_id || ''}
                  onChange={(e) => manejarCambio('categoria_padre_id', e.target.value || null)}
                  className="campo-select"
                >
                  <option value="">Sin categoría padre</option>
                  {categoriasRaiz
                    .filter(cat => !categoriaEditando || cat.id !== categoriaEditando.id)
                    .map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                </select>
              </div>

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">URL de Imagen</label>
                  <input
                    type="url"
                    value={formulario.imagen}
                    onChange={(e) => manejarCambio('imagen', e.target.value)}
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

              <div className="campo-grupo">
                <label className="campo-label">Título SEO</label>
                <input
                  type="text"
                  value={formulario.seo_titulo}
                  onChange={(e) => manejarCambio('seo_titulo', e.target.value)}
                  className="campo-input"
                  placeholder="Título para motores de búsqueda"
                  maxLength={60}
                />
                <small className="campo-ayuda">
                  {formulario.seo_titulo.length}/60 caracteres
                </small>
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Descripción SEO</label>
                <textarea
                  value={formulario.seo_descripcion}
                  onChange={(e) => manejarCambio('seo_descripcion', e.target.value)}
                  className="campo-textarea"
                  placeholder="Descripción para motores de búsqueda"
                  rows={2}
                  maxLength={160}
                />
                <small className="campo-ayuda">
                  {formulario.seo_descripcion.length}/160 caracteres
                </small>
              </div>

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
