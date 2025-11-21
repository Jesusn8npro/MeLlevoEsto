import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { clienteSupabase } from '../../../../configuracion/supabase'
import './VideosProducto.css'

const TIPOS = ['producto','beneficios','anuncio_1','anuncio_2','anuncio_3','testimonio_1','testimonio_2','testimonio_3','caracteristicas','extra']
const MAPEO_TIPO_A_CAMPO = {
  producto: 'video_producto',
  beneficios: 'video_beneficios',
  anuncio_1: 'video_anuncio_1',
  anuncio_2: 'video_anuncio_2',
  anuncio_3: 'video_anuncio_3',
  testimonio_1: 'video_testimonio_1',
  testimonio_2: 'video_testimonio_2',
  testimonio_3: 'video_testimonio_3',
  caracteristicas: 'video_caracteristicas',
  extra: 'video_extra',
}
const parseKeyFromPublicUrl = (url) => {
  if (!url) return null
  const marker = '/object/public/videos/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.substring(idx + marker.length)
}

export default function VideosProducto({ productoId, manejarExito, manejarError }) {
  const [videos, setVideos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('recientes')
  const [tipoNuevo, setTipoNuevo] = useState('producto')
  const [archivoNuevo, setArchivoNuevo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [modalEditar, setModalEditar] = useState(null)
  const [tamanosPorRuta, setTamanosPorRuta] = useState({})
  const urlOpt = import.meta.env.VITE_N8N_VIDEO_OPTIMIZE_URL || ''
  const apiKey = import.meta.env.VITE_N8N_API_KEY || ''
  const [modalOptimizar, setModalOptimizar] = useState(null)
  const [presetOpt, setPresetOpt] = useState('web')
  const [calidadOpt, setCalidadOpt] = useState(0.8)
  const [conservarOriginal, setConservarOriginal] = useState(true)
  const [nombreDestino, setNombreDestino] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [tamOriginalKB, setTamOriginalKB] = useState(null)
  const [tamOptimizadoKB, setTamOptimizadoKB] = useState(null)

  const cargarVideos = useCallback(async () => {
    if (!productoId) return
    setCargando(true)
    try {
      const { data, error } = await clienteSupabase
        .from('producto_videos')
        .select('id, producto_id, estado, creado_el, actualizado_el, video_producto, video_beneficios, video_anuncio_1, video_anuncio_2, video_anuncio_3, video_testimonio_1, video_testimonio_2, video_testimonio_3, video_caracteristicas, video_extra')
        .eq('producto_id', productoId)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      const fila = data || null
      const lista = []
      TIPOS.forEach(t => {
        const campo = MAPEO_TIPO_A_CAMPO[t]
        const url = fila ? fila[campo] : null
        if (url) {
          lista.push({
            id: fila.id,
            producto_id: productoId,
            tipo: t,
            campo,
            url_publica: url,
            ruta_storage: parseKeyFromPublicUrl(url),
            creado_el: fila.creado_el,
            actualizado_el: fila.actualizado_el,
          })
        }
      })
      setVideos(lista)
    } catch (e) {
      manejarError(e.message)
    } finally {
      setCargando(false)
    }
  }, [productoId, manejarError])

  useEffect(() => { cargarVideos() }, [cargarVideos])

  useEffect(() => {
    const calc = async () => {
      const visibles = videos.map(v => v.url_publica).filter(u => u && !(tamanosPorRuta[u]))
      const limit = 2
      let i = 0
      const worker = async () => {
        while (i < visibles.length) {
          const u = visibles[i++]
          try {
            const r = await fetch(u, { method: 'HEAD' })
            if (r.ok) {
              const cl = r.headers.get('content-length')
              if (cl) setTamanosPorRuta(prev => ({ ...prev, [u]: parseInt(cl, 10) }))
            }
          } catch {}
        }
      }
      await Promise.allSettled(Array.from({ length: Math.min(limit, visibles.length) }, () => worker()))
    }
    if (videos.length) calc()
  }, [videos])

  const abrirModalOptimizar = useCallback(async (video) => {
    setModalOptimizar(video)
    setPresetOpt('web')
    setCalidadOpt(0.8)
    setConservarOriginal(true)
    setNombreDestino('')
    setTamOptimizadoKB(null)
    try {
      const r = await fetch(video.url_publica, { method: 'HEAD' })
      if (r.ok) {
        const cl = r.headers.get('content-length')
        if (cl) setTamOriginalKB(Math.round(parseInt(cl, 10) / 1024))
      }
    } catch {}
  }, [])

  const videosFiltrados = useMemo(() => {
    let lista = [...videos]
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase()
      lista = lista.filter(v => (v.tipo || '').toLowerCase().includes(q) || (v.campo || '').toLowerCase().includes(q))
    }
    switch (orden) {
      case 'recientes': lista.sort((a,b)=> new Date(b.actualizado_el||b.creado_el) - new Date(a.actualizado_el||a.creado_el)); break
      case 'antiguas': lista.sort((a,b)=> new Date(a.actualizado_el||a.creado_el) - new Date(b.actualizado_el||b.creado_el)); break
      case 'tipo': lista.sort((a,b)=> (a.tipo||'').localeCompare(b.tipo||'')); break
      default: break
    }
    return lista
  }, [videos, busqueda, orden])

  const subirVideo = useCallback(async () => {
    try {
      if (!productoId) { manejarError('Guarda el producto antes de subir videos'); return }
      if (!archivoNuevo) { manejarError('Selecciona un archivo de video'); return }
      if (archivoNuevo.size > 45 * 1024 * 1024) { manejarError('El video supera 45MB. Reduce tamaño para subir.'); return }
      setSubiendo(true)
      const ext = (archivoNuevo.type.split('/')[1] || 'mp4')
      const base = `${tipoNuevo}`
      const nombre = `productos/${productoId}/${base}_${Date.now()}.${ext}`
      const up = await clienteSupabase.storage.from('videos').upload(nombre, archivoNuevo, { upsert: true, contentType: archivoNuevo.type })
      if (up.error) throw up.error
      const { data: pub } = clienteSupabase.storage.from('videos').getPublicUrl(nombre)
      const verificarDisponibilidad = async (url) => {
        for (let i = 0; i < 5; i++) {
          try {
            const r = await fetch(url, { method: 'HEAD' })
            if (r.ok) return true
            await new Promise(res => setTimeout(res, 300))
          } catch { await new Promise(res => setTimeout(res, 300)) }
        }
        return false
      }
      const ok = await verificarDisponibilidad(pub.publicUrl)
      if (!ok) throw new Error('No se pudo acceder al video subido (verifica políticas del bucket y tamaño)')
      const campo = MAPEO_TIPO_A_CAMPO[tipoNuevo] || 'video_producto'
      const { data: fila } = await clienteSupabase.from('producto_videos').select('producto_id').eq('producto_id', productoId).single()
      if (fila) {
        const { error: errUp } = await clienteSupabase.from('producto_videos').update({ [campo]: pub.publicUrl, estado: 'completado' }).eq('producto_id', productoId)
        if (errUp) throw errUp
      } else {
        const payload = { producto_id: productoId, [campo]: pub.publicUrl, estado: 'completado' }
        const { error: errIns } = await clienteSupabase.from('producto_videos').insert(payload)
        if (errIns) throw errIns
      }
      setArchivoNuevo(null)
      manejarExito('Video agregado correctamente')
      await cargarVideos()
    } catch (e) {
      if (e?.message?.includes('row-level security')) manejarError('RLS impide insertar/actualizar en producto_videos: revisa políticas para authenticated')
      else manejarError(e.message || 'Error al subir video')
    } finally {
      setSubiendo(false)
    }
  }, [productoId, archivoNuevo, tipoNuevo, manejarExito, manejarError, cargarVideos])

  const eliminarVideo = useCallback(async (video)=>{
    try {
      const key = parseKeyFromPublicUrl(video.url_publica)
      if (key) {
        const rem = await clienteSupabase.storage.from('videos').remove([key])
        if (rem.error) throw rem.error
      }
      const { error } = await clienteSupabase.from('producto_videos').update({ [video.campo]: null }).eq('producto_id', productoId)
      if (error) throw error
      manejarExito('Video eliminado')
      await cargarVideos()
    } catch(e){ manejarError(e.message) }
  }, [cargarVideos, manejarExito, manejarError, productoId])

  const optimizarVideo = useCallback(async (video) => {
    try {
      if (!urlOpt || !apiKey) { manejarError('Configura VITE_N8N_VIDEO_OPTIMIZE_URL y VITE_N8N_API_KEY'); return }
      setSubiendo(true)
      const resp = await fetch(urlOpt, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
        body: JSON.stringify({ url: video.url_publica, preset: presetOpt, calidad: calidadOpt, producto_id: productoId })
      })
      if (!resp.ok) throw new Error('No se pudo optimizar el video')
      const { base64, mime, nombre_sugerido } = await resp.json()
      const bin = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      const blob = new Blob([bin], { type: mime || 'video/mp4' })
      setTamOptimizadoKB(Math.round(blob.size / 1024))
      const ext = (mime || 'video/mp4').split('/')[1] || 'mp4'
      const baseName = (nombreDestino?.trim() || nombre_sugerido || 'video_opt').replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_\-]/g,'')
      const keyActual = parseKeyFromPublicUrl(video.url_publica) || ''
      const carpetaOriginal = keyActual.replace(/[^/]+$/, '')
      const nombreFinal = `${carpetaOriginal}${baseName}.${ext}`
      if (conservarOriginal && video.ruta_storage) {
        const extOrig = (video.url_publica.split('.').pop() || 'mp4')
        const nombreBackup = `${carpetaOriginal}${baseName}.original.${extOrig}`
        const respOrig = await fetch(video.url_publica)
        const blobOrig = await respOrig.blob()
        await clienteSupabase.storage.from('videos').upload(nombreBackup, blobOrig, { upsert: true, contentType: blobOrig.type })
      }
      const { error: errUp } = await clienteSupabase.storage.from('videos').upload(nombreFinal, blob, { upsert: true, contentType: blob.type })
      if (errUp) throw errUp
      const { data: pub } = clienteSupabase.storage.from('videos').getPublicUrl(nombreFinal)
      if (!conservarOriginal && keyActual && keyActual !== nombreFinal) {
        await clienteSupabase.storage.from('videos').remove([keyActual])
      }
      const { error } = await clienteSupabase.from('producto_videos').update({ [video.campo]: pub.publicUrl, estado: 'completado' }).eq('producto_id', productoId)
      if (error) throw error
      manejarExito('Video optimizado correctamente')
      await cargarVideos()
      setModalOptimizar(null)
    } catch (e) {
      manejarError(e.message)
    } finally { setSubiendo(false) }
  }, [urlOpt, apiKey, productoId, cargarVideos, manejarExito, manejarError])

  return (
    <div className="videos-producto">
      <div className="barra-herramientas">
        <div className="grupo">
          <label>Buscar</label>
          <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Título, tipo..." />
        </div>
        <div className="grupo">
          <label>Orden</label>
          <select value={orden} onChange={e=>setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
            <option value="tipo">Por tipo</option>
          </select>
        </div>
        <div className="acciones-derecha">
          <button className="btn btn-primario" onClick={()=>setModalEditar('nuevo')}>Subir video</button>
        </div>
      </div>

      <div className="grid-archivos">
        {videosFiltrados.map(v => (
          <div key={`${v.id}-${v.campo}`} className="tarjeta-archivo">
            <div className="vista-cuadrada" onClick={()=>abrirModalOptimizar(v)}>
              <video src={v.url_publica} className="video-preview" controls muted preload="none" playsInline />
            </div>
            <div className="contenido-tarjeta">
              <div className="nombre-archivo">{v.tipo}</div>
              <div className="detalle-archivo">{tamanosPorRuta[v.url_publica] ? `${Math.round(tamanosPorRuta[v.url_publica]/1024)} KB` : '— KB'}</div>
              <div className="acciones">
                <button className="btn" onClick={()=>abrirModalOptimizar(v)} disabled={subiendo}>Optimizar</button>
                <button className="btn btn-peligro" onClick={()=>eliminarVideo(v)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
        {(!cargando && videosFiltrados.length === 0) && (
          <div className="vacio">Sin videos</div>
        )}
      </div>

      {modalOptimizar && (
        <div className="modal-subida-ia" onClick={()=>setModalOptimizar(null)}>
          <div className="modal-subida-contenido" onClick={e=>e.stopPropagation()}>
            <h2 className="modal-subida-titulo">Optimizar video del producto</h2>
            <div className="modal-subida-form">
              <video src={modalOptimizar.url_publica} className="video-preview" controls muted preload="metadata" />
              <label>Preset de optimización</label>
              <select value={presetOpt} onChange={e=>setPresetOpt(e.target.value)}>
                <option value="producto">Producto (90%)</option>
                <option value="web">Web (80%)</option>
                <option value="movil">Móvil (75%)</option>
              </select>
              <label>Calidad manual</label>
              <input type="range" min={0.1} max={0.95} step={0.05} value={calidadOpt} onChange={e=>setCalidadOpt(parseFloat(e.target.value))} />
              <div className="detalle-archivo">Tamaño original: {tamOriginalKB ? `${tamOriginalKB} KB` : '—'} • Optimizado: {tamOptimizadoKB ? `${tamOptimizadoKB} KB` : '—'}</div>
              <label className="check"><input type="checkbox" checked={conservarOriginal} onChange={e=>setConservarOriginal(e.target.checked)} /> Conservar original (backup)</label>
              <input type="text" placeholder="Nombre de archivo destino (opcional)" value={nombreDestino} onChange={e=>setNombreDestino(e.target.value)} />
            </div>
            <div className="modal-subida-acciones">
              <button className="btn" onClick={()=>setModalOptimizar(null)}>Cancelar</button>
              <button className="btn btn-primario" disabled={guardando||subiendo} onClick={()=>optimizarVideo(modalOptimizar)}>{subiendo ? 'Optimizando…' : 'Aplicar cambios'}</button>
            </div>
          </div>
        </div>
      )}

      {modalEditar === 'nuevo' && (
        <div className="modal-subida-ia" onClick={()=>setModalEditar(null)}>
          <div className="modal-subida-contenido" onClick={e=>e.stopPropagation()}>
            <h2 className="modal-subida-titulo">Subir video del producto</h2>
            <div className="modal-subida-form">
              <label>Tipo</label>
              <select value={tipoNuevo} onChange={e=>setTipoNuevo(e.target.value)}>
                {TIPOS.map(t=> (<option key={t} value={t}>{t}</option>))}
              </select>
              <input type="file" accept="video/*" onChange={e=>setArchivoNuevo(e.target.files?.[0]||null)} />
            </div>
            <div className="modal-subida-acciones">
              <button className="btn" onClick={()=>setModalEditar(null)}>Cancelar</button>
              <button className="btn btn-primario" disabled={!archivoNuevo || subiendo} onClick={subirVideo}>{subiendo ? 'Subiendo…' : 'Subir'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}