import React from 'react'
import { useParams } from 'react-router-dom'
import FormularioProducto from '../../../componentes/admin/ecommerce/PaginaCrearProductosComponentes/FormularioProducto'

/**
 * EditarProducto - Página para editar productos existentes
 * Ahora usa el componente unificado FormularioProducto
 */

const EditarProducto = () => {
  const { slug } = useParams()

  const manejarExito = (producto) => {
    console.log('✅ Producto actualizado exitosamente:', producto)
    // Aquí puedes agregar lógica adicional si es necesaria
  }

  return (
    <FormularioProducto 
      modo="editar"
      slug={slug}
      onSuccess={manejarExito}
    />
  )
}

export default EditarProducto
