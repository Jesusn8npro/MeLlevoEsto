import React from 'react'
import ImagenInteligente from '../ui/ImagenInteligente'

const PruebaImagenInteligente = () => {
  const urlsParaProbar = [
    'https://drive.google.com/file/d/1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA/view?usp=sharing',
    'https://ejemplo.com/imagen-que-no-existe.jpg', // URL que fallará
    'https://via.placeholder.com/200x200/4CAF50/white?text=Placeholder' // URL que funcionará
  ]

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f8ff', 
      border: '2px solid #2196F3', 
      borderRadius: '8px', 
      margin: '20px 0' 
    }}>
      <h3 style={{ color: '#1976D2', margin: '0 0 15px 0' }}>🧠 Prueba Imagen Inteligente</h3>
      
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Este componente probará automáticamente múltiples formatos hasta encontrar uno que funcione.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {urlsParaProbar.map((url, index) => (
          <div 
            key={index}
            style={{ 
              padding: '15px', 
              background: 'white', 
              border: '1px solid #ddd', 
              borderRadius: '8px' 
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              Prueba {index + 1}: {
                index === 0 ? 'Google Drive' :
                index === 1 ? 'URL Inválida' : 'Placeholder'
              }
            </h4>
            
            <div style={{ 
              fontSize: '11px', 
              marginBottom: '10px', 
              wordBreak: 'break-all',
              color: '#666',
              background: '#f8f9fa',
              padding: '5px',
              borderRadius: '3px'
            }}>
              {url}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <ImagenInteligente
                src={url}
                alt={`Prueba ${index + 1}`}
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  border: '2px solid #ddd',
                  borderRadius: '8px'
                }}
                onLoad={() => console.log(`✅ Imagen ${index + 1} cargada exitosamente`)}
                onError={(error) => console.log(`❌ Error en imagen ${index + 1}:`, error)}
              />
            </div>
            
            <div style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              textAlign: 'center',
              color: '#666'
            }}>
              {index === 0 && 'Debería probar múltiples formatos de Google Drive'}
              {index === 1 && 'Debería mostrar placeholder después de fallar'}
              {index === 2 && 'Debería cargar directamente'}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#e8f5e8', 
        borderRadius: '8px',
        border: '1px solid #4CAF50'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2E7D32' }}>🎯 Qué esperar:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#2E7D32' }}>
          <li>La imagen de Google Drive debería probar múltiples formatos automáticamente</li>
          <li>La URL inválida debería mostrar un placeholder después de fallar</li>
          <li>El placeholder debería cargar inmediatamente</li>
          <li>Revisa la consola para ver los logs detallados del proceso</li>
        </ul>
      </div>
    </div>
  )
}

export default PruebaImagenInteligente