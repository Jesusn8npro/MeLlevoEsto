import React from 'react'
import FormularioProducto from '../../../componentes/admin/FormularioProducto'

/**
 * AgregarProducto - Página para crear nuevos productos
 * Ahora usa el componente unificado FormularioProducto
 */

const AgregarProducto = () => {
  const manejarExito = (producto) => {
    console.log('✅ Producto creado exitosamente:', producto)
    // Aquí puedes agregar lógica adicional si es necesaria
  }

  return (
    <FormularioProducto 
      modo="crear"
      onSuccess={manejarExito}
    />
  )
}

export default AgregarProducto
