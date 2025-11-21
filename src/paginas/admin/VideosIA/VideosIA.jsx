import React, { useEffect, useMemo, useState, useCallback } from 'react'
import './VideosIA.css'
import { clienteSupabase } from '../../../configuracion/supabase'

export default function VideosIA() {
  const [archivos, setArchivos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('recientes')
  const [cargando, setCargando] = useState(false)
  const [tamanos, setTamanos] = useState({})
  const [modalUsos, setModalUsos] = useState(null)
  const [productos, setProductos] = useState([])
  const [productoSel, setProductoSel] = useState('')
  const [tipoSel, setTipoSel] = useState('producto')
  const urlOpt = import.meta.env.VITE_N8N_VIDEO_OPTIMIZE_URL || ''
  const apiKey = import.meta.env.VITE_N8N_API_KEY || ''

  const listar = useCallback(async () => {
    setCargando(true)
    try {
      const { data, error } = await clienteSupabase.storage.from('videos').list('', { limit: 1000 })
      if (error) throw error
      const arr = (data||[]).filter(i => /\.(mp4|mov|webm|mkv)$/i.test(i.name)).map(i => ({ key: i.name, name: i.name, url: clienteSupabase.storage.from('videos').getPublicUrl(i.name).data.publicUrl }))
      setArchivos(arr)
    } catch(e){ setArchivos([]) } finally { setCargando(false) }
  }, [])

  useEffect(() => { listar() }, [listar])

  useEffect(() => {
    const calc = async () => {
      const vis = archivos.map(a=>a.url).filter(u => !(tamanos[u]))
      const limit = 2
      let i=0
      const worker = async () => {
        while (i<vis.length) {
          const u = vis[i++]
          try { const r=await fetch(u,{method:'HEAD'}); if(r.ok){ const cl=r.headers.get('content-length'); if(cl) setTamanos(prev=>({...prev,[u]:parseInt(cl,10)})) } } catch {}
        }
      }
      await Promise.allSettled(Array.from({length:Math.min(limit,vis.length)},()=>worker()))
    }
    if (archivos.length) calc()
  }, [archivos])

  const filtrados = useMemo(() => {
    let l=[...archivos]
    if (busqueda.trim()) { const q=busqueda.trim().toLowerCase(); l=l.filter(a=>a.name.toLowerCase().includes(q)) }
    if (orden==='recientes') l.sort((a,b)=>a.name.localeCompare(b.name))
    return l
  }, [archivos,busqueda,orden])

  const verUsos = useCallback(async (a) => {
    try {
      const { data } = await clienteSupabase.from('producto_videos').select('id, producto_id, tipo, url_publica, productos(nombre, slug)').or(`ruta_storage.eq.${a.key},url_publica.eq.${a.url}`)
      setModalUsos({ archivo:a, usos:data||[] })
      const { data: prods } = await clienteSupabase.from('productos').select('id,nombre,slug').eq('activo',true).order('nombre',{ascending:true}).limit(200)
      setProductos(prods||[])
    } catch { setModalUsos({ archivo:a, usos:[] }) }
  }, [])

  const asignar = useCallback(async () => {
    if (!productoSel) return
    try {
      const { data: pub } = clienteSupabase.storage.from('videos').getPublicUrl(modalUsos.archivo.key)
      const campo = {
        producto: 'video_producto',
        beneficios: 'video_beneficios',
        anuncio_1: 'video_anuncio_1',
        anuncio_2: 'video_anuncio_2',
        anuncio_3: 'video_anuncio_3',
        testimonio: 'video_testimonio_1',
        extra: 'video_extra'
      }[tipoSel] || 'video_producto'
      const { data: fila } = await clienteSupabase.from('producto_videos').select('producto_id').eq('producto_id', productoSel).single()
      if (fila && fila.producto_id) {
        const { error } = await clienteSupabase.from('producto_videos').update({ [campo]: pub.publicUrl, estado: 'completado' }).eq('producto_id', productoSel)
        if (error) throw error
      } else {
        const { error } = await clienteSupabase.from('producto_videos').insert({ producto_id: productoSel, [campo]: pub.publicUrl, estado: 'completado' })
        if (error) throw error
      }
      setModalUsos(null)
    } catch(e){}
  }, [modalUsos, productoSel, tipoSel])

  const optimizar = useCallback(async (a) => {
    try {
      if (!urlOpt || !apiKey) return
      const resp = await fetch(urlOpt,{method:'POST',headers:{'Content-Type':'application/json','X-API-KEY':apiKey},body:JSON.stringify({url:a.url,preset:'web'})})
      if (!resp.ok) return
      const { base64, mime, nombre_sugerido } = await resp.json()
      const bin = Uint8Array.from(atob(base64), c=>c.charCodeAt(0))
      const blob = new Blob([bin], { type: mime || 'video/mp4' })
      const ext = (mime||'video/mp4').split('/')[1] || 'mp4'
      const nombreBase = (nombre_sugerido || a.name.replace(/\.[a-zA-Z0-9]+$/, ''))
      const nombreFinal = `${nombreBase}.${ext}`
      await clienteSupabase.storage.from('videos').upload(nombreFinal, blob, { upsert:true, contentType: blob.type })
      await listar()
    } catch(e){}
  }, [urlOpt, apiKey, listar])

  return (
    <div className="videos-ia">
      <div className="barra-herramientas">
        <label>Buscar</label>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Nombre..." />
        <label>Orden</label>
        <select value={orden} onChange={e=>setOrden(e.target.value)}>
          <option value="recientes">Más recientes</option>
        </select>
      </div>
      <div className="grid-archivos">
        {filtrados.map(a => (
          <div key={a.key} className="tarjeta-archivo">
            <div className="vista-cuadrada">
              <video src={a.url} className="video-preview" controls muted preload="metadata" />
            </div>
            <div className="contenido-tarjeta">
              <div className="nombre-archivo">{a.name}</div>
              <div className="detalle-archivo">{tamanos[a.url] ? `${Math.round(tamanos[a.url]/1024)} KB` : '— KB'}</div>
              <div className="acciones">
                <button className="btn btn-primario" onClick={()=>verUsos(a)}>Ver usos</button>
                <button className="btn" onClick={()=>optimizar(a)}>Optimizar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalUsos && (
        <div className="modal-subida-ia" onClick={()=>setModalUsos(null)}>
          <div className="modal-subida-contenido" onClick={e=>e.stopPropagation()}>
            <h2 className="modal-subida-titulo">Usos del video</h2>
            <div className="modal-subida-form">
              <video src={modalUsos.archivo.url} className="video-preview" controls muted preload="metadata" />
              <div>
                <label>Producto</label>
                <select value={productoSel} onChange={e=>setProductoSel(e.target.value)}>
                  <option value="">Selecciona…</option>
                  {productos.map(p=>(<option key={p.id} value={p.id}>{p.nombre}</option>))}
                </select>
                <label>Tipo</label>
                <select value={tipoSel} onChange={e=>setTipoSel(e.target.value)}>
                  <option value="producto">producto</option>
                  <option value="beneficios">beneficios</option>
                  <option value="anuncio_1">anuncio_1</option>
                  <option value="anuncio_2">anuncio_2</option>
                  <option value="anuncio_3">anuncio_3</option>
                  <option value="testimonio">testimonio</option>
                  <option value="extra">extra</option>
                </select>
              </div>
            </div>
            <div className="modal-subida-acciones">
              <button className="btn" onClick={()=>setModalUsos(null)}>Cerrar</button>
              <button className="btn btn-primario" onClick={asignar}>Asignar a producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
