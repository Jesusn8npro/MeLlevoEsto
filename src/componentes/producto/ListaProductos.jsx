// Componente de lista de productos
export default function ListaProductos({ productos = [] }) {
  return (
    <div className="lista-productos">
      {/* Contenido de la lista de productos */}
      <h2>Lista de Productos</h2>
      {productos.length === 0 && <p>No hay productos disponibles</p>}
    </div>
  )
}




























