import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import Compressor from 'compressorjs'
import './ImagenesIA.css'

// Página de administración para gestionar imágenes generadas (IA) en Storage
export default function ImagenesIA() {
  const BUCKETS = ['imagenes', 'imagenes_tienda', 'imagenes_categorias', 'imagenes_articulos']

  const [bucketSeleccionado, setBucketSeleccionado] = useState(BUCKETS[0])
  const [archivos, setArchivos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [mostrandoUsos, setMostrandoUsos] = useState(null) // ruta del archivo
  const [usos, setUsos] = useState([])
  const [reemplazarOriginal, setReemplazarOriginal] = useState(false)

  // Listar archivos del bucket seleccionado
  const listarArchivos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)
      const { data, error } = await clienteSupabase
        .storage
        .from(bucketSeleccionado)
        .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
      if (error) throw error
      setArchivos((data || []).filter(a => a && a.name))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [bucketSeleccionado])

  useEffect(() => { listarArchivos() }, [listarArchivos])

  const archivosFiltrados = useMemo(() => {
    if (!busqueda) return archivos
    const q = busqueda.toLowerCase()
    return archivos.filter(a => a.name.toLowerCase().includes(q))
  }, [archivos, busqueda])

  const obtenerUrlPublica = useCallback((path) => {
    const { data } = clienteSupabase.storage.from(bucketSeleccionado).getPublicUrl(path)
    return data?.publicUrl || ''
  }, [bucketSeleccionado])

  // Ver en qué productos se usa una imagen
  const consultarUsos = useCallback(async (file) => {
    try {
      setMostrandoUsos(file.name)
      setUsos([])
      const url = obtenerUrlPublica(file.name)
      // Buscar coincidencias por URL o nombre en tabla producto_imagenes
      const { data: registros, error } = await clienteSupabase
        .from('producto_imagenes')
        .select('producto_id, imagen_principal, imagen_secundaria_1, imagen_secundaria_2, imagen_secundaria_3, imagen_secundaria_4')
      if (error) throw error
      const usados = (registros || []).filter(r => {
        const valores = [r.imagen_principal, r.imagen_secundaria_1, r.imagen_secundaria_2, r.imagen_secundaria_3, r.imagen_secundaria_4]
        return valores.some(v => typeof v === 'string' && (v.includes(url) || v.includes(file.name)))
      })
      const ids = Array.from(new Set(usados.map(u => u.producto_id).filter(Boolean)))
      let productos = []
      if (ids.length > 0) {
        const { data: prods } = await clienteSupabase
          .from('productos')
          .select('id, nombre, slug')
          .in('id', ids)
        productos = prods || []
      }
      const mapa = new Map(productos.map(p => [p.id, p]))
      setUsos(usados.map(u => ({ producto_id: u.producto_id, producto: mapa.get(u.producto_id) })))
    } catch (e) {
      setUsos([])
    }
  }, [obtenerUrlPublica])

  // Eliminar archivo del bucket
  const eliminarArchivo = useCallback(async (file) => {
    try {
      setCargando(true)
      const { error } = await clienteSupabase.storage.from(bucketSeleccionado).remove([file.name])
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
      const url = obtenerUrlPublica(file.name)
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
        ? file.name
        : file.name.replace(/\.[a-zA-Z0-9]+$/, '') + '-optimizado.webp'
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
        <label className="check-reemplazar">
          <input type="checkbox" checked={reemplazarOriginal} onChange={e => setReemplazarOriginal(e.target.checked)} />
          Reemplazar original al optimizar
        </label>
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
            <div className="vista-cuadrada">
              {/* imagen */}
              <img
                src={obtenerUrlPublica(file.name)}
                alt={file.name}
                className="imagen-preview"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="contenido-tarjeta">
              <div className="nombre-archivo">{file.name}</div>
              <div className="detalle-archivo">Tamaño: {Math.round((file?.metadata?.size || 0) / 1024)} KB</div>
              <div className="acciones">
                <button className="btn btn-primario" onClick={() => consultarUsos(file)}>Ver usos</button>
                <button className="btn btn-ambar" onClick={() => optimizarArchivo(file)}>Optimizar</button>
                <button className="btn btn-peligro" onClick={() => eliminarArchivo(file)}>Eliminar</button>
              </div>
              <div className="acciones-secundarias">
                <button className="btn btn-secundario" onClick={() => navigator.clipboard.writeText(obtenerUrlPublica(file.name))}>Copiar URL</button>
                <a className="btn btn-ligero" href={obtenerUrlPublica(file.name)} target="_blank" rel="noreferrer">Abrir</a>
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
                <li key={`${u.producto_id}`} className="item-uso">
                  <div>
                    <div className="uso-id">Producto ID: {u.producto_id}</div>
                    <div className="uso-detalle">{u.producto?.nombre} {u.producto?.slug ? `— /producto/${u.producto.slug}` : ''}</div>
                  </div>
                  {u.producto?.slug && (
                    <a href={`/producto/${u.producto.slug}`} className="link-producto">Abrir producto</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}