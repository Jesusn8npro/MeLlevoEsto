import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clienteSupabase } from '../../../configuracion/supabase'
import { useAuth } from '../../../contextos/ContextoAutenticacion'
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
  Camera
} from 'lucide-react'
import './EstilosAgregarProducto.css'
import CrearProductoIA from '../../../componentes/admin/CrearProductoIA'
import ChatImagenesIA from '../../../componentes/admin/ChatImagenesIA'

const AgregarProducto = () => {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [categorias, setCategorias] = useState([])
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

  useEffect(() => {
    cargarCategorias()
  }, [])

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
      console.error('Error cargando categorías:', error)
      setError('Error al cargar las categorías')
    }
  }

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

    // Auto-generar meta_title desde el nombre
    if (campo === 'nombre') {
      setFormulario(prev => ({
        ...prev,
        meta_title: valor ? `${valor} - ME LLEVO ESTO` : ''
      }))
    }
  }

  const agregarElementoArray = (campo, valor, setter) => {
    if (valor.trim()) {
      setFormulario(prev => ({
        ...prev,
        [campo]: [...prev[campo], valor.trim()]
      }))
      setter('')
    }
  }

  const eliminarElementoArray = (campo, index) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }))
  }

  const validarFormulario = () => {
    const errores = []

    if (!formulario.nombre.trim()) errores.push('El nombre es obligatorio')
    if (!formulario.descripcion.trim()) errores.push('La descripción es obligatoria')
    if (!formulario.precio || formulario.precio <= 0) errores.push('El precio debe ser mayor a 0')
    if (!formulario.stock || formulario.stock < 0) errores.push('El stock debe ser mayor o igual a 0')
    if (!formulario.categoria_id) errores.push('Debe seleccionar una categoría')

    return errores
  }

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

      // Preparar datos para insertar - SOLO campos que existen en la BD
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
        creado_por: usuario?.id
      }

      console.log('Guardando producto:', datosProducto)

      const { data, error } = await clienteSupabase
        .from('productos')
        .insert([datosProducto])
        .select()

      if (error) {
        console.error('Error al guardar:', error)
        throw error
      }

      console.log('Producto guardado:', data)
      setExito('¡Producto creado exitosamente!')
      setProductoCreado(data[0]) // Guardar el producto creado
      
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

  const manejarProductoIA = (productoGenerado) => {
    console.log('📦 Producto generado por IA:', productoGenerado)
    
    // Mapear datos de IA al formulario existente
    setFormulario(prev => ({
      ...prev,
      // Datos básicos
      nombre: productoGenerado.nombre || '',
      precio: productoGenerado.precio || '',
      categoria_id: productoGenerado.categoria_id || '',
      
      // Datos generados por IA
      descripcion: productoGenerado.descripcion || '',
      ganchos: productoGenerado.ganchos || [],
      beneficios: productoGenerado.beneficios || [],
      ventajas: productoGenerado.ventajas || [],
      slug: productoGenerado.slug || '',
      meta_title: productoGenerado.meta_title || '',
      meta_description: productoGenerado.meta_description || '',
      palabras_clave: productoGenerado.palabras_clave || [],
      
      // Imágenes
      fotos_principales: productoGenerado.fotos_principales || [],
      
      // Configuración
      stock: productoGenerado.stock || 10,
      stock_minimo: productoGenerado.stock_minimo || 5,
      destacado: productoGenerado.destacado || false,
      activo: productoGenerado.activo !== undefined ? productoGenerado.activo : true
    }))

    // Mostrar mensaje de éxito
    setExito('¡Producto generado con IA exitosamente! Revisa la información y guarda cuando esté listo.')
    
    // Cerrar modal
    setMostrarModalIA(false)
  }

  const manejarImagenesGeneradas = (imagenes) => {
    console.log('🖼️ Imágenes generadas:', imagenes)
    
    // Agregar las nuevas imágenes a las fotos principales
    setFormulario(prev => ({
      ...prev,
      fotos_principales: [...prev.fotos_principales, ...imagenes]
    }))

    // Actualizar el producto creado también
    if (productoCreado) {
      setProductoCreado(prev => ({
        ...prev,
        fotos_principales: [...(prev.fotos_principales || []), ...imagenes]
      }))
    }

    setExito(`¡${imagenes.length} imagen(es) generada(s) y agregada(s) al producto!`)
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
            Agregar Nuevo Producto
          </h1>
          <p className="subtitulo-pagina">
            Completa la información del producto para agregarlo al catálogo
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
          <button 
            type="button" 
            className="boton-vista-previa"
            disabled={!formulario.nombre}
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
            <Save className="icono" />
            {cargando ? 'Guardando...' : 'Guardar Producto'}
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
          <Save className="icono" />
          {exito}
        </div>
      )}

      {/* Formulario */}
      <div className="formulario-contenedor">
        <div className="formulario-grid">
          
          {/* Columna Principal */}
          <div className="columna-principal">
            
            {/* Información Básica */}
            <div className="seccion-card">
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
                    placeholder="Ej: iPhone 15 Pro Max"
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

            {/* Ganchos de Venta */}
            <div className="seccion-card">
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
            <div className="seccion-card">
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

            {/* Ventajas */}
            <div className="seccion-card">
              <div className="seccion-header">
                <Tag className="icono" />
                <h3>Ventajas Competitivas</h3>
              </div>
              
              <div className="lista-dinamica">
                <div className="agregar-elemento">
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: Mejor precio del mercado"
                    value={nuevaVentaja}
                    onChange={(e) => setNuevaVentaja(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        agregarElementoArray('ventajas', nuevaVentaja, setNuevaVentaja)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="boton-agregar"
                    onClick={() => agregarElementoArray('ventajas', nuevaVentaja, setNuevaVentaja)}
                  >
                    <Plus className="icono" />
                  </button>
                </div>
                
                <div className="elementos-lista">
                  {formulario.ventajas.map((ventaja, index) => (
                    <div key={index} className="elemento-item">
                      <span>{ventaja}</span>
                      <button
                        type="button"
                        className="boton-eliminar"
                        onClick={() => eliminarElementoArray('ventajas', index)}
                      >
                        <X className="icono" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Columna Lateral */}
          <div className="columna-lateral">
            
            {/* Precios */}
            <div className="seccion-card">
              <div className="seccion-header">
                <DollarSign className="icono" />
                <h3>Precios</h3>
              </div>
              
              <div className="campos-grid">
                <div className="campo-grupo">
                  <label className="campo-label">
                    Precio Actual *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="campo-input"
                    placeholder="0.00"
                    value={formulario.precio}
                    onChange={(e) => manejarCambio('precio', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">
                    Precio Original
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="campo-input"
                    placeholder="0.00"
                    value={formulario.precio_original}
                    onChange={(e) => manejarCambio('precio_original', e.target.value)}
                  />
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
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="campo-grupo campo-completo">
                  <div className="checkbox-grupo">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formulario.destacado}
                        onChange={(e) => manejarCambio('destacado', e.target.checked)}
                      />
                      <span className="checkbox-texto">Producto Destacado</span>
                    </label>
                  </div>
                  
                  <div className="checkbox-grupo">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formulario.activo}
                        onChange={(e) => manejarCambio('activo', e.target.checked)}
                      />
                      <span className="checkbox-texto">Producto Activo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventario */}
            <div className="seccion-card">
              <div className="seccion-header">
                <Package className="icono" />
                <h3>Inventario</h3>
              </div>
              
              <div className="campos-grid">
                <div className="campo-grupo">
                  <label className="campo-label">
                    Stock Actual *
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

            {/* Especificaciones */}
            <div className="seccion-card">
              <div className="seccion-header">
                <Truck className="icono" />
                <h3>Especificaciones</h3>
              </div>
              
              <div className="campos-grid">
                <div className="campo-grupo">
                  <label className="campo-label">Marca</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: Apple"
                    value={formulario.marca}
                    onChange={(e) => manejarCambio('marca', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Modelo</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: iPhone 15"
                    value={formulario.modelo}
                    onChange={(e) => manejarCambio('modelo', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Color</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: Negro"
                    value={formulario.color}
                    onChange={(e) => manejarCambio('color', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Talla</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: XL"
                    value={formulario.talla}
                    onChange={(e) => manejarCambio('talla', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Material</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: Algodón"
                    value={formulario.material}
                    onChange={(e) => manejarCambio('material', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="campo-input"
                    placeholder="0.00"
                    value={formulario.peso}
                    onChange={(e) => manejarCambio('peso', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Dimensiones</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: 20x15x5 cm"
                    value={formulario.dimensiones}
                    onChange={(e) => manejarCambio('dimensiones', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Garantía (meses)</label>
                  <input
                    type="number"
                    className="campo-input"
                    placeholder="12"
                    value={formulario.garantia_meses}
                    onChange={(e) => manejarCambio('garantia_meses', e.target.value)}
                  />
                </div>

                <div className="campo-grupo campo-completo">
                  <label className="campo-label">País de Origen</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej: España"
                    value={formulario.origen_pais}
                    onChange={(e) => manejarCambio('origen_pais', e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Secciones de Ancho Completo */}
        
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

        {/* Imágenes Secundarias */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Image className="icono" />
            <h3>Imágenes Secundarias</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="url"
                className="campo-input"
                placeholder="https://ejemplo.com/imagen-secundaria.jpg"
                value={nuevaImagenSecundaria}
                onChange={(e) => setNuevaImagenSecundaria(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarElementoArray('fotos_secundarias', nuevaImagenSecundaria, setNuevaImagenSecundaria)
                  }
                }}
              />
              <button
                type="button"
                className="boton-agregar"
                onClick={() => agregarElementoArray('fotos_secundarias', nuevaImagenSecundaria, setNuevaImagenSecundaria)}
              >
                <Plus className="icono" />
              </button>
            </div>
            
            <div className="imagenes-grid">
              {formulario.fotos_secundarias.map((imagen, index) => (
                <div key={index} className="imagen-item">
                  <img src={imagen} alt={`Secundaria ${index + 1}`} className="imagen-preview" />
                  <button
                    type="button"
                    className="boton-eliminar-imagen"
                    onClick={() => eliminarElementoArray('fotos_secundarias', index)}
                  >
                    <X className="icono" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Upload className="icono" />
            <h3>Videos del Producto</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="url"
                className="campo-input"
                placeholder="https://youtube.com/watch?v=..."
                value={nuevoVideo}
                onChange={(e) => setNuevoVideo(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarElementoArray('videos', nuevoVideo, setNuevoVideo)
                  }
                }}
              />
              <button
                type="button"
                className="boton-agregar"
                onClick={() => agregarElementoArray('videos', nuevoVideo, setNuevoVideo)}
              >
                <Plus className="icono" />
              </button>
            </div>
            
            <div className="elementos-lista">
              {formulario.videos.map((video, index) => (
                <div key={index} className="elemento-item">
                  <span>{video}</span>
                  <button
                    type="button"
                    className="boton-eliminar"
                    onClick={() => eliminarElementoArray('videos', index)}
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

      {/* Modal Crear con IA */}
      <CrearProductoIA
        mostrar={mostrarModalIA}
        onCerrar={() => setMostrarModalIA(false)}
        onProductoCreado={manejarProductoIA}
        categorias={categorias}
      />

      {/* Chat de Imágenes IA - Integrado en el formulario */}
      {mostrarChatImagenes && (
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <h2>🎨 Chat de Imágenes IA</h2>
            <button 
              className="boton-cerrar-chat"
              onClick={() => setMostrarChatImagenes(false)}
            >
              ✕ Cerrar
            </button>
          </div>
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
            onImagenesGeneradas={manejarImagenesGeneradas}
          />
        </div>
      )}
    </div>
  )
}

export default AgregarProducto