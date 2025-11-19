import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../../configuracion/supabase'

// 🚀 OPTIMIZACIÓN DE IMÁGENES ACTIVADA
import { comprimirParaEditor, obtenerInfoImagen, CONFIGURACIONES_PREDEFINIDAS, comprimirImagen } from '../../../../utilidades/compresionImagenes'
import { InfoImagenWidget } from '../../../../utilidades/infoImagenes'

// Iconos
import { 
  Image, 
  Upload, 
  Save, 
  Loader,
  Camera,
  AlertCircle,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Grid,
  List,
  Search,
  Filter,
  CheckCircle,
  X,
  Bug,
  Database,
  Zap // Icono para optimización
} from 'lucide-react'

// Estilos
import './ImagenesLanding.css'

const ImagenesLanding = ({ 
  datosProducto, 
  cargando, 
  setCargando, 
  manejarExito, 
  manejarError, 
  productoId 
}) => {
  const [imagenesLanding, setImagenesLanding] = useState({
    estado: 'pendiente',
    // Imágenes principales
    imagen_principal: null,
    imagen_secundaria_1: null,
    imagen_secundaria_2: null,
    imagen_secundaria_3: null,
    imagen_secundaria_4: null,
    // Imágenes de puntos de dolor
    imagen_punto_dolor_1: null,
    imagen_punto_dolor_2: null,
    imagen_punto_dolor_3: null,
    imagen_punto_dolor_4: null,
    // Imágenes de soluciones
    imagen_solucion_1: null,
    imagen_solucion_2: null,
    imagen_solucion_3: null,
    imagen_solucion_4: null,
    // Imágenes de testimonios
    imagen_testimonio_persona_1: null,
    imagen_testimonio_persona_2: null,
    imagen_testimonio_persona_3: null,
    imagen_testimonio_persona_4: null,
    imagen_testimonio_persona_5: null,
    imagen_testimonio_persona_6: null,
    imagen_testimonio_producto_1: null,
    imagen_testimonio_producto_2: null,
    imagen_testimonio_producto_3: null,
    imagen_testimonio_producto_4: null,
    imagen_testimonio_producto_5: null,
    imagen_testimonio_producto_6: null,
    // Imágenes adicionales
    imagen_beneficio_1: null,
    imagen_beneficio_2: null,
    imagen_beneficio_3: null,
    imagen_beneficio_4: null,
    imagen_caracteristicas: null,
    imagen_garantias: null,
    imagen_cta_final: null
  })

  const [subiendoImagenLanding, setSubiendoImagenLanding] = useState(false)
  const [vistaActual, setVistaActual] = useState('grid') // 'grid' o 'list'
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  
  // 🚀 Estados para optimización de imágenes
  const [optimizandoImagen, setOptimizandoImagen] = useState(false)
  const [estadisticasOptimizacion, setEstadisticasOptimizacion] = useState(null)
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  // 🎚️ Preset de compresión (mapea a configuraciones predefinidas de utilidades)
  const [presetCompresion, setPresetCompresion] = useState('web') // 'producto' (90%), 'web' (80%), 'movil' (75%), 'thumbnail' (70%)
  // 📌 Estados por imagen (control granular)
  const [presetsPorImagen, setPresetsPorImagen] = useState({}) // { keyImagen: 'web' | 'producto' | 'movil' | 'thumbnail' }
  const [calidadPorImagen, setCalidadPorImagen] = useState({}) // { keyImagen: 0.5..0.95 }
  const [statsPorImagen, setStatsPorImagen] = useState({}) // { keyImagen: estadisticas }
  const [archivoSeleccionadoPorKey, setArchivoSeleccionadoPorKey] = useState({}) // { keyImagen: File }
  const [pagina, setPagina] = useState(1)
  const [porPagina, setPorPagina] = useState(12)
  const [optimizandoPorKey, setOptimizandoPorKey] = useState({}) // { keyImagen: true }
  
  // ===== SISTEMA DE LOGGING Y DEBUG =====
  const [mostrarDebug, setMostrarDebug] = useState(true)
  const [logsDebug, setLogsDebug] = useState([])
  const [datosSupabase, setDatosSupabase] = useState(null)
  const [errorSupabase, setErrorSupabase] = useState(null)

  // Función para agregar logs
  const agregarLog = (tipo, mensaje, datos = null) => {
    const nuevoLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      tipo, // 'info', 'success', 'error', 'warning'
      mensaje,
      datos
    }
    setLogsDebug(prev => [nuevoLog, ...prev.slice(0, 19)]) // Mantener solo los últimos 20 logs
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`, datos)
  }

  // Reoptimizar una imagen ya subida desde su URL pública
  const descargarConTimeout = async (url, ms = 15000) => {
    return Promise.race([
      fetch(url, { mode: 'cors' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Tiempo de espera excedido al descargar la imagen')), ms))
    ])
  }

  const verificarDisponible = async (url, ms = 8000) => {
    try {
      const resp = await Promise.race([
        fetch(url, { method: 'GET' }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout de verificación')), ms))
      ])
      const blob = await resp.blob()
      return blob.size > 0
    } catch {
      return false
    }
  }

  const reoptimizarImagenDesdeURL = async (tipoImagen) => {
    try {
      if (optimizandoPorKey[tipoImagen]) return
      setOptimizandoPorKey(prev => ({ ...prev, [tipoImagen]: true }))
      const urlActual = imagenesLanding[tipoImagen]
      if (!urlActual) return

      setSubiendoImagenLanding(true)
      setOptimizandoImagen(true)

      const respuesta = await descargarConTimeout(urlActual)
      const blobOriginal = await respuesta.blob()

      // Aplicar preset/calidad por imagen
      const presetElegido = presetsPorImagen[tipoImagen] || presetCompresion
      const calidadElegida = calidadPorImagen[tipoImagen]
      let resultado
      if (typeof calidadElegida === 'number') {
        const base = CONFIGURACIONES_PREDEFINIDAS[presetElegido] || CONFIGURACIONES_PREDEFINIDAS.web
        // Forzar conversión a WebP cuando se usa calidad manual para máxima compresión
        resultado = await comprimirImagen(blobOriginal, { ...base, quality: calidadElegida, convertSize: 0 })
      } else {
        resultado = await comprimirParaEditor(blobOriginal, presetElegido)
      }

      const archivoFinal = resultado.archivoComprimido || resultado.archivo || blobOriginal
      setStatsPorImagen(prev => ({ ...prev, [tipoImagen]: resultado.estadisticas }))
      setEstadisticasOptimizacion(resultado.estadisticas)

      const extension = 'webp'
      const nombreArchivo = `optimizadas/${productoId}/${tipoImagen}.${extension}`

      const { data, error } = await clienteSupabase.storage
        .from('imagenes_tienda')
        .upload(nombreArchivo, archivoFinal, { cacheControl: '3600', upsert: true })

      if (error) throw error

      const { data: { publicUrl } } = clienteSupabase.storage
        .from('imagenes_tienda')
        .getPublicUrl(nombreArchivo)

      const ok = await verificarDisponible(publicUrl)
      if (!ok) throw new Error('La imagen optimizada no se pudo verificar en Storage')
      setImagenesLanding(prev => ({ ...prev, [tipoImagen]: publicUrl }))

      const datosParaGuardar = { ...imagenesLanding, [tipoImagen]: publicUrl, producto_id: productoId }
      const { error: errorGuardar } = await clienteSupabase
        .from('producto_imagenes')
        .upsert(datosParaGuardar)

      if (errorGuardar) throw errorGuardar

      manejarExito('Imagen reoptimizada y reemplazada correctamente')
    } catch (error) {
      console.error('Error al reoptimizar imagen:', error)
      manejarError('No se pudo reoptimizar la imagen')
    } finally {
      setSubiendoImagenLanding(false)
      setOptimizandoImagen(false)
      setOptimizandoPorKey(prev => ({ ...prev, [tipoImagen]: false }))
    }
  }

  // Definir categorías de imágenes
  const categoriasImagenes = {
    principales: {
      titulo: '🖼️ Imágenes Principales',
      descripcion: 'Imágenes principales del producto para mostrar en la landing',
      campos: [
        { key: 'imagen_principal', label: 'Imagen Principal', descripcion: 'Imagen hero principal del producto' },
        { key: 'imagen_secundaria_1', label: 'Imagen Secundaria 1', descripcion: 'Primera imagen secundaria' },
        { key: 'imagen_secundaria_2', label: 'Imagen Secundaria 2', descripcion: 'Segunda imagen secundaria' },
        { key: 'imagen_secundaria_3', label: 'Imagen Secundaria 3', descripcion: 'Tercera imagen secundaria' },
        { key: 'imagen_secundaria_4', label: 'Imagen Secundaria 4', descripcion: 'Cuarta imagen secundaria' }
      ]
    },
    puntos_dolor: {
      titulo: '😰 Puntos de Dolor',
      descripcion: 'Imágenes que muestran problemas que resuelve el producto',
      campos: [
        { key: 'imagen_punto_dolor_1', label: 'Punto de Dolor 1', descripcion: 'Primera imagen de problema' },
        { key: 'imagen_punto_dolor_2', label: 'Punto de Dolor 2', descripcion: 'Segunda imagen de problema' },
        { key: 'imagen_punto_dolor_3', label: 'Punto de Dolor 3', descripcion: 'Tercera imagen de problema' },
        { key: 'imagen_punto_dolor_4', label: 'Punto de Dolor 4', descripcion: 'Cuarta imagen de problema' }
      ]
    },
    soluciones: {
      titulo: '💡 Soluciones',
      descripcion: 'Imágenes que muestran cómo el producto resuelve los problemas',
      campos: [
        { key: 'imagen_solucion_1', label: 'Solución 1', descripcion: 'Primera imagen de solución' },
        { key: 'imagen_solucion_2', label: 'Solución 2', descripcion: 'Segunda imagen de solución' }
      ]
    },
    testimonios: {
      titulo: '👥 Testimonios',
      descripcion: 'Fotos de personas y productos para testimonios y reseñas',
      campos: [
        { key: 'imagen_testimonio_persona_1', label: 'Persona 1', descripcion: 'Foto de primera persona' },
        { key: 'imagen_testimonio_persona_2', label: 'Persona 2', descripcion: 'Foto de segunda persona' },
        { key: 'imagen_testimonio_persona_3', label: 'Persona 3', descripcion: 'Foto de tercera persona' },
        { key: 'imagen_testimonio_producto_1', label: 'Producto 1', descripcion: 'Foto de producto en testimonio 1' },
        { key: 'imagen_testimonio_producto_2', label: 'Producto 2', descripcion: 'Foto de producto en testimonio 2' },
        { key: 'imagen_testimonio_producto_3', label: 'Producto 3', descripcion: 'Foto de producto en testimonio 3' }
      ]
    },
    finales: {
      titulo: '🎯 Secciones Finales',
      descripcion: 'Imágenes para las secciones finales de la landing',
      campos: [
        { key: 'imagen_caracteristicas', label: 'Características', descripcion: 'Imagen de características del servicio' },
        { key: 'imagen_garantias', label: 'Garantías', descripcion: 'Imagen de garantías y políticas' },
        { key: 'imagen_cta_final', label: 'CTA Final', descripcion: 'Imagen del llamado a la acción final' }
      ]
    }
  }

  // Cargar datos existentes
  useEffect(() => {
    if (productoId) {
      agregarLog('info', `🔄 useEffect disparado - Producto ID: ${productoId}`)
      cargarImagenesLanding()
    } else {
      agregarLog('warning', '⚠️ useEffect - No hay producto ID disponible')
    }
  }, [productoId])

  const cargarImagenesLanding = async () => {
    try {
      setCargando(true)
      agregarLog('info', `🔍 Iniciando carga de imágenes para producto ID: ${productoId}`)
      
      const { data, error } = await clienteSupabase
        .from('producto_imagenes')
        .select('*')
        .eq('producto_id', productoId)
        .single()

      // Logging detallado de la respuesta
      agregarLog('info', '📡 Respuesta de Supabase recibida', { data, error })
      setDatosSupabase(data)
      setErrorSupabase(error)

      if (error && error.code !== 'PGRST116') {
        agregarLog('error', `❌ Error en consulta Supabase: ${error.message}`, error)
        throw error
      }

      if (data) {
        agregarLog('success', '✅ Datos encontrados en Supabase', data)
        setImagenesLanding(data)
        manejarExito('Imágenes cargadas correctamente')
        
        // Contar imágenes existentes
        const imagenesExistentes = Object.keys(data).filter(key => 
          key.includes('imagen_') && data[key] && data[key] !== null
        ).length
        agregarLog('info', `📊 Total de imágenes encontradas: ${imagenesExistentes}`)
      } else {
        agregarLog('warning', '⚠️ No se encontraron datos, creando registro inicial')
        
        // Si no hay datos, crear registro inicial
        const datosIniciales = {
          producto_id: productoId,
          estado: 'pendiente'
        }
        
        agregarLog('info', '🆕 Insertando registro inicial', datosIniciales)
        
        const { error: errorCrear } = await clienteSupabase
          .from('producto_imagenes')
          .insert(datosIniciales)
        
        if (errorCrear) {
          agregarLog('error', `❌ Error al crear registro inicial: ${errorCrear.message}`, errorCrear)
          throw errorCrear
        }
        
        agregarLog('success', '✅ Registro inicial creado correctamente')
        setImagenesLanding(prev => ({ ...prev, ...datosIniciales }))
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error)
      agregarLog('error', `💥 Error crítico al cargar imágenes: ${error.message}`, error)
      manejarError('Error al cargar las imágenes existentes')
    } finally {
      setCargando(false)
      agregarLog('info', '🏁 Proceso de carga finalizado')
    }
  }

  const manejarSubidaImagen = async (event, tipoImagen) => {
    const archivo = event.target.files[0]
    if (!archivo) return

    // 🚀 MOSTRAR INFO DE LA IMAGEN ORIGINAL
    setArchivoSeleccionado(archivo)
    const infoOriginal = await obtenerInfoImagen(archivo)
    
    agregarLog('info', `📤 Iniciando subida de imagen tipo: ${tipoImagen}`, { 
      nombre: archivo.name, 
      tamaño: archivo.size, 
      tipo: archivo.type,
      dimensiones: `${infoOriginal?.dimensiones?.ancho ?? '¿?'}x${infoOriginal?.dimensiones?.alto ?? '¿?'}`
    })

    // Validar tipo de archivo
    if (!archivo.type.startsWith('image/')) {
      agregarLog('error', '❌ Tipo de archivo inválido', { tipo: archivo.type })
      manejarError('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      agregarLog('error', '❌ Archivo demasiado grande', { tamaño: archivo.size })
      manejarError('La imagen es demasiado grande. Máximo 5MB permitido')
      return
    }

    setSubiendoImagenLanding(true)
    setOptimizandoImagen(true)

    // 🚀 COMPRIMIR IMAGEN AUTOMÁTICAMENTE
    let archivoFinal = archivo
    try {
      agregarLog('info', '🚀 Comprimiendo imagen automáticamente...', { 
        tamañoOriginal: archivo.size 
      })
      
      // Usar preset/calidad por imagen si existen; si no, usar global
      const presetElegido = presetsPorImagen[tipoImagen] || presetCompresion
      const calidadElegida = calidadPorImagen[tipoImagen]
      let resultado
      if (typeof calidadElegida === 'number') {
        const base = CONFIGURACIONES_PREDEFINIDAS[presetElegido] || CONFIGURACIONES_PREDEFINIDAS.web
        // Forzar conversión a WebP cuando se usa calidad manual para máxima compresión
        resultado = await comprimirImagen(archivo, { ...base, quality: calidadElegida, convertSize: 0 })
        archivoFinal = resultado.archivoComprimido || archivo
        setEstadisticasOptimizacion(resultado.estadisticas)
        setStatsPorImagen(prev => ({ ...prev, [tipoImagen]: resultado.estadisticas }))
      } else {
        resultado = await comprimirParaEditor(archivo, presetElegido)
        archivoFinal = resultado.archivo || archivo
        setEstadisticasOptimizacion(resultado.estadisticas)
        setStatsPorImagen(prev => ({ ...prev, [tipoImagen]: resultado.estadisticas }))
      }
      
      // Ajustar métricas según estructura real de estadisticas
      const reduccionPct = resultado.estadisticas?.porcentajes?.reduccion
      const tamOriginal = resultado.estadisticas?.tamaño?.original
      const tamComprimido = resultado.estadisticas?.tamaño?.comprimido
      
      agregarLog('success', `✅ Imagen optimizada${typeof reduccionPct === 'number' ? `: -${reduccionPct}%` : ''}`, {
        tamañoOriginal: tamOriginal,
        tamañoComprimido: tamComprimido,
        reduccion: reduccionPct
      })
      
    } catch (errorCompresion) {
      agregarLog('warning', '⚠️ No se pudo comprimir, usando imagen original', errorCompresion)
      // Continuar con la imagen original si falla la compresión
    }
    
    setOptimizandoImagen(false)

    try {
      let extOpt = 'webp'
      let extOrig = (archivo?.type?.split('/')[1] || 'jpg').toLowerCase()
      if (extOrig === 'jpeg') extOrig = 'jpg'
      const nombreOriginal = `originales/${productoId}/${tipoImagen}.${extOrig}`
      const nombreOptimizado = `optimizadas/${productoId}/${tipoImagen}.${extOpt}`
      
      agregarLog('info', `🗂️ Subiendo imagen optimizada a bucket 'imagenes_tienda'`, { 
        nombreOptimizado,
        tamañoFinal: archivoFinal.size,
        optimizada: archivoFinal !== archivo
      })
      
      await clienteSupabase.storage
        .from('imagenes_tienda')
        .upload(nombreOriginal, archivo, { cacheControl: '3600', upsert: true })

      const { data, error } = await clienteSupabase.storage
        .from('imagenes_tienda')
        .upload(nombreOptimizado, archivoFinal, { cacheControl: '3600', upsert: true })

      if (error) {
        agregarLog('error', `❌ Error en Storage Supabase: ${error.message}`, error)
        throw error
      }

      agregarLog('success', '✅ Archivo subido al storage', data)

      const { data: { publicUrl } } = clienteSupabase.storage
        .from('imagenes_tienda')
        .getPublicUrl(nombreOptimizado)

      agregarLog('info', '🔗 URL pública generada', { publicUrl })

      const okFinal = await verificarDisponible(publicUrl)
      if (!okFinal) throw new Error('Verificación fallida: la imagen optimizada no está disponible')
      setImagenesLanding(prev => ({ ...prev, [tipoImagen]: publicUrl }))
      setArchivoSeleccionadoPorKey(prev => ({ ...prev, [tipoImagen]: archivo }))

      // Guardar automáticamente en la base de datos después de subir
      const datosParaGuardar = {
        ...imagenesLanding,
        [tipoImagen]: publicUrl,
        producto_id: productoId
      }

      const { error: errorGuardar } = await clienteSupabase
        .from('producto_imagenes')
        .upsert(datosParaGuardar)

      if (errorGuardar) {
        agregarLog('error', `❌ Error al guardar en BD: ${errorGuardar.message}`, errorGuardar)
        throw errorGuardar
      }

      agregarLog('success', `✅ Imagen ${tipoImagen} guardada en BD automáticamente`)
      agregarLog('success', `✅ Imagen ${tipoImagen} actualizada correctamente`)
      manejarExito('Imagen subida y guardada correctamente')
    } catch (error) {
      console.error('Error al subir imagen:', error)
      agregarLog('error', `💥 Error crítico en subida: ${error.message}`, error)
      manejarError(`Error al subir la imagen: ${error.message}`)
    } finally {
      setSubiendoImagenLanding(false)
      agregarLog('info', '🏁 Proceso de subida finalizado')
    }
  }

  const eliminarImagen = async (tipoImagen) => {
    if (!imagenesLanding[tipoImagen]) return
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return

    try {
      setImagenesLanding(prev => ({
        ...prev,
        [tipoImagen]: null
      }))
      manejarExito('Imagen eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
      manejarError('Error al eliminar la imagen')
    }
  }

  const guardarImagenesLanding = async () => {
    if (!productoId) {
      manejarError('Debes crear el producto primero')
      return
    }

    setCargando(true)

    try {
      const datosParaGuardar = {
        ...imagenesLanding,
        producto_id: productoId
      }

      const { error } = await clienteSupabase
        .from('producto_imagenes')
        .upsert(datosParaGuardar)

      if (error) throw error

      manejarExito('Imágenes guardadas correctamente')
    } catch (error) {
      console.error('Error al guardar imágenes:', error)
      manejarError('Error al guardar las imágenes')
    } finally {
      setCargando(false)
    }
  }

  const contarImagenesGeneradas = () => {
    return Object.values(imagenesLanding).filter(valor => 
      valor && typeof valor === 'string' && valor.startsWith('http')
    ).length
  }

  const obtenerImagenesFiltradas = () => {
    let todasLasImagenes = []
    
    Object.entries(categoriasImagenes).forEach(([categoriaKey, categoria]) => {
      if (filtroCategoria === 'todas' || filtroCategoria === categoriaKey) {
        categoria.campos.forEach(campo => {
          todasLasImagenes.push({
            ...campo,
            categoria: categoriaKey,
            categoriaLabel: categoria.titulo,
            valor: imagenesLanding[campo.key]
          })
        })
      }
    })

    if (busqueda) {
      todasLasImagenes = todasLasImagenes.filter(img => 
        img.label.toLowerCase().includes(busqueda.toLowerCase()) ||
        img.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    }

    return todasLasImagenes
  }

  const renderizarTarjetaImagen = (imagen) => (
    <div key={imagen.key} className="tarjeta-imagen">
      <div className="tarjeta-imagen-header">
        <div className="tarjeta-imagen-info">
          <h4 className="tarjeta-imagen-titulo">{imagen.label}</h4>
          <p className="tarjeta-imagen-descripcion">{imagen.descripcion}</p>
          <span className="tarjeta-imagen-categoria">{imagen.categoriaLabel}</span>
        </div>
        <div className="tarjeta-imagen-estado">
          {imagen.valor ? (
            <CheckCircle className="icono-estado activo" />
          ) : (
            <AlertCircle className="icono-estado inactivo" />
          )}
        </div>
      </div>

      <div className="tarjeta-imagen-contenido">
        {imagen.valor ? (
          <div className="imagen-existente">
            <img 
              src={imagen.valor} 
              alt={imagen.label}
              className="imagen-preview-grande"
              onClick={() => setImagenSeleccionada(imagen.valor)}
            />
            <div className="imagen-acciones">
              <button
                type="button"
                className="boton-accion ver"
                onClick={() => setImagenSeleccionada(imagen.valor)}
                title="Ver imagen completa"
              >
                <Eye className="icono" />
              </button>
              <button
                type="button"
                className="boton-accion descargar"
                onClick={() => window.open(imagen.valor, '_blank')}
                title="Abrir en nueva pestaña"
              >
                <Download className="icono" />
              </button>
              <button
                type="button"
                className="boton-accion eliminar"
                onClick={() => eliminarImagen(imagen.key)}
                title="Eliminar imagen"
              >
                <Trash2 className="icono" />
              </button>
            </div>
          </div>
        ) : (
          <div className="zona-subida">
            <div className="zona-subida-contenido">
              <Upload className="icono-subida" />
              <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => manejarSubidaImagen(e, imagen.key)}
                className="input-file-oculto"
                disabled={subiendoImagenLanding || !productoId}
              />
            </div>
          </div>
        )}
      </div>

      {/* Panel de compresión por imagen */}
      <div className="panel-compresion">
        <div className="controles">
          <label className="control">
            <span>Preset</span>
            <select
              value={presetsPorImagen[imagen.key] || presetCompresion}
              onChange={(e) => setPresetsPorImagen(prev => ({ ...prev, [imagen.key]: e.target.value }))}
            >
              <option value="producto">Producto (90%)</option>
              <option value="web">Web (80%)</option>
              <option value="movil">Móvil (75%)</option>
              <option value="thumbnail">Thumbnail (70%)</option>
              <option value="ultra">Ultra (60%, WebP)</option>
              <option value="extremo">Extremo (35%, WebP, 800×600)</option>
            </select>
          </label>

          <label className="control">
            <span>Calidad</span>
            <input
              type="range"
              min={0.1}
              max={0.95}
              step={0.05}
              value={typeof calidadPorImagen[imagen.key] === 'number' ? calidadPorImagen[imagen.key] : 0.8}
              onChange={(e) => setCalidadPorImagen(prev => ({ ...prev, [imagen.key]: parseFloat(e.target.value) }))}
            />
            <span className="valor">{Math.round(100 * (typeof calidadPorImagen[imagen.key] === 'number' ? calidadPorImagen[imagen.key] : 0.8))}%</span>
          </label>

          {imagen.valor && (
            <button
              type="button"
              className="boton-optimizar"
              onClick={() => reoptimizarImagenDesdeURL(imagen.key)}
              disabled={subiendoImagenLanding || !productoId || optimizandoPorKey[imagen.key]}
            >
              {optimizandoPorKey[imagen.key] ? 'Optimizando…' : 'Optimizar y reemplazar'}
            </button>
          )}
        </div>

        {/* Información de compresión en vivo */}
        {statsPorImagen[imagen.key] && (
          <div className="info-compresion">
            <div className="bloque">
              <span className="etiqueta">Tamaño original</span>
              <span className="valor">{statsPorImagen[imagen.key].tamaño?.originalFormateado}</span>
            </div>
            <div className="bloque">
              <span className="etiqueta">Tamaño optimizado</span>
              <span className="valor">{statsPorImagen[imagen.key].tamaño?.comprimidoFormateado}</span>
            </div>
            <div className="bloque reduccion">
              <span className="etiqueta">Reducción</span>
              <span className="valor">-{statsPorImagen[imagen.key].porcentajes?.reduccion ?? 0}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderizarFilaImagen = (imagen) => (
    <div key={imagen.key} className="fila-imagen">
      <div className="fila-imagen-info">
        <div className="fila-imagen-miniatura">
          {imagen.valor ? (
            <img 
              src={imagen.valor} 
              alt={imagen.label}
              className="miniatura"
              onClick={() => setImagenSeleccionada(imagen.valor)}
            />
          ) : (
            <div className="miniatura-vacia">
              <Image className="icono" />
            </div>
          )}
        </div>
        <div className="fila-imagen-detalles">
          <h4 className="fila-imagen-titulo">{imagen.label}</h4>
          <p className="fila-imagen-descripcion">{imagen.descripcion}</p>
          <span className="fila-imagen-categoria">{imagen.categoriaLabel}</span>
        </div>
      </div>
      
      <div className="fila-imagen-acciones">
        {imagen.valor ? (
          <>
            <button
              type="button"
              className="boton-accion-pequeno ver"
              onClick={() => setImagenSeleccionada(imagen.valor)}
              title="Ver imagen"
            >
              <Eye className="icono" />
            </button>
            <button
              type="button"
              className="boton-accion-pequeno eliminar"
              onClick={() => eliminarImagen(imagen.key)}
              title="Eliminar"
            >
              <Trash2 className="icono" />
            </button>
          </>
        ) : (
          <label className="boton-subir-pequeno">
            <Upload className="icono" />
            Subir
            <input
              type="file"
              accept="image/*"
              onChange={(e) => manejarSubidaImagen(e, imagen.key)}
              style={{ display: 'none' }}
              disabled={subiendoImagenLanding || !productoId}
            />
          </label>
        )}
      </div>
    </div>
  )

  if (!datosProducto && !productoId) {
    return (
      <div className="alerta-producto">
        <AlertCircle className="icono" />
        <div className="alerta-texto">
          <h4>Producto requerido</h4>
          <p>Debes crear y guardar el producto primero antes de gestionar las imágenes.</p>
        </div>
      </div>
    )
  }

  const imagenesFiltradas = obtenerImagenesFiltradas()
  const inicio = (pagina - 1) * porPagina
  const fin = inicio + porPagina
  const imagenesPaginadas = imagenesFiltradas.slice(inicio, fin)

  return (
    <>
      {/* Modal de imagen ampliada */}
      {imagenSeleccionada && (
        <div className="modal-imagen" onClick={() => setImagenSeleccionada(null)}>
          <div className="modal-imagen-contenido" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-imagen-cerrar"
              onClick={() => setImagenSeleccionada(null)}
            >
              <X className="icono" />
            </button>
            <img src={imagenSeleccionada} alt="Imagen ampliada" className="imagen-ampliada" />
          </div>
        </div>
      )}

      {/* Header con estadísticas */}
      <div className="imagenes-header-moderno">
        <div className="estadisticas-principales">
          <div className="estadistica-card">
            <div className="estadistica-numero">{contarImagenesGeneradas()}</div>
            <div className="estadistica-label">Imágenes subidas</div>
          </div>
          <div className="estadistica-card">
            <div className="estadistica-numero">{Object.keys(categoriasImagenes).reduce((total, cat) => total + categoriasImagenes[cat].campos.length, 0)}</div>
            <div className="estadistica-label">Total disponibles</div>
          </div>
          <div className="estadistica-card">
            <div className="estadistica-numero">{imagenesLanding.estado === 'validado' ? '✅' : imagenesLanding.estado === 'generado' ? '🔄' : '📋'}</div>
            <div className="estadistica-label">Estado</div>
          </div>
          
          {/* 🚀 WIDGET DE OPTIMIZACIÓN EN TIEMPO REAL */}
          {estadisticasOptimizacion && (
            <div className="estadistica-card optimizacion-activa">
              <div className="estadistica-numero">
                <Zap className="icono-optimizacion" />
                -{estadisticasOptimizacion?.porcentajes?.reduccion ?? 0}%
              </div>
              <div className="estadistica-label">Última optimización</div>
            </div>
          )}
          
          {optimizandoImagen && (
            <div className="estadistica-card optimizando">
              <div className="estadistica-numero">
                <Loader className="icono-girando" />
                🚀
              </div>
              <div className="estadistica-label">Optimizando...</div>
            </div>
          )}
        </div>

        <div className="controles-vista">
          <div className="grupo-controles">
            <div className="busqueda-container">
              <Search className="icono-busqueda" />
              <input
                type="text"
                placeholder="Buscar imágenes..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-busqueda"
              />
            </div>
            
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="select-filtro"
            >
              <option value="todas">Todas las categorías</option>
              {Object.entries(categoriasImagenes).map(([key, categoria]) => (
                <option key={key} value={key}>{categoria.titulo}</option>
              ))}
            </select>
          </div>

          <div className="botones-vista">
            <button
              type="button"
              className={`boton-vista ${vistaActual === 'grid' ? 'activo' : ''}`}
              onClick={() => setVistaActual('grid')}
            >
              <Grid className="icono" />
            </button>
            <button
              type="button"
              className={`boton-vista ${vistaActual === 'list' ? 'activo' : ''}`}
              onClick={() => setVistaActual('list')}
            >
              <List className="icono" />
            </button>
          </div>
        </div>
      </div>

      {/* Estado del producto */}
      <div className="seccion-estado">
        <div className="estado-header">
          <Camera className="icono" />
          <h3>Estado de las Imágenes</h3>
        </div>
        
        <div className="estado-contenido">
          <select
            className="select-estado"
            value={imagenesLanding.estado}
            onChange={(e) => setImagenesLanding(prev => ({ ...prev, estado: e.target.value }))}
            disabled={!productoId}
          >
            <option value="pendiente">📋 Pendiente</option>
            <option value="generado">🔄 En proceso</option>
            <option value="validado">✅ Completado</option>
          </select>
          
          <button
            type="button"
            className="boton-recargar"
            onClick={cargarImagenesLanding}
            disabled={cargando}
          >
            <RefreshCw className={`icono ${cargando ? 'girando' : ''}`} />
            Recargar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`imagenes-contenedor ${vistaActual}`}>
        {vistaActual === 'grid' ? (
          <div className="imagenes-grid-moderno">
            {imagenesPaginadas.map(renderizarTarjetaImagen)}
          </div>
        ) : (
          <div className="imagenes-lista-moderno">
            {imagenesPaginadas.map(renderizarFilaImagen)}
          </div>
        )}
      </div>

      {imagenesFiltradas.length === 0 && (
        <div className="sin-resultados">
          <Search className="icono" />
          <h3>No se encontraron imágenes</h3>
          <p>Intenta cambiar los filtros o la búsqueda</p>
        </div>
      )}

      {/* 🚀 WIDGET DE INFORMACIÓN DE IMAGEN + Selector de compresión */}
      {archivoSeleccionado && (
        <div className="widget-info-imagen">
          <h4>📊 Información de la imagen seleccionada</h4>
          {/* Mostrar peso y dimensiones reales */}
          <InfoImagenWidget fuente={archivoSeleccionado} />

          {/* Selector de calidad con porcentajes visibles */}
          <div className="selector-compresion">
            <label>Calidad de compresión:</label>
            <select
              value={presetCompresion}
              onChange={(e) => setPresetCompresion(e.target.value)}
            >
              <option value="producto">Máxima calidad (90%)</option>
              <option value="web">Alta calidad (80%)</option>
              <option value="movil">Balance móvil (75%)</option>
              <option value="thumbnail">Ahorro/thumbnail (70%)</option>
            </select>
            <small>Se aplicará al próximo archivo que subas.</small>
          </div>

          {/* Métricas de la última optimización */}
          {estadisticasOptimizacion && (
            <div className="estadisticas-optimizacion">
              <h5>🚀 Resultados de la optimización:</h5>
              <div className="metricas-optimizacion">
                <div className="metrica">
                  <span className="label">Tamaño original:</span>
                  <span className="valor">{((estadisticasOptimizacion?.tamaño?.original || 0) / 1024).toFixed(1)} KB</span>
                </div>
                <div className="metrica">
                  <span className="label">Tamaño optimizado:</span>
                  <span className="valor">{((estadisticasOptimizacion?.tamaño?.comprimido || 0) / 1024).toFixed(1)} KB</span>
                </div>
                <div className="metrica destacada">
                  <span className="label">Reducción:</span>
                  <span className="valor">-{estadisticasOptimizacion?.porcentajes?.reduccion ?? 0}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Acciones principales */}
      <div className="acciones-principales">
        <button
          type="button"
          className="boton-guardar-principal"
          onClick={guardarImagenesLanding}
          disabled={cargando || subiendoImagenLanding || !productoId}
        >
          {cargando ? (
            <>
              <Loader className="icono spinner" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="icono" />
              Guardar Todas las Imágenes
            </>
          )}
        </button>
      </div>

      <div className="paginacion-editor">
        <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
        <span>Página {pagina}</span>
        <button onClick={() => setPagina(p => p + 1)} disabled={fin >= imagenesFiltradas.length}>Siguiente</button>
        <select value={porPagina} onChange={e => { setPagina(1); setPorPagina(parseInt(e.target.value)) }}>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={16}>16</option>
        </select>
      </div>

      {/* Panel de Debug */}
      <div className="debug-panel">
        <div className="debug-header">
          <button
            type="button"
            className={`debug-toggle ${mostrarDebug ? 'activo' : ''}`}
            onClick={() => setMostrarDebug(!mostrarDebug)}
          >
            <Bug className="icono" />
            Debug Panel {mostrarDebug ? '▼' : '▶'}
          </button>
          {mostrarDebug && (
            <button
              type="button"
              className="debug-clear"
              onClick={() => setLogsDebug([])}
            >
              Limpiar Logs
            </button>
          )}
        </div>

        {mostrarDebug && (
          <div className="debug-content">
            {/* Información de Supabase */}
            <div className="debug-section">
              <h4><Database className="icono" /> Estado de Supabase</h4>
              <div className="debug-info">
                <div className="info-item">
                  <strong>Producto ID:</strong> {productoId || 'No definido'}
                </div>
                <div className="info-item">
                  <strong>Tabla:</strong> producto_imagenes
                </div>
                <div className="info-item">
                  <strong>Bucket:</strong> imagenes_tienda
                </div>
                <div className="info-item">
                  <strong>Estado:</strong> {imagenesLanding.estado}
                </div>
                {datosSupabase && (
                  <div className="info-item">
                    <strong>Última consulta:</strong>
                    <pre>{JSON.stringify(datosSupabase, null, 2)}</pre>
                  </div>
                )}
                {errorSupabase && (
                  <div className="info-item error">
                    <strong>Último error:</strong>
                    <pre>{JSON.stringify(errorSupabase, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>

            {/* Logs de actividad */}
            <div className="debug-section">
              <h4>📋 Logs de Actividad</h4>
              <div className="debug-logs">
                {logsDebug.length === 0 ? (
                  <p className="no-logs">No hay logs disponibles</p>
                ) : (
                  logsDebug.slice(-20).map((log, index) => (
                    <div key={`log-${log.timestamp}-${index}`} className={`log-entry ${log.tipo}`}>
                      <span className="log-time">{log.timestamp}</span>
                      <span className="log-message">{log.mensaje}</span>
                      {log.datos && (
                        <pre className="log-data">{JSON.stringify(log.datos, null, 2)}</pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ImagenesLanding
