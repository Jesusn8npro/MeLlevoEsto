import React from 'react'
import TarjetaProductoVendedora from './TarjetaProductoVendedora'

// Componente de tarjeta de producto - Wrapper que usa la versión vendedora
export default function TarjetaProducto({ producto, ...props }) {
  return (
    <TarjetaProductoVendedora 
      producto={producto} 
      {...props}
    />
  )
}

























