import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../../configuracion/supabase'

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
  Database
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

    agregarLog('info', `📤 Iniciando subida de imagen tipo: ${tipoImagen}`, { 
      nombre: archivo.name, 
      tamaño: archivo.size, 
      tipo: archivo.type 
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

    try {
      const extension = archivo.name.split('.').pop()
      const nombreArchivo = `${productoId}_${tipoImagen}_${Date.now()}.${extension}`
      
      agregarLog('info', `🗂️ Subiendo a bucket 'imagenes_tienda'`, { nombreArchivo })
      
      const { data, error } = await clienteSupabase.storage
        .from('imagenes_tienda')
        .upload(nombreArchivo, archivo, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        agregarLog('error', `❌ Error en Storage Supabase: ${error.message}`, error)
        throw error
      }

      agregarLog('success', '✅ Archivo subido al storage', data)

      const { data: { publicUrl } } = clienteSupabase.storage
        .from('imagenes_tienda')
        .getPublicUrl(nombreArchivo)

      agregarLog('info', '🔗 URL pública generada', { publicUrl })

      setImagenesLanding(prev => ({
        ...prev,
        [tipoImagen]: publicUrl
      }))

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
            {imagenesFiltradas.map(renderizarTarjetaImagen)}
          </div>
        ) : (
          <div className="imagenes-lista-moderno">
            {imagenesFiltradas.map(renderizarFilaImagen)}
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