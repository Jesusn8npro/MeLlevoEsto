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

    // Preparar lista de URLs para probar
    let urls = []
    
    if (esUrlGoogleDrive(src)) {
      const fileId = extraerIdGoogleDrive(src)
      if (fileId) {
        urls = obtenerFormatosGoogleDrive(fileId)
      } else {
        urls = [src]
      }
    } else {
      urls = [src]
    }

    setUrlsParaProbar(urls)
    setUrlActual(urls[0])
  }, [src])

  const manejarError = () => {
    console.log(`❌ Error cargando imagen (intento ${intentoActual + 1}):`, urlActual)
    
    // Intentar siguiente URL
    const siguienteIntento = intentoActual + 1
    
    if (siguienteIntento < urlsParaProbar.length) {
      console.log(`🔄 Probando siguiente formato (${siguienteIntento + 1}/${urlsParaProbar.length}):`, urlsParaProbar[siguienteIntento])
      setIntentoActual(siguienteIntento)
      setUrlActual(urlsParaProbar[siguienteIntento])
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
    opacity: cargando ? 0.7 : 1,
    transition: 'opacity 0.3s ease',
    backgroundColor: cargando ? '#f5f5f5' : 'transparent'
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={urlActual}
        alt={alt}
        style={estiloFinal}
        className={className}
        onLoad={manejarCarga}
        onError={manejarError}
        {...props}
      />
      
      {cargando && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '12px',
          color: '#666',
          background: 'rgba(255,255,255,0.8)',
          padding: '4px 8px',
          borderRadius: '4px',
          pointerEvents: 'none'
        }}>
          Cargando...
        </div>
      )}
      
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