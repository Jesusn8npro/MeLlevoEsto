import React, { useState, useEffect } from 'react'
import { convertirImagenRapido, obtenerImagenPlaceholder, esUrlGoogleDrive, extraerIdGoogleDrive, obtenerFormatosGoogleDrive } from '../../utilidades/imagenesAlternativas'

const ImagenInteligente = ({ 
  src, 
  alt = "Imagen", 
  style = {}, 
  className = "",
  onLoad,
  onError,
  ...props 
}) => {
  const [urlActual, setUrlActual] = useState(src)
  const [intentoActual, setIntentoActual] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  // Lista de URLs para probar en orden
  const [urlsParaProbar, setUrlsParaProbar] = useState([])

  useEffect(() => {
    if (!src) {
      setError(true)
      setCargando(false)
      return
    }

    // Resetear estado
    setError(false)
    setCargando(true)
    setIntentoActual(0)

    // Preparar lista de URLs para probar, empezando por conversión rápida si es Google Drive
    let urls = []
    if (esUrlGoogleDrive(src)) {
      const fileId = extraerIdGoogleDrive(src)
      if (fileId) {
        const formatos = obtenerFormatosGoogleDrive(fileId)
        // Insertar primero la conversión rápida
        const rapida = convertirImagenRapido(src)
        urls = [rapida, ...formatos.filter(u => u !== rapida)]
      } else {
        urls = [convertirImagenRapido(src), src]
      }
    } else {
      urls = [src]
    }

    // Añadir pequeña cadena anti-caché para evitar respuestas cacheadas erróneas
    const conCacheBust = (u) => {
      try {
        const separador = u.includes('?') ? '&' : '?'
        return `${u}${separador}cb=${Date.now()}`
      } catch {
        return u
      }
    }

    setUrlsParaProbar(urls)
    setUrlActual(conCacheBust(urls[0]))
  }, [src])

  const manejarError = () => {
    console.log(`❌ Error cargando imagen (intento ${intentoActual + 1}):`, urlActual)
    
    // Intentar siguiente URL
    const siguienteIntento = intentoActual + 1
    
    if (siguienteIntento < urlsParaProbar.length) {
      console.log(`🔄 Probando siguiente formato (${siguienteIntento + 1}/${urlsParaProbar.length}):`, urlsParaProbar[siguienteIntento])
      setIntentoActual(siguienteIntento)
      const siguiente = urlsParaProbar[siguienteIntento]
      const separador = siguiente.includes('?') ? '&' : '?'
      setUrlActual(`${siguiente}${separador}cb=${Date.now()}`)
    } else {
      // No hay más URLs para probar
      console.log('❌ Todos los formatos fallaron, usando placeholder')
      setError(true)
      setCargando(false)
      setUrlActual(obtenerImagenPlaceholder())

      if (onError) {
        onError(new Error('No se pudo cargar ningún formato de imagen'))
      }
    }
  }

  const manejarCarga = () => {
    console.log(`✅ Imagen cargada exitosamente (intento ${intentoActual + 1}):`, urlActual)
    setCargando(false)
    setError(false)
    
    if (onLoad) {
      onLoad()
    }
  }

  const estiloFinal = {
    ...style,
    opacity: 1, // Siempre opacidad completa
    transition: 'none', // Sin transiciones para cambio instantáneo
    backgroundColor: 'transparent' // Siempre fondo transparente
  }

  return (
    <div style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
      <img
        src={urlActual}
        alt={alt}
        style={estiloFinal}
        className={className}
        onLoad={manejarCarga}
        onError={manejarError}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="eager" // Cambio de lazy a eager para carga inmediata
        decoding="sync" // Cambio de async a sync para decodificación inmediata
        {...props}
      />
      
      {/* Eliminado el indicador de carga "Cargando..." */}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          fontSize: '10px',
          color: '#f44336',
          background: 'rgba(255,255,255,0.9)',
          padding: '2px 4px',
          borderRadius: '2px',
          pointerEvents: 'none'
        }}>
          ⚠️
        </div>
      )}
    </div>
  )
}

export default ImagenInteligente