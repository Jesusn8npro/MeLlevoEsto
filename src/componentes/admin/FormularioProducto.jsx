import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clienteSupabase } from '../../configuracion/supabase'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus,
  Package,
  DollarSign,
  Tag,
  Image,
  FileText,
  Settings,
  Globe,
  Truck,
  AlertCircle,
  Sparkles,
  Camera,
  Loader
} from 'lucide-react'
import '../../paginas/admin/ecommerce/EstilosAgregarProducto.css'
import '../../paginas/admin/ecommerce/EstilosPrecioCOP.css'
import { formatearPrecioCOP } from '../../utilidades/formatoPrecio'
import CrearProductoIA from './CrearProductoIA'
import ChatImagenesIA from './ChatImagenesIA'

/**
 * FormularioProducto - Componente unificado para crear y editar productos
 * 
 * Props:
 * - modo: 'crear' | 'editar'
 * - slug: slug del producto (solo para modo editar)
 * - onSuccess: callback cuando se guarda exitosamente
 */

const FormularioProducto = ({ 
  modo = 'crear', 
  slug = null, 
  onSuccess = null 
}) => {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [cargando, setCargando] = useState(false)
  const [cargandoProducto, setCargandoProducto] = useState(modo === 'editar')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [categorias, setCategorias] = useState([])
  const [productoId, setProductoId] = useState(null)
  const [mostrarModalIA, setMostrarModalIA] = useState(false)
  const [mostrarChatImagenes, setMostrarChatImagenes] = useState(false)
  const [productoCreado, setProductoCreado] = useState(null)

  // Estado del formulario con TODOS los campos de la BD
  const [formulario, setFormulario] = useState({
    // Información básica
    nombre: '',
    slug: '',
    descripcion: '',
    ganchos: [],
    beneficios: [],
    ventajas: [],
    
    // Precios
    precio: '',
    precio_original: '',
    descuento: '',
    
    // Estado y categoría
    categoria_id: '',
    
    // Imágenes y videos
    fotos_principales: [],
    fotos_secundarias: [],
    videos: [],
    
    // Inventario
    stock: '',
    stock_minimo: '5',
    
    // Configuración
    destacado: false,
    activo: true,
    landing_tipo: 'catalogo', // Plantilla de landing por defecto
    
    // Especificaciones físicas
    peso: '',
    dimensiones: '',
    marca: '',
    modelo: '',
    color: '',
    talla: '',
    material: '',
    garantia_meses: '',
    origen_pais: '',
    
    // SEO
    palabras_clave: [],
    meta_title: '',
    meta_description: ''
  })

  // Estados para campos dinámicos
  const [nuevoGancho, setNuevoGancho] = useState('')
  const [nuevoBeneficio, setNuevoBeneficio] = useState('')
  const [nuevaVentaja, setNuevaVentaja] = useState('')
  const [nuevaPalabraClave, setNuevaPalabraClave] = useState('')
  const [nuevaImagenPrincipal, setNuevaImagenPrincipal] = useState('')
  const [nuevaImagenSecundaria, setNuevaImagenSecundaria] = useState('')
  const [nuevoVideo, setNuevoVideo] = useState('')
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  // Efectos
  useEffect(() => {
    cargarCategorias()
    if (modo === 'editar' && slug) {
      cargarProducto()
    }
  }, [modo, slug])

  // Funciones de carga
  const cargarCategorias = async () => {
    try {
      console.log('🔍 Cargando categorías...')
      
      const { data, error } = await clienteSupabase
        .from('categorias')
        .select('id, nombre, icono, activo')
        .eq('activo', true)
        .order('nombre')

      if (error) {
        console.error('❌ Error cargando categorías:', error)
        throw error
      }
      
      console.log('✅ Categorías cargadas:', data?.length || 0)
      setCategorias(data || [])
    } catch (error) {
      console.error('💥 Error cargando categorías:', error)
      setError(`Error al cargar las categorías: ${error.message}`)
    }
  }

  const cargarProducto = async () => {
    try {
      setCargandoProducto(true)
      console.log('🔍 Cargando producto para editar:', slug)

      const { data, error } = await clienteSupabase
        .from('productos')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('❌ Error cargando producto:', error)
        throw error
      }

      console.log('✅ Producto cargado:', data)
      
      // Mapear datos del producto al formulario
      setFormulario({
        nombre: data.nombre || '',
        slug: data.slug || '',
        descripcion: data.descripcion || '',
        ganchos: data.ganchos || [],
        beneficios: data.beneficios || [],
        ventajas: data.ventajas || [],
        precio: data.precio || '',
        precio_original: data.precio_original || '',
        descuento: data.descuento || '',
        categoria_id: data.categoria_id || '',
        fotos_principales: data.fotos_principales || [],
        fotos_secundarias: data.fotos_secundarias || [],
        videos: data.videos || [],
        stock: data.stock || '',
        stock_minimo: data.stock_minimo || '5',
        destacado: data.destacado || false,
        activo: data.activo !== undefined ? data.activo : true,
        landing_tipo: data.landing_tipo || 'temu',
        peso: data.peso || '',
        dimensiones: data.dimensiones || '',
        marca: data.marca || '',
        modelo: data.modelo || '',
        color: data.color || '',
        talla: data.talla || '',
        material: data.material || '',
        garantia_meses: data.garantia_meses || '',
        origen_pais: data.origen_pais || '',
        palabras_clave: data.palabras_clave || [],
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || ''
      })

      setProductoId(data.id)
      
    } catch (error) {
      console.error('💥 Error cargando producto:', error)
      setError(`Error al cargar el producto: ${error.message}`)
    } finally {
      setCargandoProducto(false)
    }
  }

  // Función de manejo de cambios
  const manejarCambio = (campo, valor) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }))

    // Auto-generar slug desde el nombre
    if (campo === 'nombre') {
      const slug = valor
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormulario(prev => ({
        ...prev,
        slug: slug
      }))
    }

    // Limpiar mensajes
    if (error) setError('')
    if (exito) setExito('')
  }

  // Funciones para arrays dinámicos
  const agregarElementoArray = (campo, valor, setterValor) => {
    if (!valor.trim()) return
    
    setFormulario(prev => ({
      ...prev,
      [campo]: [...prev[campo], valor.trim()]
    }))
    setterValor('')
  }

  const eliminarElementoArray = (campo, index) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }))
  }

  // Validación
  const validarFormulario = () => {
    const errores = []

    if (!formulario.nombre.trim()) errores.push('El nombre es obligatorio')
    if (!formulario.descripcion.trim()) errores.push('La descripción es obligatoria')
    if (!formulario.precio || formulario.precio <= 0) errores.push('El precio debe ser mayor a 0')
    if (!formulario.stock || formulario.stock < 0) errores.push('El stock debe ser mayor o igual a 0')
    if (!formulario.categoria_id) errores.push('Debe seleccionar una categoría')

    return errores
  }

  // Función principal de guardado
  const guardarProducto = async () => {
    try {
      setCargando(true)
      setError('')
      setExito('')

      const errores = validarFormulario()
      if (errores.length > 0) {
        setError(errores.join(', '))
        return
      }

      // Preparar datos para insertar/actualizar
      const datosProducto = {
        // Información básica
        nombre: formulario.nombre.trim(),
        slug: formulario.slug.trim(),
        descripcion: formulario.descripcion.trim(),
        ganchos: formulario.ganchos,
        beneficios: formulario.beneficios,
        ventajas: formulario.ventajas,
        
        // Precios
        precio: parseFloat(formulario.precio),
        precio_original: formulario.precio_original ? parseFloat(formulario.precio_original) : null,
        descuento: formulario.descuento ? parseFloat(formulario.descuento) : null,
        
        // Categoría
        categoria_id: formulario.categoria_id || null,
        
        // Imágenes y videos
        fotos_principales: formulario.fotos_principales,
        fotos_secundarias: formulario.fotos_secundarias,
        videos: formulario.videos,
        
        // Inventario
        stock: parseInt(formulario.stock),
        stock_minimo: parseInt(formulario.stock_minimo),
        
        // Configuración
        destacado: formulario.destacado,
        activo: formulario.activo,
        landing_tipo: formulario.landing_tipo,
        
        // Especificaciones físicas
        peso: formulario.peso ? parseFloat(formulario.peso) : null,
        dimensiones: formulario.dimensiones || null,
        marca: formulario.marca || null,
        modelo: formulario.modelo || null,
        color: formulario.color || null,
        talla: formulario.talla || null,
        material: formulario.material || null,
        garantia_meses: formulario.garantia_meses ? parseInt(formulario.garantia_meses) : null,
        origen_pais: formulario.origen_pais || null,
        
        // SEO
        palabras_clave: formulario.palabras_clave,
        meta_title: formulario.meta_title || null,
        meta_description: formulario.meta_description || null,
        
        // Auditoría
        ...(modo === 'crear' && { creado_por: usuario?.id }),
        ...(modo === 'editar' && { actualizado_el: new Date().toISOString() })
      }

      console.log(`${modo === 'crear' ? 'Creando' : 'Actualizando'} producto:`, datosProducto)
      console.log('🎨 Landing tipo seleccionado:', formulario.landing_tipo)

      let result
      if (modo === 'crear') {
        result = await clienteSupabase
          .from('productos')
          .insert([datosProducto])
          .select()
      } else {
        result = await clienteSupabase
          .from('productos')
          .update(datosProducto)
          .eq('id', productoId)
          .select()
      }

      const { data, error } = result

      if (error) {
        console.error('Error al guardar:', error)
        throw error
      }

      console.log('Producto guardado:', data)
      const mensaje = modo === 'crear' ? '¡Producto creado exitosamente!' : '¡Producto actualizado exitosamente!'
      setExito(mensaje)
      
      if (modo === 'crear') {
        setProductoCreado(data[0])
      }

      // Callback de éxito
      if (onSuccess) {
        onSuccess(data[0])
      }
      
      setTimeout(() => {
        navigate('/admin/productos')
      }, 2000)

    } catch (error) {
      console.error('Error al guardar producto:', error)
      setError(`Error al guardar: ${error.message}`)
    } finally {
      setCargando(false)
    }
  }

  // Título dinámico
  const titulo = modo === 'crear' ? 'Agregar Nuevo Producto' : 'Editar Producto'
  const subtitulo = modo === 'crear' 
    ? 'Completa la información del producto para agregarlo al catálogo'
    : 'Modifica la información del producto'

  // Si está cargando el producto para editar
  if (cargandoProducto) {
    return (
      <div className="agregar-producto">
        <div className="cargando-producto">
          <Loader className="spinner" />
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="agregar-producto">
      {/* Header */}
      <div className="agregar-producto-header">
        <div className="header-navegacion">
          <Link to="/admin/productos" className="boton-volver">
            <ArrowLeft className="icono" />
            Volver a Productos
          </Link>
        </div>
        
        <div className="header-titulo">
          <h1 className="titulo-pagina">
            <Package className="icono-titulo" />
            {titulo}
          </h1>
          <p className="subtitulo-pagina">
            {subtitulo}
          </p>
        </div>

        <div className="header-acciones">
          <button 
            type="button" 
            className="boton-secundario"
            onClick={() => navigate('/admin/productos')}
          >
            <X className="icono" />
            Cancelar
          </button>
          
          {modo === 'crear' && (
            <>
              <button 
                type="button" 
                className="boton-ia"
                onClick={() => setMostrarModalIA(true)}
              >
                <Sparkles className="icono" />
                Crear con IA
              </button>
              <button 
                type="button" 
                className="boton-imagenes-ia"
                onClick={() => setMostrarChatImagenes(true)}
              >
                <Camera className="icono" />
                Crear Imágenes con IA
              </button>
            </>
          )}
          
          <button 
            type="button" 
            className="boton-vista-previa"
            onClick={() => window.open(`/producto/${formulario.slug}`, '_blank')}
            disabled={!formulario.slug}
          >
            <Eye className="icono" />
            Vista Previa
          </button>
          <button 
            type="button" 
            className="boton-primario"
            onClick={guardarProducto}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <Loader className="icono spinner" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="icono" />
                {modo === 'crear' ? 'Guardar Producto' : 'Actualizar Producto'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mensaje-error">
          <AlertCircle className="icono" />
          {error}
        </div>
      )}

      {exito && (
        <div className="mensaje-exito">
          <Package className="icono" />
          {exito}
        </div>
      )}

      {/* Formulario */}
      <div className="formulario-grid">
        {/* Información Básica */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <FileText className="icono" />
            <h3>Información Básica</h3>
          </div>
          
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">
                Nombre del Producto *
              </label>
              <input
                type="text"
                className="campo-input"
                placeholder="Ej: iPhone 16 Pro Max"
                value={formulario.nombre}
                onChange={(e) => manejarCambio('nombre', e.target.value)}
              />
            </div>

            <div className="campo-grupo">
              <label className="campo-label">
                Slug (URL)
              </label>
              <input
                type="text"
                className="campo-input"
                placeholder="se-genera-automaticamente"
                value={formulario.slug}
                onChange={(e) => manejarCambio('slug', e.target.value)}
              />
            </div>

            <div className="campo-grupo campo-completo">
              <label className="campo-label">
                Descripción *
              </label>
              <textarea
                className="campo-textarea"
                rows="4"
                placeholder="Describe las características principales del producto..."
                value={formulario.descripcion}
                onChange={(e) => manejarCambio('descripcion', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Precios */}
        <div className="seccion-card">
          <div className="seccion-header">
            <DollarSign className="icono" />
            <h3>Precios</h3>
          </div>
          
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">
                Precio Actual (COP) *
              </label>
              <div className="campo-precio-cop">
                <span className="simbolo-peso">$</span>
                <input
                  type="number"
                  step="1"
                  className="campo-input campo-precio"
                  placeholder="50000"
                  value={formulario.precio}
                  onChange={(e) => manejarCambio('precio', e.target.value)}
                />
                <span className="precio-formateado">
                  {formulario.precio ? formatearPrecioCOP(formulario.precio) : '$0'}
                </span>
              </div>
            </div>

            <div className="campo-grupo">
              <label className="campo-label">
                Precio Original (COP)
              </label>
              <div className="campo-precio-cop">
                <span className="simbolo-peso">$</span>
                <input
                  type="number"
                  step="1"
                  className="campo-input campo-precio"
                  placeholder="80000"
                  value={formulario.precio_original}
                  onChange={(e) => manejarCambio('precio_original', e.target.value)}
                />
                <span className="texto-ayuda">Precio antes del descuento</span>
              </div>
            </div>

            <div className="campo-grupo">
              <label className="campo-label">
                Descuento (%)
              </label>
              <input
                type="number"
                step="0.01"
                className="campo-input"
                placeholder="0"
                value={formulario.descuento}
                onChange={(e) => manejarCambio('descuento', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Configuración de Landing Page */}
        <div className="seccion-card">
          <div className="seccion-header">
            <Sparkles className="icono" />
            <h3>🎨 Configuración de Landing Page</h3>
          </div>
          
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">
                Plantilla de Landing
                <span className="campo-ayuda">Selecciona el estilo de página de venta</span>
              </label>
              <select
                className="campo-select"
                value={formulario.landing_tipo}
                onChange={(e) => manejarCambio('landing_tipo', e.target.value)}
              >
                <option value="catalogo">📋 Vista Catálogo - Estándar</option>
                <option value="temu">🛍️ Plantilla TEMU - Estilo marketplace</option>
                <option value="lujo">🏆 Plantilla Lujo - Premium y elegante</option>
                <option value="oferta_flash">⚡ Plantilla Oferta Flash - Urgencia y descuentos</option>
                <option value="aventura">🏔️ Plantilla Aventura - Deportes y outdoor</option>
                <option value="minimalista">✨ Plantilla Minimalista - Limpio y moderno</option>
              </select>
            </div>

            <div className="campo-grupo campo-completo">
              <div className="checkboxes-configuracion">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formulario.destacado}
                    onChange={(e) => manejarCambio('destacado', e.target.checked)}
                  />
                  <span className="checkbox-texto">
                    ⭐ Producto destacado
                    <small>Aparecerá en secciones especiales</small>
                  </span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formulario.activo}
                    onChange={(e) => manejarCambio('activo', e.target.checked)}
                  />
                  <span className="checkbox-texto">
                    ✅ Producto activo
                    <small>Visible para los clientes</small>
                  </span>
                </label>
              </div>
            </div>

            <div className="campo-grupo campo-completo">
              <div className="preview-landing">
                <p className="preview-texto">
                  <strong>Vista previa:</strong> Tu producto usará la plantilla <strong>{formulario.landing_tipo.toUpperCase()}</strong>
                </p>
                <p className="preview-url">
                  <strong>URL de landing:</strong> <code>/landing/{formulario.slug || 'tu-producto'}</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categoría y Estado */}
        <div className="seccion-card">
          <div className="seccion-header">
            <Settings className="icono" />
            <h3>Configuración</h3>
          </div>
          
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">
                Categoría *
              </label>
              <select
                className="campo-select"
                value={formulario.categoria_id}
                onChange={(e) => manejarCambio('categoria_id', e.target.value)}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.icono} {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-grupo">
              <label className="campo-label">
                Stock *
              </label>
              <input
                type="number"
                className="campo-input"
                placeholder="0"
                value={formulario.stock}
                onChange={(e) => manejarCambio('stock', e.target.value)}
              />
            </div>

            <div className="campo-grupo">
              <label className="campo-label">
                Stock Mínimo
              </label>
              <input
                type="number"
                className="campo-input"
                placeholder="5"
                value={formulario.stock_minimo}
                onChange={(e) => manejarCambio('stock_minimo', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ganchos de Venta */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Tag className="icono" />
            <h3>Ganchos de Venta</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="text"
                className="campo-input"
                placeholder="Ej: Envío gratis en 24h"
                value={nuevoGancho}
                onChange={(e) => setNuevoGancho(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarElementoArray('ganchos', nuevoGancho, setNuevoGancho)
                  }
                }}
              />
              <button
                type="button"
                className="boton-agregar"
                onClick={() => agregarElementoArray('ganchos', nuevoGancho, setNuevoGancho)}
              >
                <Plus className="icono" />
              </button>
            </div>
            
            <div className="elementos-lista">
              {formulario.ganchos.map((gancho, index) => (
                <div key={index} className="elemento-item">
                  <span>{gancho}</span>
                  <button
                    type="button"
                    className="boton-eliminar"
                    onClick={() => eliminarElementoArray('ganchos', index)}
                  >
                    <X className="icono" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Tag className="icono" />
            <h3>Beneficios</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="text"
                className="campo-input"
                placeholder="Ej: Ahorra tiempo y dinero"
                value={nuevoBeneficio}
                onChange={(e) => setNuevoBeneficio(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarElementoArray('beneficios', nuevoBeneficio, setNuevoBeneficio)
                  }
                }}
              />
              <button
                type="button"
                className="boton-agregar"
                onClick={() => agregarElementoArray('beneficios', nuevoBeneficio, setNuevoBeneficio)}
              >
                <Plus className="icono" />
              </button>
            </div>
            
            <div className="elementos-lista">
              {formulario.beneficios.map((beneficio, index) => (
                <div key={index} className="elemento-item">
                  <span>{beneficio}</span>
                  <button
                    type="button"
                    className="boton-eliminar"
                    onClick={() => eliminarElementoArray('beneficios', index)}
                  >
                    <X className="icono" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Imágenes Principales */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Image className="icono" />
            <h3>Imágenes Principales</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="url"
                className="campo-input"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={nuevaImagenPrincipal}
                onChange={(e) => setNuevaImagenPrincipal(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarElementoArray('fotos_principales', nuevaImagenPrincipal, setNuevaImagenPrincipal)
                  }
                }}
              />
              <button
                type="button"
                className="boton-agregar"
                onClick={() => agregarElementoArray('fotos_principales', nuevaImagenPrincipal, setNuevaImagenPrincipal)}
              >
                <Plus className="icono" />
              </button>
            </div>
            
            <div className="imagenes-grid">
              {formulario.fotos_principales.map((imagen, index) => (
                <div key={index} className="imagen-item">
                  <img src={imagen} alt={`Principal ${index + 1}`} className="imagen-preview" />
                  <button
                    type="button"
                    className="boton-eliminar-imagen"
                    onClick={() => eliminarElementoArray('fotos_principales', index)}
                  >
                    <X className="icono" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Globe className="icono" />
            <h3>SEO y Palabras Clave</h3>
          </div>
          
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">Meta Title</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Se genera automáticamente"
                value={formulario.meta_title}
                onChange={(e) => manejarCambio('meta_title', e.target.value)}
              />
            </div>

            <div className="campo-grupo campo-completo">
              <label className="campo-label">Meta Description</label>
              <textarea
                className="campo-textarea"
                rows="3"
                placeholder="Descripción para motores de búsqueda..."
                value={formulario.meta_description}
                onChange={(e) => manejarCambio('meta_description', e.target.value)}
              />
            </div>

            <div className="campo-grupo campo-completo">
              <label className="campo-label">Palabras Clave</label>
              <div className="lista-dinamica">
                <div className="agregar-elemento">
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: smartphone, móvil, tecnología"
                    value={nuevaPalabraClave}
                    onChange={(e) => setNuevaPalabraClave(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        agregarElementoArray('palabras_clave', nuevaPalabraClave, setNuevaPalabraClave)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="boton-agregar"
                    onClick={() => agregarElementoArray('palabras_clave', nuevaPalabraClave, setNuevaPalabraClave)}
                  >
                    <Plus className="icono" />
                  </button>
                </div>
                
                <div className="elementos-lista">
                  {formulario.palabras_clave.map((palabra, index) => (
                    <div key={index} className="elemento-item">
                      <span>{palabra}</span>
                      <button
                        type="button"
                        className="boton-eliminar"
                        onClick={() => eliminarElementoArray('palabras_clave', index)}
                      >
                        <X className="icono" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modales */}
      {modo === 'crear' && (
        <>
          <CrearProductoIA
            mostrar={mostrarModalIA}
            onCerrar={() => setMostrarModalIA(false)}
            onProductoCreado={(producto) => {
              // Mapear producto generado al formulario
              setFormulario(prev => ({ ...prev, ...producto }))
              setMostrarModalIA(false)
            }}
            categorias={categorias}
          />

          {mostrarChatImagenes && (
            <div className="seccion-card seccion-completa">
              <ChatImagenesIA
                mostrar={mostrarChatImagenes}
                onCerrar={() => setMostrarChatImagenes(false)}
                producto={productoCreado || {
                  id: `borrador-${Date.now()}`,
                  nombre: formulario.nombre || 'Producto sin nombre',
                  descripcion: formulario.descripcion || '',
                  categoria_id: formulario.categoria_id || '',
                  fotos_principales: formulario.fotos_principales || [],
                  fotos_secundarias: formulario.fotos_secundarias || []
                }}
                onImagenesGeneradas={(imagenes) => {
                  setFormulario(prev => ({
                    ...prev,
                    fotos_principales: [...prev.fotos_principales, ...imagenes]
                  }))
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FormularioProducto
