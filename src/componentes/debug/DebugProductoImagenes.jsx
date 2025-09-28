import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../configuracion/supabase'

/**
 * Componente temporal para debuggear el problema de las imágenes
 */
const DebugProductoImagenes = ({ slug }) => {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      cargarDatos()
    }
  }, [slug])

  const cargarDatos = async () => {
    setCargando(true)
    setError(null)

    try {
      console.log('🔍 DebugProductoImagenes - Consultando slug:', slug)
      
      // Consulta directa para ver qué datos llegan
      const { data, error: errorConsulta } = await clienteSupabase
        .from('productos')
        .select(`
          id,
          nombre,
          slug,
          activo,
          precio,
          precio_original,
          producto_imagenes (
            id,
            producto_id,
            imagen_principal,
            imagen_secundaria_1,
            imagen_secundaria_2,
            imagen_secundaria_3,
            imagen_secundaria_4,
            estado,
            total_imagenes_generadas,
            creado_el
          )
        `)
        .eq('slug', slug)
        .eq('activo', true)
        .single()

      console.log('🔍 DebugProductoImagenes - Datos recibidos:', data)
      console.log('🔍 DebugProductoImagenes - Error:', errorConsulta)

      if (errorConsulta) {
        throw errorConsulta
      }

      setDatos(data)
    } catch (err) {
      console.error('❌ DebugProductoImagenes - Error:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return <div style={{ padding: '20px', background: '#f0f0f0' }}>Cargando datos de debug...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#ffebee', color: '#c62828' }}>
        <h3>Error en Debug:</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#e8f5e8', 
      border: '2px solid #4caf50',
      margin: '20px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <h3 style={{ color: '#2e7d32' }}>🔍 DEBUG - Datos del Producto</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Producto:</strong><br/>
        ID: {datos?.id}<br/>
        Nombre: {datos?.nombre}<br/>
        Slug: {datos?.slug}<br/>
        Activo: {datos?.activo ? 'SÍ' : 'NO'}<br/>
        Precio: ${datos?.precio}<br/>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Producto Imágenes (Array):</strong><br/>
        Cantidad de registros: {datos?.producto_imagenes?.length || 0}<br/>
        {datos?.producto_imagenes?.length > 0 ? (
          datos.producto_imagenes.map((img, index) => (
            <div key={index} style={{ 
              background: '#fff', 
              padding: '10px', 
              margin: '5px 0',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}>
              <strong>Registro {index + 1}:</strong><br/>
              ID: {img.id}<br/>
              Producto ID: {img.producto_id}<br/>
              Estado: {img.estado}<br/>
              Total imágenes: {img.total_imagenes_generadas}<br/>
              <br/>
              <strong>URLs de Imágenes:</strong><br/>
              Principal: {img.imagen_principal ? (
                <span style={{ color: 'green' }}>✅ {img.imagen_principal.substring(0, 50)}...</span>
              ) : (
                <span style={{ color: 'red' }}>❌ Sin imagen</span>
              )}<br/>
              Secundaria 1: {img.imagen_secundaria_1 ? (
                <span style={{ color: 'green' }}>✅ {img.imagen_secundaria_1.substring(0, 50)}...</span>
              ) : (
                <span style={{ color: 'red' }}>❌ Sin imagen</span>
              )}<br/>
              Secundaria 2: {img.imagen_secundaria_2 ? (
                <span style={{ color: 'green' }}>✅ {img.imagen_secundaria_2.substring(0, 50)}...</span>
              ) : (
                <span style={{ color: 'red' }}>❌ Sin imagen</span>
              )}<br/>
            </div>
          ))
        ) : (
          <span style={{ color: 'red' }}>❌ No hay registros en producto_imagenes</span>
        )}
      </div>

      <button 
        onClick={cargarDatos}
        style={{
          padding: '10px 20px',
          background: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Recargar Datos
      </button>
    </div>
  )
}

export default DebugProductoImagenes
