import React from 'react'

const TestFormatos = () => {
  // URL de prueba real de Google Drive
  const urlOriginal = "https://drive.google.com/file/d/1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA/view?usp=sharing"
  const fileId = "1YUGaBMl22HxCzNU6EMQcVf_E-WAiWoiA"

  // Diferentes formatos para probar
  const formatos = [
    {
      nombre: "Formato Original",
      url: urlOriginal,
      descripcion: "URL original de Google Drive"
    },
    {
      nombre: "Formato Directo (uc?id=)",
      url: `https://drive.google.com/uc?id=${fileId}`,
      descripcion: "Formato directo con uc?id="
    },
    {
      nombre: "Formato Directo con export=view",
      url: `https://drive.google.com/uc?export=view&id=${fileId}`,
      descripcion: "Formato con export=view"
    },
    {
      nombre: "Formato lh3.googleusercontent.com",
      url: `https://lh3.googleusercontent.com/d/${fileId}`,
      descripcion: "Formato lh3.googleusercontent.com básico"
    },
    {
      nombre: "Formato lh3 con tamaño w1000",
      url: `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
      descripcion: "Formato lh3 con tamaño w1000"
    },
    {
      nombre: "Formato lh3 con tamaño w1200-h800-no",
      url: `https://lh3.googleusercontent.com/d/${fileId}=w1200-h800-no`,
      descripcion: "Formato lh3 con tamaño w1200-h800-no (utilidad actual)"
    },
    {
      nombre: "Formato thumbnail",
      url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
      descripcion: "Formato thumbnail con tamaño"
    }
  ]

  const manejarCarga = (formato) => {
    console.log(`✅ FORMATO FUNCIONA: ${formato.nombre} - ${formato.url}`)
  }

  const manejarError = (formato, error) => {
    console.error(`❌ FORMATO FALLA: ${formato.nombre} - ${formato.url}`, error)
  }

  return (
    <div style={{ 
      background: '#fff3cd', 
      padding: '20px', 
      margin: '20px', 
      border: '2px solid #ffc107',
      borderRadius: '8px'
    }}>
      <h3>🧪 TEST FORMATOS DE GOOGLE DRIVE</h3>
      <p><strong>URL Original:</strong> <code style={{ fontSize: '10px' }}>{urlOriginal}</code></p>
      <p><strong>File ID:</strong> <code>{fileId}</code></p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginTop: '20px' }}>
        {formatos.map((formato, index) => (
          <div key={index} style={{ 
            background: 'white',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{formato.nombre}</h4>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>{formato.descripcion}</p>
            <div style={{ marginBottom: '10px' }}>
              <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>{formato.url}</code>
            </div>
            <img 
              src={formato.url}
              alt={`Test ${formato.nombre}`}
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              onLoad={() => manejarCarga(formato)}
              onError={(e) => manejarError(formato, e)}
            />
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h4>📋 Instrucciones:</h4>
        <ol>
          <li>Abre la consola del navegador (F12)</li>
          <li>Observa qué formatos muestran "✅ FORMATO FUNCIONA" y cuáles "❌ FORMATO FALLA"</li>
          <li>Los formatos que cargan correctamente mostrarán la imagen</li>
          <li>Usa el formato que funcione para actualizar la utilidad de Google Drive</li>
        </ol>
      </div>
    </div>
  )
}

export default TestFormatos