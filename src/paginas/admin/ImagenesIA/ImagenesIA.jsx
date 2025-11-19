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
  const [modalAbierto, setModalAbierto] = useState(false)
  const [imagenModal, setImagenModal] = useState(null)
  const [previewsProductos, setPreviewsProductos] = useState([])

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
      setImagenModal(obtenerUrlPublica(file.name))
      setModalAbierto(true)
      setUsos([])
      const url = obtenerUrlPublica(file.name)
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
            <div className="vista-cuadrada" onClick={() => { setImagenModal(obtenerUrlPublica(file.name)); setModalAbierto(true); }}>
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
                <button className="btn btn-peligro" onClick={() => { if (confirm('¿Eliminar esta imagen del storage?')) eliminarArchivo(file) }}>Eliminar</button>
              </div>
              <div className="acciones-secundarias">
                <button className="btn btn-secundario" onClick={() => navigator.clipboard.writeText(obtenerUrlPublica(file.name))}>Copiar URL</button>
                <button className="btn btn-ligero" onClick={() => { setImagenModal(obtenerUrlPublica(file.name)); setModalAbierto(true) }}>Abrir</button>
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
            <img src={imagenModal} alt="Imagen" className="modal-imagen-preview" />
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
      )}
    </div>
  )
}