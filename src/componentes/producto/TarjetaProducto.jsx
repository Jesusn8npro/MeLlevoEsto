// Componente de tarjeta de producto
export default function TarjetaProducto({ producto }) {
  return (
    <div className="tarjeta-producto">
      {/* Contenido de la tarjeta de producto */}
      <h3>{producto?.nombre || 'Producto'}</h3>
    </div>
  )
}



