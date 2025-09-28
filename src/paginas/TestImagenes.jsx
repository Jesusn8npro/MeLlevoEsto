import React, { useState } from 'react'
import './TestImagenes.css'

const TestImagenes = () => {
  const [url, setUrl] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [cargando, setCargando] = useState(false)

  const agregarImagen = () => {
    if (!url.trim()) return
    
    setCargando(true)
    const nuevaImagen = {
      id: Date.now(),
      url: url.trim(),
      estado: 'cargando',
      timestamp: new Date().toLocaleTimeString()
    }
    
    setImagenes(prev => [nuevaImagen, ...prev])
    setUrl('')
    setCargando(false)
  }

  const manejarEstadoImagen = (id, estado, error = null) => {
    setImagenes(prev => prev.map(img => 
      img.id === id 
        ? { ...img, estado, error, tiempoCarga: new Date().toLocaleTimeString() }
        : img
    ))
  }

  const limpiarTodo = () => {
    setImagenes([])
    setUrl('')
  }

  const urlsEjemplo = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    'https://drive.google.com/thumbnail?id=1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA&sz=w1000',
    'https://drive.google.com/file/d/1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA/view?usp=sharing',
    'https://drive.usercontent.google.com/download?id=1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA&export=view&authuser=0',
    'https://lh3.googleusercontent.com/d/1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA'
  ]

  return (
    <div className="test-imagenes-container">
      <div className="test-imagenes-header">
        <h1>🧪 Tester de URLs de Imágenes</h1>
        <p>Prueba diferentes formatos de URLs para ver cuáles funcionan</p>
      </div>

      <div className="test-imagenes-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Pega aquí la URL de la imagen..."
            className="url-input"
            onKeyPress={(e) => e.key === 'Enter' && agregarImagen()}
          />
          <button 
            onClick={agregarImagen}
            disabled={!url.trim() || cargando}
            className="btn-agregar"
          >
            {cargando ? '⏳' : '➕'} Probar URL
          </button>
          <button 
            onClick={limpiarTodo}
            className="btn-limpiar"
          >
            🗑️ Limpiar Todo
          </button>
        </div>

        <div className="urls-ejemplo">
          <h3>📋 URLs de Ejemplo:</h3>
          <div className="ejemplo-buttons">
            {urlsEjemplo.map((urlEj, index) => (
              <button
                key={index}
                onClick={() => setUrl(urlEj)}
                className="btn-ejemplo"
                title={urlEj}
              >
                Ejemplo {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="test-imagenes-resultados">
        <h2>📊 Resultados ({imagenes.length})</h2>
        
        {imagenes.length === 0 && (
          <div className="sin-resultados">
            <p>🔍 No hay imágenes para probar aún</p>
            <p>Pega una URL arriba y presiona "Probar URL"</p>
          </div>
        )}

        <div className="imagenes-grid">
          {imagenes.map((imagen) => (
            <div key={imagen.id} className={`imagen-test ${imagen.estado}`}>
              <div className="imagen-header">
                <div className="estado-badge">
                  {imagen.estado === 'cargando' && '⏳ Cargando...'}
                  {imagen.estado === 'exitosa' && '✅ Exitosa'}
                  {imagen.estado === 'error' && '❌ Error'}
                </div>
                <div className="timestamp">
                  Agregada: {imagen.timestamp}
                  {imagen.tiempoCarga && ` | Cargada: ${imagen.tiempoCarga}`}
                </div>
              </div>

              <div className="imagen-container">
                <img
                  src={imagen.url}
                  alt={`Test ${imagen.id}`}
                  onLoad={() => manejarEstadoImagen(imagen.id, 'exitosa')}
                  onError={(e) => manejarEstadoImagen(imagen.id, 'error', e.target.src)}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    border: imagen.estado === 'exitosa' ? '3px solid #4CAF50' : 
                           imagen.estado === 'error' ? '3px solid #f44336' : '3px solid #2196F3'
                  }}
                />
              </div>

              <div className="imagen-info">
                <div className="url-display">
                  <strong>URL:</strong>
                  <code>{imagen.url}</code>
                </div>
                
                {imagen.error && (
                  <div className="error-info">
                    <strong>❌ Error:</strong>
                    <p>No se pudo cargar la imagen</p>
                  </div>
                )}

                <div className="url-analysis">
                  <strong>🔍 Análisis:</strong>
                  <ul>
                    <li>Dominio: {new URL(imagen.url).hostname}</li>
                    <li>Protocolo: {new URL(imagen.url).protocol}</li>
                    <li>Tipo: {
                      imagen.url.includes('unsplash.com') ? 'Unsplash' :
                      imagen.url.includes('drive.google.com/thumbnail') ? 'Google Drive Thumbnail' :
                      imagen.url.includes('drive.google.com/file') ? 'Google Drive File' :
                      imagen.url.includes('drive.usercontent.google.com') ? 'Google Drive UserContent' :
                      imagen.url.includes('lh3.googleusercontent.com') ? 'Google Photos' :
                      'Otro'
                    }</li>
                  </ul>
                </div>

                <button 
                  onClick={() => navigator.clipboard.writeText(imagen.url)}
                  className="btn-copiar"
                >
                  📋 Copiar URL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-imagenes-stats">
        <h3>📈 Estadísticas</h3>
        <div className="stats-grid">
          <div className="stat-card exitosa">
            <div className="stat-number">{imagenes.filter(img => img.estado === 'exitosa').length}</div>
            <div className="stat-label">✅ Exitosas</div>
          </div>
          <div className="stat-card error">
            <div className="stat-number">{imagenes.filter(img => img.estado === 'error').length}</div>
            <div className="stat-label">❌ Errores</div>
          </div>
          <div className="stat-card cargando">
            <div className="stat-number">{imagenes.filter(img => img.estado === 'cargando').length}</div>
            <div className="stat-label">⏳ Cargando</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestImagenes
