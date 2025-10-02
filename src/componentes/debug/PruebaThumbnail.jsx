import React from 'react'
import { convertirUrlGoogleDrive } from '../../utilidades/googleDrive'

const PruebaThumbnail = () => {
  // URL de prueba que sabemos que existe
  const urlPrueba = 'https://drive.google.com/file/d/1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA/view?usp=sharing'
  const urlConvertida = convertirUrlGoogleDrive(urlPrueba)

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f8ff', 
      border: '2px solid #4CAF50', 
      borderRadius: '8px', 
      margin: '20px 0' 
    }}>
      <h3 style={{ color: '#2E7D32', margin: '0 0 15px 0' }}>🧪 Prueba de Thumbnail</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>URL Original:</strong>
        <div style={{ 
          fontSize: '12px', 
          background: '#fff', 
          padding: '8px', 
          borderRadius: '4px', 
          wordBreak: 'break-all',
          border: '1px solid #ddd'
        }}>
          {urlPrueba}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>URL Convertida (Thumbnail):</strong>
        <div style={{ 
          fontSize: '12px', 
          background: '#fff', 
          padding: '8px', 
          borderRadius: '4px', 
          wordBreak: 'break-all',
          border: '1px solid #ddd'
        }}>
          {urlConvertida}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Resultado Visual:</strong>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginTop: '10px'
        }}>
          <img 
            src={urlConvertida} 
            alt="Prueba thumbnail"
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
            onLoad={() => {
              console.log('✅ ÉXITO: Thumbnail cargado correctamente!')
              console.log('URL que funciona:', urlConvertida)
            }}
            onError={(e) => {
              console.error('❌ ERROR: Thumbnail falló al cargar')
              console.error('URL que falló:', urlConvertida)
              console.error('Error:', e)
            }}
          />
          <div>
            <div style={{ 
              padding: '8px 12px', 
              background: '#4CAF50', 
              color: 'white', 
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Si ves la imagen aquí → ¡FUNCIONA! 🎉
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '5px' 
            }}>
              Revisa la consola para ver los logs
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '10px', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>📝 Nota:</strong> Este formato usa la API de thumbnail de Google Drive que debería funcionar mejor que los otros formatos.
      </div>
    </div>
  )
}

export default PruebaThumbnail