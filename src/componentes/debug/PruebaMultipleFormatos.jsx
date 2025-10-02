import React, { useState } from 'react'

const PruebaMultipleFormatos = () => {
  const [resultados, setResultados] = useState({})
  
  // URL de prueba
  const urlOriginal = 'https://drive.google.com/file/d/1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA/view?usp=sharing'
  const fileId = '1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA'

  const formatos = {
    'thumbnail_400': `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`,
    'thumbnail_200': `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h200`,
    'uc_export_view': `https://drive.google.com/uc?export=view&id=${fileId}`,
    'uc_id': `https://drive.google.com/uc?id=${fileId}`,
    'googleusercontent': `https://lh3.googleusercontent.com/d/${fileId}`,
    'googleusercontent_size': `https://lh3.googleusercontent.com/d/${fileId}=w400-h400`,
    'direct_download': `https://drive.google.com/uc?export=download&id=${fileId}`,
  }

  const probarFormato = (nombre, url) => {
    return new Promise((resolve) => {
      const img = new Image()
      const timeout = setTimeout(() => {
        resolve({ nombre, url, estado: 'timeout' })
      }, 8000)

      img.onload = () => {
        clearTimeout(timeout)
        resolve({ 
          nombre, 
          url, 
          estado: 'success', 
          width: img.naturalWidth, 
          height: img.naturalHeight 
        })
      }

      img.onerror = () => {
        clearTimeout(timeout)
        resolve({ nombre, url, estado: 'error' })
      }

      img.src = url
    })
  }

  const ejecutarPruebas = async () => {
    console.log('🧪 INICIANDO PRUEBAS DE MÚLTIPLES FORMATOS')
    setResultados({})
    
    const nuevosResultados = {}
    
    for (const [nombre, url] of Object.entries(formatos)) {
      console.log(`Probando: ${nombre} - ${url}`)
      const resultado = await probarFormato(nombre, url)
      nuevosResultados[nombre] = resultado
      
      if (resultado.estado === 'success') {
        console.log(`✅ FUNCIONA: ${nombre}`)
      } else {
        console.log(`❌ FALLA: ${nombre}`)
      }
      
      setResultados({...nuevosResultados})
    }
    
    console.log('📊 RESULTADOS FINALES:', nuevosResultados)
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#e8f5e8', 
      border: '2px solid #4CAF50', 
      borderRadius: '8px', 
      margin: '20px 0' 
    }}>
      <h3 style={{ color: '#2E7D32', margin: '0 0 15px 0' }}>🔬 Prueba Múltiples Formatos</h3>
      
      <button 
        onClick={ejecutarPruebas}
        style={{
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        🚀 Ejecutar Pruebas
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '15px' 
      }}>
        {Object.entries(formatos).map(([nombre, url]) => {
          const resultado = resultados[nombre]
          
          return (
            <div 
              key={nombre}
              style={{ 
                padding: '15px', 
                background: 'white', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                borderLeft: `4px solid ${
                  resultado?.estado === 'success' ? '#4CAF50' : 
                  resultado?.estado === 'error' ? '#f44336' : 
                  resultado?.estado === 'timeout' ? '#ff9800' : '#ccc'
                }`
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {nombre}
                {resultado && (
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: 
                      resultado.estado === 'success' ? '#4CAF50' : 
                      resultado.estado === 'error' ? '#f44336' : '#ff9800',
                    color: 'white'
                  }}>
                    {resultado.estado === 'success' ? '✅ OK' : 
                     resultado.estado === 'error' ? '❌ ERROR' : '⏱️ TIMEOUT'}
                  </span>
                )}
              </div>
              
              <div style={{ 
                fontSize: '11px', 
                marginBottom: '10px', 
                wordBreak: 'break-all',
                color: '#666'
              }}>
                {url}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={url} 
                  alt={`Test ${nombre}`}
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  onLoad={() => console.log(`✅ Cargó: ${nombre}`)}
                  onError={() => console.log(`❌ Falló: ${nombre}`)}
                />
                
                {resultado?.estado === 'success' && (
                  <div style={{ fontSize: '12px', color: '#4CAF50' }}>
                    {resultado.width} x {resultado.height}px
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {Object.keys(resultados).length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#fff', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h4>📊 Resumen de Resultados:</h4>
          {(() => {
            const exitosos = Object.values(resultados).filter(r => r.estado === 'success')
            const fallidos = Object.values(resultados).filter(r => r.estado === 'error')
            const timeouts = Object.values(resultados).filter(r => r.estado === 'timeout')
            
            return (
              <div>
                <p>✅ Exitosos: {exitosos.length}</p>
                <p>❌ Fallidos: {fallidos.length}</p>
                <p>⏱️ Timeouts: {timeouts.length}</p>
                
                {exitosos.length > 0 && (
                  <div style={{ marginTop: '10px', padding: '10px', background: '#d4edda', borderRadius: '4px' }}>
                    <strong>🎯 Formato recomendado:</strong> {exitosos[0].nombre}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default PruebaMultipleFormatos