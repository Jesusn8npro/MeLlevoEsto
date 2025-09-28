// Componente de item del carrito
export default function ItemCarrito({ item }) {
  return (
    <div className="item-carrito">
      {/* Contenido del item del carrito */}
      <h4>{item?.productos?.nombre || 'Producto'}</h4>
    </div>
  )
}






















