import React, { useState, useEffect } from 'react'
import { obtenerFormatosGoogleDrive } from '../../utilidades/googleDrive'

const DiagnosticoImagenes = ({ productos }) => {
  const [resultados, setResultados] = useState({})
  const [cargando, setCargando] = useState(false)

  const probarFormato = async (nombre, url) => {
    return new Promise((resolve) => {
      const img = new Image()
      const timeoutId = setTimeout(() => {
        resolve({
          nombre,
          url,
          estado: 'timeout',
          error: 'Timeout después de 10 segundos'
        })
      }, 10000)

      img.onload = () => {
        clearTimeout(timeoutId)
        resolve({
          nombre,
          url,
          estado: 'success',
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }

      img.onerror = (e) => {
        clearTimeout(timeoutId)
        resolve({
          nombre,
          url,
          estado: 'error',
          error: e.type || 'Error desconocido'
        })
      }

      img.src = url
    })
  }

  const ejecutarDiagnostico = async () => {
    if (!productos || productos.length === 0) return

    setCargando(true)
    const producto = productos[0]
    
    if (!producto.fotos_principales || producto.fotos_principales.length === 0) {
      setCargando(false)
      return
    }

    const urlOriginal = producto.fotos_principales[0]
    const formatos = obtenerFormatosGoogleDrive(urlOriginal)
    
    console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO')
    console.log('URL Original:', urlOriginal)
    console.log('File ID extraído:', formatos.fileId)

    const resultadosFormatos = {}
    
    // Probar cada formato
    for (const [nombre, url] of Object.entries(formatos)) {
      if (nombre === 'original' || nombre === 'fileId') continue
      
      console.log(`🧪 Probando formato: ${nombre}`)
      const resultado = await probarFormato(nombre, url)
      resultadosFormatos[nombre] = resultado
      
      if (resultado.estado === 'success') {
        console.log(`✅ ÉXITO: ${nombre} - ${url}`)
      } else {
        console.log(`❌ FALLO: ${nombre} - ${resultado.error} - ${url}`)
      }
    }

    setResultados(resultadosFormatos)
    setCargando(false)
    
    console.log('📊 RESUMEN DEL DIAGNÓSTICO:', resultadosFormatos)
  }

  useEffect(() => {
    if (productos && productos.length > 0) {
      ejecutarDiagnostico()
    }
  }, [productos])

  if (!productos || productos.length === 0) {
    return (
      <div style={{ padding: '20px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', margin: '10px 0' }}>
        <h3>🔍 Diagnóstico de Imágenes</h3>
        <p>No hay productos para diagnosticar</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px', margin: '10px 0' }}>
      <h3>🔍 Diagnóstico Avanzado de Imágenes</h3>
      
      {cargando && (
        <div style={{ padding: '10px', background: '#fff', borderRadius: '4px', margin: '10px 0' }}>
          <p>⏳ Ejecutando diagnóstico completo... (esto puede tomar unos segundos)</p>
        </div>
      )}

      {Object.keys(resultados).length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4>📊 Resultados del Diagnóstico:</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            {Object.entries(resultados).map(([nombre, resultado]) => (
              <div 
                key={nombre} 
                style={{ 
                  padding: '10px', 
                  background: resultado.estado === 'success' ? '#d4edda' : '#f8d7da',
                  border: `1px solid ${resultado.estado === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                  borderRadius: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{nombre}</strong>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    background: resultado.estado === 'success' ? '#28a745' : '#dc3545',
                    color: 'white'
                  }}>
                    {resultado.estado === 'success' ? '✅ FUNCIONA' : '❌ FALLA'}
                  </span>
                </div>
                
                <div style={{ fontSize: '11px', marginTop: '5px', wordBreak: 'break-all' }}>
                  {resultado.url}
                </div>
                
                {resultado.estado === 'success' && (
                  <div style={{ fontSize: '12px', marginTop: '5px', color: '#155724' }}>
                    Dimensiones: {resultado.width} x {resultado.height}px
                  </div>
                )}
                
                {resultado.estado !== 'success' && (
                  <div style={{ fontSize: '12px', marginTop: '5px', color: '#721c24' }}>
                    Error: {resultado.error}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px' }}>
            <h5>🎯 Recomendación:</h5>
            {(() => {
              const exitosos = Object.entries(resultados).filter(([_, r]) => r.estado === 'success')
              if (exitosos.length > 0) {
                const mejor = exitosos[0]
                return (
                  <p style={{ color: '#155724', margin: 0 }}>
                    <strong>Usar formato: {mejor[0]}</strong><br/>
                    Este formato carga correctamente las imágenes.
                  </p>
                )
              } else {
                return (
                  <p style={{ color: '#721c24', margin: 0 }}>
                    <strong>⚠️ Ningún formato funciona</strong><br/>
                    Posibles problemas: CORS, permisos de Google Drive, o URLs inválidas.
                  </p>
                )
              }
            })()}
          </div>
        </div>
      )}
      
      <button 
        onClick={ejecutarDiagnostico}
        disabled={cargando}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          background: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: cargando ? 'not-allowed' : 'pointer'
        }}
      >
        {cargando ? '⏳ Diagnosticando...' : '🔄 Ejecutar Diagnóstico'}
      </button>
    </div>
  )
}

export default DiagnosticoImagenes