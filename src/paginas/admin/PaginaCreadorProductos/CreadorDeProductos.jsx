import React from 'react'
import FormularioProducto from '../../../componentes/admin/ecommerce/PaginaCrearProductosComponentes/FormularioProducto'

// Página: Creador de productos
// Usa el componente unificado FormularioProducto en modo "crear"
const CreadorDeProductos = () => {
  const manejarExito = (producto) => {
    console.log('✅ Producto creado exitosamente:', producto)
  }

  return (
    <FormularioProducto 
      modo="crear"
      onSuccess={manejarExito}
    />
  )
}

export default CreadorDeProductos