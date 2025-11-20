import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import Compressor from 'compressorjs'
import { comprimirImagen, CONFIGURACIONES_PREDEFINIDAS } from '../../../utilidades/compresionImagenes'
import './ImagenesIA.css'

// Página de administración para gestionar imágenes generadas (IA) en Storage
export default function ImagenesIA() {
  const BUCKETS = ['imagenes', 'imagenes_tienda', 'imagenes_categorias', 'imagenes_articulos']

  const [bucketSeleccionado, setBucketSeleccionado] = useState(BUCKETS[0])
  const [archivos, setArchivos] = useState([]) // [{key,name,path,size,created_at,updated_at}]
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('recientes')
  const [tamMinKB, setTamMinKB] = useState('')
  const [tamMaxKB, setTamMaxKB] = useState('')
  const [seleccionados, setSeleccionados] = useState(new Set())
  const [tamanosPorKey, setTamanosPorKey] = useState({})
  const [mostrandoUsos, setMostrandoUsos] = useState(null) // ruta del archivo
  const [usos, setUsos] = useState([])
  const [reemplazarOriginal, setReemplazarOriginal] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [imagenModal, setImagenModal] = useState(null)
  const [previewsProductos, setPreviewsProductos] = useState([])
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [presetCompresion, setPresetCompresion] = useState('web')
  const [calidadManual, setCalidadManual] = useState(null)
  const [blobOriginalModal, setBlobOriginalModal] = useState(null)
  const [tamOriginalKB, setTamOriginalKB] = useState(null)
  const [tamEstimadoKB, setTamEstimadoKB] = useState(null)
  const [calculandoTamano, setCalculandoTamano] = useState(false)
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null)
  const [campoSeleccionado, setCampoSeleccionado] = useState('imagen_principal')
  const [nombreDestino, setNombreDestino] = useState('')
  const [guardandoCampo, setGuardandoCampo] = useState(false)
  const [actualizarActiva, setActualizarActiva] = useState(true)
  const [conservarOriginal, setConservarOriginal] = useState(true)

  // Listar archivos del bucket seleccionado
  const listarArchivos = useCallback(async () => {
    async function listarRecursivo(base = '', depth = 0, acc = []) {
      const { data, error } = await clienteSupabase.storage.from(bucketSeleccionado).list(base, { limit: 1000 })
      if (error) throw error
      for (const item of (data || [])) {
        const esImagen = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name)
        if (esImagen) {
          const path = base ? `${base.endsWith('/') ? base : base + '/'}` : ''
          const key = `${path}${item.name}`
          acc.push({ key, name: item.name, path, size: item?.size ?? null, created_at: item?.created_at ?? null, updated_at: item?.updated_at ?? null })
        } else {
          const nextBase = base ? `${base}/${item.name}` : item.name
          if (depth < 3) {
            await listarRecursivo(nextBase, depth + 1, acc)
          }
        }
      }
      return acc
    }
    try {
      setCargando(true)
      setError(null)
      const archivosPlanos = await listarRecursivo('')
      setArchivos(archivosPlanos)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [bucketSeleccionado])

  useEffect(() => { listarArchivos() }, [listarArchivos])

  const archivosFiltrados = useMemo(() => {
    let lista = [...archivos]
    const q = (busqueda || '').toLowerCase()
    if (q) {
      lista = lista.filter(a => a.name.toLowerCase().includes(q) || a.path.toLowerCase().includes(q))
    }
    const min = parseFloat(tamMinKB)
    const max = parseFloat(tamMaxKB)
    const sizeOf = (a) => (a.size ?? tamanosPorKey[a.key] ?? 0)
    if (!isNaN(min)) lista = lista.filter(a => sizeOf(a) / 1024 >= min)
    if (!isNaN(max)) lista = lista.filter(a => sizeOf(a) / 1024 <= max)
    switch (orden) {
      case 'recientes':
        lista.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))
        break
      case 'antiguas':
        lista.sort((a, b) => new Date(a.updated_at || a.created_at || 0) - new Date(b.updated_at || b.created_at || 0))
        break
      case 'tamano_mayor':
        lista.sort((a, b) => sizeOf(b) - sizeOf(a))
        break
      case 'tamano_menor':
        lista.sort((a, b) => sizeOf(a) - sizeOf(b))
        break
      case 'nombre':
        lista.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    return lista
  }, [archivos, busqueda, tamMinKB, tamMaxKB, orden, tamanosPorKey])

  const obtenerUrlPublica = useCallback((key) => {
    const { data } = clienteSupabase.storage.from(bucketSeleccionado).getPublicUrl(key)
    return data?.publicUrl || ''
  }, [bucketSeleccionado])

  // Ver en qué productos se usa una imagen
  const consultarUsos = useCallback(async (file) => {
    try {
      const key = `${file.path}${file.name}`
      setMostrandoUsos(key)
      setImagenModal(obtenerUrlPublica(key))
      setModalAbierto(true)
      setArchivoSeleccionado(file)
      setUsos([])
      const url = obtenerUrlPublica(key)
      // Campos de uso según tabla producto_imagenes
      const campos = [
        'imagen_principal','imagen_secundaria_1','imagen_secundaria_2','imagen_secundaria_3','imagen_secundaria_4',
        'imagen_punto_dolor_1','imagen_punto_dolor_2','imagen_solucion_1','imagen_solucion_2',
        'imagen_testimonio_persona_1','imagen_testimonio_persona_2','imagen_testimonio_persona_3',
        'imagen_testimonio_producto_1','imagen_testimonio_producto_2','imagen_testimonio_producto_3',
        'imagen_caracteristicas','imagen_garantias','imagen_cta_final'
      ]
      const { data: registros, error } = await clienteSupabase
        .from('producto_imagenes')
        .select(['producto_id', ...campos].join(','))
      if (error) throw error
      const coincidencias = []
      for (const r of (registros || [])) {
        for (const campo of campos) {
          const val = r[campo]
          if (typeof val === 'string' && (val.includes(url) || val.includes(file.name))) {
            coincidencias.push({ producto_id: r.producto_id, campo, valor: val })
          }
        }
      }
      const ids = Array.from(new Set(coincidencias.map(c => c.producto_id).filter(Boolean)))
      let productos = []
      if (ids.length > 0) {
        const { data: prods } = await clienteSupabase
          .from('productos')
          .select('id, nombre, slug')
          .in('id', ids)
        productos = prods || []
      }
      const mapa = new Map(productos.map(p => [p.id, p]))
      setUsos(coincidencias.map(c => ({ producto_id: c.producto_id, producto: mapa.get(c.producto_id), campo: c.campo, valor: c.valor })))
      if (coincidencias.length > 0) {
        setProductoSeleccionadoId(coincidencias[0].producto_id)
        setCampoSeleccionado(coincidencias[0].campo)
      }
      const { data: imgs } = ids.length > 0 ? await clienteSupabase
        .from('producto_imagenes')
        .select('producto_id, imagen_principal, imagen_secundaria_1')
        .in('producto_id', ids) : { data: [] }
      const mapaImgs = new Map((imgs || []).map(i => [i.producto_id, i]))
      setPreviewsProductos(ids.map(pid => ({ producto: mapa.get(pid), imagenes: mapaImgs.get(pid) || {} })))
    } catch (e) {
      setUsos([])
      setPreviewsProductos([])
    }
  }, [obtenerUrlPublica])

  // Cargar blob original al abrir modal
  useEffect(() => {
    const cargarBlob = async () => {
      try {
        if (!modalAbierto || !archivoSeleccionado) return
        const key = archivoSeleccionado.key || `${archivoSeleccionado.path}${archivoSeleccionado.name}`
        const url = obtenerUrlPublica(key)
        const resp = await fetch(url)
        const blob = await resp.blob()
        setBlobOriginalModal(blob)
        setTamOriginalKB(Math.round(blob.size / 1024))
      } catch (_) {
        setBlobOriginalModal(null)
        setTamOriginalKB(null)
      }
    }
    cargarBlob()
  }, [modalAbierto, archivoSeleccionado, obtenerUrlPublica])

  // Estimar tamaño con debounce cuando cambian preset/calidad
  useEffect(() => {
    let t
    const estimar = async () => {
      try {
        if (!blobOriginalModal) return
        setCalculandoTamano(true)
        const base = CONFIGURACIONES_PREDEFINIDAS[presetCompresion] || CONFIGURACIONES_PREDEFINIDAS.web
        const config = typeof calidadManual === 'number' ? { ...base, quality: calidadManual, convertSize: 0 } : base
        const { archivoComprimido } = await comprimirImagen(blobOriginalModal, config)
        setTamEstimadoKB(Math.round(archivoComprimido.size / 1024))
      } catch (_) {
        setTamEstimadoKB(null)
      } finally {
        setCalculandoTamano(false)
      }
    }
    t = setTimeout(estimar, 250)
    return () => clearTimeout(t)
  }, [blobOriginalModal, presetCompresion, calidadManual])

  // Calcular tamaños faltantes para tarjetas
  useEffect(() => {
    const calcSizes = async () => {
      try {
        const faltantes = archivos.filter(a => !a.size || a.size === 0).slice(0, 30)
        for (const a of faltantes) {
          const url = obtenerUrlPublica(a.key)
          let size = 0
          try {
            const head = await fetch(url, { method: 'HEAD' })
            if (head.ok) {
              const cl = head.headers.get('content-length')
              if (cl) size = parseInt(cl, 10)
            }
          } catch {}
          if (!size) {
            try {
              const r = await fetch(url)
              if (r.ok) {
                const b = await r.blob()
                size = b.size
              }
            } catch {}
          }
          if (size) {
            setTamanosPorKey(prev => ({ ...prev, [a.key]: size }))
          }
        }
      } catch {}
    }
    if (archivos.length) calcSizes()
  }, [archivos, obtenerUrlPublica])

  const formatoKB = (bytes) => {
    if (typeof bytes === 'number' && bytes > 0) return Math.round(bytes / 1024)
    return '—'
  }

  // Eliminar archivo del bucket
  const eliminarArchivo = useCallback(async (file) => {
    try {
      setCargando(true)
      const key = file.key || `${file.path}${file.name}`
      const { error } = await clienteSupabase.storage.from(bucketSeleccionado).remove([key])
      if (error) throw error
      await listarArchivos()
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [bucketSeleccionado, listarArchivos])

  // Optimizar imagen (comprimir y subir como .webp o reemplazar)
  const optimizarArchivo = useCallback(async (file) => {
    try {
      setCargando(true)
      setError(null)
      const key = file.key || `${file.path}${file.name}`
      const url = obtenerUrlPublica(key)
      const respuesta = await fetch(url)
      const blobOriginal = await respuesta.blob()
      const blobOptimizado = await new Promise((resolve, reject) => {
        // Calidad 0.75 y salida webp cuando sea posible
        new Compressor(blobOriginal, {
          quality: 0.75,
          mimeType: 'image/webp',
          convertSize: 0,
          success: resolve,
          error: reject
        })
      })
      const destino = reemplazarOriginal
        ? key
        : `${file.path}${file.name.replace(/\.[a-zA-Z0-9]+$/, '')}-optimizado.webp`
      const { error } = await clienteSupabase
        .storage
        .from(bucketSeleccionado)
        .upload(destino, blobOptimizado, { upsert: true, contentType: 'image/webp' })
      if (error) throw error
      await listarArchivos()
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [bucketSeleccionado, obtenerUrlPublica, reemplazarOriginal, listarArchivos])

  return (
    <div className="imagenes-ia">
      <h1 className="titulo-pagina">Gestión de Imágenes IA</h1>

      <div className="barra-herramientas">
        <label className="text-sm">Bucket</label>
        <select
          className="select-bucket"
          value={bucketSeleccionado}
          onChange={(e) => setBucketSeleccionado(e.target.value)}
        >
          {BUCKETS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          className="buscador"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select className="select-orden" value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="recientes">Más recientes</option>
          <option value="antiguas">Más antiguas</option>
          <option value="tamano_mayor">Tamaño mayor</option>
          <option value="tamano_menor">Tamaño menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
        <div className="filtro-tamano">
          <input type="number" min="0" placeholder="Tamaño min (KB)" value={tamMinKB} onChange={e => setTamMinKB(e.target.value)} />
          <input type="number" min="0" placeholder="Tamaño max (KB)" value={tamMaxKB} onChange={e => setTamMaxKB(e.target.value)} />
        </div>
        <button className="btn btn-peligro" disabled={seleccionados.size === 0} onClick={async () => {
          try {
            setCargando(true)
            const keys = Array.from(seleccionados)
            const { error: errDel } = await clienteSupabase.storage.from(bucketSeleccionado).remove(keys)
            if (errDel) throw errDel
            setSeleccionados(new Set())
            await listarArchivos()
          } catch (e) {
            setError(e.message)
          } finally {
            setCargando(false)
          }
        }}>Eliminar seleccionadas</button>
      </div>

      {error && (
        <div className="mensaje-error">{error}</div>
      )}

      {cargando && (
        <div className="cargando">Cargando...</div>
      )}

      <div className="grid-archivos">
        {archivosFiltrados.map(file => (
          <div key={file.name} className="tarjeta-archivo">
            <div className="vista-cuadrada" onClick={() => consultarUsos(file)}>
              {/* imagen */}
              <img
                src={obtenerUrlPublica(`${file.path}${file.name}`)}
                alt={file.name}
                className="imagen-preview"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="contenido-tarjeta">
              <div className="nombre-archivo">{file.name}</div>
              <div className="detalle-archivo">Tamaño: {formatoKB(file.size ?? tamanosPorKey[file.key])} KB</div>
              <div className="acciones">
                <button className="btn btn-primario" onClick={() => consultarUsos(file)}>Ver usos</button>
                <button className="btn btn-peligro" onClick={() => { if (confirm('¿Eliminar esta imagen del storage?')) eliminarArchivo(file) }}>Eliminar</button>
              </div>
              <div className="acciones-secundarias">
                <button className="btn btn-secundario" onClick={() => navigator.clipboard.writeText(obtenerUrlPublica(`${file.path}${file.name}`))}>Copiar URL</button>
                <button className="btn btn-ligero" onClick={() => consultarUsos(file)}>Abrir</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostrandoUsos && (
        <div className="panel-usos">
          <h2 className="titulo-usos">Usos de: {mostrandoUsos}</h2>
          {usos.length === 0 ? (
            <div className="no-usos">No se encontraron usos en productos.</div>
          ) : (
            <ul className="lista-usos">
              {usos.map(u => (
                <li key={`${u.producto_id}-${u.campo}`} className="item-uso">
                  <div>
                    <div className="uso-id">Producto ID: {u.producto_id}</div>
                    <div className="uso-detalle">{u.producto?.nombre} {u.producto?.slug ? `— /producto/${u.producto.slug}` : ''}</div>
                    <div className="uso-detalle">Campo: {u.campo}</div>
                  </div>
                  {u.producto?.slug && (
                    <div className="links-producto">
                      <a href={`/producto/${u.producto.slug}`} className="link-producto">Ver producto</a>
                      <a href={`/landing/${u.producto.slug}`} className="link-producto">Ver landing</a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {modalAbierto && imagenModal && (
        <div className="modal-imagen-ia fade-in" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido-ia slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar-ia" onClick={() => setModalAbierto(false)}>Cerrar</button>
            <div className="modal-body-ia">
              <div className="modal-left">
                <img src={imagenModal} alt="Imagen" className="modal-imagen-preview" />
              </div>
              <div className="modal-right">
                <div className="modal-controles-optim">
              <div className="control">
                <label>Preset de optimización</label>
                <select value={presetCompresion} onChange={e => setPresetCompresion(e.target.value)}>
                  <option value="producto">Producto (90%)</option>
                  <option value="web">Web (80%)</option>
                  <option value="movil">Móvil (75%)</option>
                  <option value="thumbnail">Thumbnail (70%)</option>
                  <option value="ultra">Ultra (60%, WebP)</option>
                  <option value="extremo">Extremo (35%, WebP, 800×600)</option>
                </select>
              </div>
              <div className="control">
                <label>Calidad manual</label>
                <input type="range" min={0.1} max={0.95} step={0.05} value={typeof calidadManual === 'number' ? calidadManual : 0.8} onChange={e => setCalidadManual(parseFloat(e.target.value))} />
                <span className="valor">{Math.round(100 * (typeof calidadManual === 'number' ? calidadManual : 0.8))}%</span>
              </div>
              <div className="control">
                <label>Tamaño</label>
                <div className="tam-metrica">
                  <span className="origen">Original: {tamOriginalKB ? `${tamOriginalKB} KB` : '—'}</span>
                  <span className="estimado">{calculandoTamano ? 'Calculando…' : `Optimizado: ${tamEstimadoKB ? `${tamEstimadoKB} KB` : '—'}`}</span>
                </div>
              </div>
                  <button className="btn btn-ambar" disabled={!archivoSeleccionado || !productoSeleccionadoId || !campoSeleccionado} onClick={async () => {
                    try {
                      setGuardandoCampo(true)
                      // 1. Obtener blob actual de la imagen modal
                      const urlActual = imagenModal || obtenerUrlPublica(`${archivoSeleccionado.path}${archivoSeleccionado.name}`)
                      const respActual = await fetch(urlActual)
                      const blobActual = await respActual.blob()

                      // 2. Backup original si procede
                      if (conservarOriginal) {
                        const extOrig = (blobActual.type.split('/')[1] || 'jpg')
                        const pathBackup = `productos/${productoSeleccionadoId}/originales/${campoSeleccionado}.original.${extOrig}`
                        const { data: pubBackup } = clienteSupabase.storage.from(bucketSeleccionado).getPublicUrl(pathBackup)
                        const hayBackup = pubBackup?.publicUrl ? await (async () => {
                          try { const r = await fetch(pubBackup.publicUrl); return r.ok } catch { return false }
                        })() : false
                        if (!hayBackup) {
                          const { error: errBackup } = await clienteSupabase.storage
                            .from(bucketSeleccionado)
                            .upload(pathBackup, blobActual, { upsert: false, contentType: blobActual.type })
                          if (errBackup && errBackup.message?.includes('already exists') === false) throw errBackup
                        }
                      }

                      // 3. Determinar destino activo (optimizada)
                      const base = CONFIGURACIONES_PREDEFINIDAS[presetCompresion] || CONFIGURACIONES_PREDEFINIDAS.web
                      const config = typeof calidadManual === 'number' ? { ...base, quality: calidadManual, convertSize: 0 } : base
                      let archivoFinal = blobActual
                      if (actualizarActiva) {
                        const { archivoComprimido } = await comprimirImagen(blobActual, config)
                        archivoFinal = archivoComprimido || blobActual
                      }
                      const extFinal = (archivoFinal.type.split('/')[1] || 'webp')
                      const pathFinal = (() => {
                        const nombreBase = (nombreDestino?.trim() || `${campoSeleccionado}`)
                        if (nombreDestino?.trim()) {
                          const tieneExt = /\.[a-zA-Z0-9]+$/.test(nombreBase)
                          const nombreConExt = tieneExt ? nombreBase : `${nombreBase}.${extFinal}`
                          return `productos/${productoSeleccionadoId}/${campoSeleccionado}/${nombreConExt}`
                        }
                        return `productos/${productoSeleccionadoId}/${campoSeleccionado}.${extFinal}`
                      })()

                      // 4. Subir optimizada activa
                      const { error: errUpload } = await clienteSupabase.storage
                        .from(bucketSeleccionado)
                        .upload(pathFinal, archivoFinal, { upsert: true, contentType: archivoFinal.type })
                      if (errUpload) throw errUpload

                      // 5. Verificar disponibilidad y actualizar BD
                      const { data: pubFinal } = clienteSupabase.storage.from(bucketSeleccionado).getPublicUrl(pathFinal)
                      if (!pubFinal?.publicUrl) throw new Error('No se pudo obtener URL pública del destino')
                      const okFinal = await (async () => { try { const r = await fetch(pubFinal.publicUrl); if (!r.ok) return false; const b = await r.blob(); return b.size > 0 } catch { return false } })()
                      if (!okFinal) throw new Error('El archivo optimizado no está disponible aún')

                      // 6. Escribir en producto_imagenes
                      const { data: row, error: errRow } = await clienteSupabase
                        .from('producto_imagenes')
                        .select('producto_id')
                        .eq('producto_id', productoSeleccionadoId)
                        .single()
                      if (!errRow && row) {
                        await clienteSupabase
                          .from('producto_imagenes')
                          .update({ [campoSeleccionado]: pubFinal.publicUrl, actualizado_el: new Date().toISOString() })
                          .eq('producto_id', productoSeleccionadoId)
                      } else {
                        await clienteSupabase
                          .from('producto_imagenes')
                          .insert({ producto_id: productoSeleccionadoId, [campoSeleccionado]: pubFinal.publicUrl, estado: 'pendiente' })
                      }

                      // 7. Refresco visual
                      setImagenModal(`${pubFinal.publicUrl}?v=${Date.now()}`)
                      await listarArchivos()
                    } catch (e) {
                      setError(e.message)
                    } finally {
                      setGuardandoCampo(false)
                    }
                  }}>Aplicar cambios</button>
                </div>
                <div className="seleccion-guardado">
                  <div className="checks">
                    <label className="check">
                      <input type="checkbox" checked={actualizarActiva} onChange={e => setActualizarActiva(e.target.checked)} />
                      Actualizar imagen (optimizar)
                    </label>
                    <label className="check">
                      <input type="checkbox" checked={conservarOriginal} onChange={e => setConservarOriginal(e.target.checked)} />
                      Conservar original (backup)
                    </label>
                  </div>
                  <div className="grupo">
                    <label>Producto</label>
                    <select value={productoSeleccionadoId || ''} onChange={e => setProductoSeleccionadoId(e.target.value || null)}>
                      <option value="">Selecciona…</option>
                      {previewsProductos.map(p => (
                        <option key={`opt-${p.producto?.id}`} value={p.producto?.id}>{p.producto?.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grupo">
                    <label>Campo</label>
                    <select value={campoSeleccionado} onChange={e => setCampoSeleccionado(e.target.value)}>
                      <option value="imagen_principal">imagen_principal</option>
                      <option value="imagen_secundaria_1">imagen_secundaria_1</option>
                      <option value="imagen_secundaria_2">imagen_secundaria_2</option>
                      <option value="imagen_secundaria_3">imagen_secundaria_3</option>
                      <option value="imagen_secundaria_4">imagen_secundaria_4</option>
                      <option value="imagen_punto_dolor_1">imagen_punto_dolor_1</option>
                      <option value="imagen_punto_dolor_2">imagen_punto_dolor_2</option>
                      <option value="imagen_solucion_1">imagen_solucion_1</option>
                      <option value="imagen_solucion_2">imagen_solucion_2</option>
                      <option value="imagen_testimonio_persona_1">imagen_testimonio_persona_1</option>
                      <option value="imagen_testimonio_persona_2">imagen_testimonio_persona_2</option>
                      <option value="imagen_testimonio_persona_3">imagen_testimonio_persona_3</option>
                      <option value="imagen_testimonio_producto_1">imagen_testimonio_producto_1</option>
                      <option value="imagen_testimonio_producto_2">imagen_testimonio_producto_2</option>
                      <option value="imagen_testimonio_producto_3">imagen_testimonio_producto_3</option>
                      <option value="imagen_caracteristicas">imagen_caracteristicas</option>
                      <option value="imagen_garantias">imagen_garantias</option>
                      <option value="imagen_cta_final">imagen_cta_final</option>
                    </select>
                  </div>
                  <div className="grupo">
                    <label>Nombre de archivo destino</label>
                    <input type="text" placeholder={archivoSeleccionado?.name || ''} value={nombreDestino} onChange={e => setNombreDestino(e.target.value)} />
                  </div>
                  <div className="grupo acciones">
                    <small className="nota">El botón “Aplicar cambios” optimiza (si está activo), guarda backup original (si está activo) y actualiza el campo seleccionado.</small>
                  </div>
                </div>
                <div className="modal-usos-ia">
                  <h3>Usos detectados</h3>
                  {usos.length === 0 ? (
                    <div className="no-usos">No hay usos registrados.</div>
                  ) : (
                    <ul className="lista-usos">
                      {usos.map(u => (
                        <li key={`m-${u.producto_id}-${u.campo}`} className="item-uso">
                          <div>
                            <div className="uso-id">Producto ID: {u.producto_id}</div>
                            <div className="uso-detalle">{u.producto?.nombre}</div>
                            <div className="uso-detalle">Campo: {u.campo}</div>
                          </div>
                          {u.producto?.slug && (
                            <div className="links-producto">
                              <a href={`/producto/${u.producto.slug}`} className="link-producto">Ver producto</a>
                              <a href={`/landing/${u.producto.slug}`} className="link-producto">Ver landing</a>
                              <button className="btn btn-secundario" onClick={() => { setProductoSeleccionadoId(u.producto_id); setCampoSeleccionado(u.campo) }}>Seleccionar</button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            {previewsProductos.length > 0 && (
              <div className="previews-productos">
                <h3>Productos asociados</h3>
                <div className="grid-previews">
                  {previewsProductos.map((p) => (
                    <div key={`pv-${p.producto?.id}`} className="preview-card">
                      <div className="preview-imagen">
                        {p.imagenes?.imagen_principal ? (
                          <img src={p.imagenes.imagen_principal} alt={p.producto?.nombre} />
                        ) : (
                          <div className="preview-placeholder">Sin imagen</div>
                        )}
                      </div>
                      <div className="preview-info">
                        <div className="preview-titulo">{p.producto?.nombre}</div>
                        {typeof p.producto?.precio === 'number' && (
                          <div className="preview-precio">${p.producto.precio.toLocaleString('es-CO')}</div>
                        )}
                        {p.producto?.slug && (
                          <div className="links-producto">
                            <a href={`/producto/${p.producto.slug}`} className="link-producto">Ver producto</a>
                            <a href={`/landing/${p.producto.slug}`} className="link-producto">Ver landing</a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}