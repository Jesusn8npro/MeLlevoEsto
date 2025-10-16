import React from 'react'
import { convertirUrlGoogleDrive, obtenerFormatosGoogleDrive } from '../../utilidades/googleDrive'

const DebugImagenes = ({ productos }) => {
  if (!productos || productos.length === 0) {
    return (
      <div style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        margin: '20px', 
        border: '2px solid #ccc',
        borderRadius: '8px'
      }}>
        <h3>🔍 DEBUG IMÁGENES</h3>
        <p>❌ No hay productos para debuggear</p>
      </div>
    )
  }

  return (
    <div style={{ 
      background: '#f0f0f0', 
      padding: '20px', 
      margin: '20px', 
      border: '2px solid #ccc',
      borderRadius: '8px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h3>🔍 DEBUG IMÁGENES ({productos.length} productos)</h3>
      
      {productos.slice(0, 3).map((producto, index) => {
        console.log('🖼️ DEBUG Producto:', producto.nombre, producto)
        
        return (
          <div key={index} style={{ 
            marginBottom: '20px', 
            padding: '10px', 
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            <h4>📦 {producto.nombre}</h4>
            
            {/* Mostrar fotos_principales */}
            <div>
              <strong>🖼️ fotos_principales:</strong>
              {producto.fotos_principales && producto.fotos_principales.length > 0 ? (
                <div>
                  {producto.fotos_principales.slice(0, 1).map((url, i) => {
                    const formatos = obtenerFormatosGoogleDrive(url)
                    return (
                      <div key={i} style={{ marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                        <div><strong>URL Original:</strong> <code style={{ fontSize: '10px' }}>{url}</code></div>
                        <div><strong>File ID:</strong> <code>{formatos.fileId}</code></div>
                        
                        <div style={{ marginTop: '10px' }}>
                          <strong>🧪 Probando formatos:</strong>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                            {Object.entries(formatos).filter(([key]) => key !== 'original' && key !== 'fileId').map(([nombre, urlFormato]) => (
                              <div key={nombre} style={{ padding: '8px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>{nombre}</div>
                                <div style={{ fontSize: '10px', marginBottom: '5px', wordBreak: 'break-all' }}>{urlFormato}</div>
                                <img 
                                  src={urlFormato} 
                                  alt={`Test ${nombre}`}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  onLoad={() => console.log(`✅ FORMATO FUNCIONA: ${nombre} - ${urlFormato}`)}
                                  onError={(e) => console.error(`❌ FORMATO FALLA: ${nombre} - ${urlFormato}`, e)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p>❌ No hay fotos_principales</p>
              )}
            </div>

            {/* Mostrar producto_imagenes si existe */}
            {producto.producto_imagenes && producto.producto_imagenes.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>🗂️ producto_imagenes:</strong>
                <pre style={{ fontSize: '10px', background: '#f5f5f5', padding: '5px' }}>
                  {JSON.stringify(producto.producto_imagenes[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default DebugImagenes