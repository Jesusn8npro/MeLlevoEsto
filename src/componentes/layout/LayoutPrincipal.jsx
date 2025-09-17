import HeaderPrincipal from './HeaderPrincipal'

// Layout principal de la aplicación
export default function LayoutPrincipal({ children }) {
  return (
    <div className="layout-principal">
      {/* Header principal ultra vendedor */}
      <HeaderPrincipal />

      {/* Contenido principal */}
      <main className="contenido-principal">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        {/* Contenido del footer */}
      </footer>

      {/* Carrito flotante */}
      <div className="carrito-flotante">
        {/* Contenido del carrito flotante */}
      </div>
    </div>
  )
}
