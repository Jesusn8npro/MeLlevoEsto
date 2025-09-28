import { Link } from 'react-router-dom'
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react'
import './PaginaNoEncontrada.css'

// Página 404 - No encontrada ultra vendedora
export default function PaginaNoEncontrada() {
  return (
    <div className="pagina-404">
      {/* Hero Section con animación */}
      <div className="hero-404">
        <div className="contenedor-404">
          {/* Animación del 404 */}
          <div className="numero-404">
            <span className="numero-4 numero-animado">4</span>
            <span className="numero-0 numero-animado">
              <div className="emoji-404">😱</div>
            </span>
            <span className="numero-4 numero-animado">4</span>
          </div>
          
          {/* Mensaje principal */}
          <div className="mensaje-404">
            <h1 className="titulo-404">¡Oops! Página no encontrada</h1>
            <p className="subtitulo-404">
              Parece que esta página se fue de compras y no ha vuelto 🛒
            </p>
            <p className="descripcion-404">
              Pero no te preocupes, tenemos miles de productos increíbles esperándote
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="acciones-404">
            <Link to="/" className="boton-principal">
              <Home size={20} />
              <span>Volver al Inicio</span>
            </Link>
            
            <button className="boton-secundario" onClick={() => window.history.back()}>
              <ArrowLeft size={20} />
              <span>Página Anterior</span>
            </button>
          </div>
          
          {/* Sugerencias rápidas */}
          <div className="sugerencias-404">
            <h3>¿Qué tal si pruebas con esto?</h3>
            <div className="grid-sugerencias">
              <Link to="/ofertas" className="sugerencia-card">
                <div className="sugerencia-icono">🔥</div>
                <div className="sugerencia-contenido">
                  <h4>Ofertas Flash</h4>
                  <p>Hasta -80% de descuento</p>
                </div>
              </Link>
              
              <Link to="/electronica" className="sugerencia-card">
                <div className="sugerencia-icono">📱</div>
                <div className="sugerencia-contenido">
                  <h4>Electrónicos</h4>
                  <p>Lo último en tecnología</p>
                </div>
              </Link>
              
              <Link to="/ropa" className="sugerencia-card">
                <div className="sugerencia-icono">👕</div>
                <div className="sugerencia-contenido">
                  <h4>Ropa y Moda</h4>
                  <p>Tendencias actuales</p>
                </div>
              </Link>
              
              <Link to="/hogar" className="sugerencia-card">
                <div className="sugerencia-icono">🏠</div>
                <div className="sugerencia-contenido">
                  <h4>Hogar</h4>
                  <p>Decora tu espacio</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de beneficios */}
      <div className="beneficios-404">
        <div className="contenedor-beneficios">
          <h3>Mientras estás aquí, recuerda que ofrecemos:</h3>
          <div className="grid-beneficios">
            <div className="beneficio-item">
              <div className="beneficio-icono">🚚</div>
              <div className="beneficio-texto">
                <h4>Envío Gratis</h4>
                <p>En compras superiores a $100.000</p>
              </div>
            </div>
            
            <div className="beneficio-item">
              <div className="beneficio-icono">🔄</div>
              <div className="beneficio-texto">
                <h4>Devoluciones Gratis</h4>
                <p>Hasta 30 días después de la compra</p>
              </div>
            </div>
            
            <div className="beneficio-item">
              <div className="beneficio-icono">🛡️</div>
              <div className="beneficio-texto">
                <h4>Compra Segura</h4>
                <p>Protección total en tus pagos</p>
              </div>
            </div>
            
            <div className="beneficio-item">
              <div className="beneficio-icono">⚡</div>
              <div className="beneficio-texto">
                <h4>Ofertas Flash</h4>
                <p>Descuentos increíbles cada día</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
