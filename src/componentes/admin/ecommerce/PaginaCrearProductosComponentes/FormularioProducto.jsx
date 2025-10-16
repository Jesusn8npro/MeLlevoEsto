import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clienteSupabase } from '../../../../configuracion/supabase'
import { useAuth } from '../../../../contextos/ContextoAutenticacion'
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
import './formularioproducto.css'
import { formatearPrecioCOP } from '../../../../utilidades/formatoPrecio'
import CrearProductoIA from './CrearProductoIA/CrearProductoIA'
import ChatImagenesIA from './ChatImagenesIA/ChatImagenesIA'

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
  // Pestañas
  const [pestanaActiva, setPestanaActiva] = useState('detalles') // 'detalles' | 'crearIA' | 'imagenesIA' | 'vistaPrevia'
  const [mostrarModalIA, setMostrarModalIA] = useState(false) // legado (no usado en modo pestañas)
  const [mostrarChatImagenes, setMostrarChatImagenes] = useState(false) // legado (no usado en modo pestañas)
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

    // Estado del producto (nuevo/usado/reacondicionado)
    estado: 'nuevo',
    
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

  // ===== Imágenes para Landing Page (tabla_producto_imagenes) =====
  const [imagenesLanding, setImagenesLanding] = useState({
    imagen_principal: '',
    imagen_secundaria_1: '',
    imagen_secundaria_2: '',
    imagen_secundaria_3: '',
    imagen_secundaria_4: '',
    imagen_punto_dolor_1: '',
    imagen_punto_dolor_2: '',
    imagen_punto_dolor_3: '',
    imagen_punto_dolor_4: '',
    imagen_solucion_1: '',
    imagen_solucion_2: '',
    imagen_solucion_3: '',
    imagen_solucion_4: '',
    imagen_testimonio_persona_1: '',
    imagen_testimonio_persona_2: '',
    imagen_testimonio_persona_3: '',
    imagen_testimonio_persona_4: '',
    imagen_testimonio_persona_5: '',
    imagen_testimonio_persona_6: '',
    imagen_testimonio_producto_1: '',
    imagen_testimonio_producto_2: '',
    imagen_testimonio_producto_3: '',
    imagen_testimonio_producto_4: '',
    imagen_testimonio_producto_5: '',
    imagen_testimonio_producto_6: '',
    imagen_caracteristicas: '',
    imagen_garantias: '',
    imagen_cta_final: '',
    estado: 'pendiente',
    total_imagenes_generadas: 0,
    prompts_utilizados: {}
  })
  const [imagenesLandingId, setImagenesLandingId] = useState(null)
  const [subiendoImagenLanding, setSubiendoImagenLanding] = useState(false)

  // Efectos
  useEffect(() => {
    cargarCategorias()
    if (modo === 'editar' && slug) {
      cargarProducto()
    }
  }, [modo, slug])

  // Cargar imágenes de landing cuando se tenga el ID del producto
  useEffect(() => {
    if (modo === 'editar' && productoId) {
      cargarImagenesProducto(productoId)
    }
  }, [modo, productoId])

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
      
      // Intentar por slug primero
      const { data: porSlug, error: errorSlug } = await clienteSupabase
        .from('productos')
        .select('*')
        .eq('slug', slug)
        .limit(1)

      if (errorSlug) {
        console.error('❌ Error cargando producto por slug:', errorSlug)
        throw errorSlug
      }

      let productoEncontrado = porSlug && porSlug.length ? porSlug[0] : null

      // Si no se encontró por slug, intentar por nombre
      if (!productoEncontrado) {
        const { data: porNombre, error: errorNombre } = await clienteSupabase
          .from('productos')
          .select('*')
          .eq('nombre', slug)
          .limit(1)

        if (errorNombre) {
          console.error('❌ Error cargando producto por nombre:', errorNombre)
          throw errorNombre
        }

        productoEncontrado = porNombre && porNombre.length ? porNombre[0] : null
      }

      if (!productoEncontrado) {
        throw new Error('Producto no encontrado por slug o nombre')
      }

      console.log('✅ Producto cargado:', productoEncontrado)
      
      // Mapear datos del producto al formulario
      setFormulario({
        nombre: productoEncontrado.nombre || '',
        slug: productoEncontrado.slug || '',
        descripcion: productoEncontrado.descripcion || '',
        ganchos: productoEncontrado.ganchos || [],
        beneficios: productoEncontrado.beneficios || [],
        ventajas: productoEncontrado.ventajas || [],
        precio: productoEncontrado.precio || '',
        precio_original: productoEncontrado.precio_original || '',
        descuento: productoEncontrado.descuento || '',
        estado: productoEncontrado.estado || 'nuevo',
        categoria_id: productoEncontrado.categoria_id || '',
        fotos_principales: productoEncontrado.fotos_principales || [],
        fotos_secundarias: productoEncontrado.fotos_secundarias || [],
        videos: productoEncontrado.videos || [],
        stock: productoEncontrado.stock || '',
        stock_minimo: productoEncontrado.stock_minimo || '5',
        destacado: productoEncontrado.destacado || false,
        activo: productoEncontrado.activo !== undefined ? productoEncontrado.activo : true,
        landing_tipo: productoEncontrado.landing_tipo || 'temu',
        peso: productoEncontrado.peso || '',
        dimensiones: productoEncontrado.dimensiones || '',
        marca: productoEncontrado.marca || '',
        modelo: productoEncontrado.modelo || '',
        color: productoEncontrado.color || '',
        talla: productoEncontrado.talla || '',
        material: productoEncontrado.material || '',
        garantia_meses: productoEncontrado.garantia_meses || '',
        origen_pais: productoEncontrado.origen_pais || '',
        palabras_clave: productoEncontrado.palabras_clave || [],
        meta_title: productoEncontrado.meta_title || '',
        meta_description: productoEncontrado.meta_description || ''
      })

      setProductoId(productoEncontrado.id)
      
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

  // ===== Utilidades e integración de Imágenes de Landing =====
  const contarImagenesGeneradas = (obj) => {
    return Object.keys(obj)
      .filter(k => k.startsWith('imagen_'))
      .filter(k => obj[k] && String(obj[k]).trim().length > 0)
      .length
  }

  const cargarImagenesProducto = async (idProducto) => {
    try {
      const { data, error } = await clienteSupabase
        .from('tabla_producto_imagenes')
        .select('*')
        .eq('producto_id', idProducto)
        .limit(1)

      if (error) throw error

      if (data && data.length) {
        const registro = data[0]
        setImagenesLanding(prev => ({
          ...prev,
          ...registro,
          prompts_utilizados: registro.prompts_utilizados || {},
          estado: registro.estado || 'pendiente',
          total_imagenes_generadas: registro.total_imagenes_generadas || contarImagenesGeneradas(registro)
        }))
        setImagenesLandingId(registro.id)
      } else {
        setImagenesLanding(prev => ({
          ...prev,
          estado: 'pendiente',
          total_imagenes_generadas: 0
        }))
        setImagenesLandingId(null)
      }
    } catch (error) {
      console.error('Error cargando imágenes de landing:', error)
      setError(`Error al cargar las imágenes: ${error.message}`)
    }
  }

  const subirImagenLanding = async (archivo, campo) => {
    try {
      if (!archivo) return
      if (!formulario.slug) {
        setError('Primero asigna un nombre para generar el slug del producto')
        return
      }

      setSubiendoImagenLanding(true)
      setError('')

      const ruta = `productos/${formulario.slug}/landing/${Date.now()}-${archivo.name}`
      const { data, error } = await clienteSupabase.storage
        .from('imagenes')
        .upload(ruta, archivo, { upsert: true })

      if (error) throw error

      const { data: publicData } = clienteSupabase.storage
        .from('imagenes')
        .getPublicUrl(ruta)

      const urlPublica = publicData?.publicUrl
      setImagenesLanding(prev => ({ ...prev, [campo]: urlPublica }))
      setExito('Imagen subida correctamente')
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      setError(`No se pudo subir la imagen: ${error.message}`)
    } finally {
      setSubiendoImagenLanding(false)
    }
  }

  const guardarImagenesProducto = async () => {
    try {
      if (!productoId) {
        setError('Primero guarda el producto para poder asociar sus imágenes de landing')
        return
      }

      setCargando(true)
      setError('')
      setExito('')

      const total = contarImagenesGeneradas(imagenesLanding)
      const payload = {
        producto_id: productoId,
        estado: imagenesLanding.estado || 'pendiente',
        total_imagenes_generadas: total,
        prompts_utilizados: imagenesLanding.prompts_utilizados || {},
        // Campos de imágenes
        imagen_principal: imagenesLanding.imagen_principal || null,
        imagen_secundaria_1: imagenesLanding.imagen_secundaria_1 || null,
        imagen_secundaria_2: imagenesLanding.imagen_secundaria_2 || null,
        imagen_secundaria_3: imagenesLanding.imagen_secundaria_3 || null,
        imagen_secundaria_4: imagenesLanding.imagen_secundaria_4 || null,
        imagen_punto_dolor_1: imagenesLanding.imagen_punto_dolor_1 || null,
        imagen_punto_dolor_2: imagenesLanding.imagen_punto_dolor_2 || null,
        imagen_punto_dolor_3: imagenesLanding.imagen_punto_dolor_3 || null,
        imagen_punto_dolor_4: imagenesLanding.imagen_punto_dolor_4 || null,
        imagen_solucion_1: imagenesLanding.imagen_solucion_1 || null,
        imagen_solucion_2: imagenesLanding.imagen_solucion_2 || null,
        imagen_solucion_3: imagenesLanding.imagen_solucion_3 || null,
        imagen_solucion_4: imagenesLanding.imagen_solucion_4 || null,
        imagen_testimonio_persona_1: imagenesLanding.imagen_testimonio_persona_1 || null,
        imagen_testimonio_persona_2: imagenesLanding.imagen_testimonio_persona_2 || null,
        imagen_testimonio_persona_3: imagenesLanding.imagen_testimonio_persona_3 || null,
        imagen_testimonio_persona_4: imagenesLanding.imagen_testimonio_persona_4 || null,
        imagen_testimonio_persona_5: imagenesLanding.imagen_testimonio_persona_5 || null,
        imagen_testimonio_persona_6: imagenesLanding.imagen_testimonio_persona_6 || null,
        imagen_testimonio_producto_1: imagenesLanding.imagen_testimonio_producto_1 || null,
        imagen_testimonio_producto_2: imagenesLanding.imagen_testimonio_producto_2 || null,
        imagen_testimonio_producto_3: imagenesLanding.imagen_testimonio_producto_3 || null,
        imagen_testimonio_producto_4: imagenesLanding.imagen_testimonio_producto_4 || null,
        imagen_testimonio_producto_5: imagenesLanding.imagen_testimonio_producto_5 || null,
        imagen_testimonio_producto_6: imagenesLanding.imagen_testimonio_producto_6 || null,
        imagen_caracteristicas: imagenesLanding.imagen_caracteristicas || null,
        imagen_garantias: imagenesLanding.imagen_garantias || null,
        imagen_cta_final: imagenesLanding.imagen_cta_final || null,
        actualizado_el: new Date().toISOString()
      }

      let result
      if (imagenesLandingId) {
        result = await clienteSupabase
          .from('tabla_producto_imagenes')
          .update(payload)
          .eq('id', imagenesLandingId)
          .select()
      } else {
        result = await clienteSupabase
          .from('tabla_producto_imagenes')
          .insert([payload])
          .select()
      }

      const { data, error } = result
      if (error) throw error

      const registro = data[0]
      setImagenesLandingId(registro.id)
      setExito('¡Imágenes de landing guardadas correctamente!')
    } catch (error) {
      console.error('Error guardando imágenes:', error)
      setError(`Error al guardar las imágenes: ${error.message}`)
    } finally {
      setCargando(false)
    }
  }

  // Render de un campo de imagen con subida y vista previa
  const renderCampoImagen = (campo, etiqueta) => (
    <div className="campo-grupo">
      <label className="campo-label">{etiqueta}</label>
      <div className="campo-imagen-subida">
        <input
          type="url"
          className="campo-input"
          placeholder="https://..."
          value={imagenesLanding[campo] || ''}
          onChange={(e) => setImagenesLanding(prev => ({ ...prev, [campo]: e.target.value }))}
        />
        <div className="acciones-subida">
          <label className="boton-secundario">
            <Upload className="icono" /> Subir
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => subirImagenLanding(e.target.files?.[0], campo)}
            />
          </label>
        </div>
      </div>
      {imagenesLanding[campo] && (
        <div className="preview-mini">
          <img src={imagenesLanding[campo]} alt={etiqueta} className="imagen-preview" />
        </div>
      )}
    </div>
  )

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

        // Estado del producto
        estado: formulario.estado || 'nuevo',
        
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
  const titulo = modo === 'crear' ? 'Agregar Producto' : 'Editar Producto'
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

        {/* Barra de pestañas integrada en el mismo contenedor */}
        <div className="tabs-bar" role="tablist" aria-label="Secciones del producto">
          <button
            className={`tab-button ${pestanaActiva === 'detalles' ? 'activa' : ''}`}
            onClick={() => setPestanaActiva('detalles')}
            role="tab"
            aria-selected={pestanaActiva === 'detalles'}
          >
            <FileText className="tab-icon" />
            <span>Formulario</span>
          </button>
          <button
            className={`tab-button ${pestanaActiva === 'imagenesLanding' ? 'activa' : ''}`}
            onClick={() => setPestanaActiva('imagenesLanding')}
            role="tab"
            aria-selected={pestanaActiva === 'imagenesLanding'}
          >
            <Image className="tab-icon" />
            <span>Imágenes (Landing)</span>
          </button>
          {modo === 'crear' && (
            <>
              <button
                className={`tab-button ${pestanaActiva === 'crearIA' ? 'activa' : ''}`}
                onClick={() => setPestanaActiva('crearIA')}
                role="tab"
                aria-selected={pestanaActiva === 'crearIA'}
              >
                <Sparkles className="tab-icon" />
                <span>Crear con IA</span>
              </button>
              <button
                className={`tab-button ${pestanaActiva === 'imagenesIA' ? 'activa' : ''}`}
                onClick={() => setPestanaActiva('imagenesIA')}
                role="tab"
                aria-selected={pestanaActiva === 'imagenesIA'}
              >
                <Camera className="tab-icon" />
            <span>Imágenes con IA</span>
          </button>
        </>
      )}
      <button
        className={`tab-button ${pestanaActiva === 'vistaPrevia' ? 'activa' : ''}`}
        onClick={() => setPestanaActiva('vistaPrevia')}
        disabled={!formulario.slug}
        role="tab"
        aria-selected={pestanaActiva === 'vistaPrevia'}
      >
        <Eye className="tab-icon" />
        <span>Vista Previa</span>
      </button>
    </div>

        {/* Eliminamos los botones del header y dejamos solo título, descripción y volver */}
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

      {/* Contenido por pestaña */}
      {pestanaActiva === 'detalles' && (
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

          <div className="campo-grupo">
            <label className="campo-label">
              Estado del Producto
            </label>
            <select
              className="campo-select"
              value={formulario.estado}
              onChange={(e) => manejarCambio('estado', e.target.value)}
            >
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
              <option value="reacondicionado">Reacondicionado</option>
            </select>
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

        {/* Ventajas Competitivas */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Tag className="icono" />
            <h3>Ventajas Competitivas</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="text"
                className="campo-input"
                placeholder="Ej: Mejor batería que la competencia"
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
            <Image className="icono" />
            <h3>Videos</h3>
          </div>
          
          <div className="lista-dinamica">
            <div className="agregar-elemento">
              <input
                type="url"
                className="campo-input"
                placeholder="https://www.youtube.com/watch?v=..."
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

        {/* Especificaciones físicas */}
        <div className="seccion-card seccion-completa">
          <div className="seccion-header">
            <Truck className="icono" />
            <h3>Especificaciones Físicas</h3>
          </div>
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                className="campo-input"
                placeholder="0.50"
                value={formulario.peso}
                onChange={(e) => manejarCambio('peso', e.target.value)}
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Dimensiones</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Largo x Ancho x Alto"
                value={formulario.dimensiones}
                onChange={(e) => manejarCambio('dimensiones', e.target.value)}
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Marca</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Marca"
                value={formulario.marca}
                onChange={(e) => manejarCambio('marca', e.target.value)}
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Modelo</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Modelo"
                value={formulario.modelo}
                onChange={(e) => manejarCambio('modelo', e.target.value)}
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Color</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Color"
                value={formulario.color}
                onChange={(e) => manejarCambio('color', e.target.value)}
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Talla</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Talla"
                value={formulario.talla}
                onChange={(e) => manejarCambio('talla', e.target.value)}
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Material</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Material"
                value={formulario.material}
                onChange={(e) => manejarCambio('material', e.target.value)}
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
            <div className="campo-grupo">
              <label className="campo-label">Origen (país)</label>
              <input
                type="text"
                className="campo-input"
                placeholder="Ej: Colombia"
                value={formulario.origen_pais}
                onChange={(e) => manejarCambio('origen_pais', e.target.value)}
              />
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
      )}

      {pestanaActiva === 'imagenesLanding' && (
        <div className="seccion-card seccion-completa tab-contenido">
          <div className="seccion-header">
            <Image className="icono" />
            <h3>Imágenes para Landing Page</h3>
          </div>

          {/* Estado del paquete de imágenes */}
          <div className="campos-grid">
            <div className="campo-grupo">
              <label className="campo-label">Estado de Imágenes</label>
              <select
                className="campo-select"
                value={imagenesLanding.estado}
                onChange={(e) => setImagenesLanding(prev => ({ ...prev, estado: e.target.value }))}
              >
                <option value="pendiente">Pendiente</option>
                <option value="generado">Generado</option>
                <option value="validado">Validado</option>
              </select>
            </div>
          </div>

          {/* Bloque: principal y secundarias */}
          <div className="seccion-subtitulo"><strong>Imagen principal y secundarias</strong></div>
          <div className="campos-grid">
            {renderCampoImagen('imagen_principal', 'Imagen principal')}
            {renderCampoImagen('imagen_secundaria_1', 'Imagen secundaria 1')}
            {renderCampoImagen('imagen_secundaria_2', 'Imagen secundaria 2')}
            {renderCampoImagen('imagen_secundaria_3', 'Imagen secundaria 3')}
            {renderCampoImagen('imagen_secundaria_4', 'Imagen secundaria 4')}
          </div>

          {/* Bloque: puntos de dolor */}
          <div className="seccion-subtitulo"><strong>Puntos de dolor</strong></div>
          <div className="campos-grid">
            {renderCampoImagen('imagen_punto_dolor_1', 'Punto de dolor 1')}
            {renderCampoImagen('imagen_punto_dolor_2', 'Punto de dolor 2')}
            {renderCampoImagen('imagen_punto_dolor_3', 'Punto de dolor 3')}
            {renderCampoImagen('imagen_punto_dolor_4', 'Punto de dolor 4')}
          </div>

          {/* Bloque: soluciones */}
          <div className="seccion-subtitulo"><strong>Soluciones</strong></div>
          <div className="campos-grid">
            {renderCampoImagen('imagen_solucion_1', 'Solución 1')}
            {renderCampoImagen('imagen_solucion_2', 'Solución 2')}
            {renderCampoImagen('imagen_solucion_3', 'Solución 3')}
            {renderCampoImagen('imagen_solucion_4', 'Solución 4')}
          </div>

          {/* Bloque: testimonios personas */}
          <div className="seccion-subtitulo"><strong>Testimonios (Personas)</strong></div>
          <div className="campos-grid">
            {renderCampoImagen('imagen_testimonio_persona_1', 'Testimonio persona 1')}
            {renderCampoImagen('imagen_testimonio_persona_2', 'Testimonio persona 2')}
            {renderCampoImagen('imagen_testimonio_persona_3', 'Testimonio persona 3')}
            {renderCampoImagen('imagen_testimonio_persona_4', 'Testimonio persona 4')}
            {renderCampoImagen('imagen_testimonio_persona_5', 'Testimonio persona 5')}
            {renderCampoImagen('imagen_testimonio_persona_6', 'Testimonio persona 6')}
          </div>

          {/* Bloque: testimonios producto */}
          <div className="seccion-subtitulo"><strong>Testimonios (Producto)</strong></div>
          <div className="campos-grid">
            {renderCampoImagen('imagen_testimonio_producto_1', 'Testimonio producto 1')}
            {renderCampoImagen('imagen_testimonio_producto_2', 'Testimonio producto 2')}
            {renderCampoImagen('imagen_testimonio_producto_3', 'Testimonio producto 3')}
            {renderCampoImagen('imagen_testimonio_producto_4', 'Testimonio producto 4')}
            {renderCampoImagen('imagen_testimonio_producto_5', 'Testimonio producto 5')}
            {renderCampoImagen('imagen_testimonio_producto_6', 'Testimonio producto 6')}
          </div>

          {/* Bloque: secciones finales */}
          <div className="seccion-subtitulo"><strong>Secciones finales</strong></div>
          <div className="campos-grid">
            {renderCampoImagen('imagen_caracteristicas', 'Imagen de características')}
            {renderCampoImagen('imagen_garantias', 'Imagen de garantías')}
            {renderCampoImagen('imagen_cta_final', 'Imagen CTA final')}
          </div>

          <div className="acciones-formulario">
            <button type="button" className="boton-primario" onClick={guardarImagenesProducto} disabled={cargando || subiendoImagenLanding}>
              <Save className="icono" /> Guardar Imágenes
            </button>
        </div>
      </div>
      )}

      {pestanaActiva === 'crearIA' && (
        <div className="seccion-card seccion-completa tab-contenido">
          <CrearProductoIA
            mostrar={true}
            onCerrar={() => setPestanaActiva('detalles')}
            onProductoCreado={(producto) => {
              setFormulario(prev => ({ ...prev, ...producto }))
              setPestanaActiva('detalles')
            }}
            categorias={categorias}
            modo="embed"
          />
        </div>
      )}

      {pestanaActiva === 'imagenesIA' && (
        <div className="seccion-card seccion-completa tab-contenido">
          <ChatImagenesIA
            mostrar={true}
            onCerrar={() => setPestanaActiva('detalles')}
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

      {pestanaActiva === 'vistaPrevia' && (
        <div className="seccion-card seccion-completa tab-contenido">
          <div className="seccion-header">
            <Eye className="icono" />
            <h3>Vista Previa</h3>
          </div>
          {formulario.slug ? (
            <div className="iframe-previa">
              <iframe
                title="Vista previa del producto"
                src={`/producto/${formulario.slug}`}
                frameBorder="0"
              />
            </div>
          ) : (
            <div className="mensaje-error">
              <AlertCircle className="icono" />
              Asigna un slug para ver la vista previa.
            </div>
          )}
        </div>
      )}

      {/* Modales (legado) desactivados por modo pestañas */}
      {pestanaActiva === 'detalles' && (
        <div className="acciones-formulario">
          <button
            type="button"
            className="boton-primario"
            onClick={guardarProducto}
            disabled={cargando}
          >
            <Save className="icono" /> Guardar Producto
          </button>
        </div>
      )}
    </div>
  )
}

export default FormularioProducto
