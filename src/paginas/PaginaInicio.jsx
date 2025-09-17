import './PaginaInicio.css'

// Página de inicio - Landing ultra vendedora
export default function PaginaInicio() {
  return (
    <div className="pagina-inicio">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-contenido">
          <h1 className="hero-titulo">
            🛒 ¡Bienvenido a ME LLEVO ESTO! 🛒
          </h1>
          
          <p className="hero-subtitulo">
            La tienda más vendedora del mercado
          </p>

          <div className="oferta-flash">
            <h2 className="oferta-titulo">🔥 OFERTAS FLASH 🔥</h2>
            <p className="oferta-descripcion">
              ¡Descuentos hasta -80% por tiempo limitado!
            </p>
            <div className="contador-tiempo">
              <div className="tiempo-item">
                <span className="tiempo-numero">23</span>
                <span className="tiempo-label">Horas</span>
              </div>
              <div className="tiempo-separador">:</div>
              <div className="tiempo-item">
                <span className="tiempo-numero">59</span>
                <span className="tiempo-label">Min</span>
              </div>
              <div className="tiempo-separador">:</div>
              <div className="tiempo-item">
                <span className="tiempo-numero">45</span>
                <span className="tiempo-label">Seg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="categorias-section">
        <div className="contenedor-categorias">
          <h2 className="categorias-titulo">Explora nuestras categorías</h2>
          
          <div className="categorias-grid">
            <div className="categoria-card categoria-destacada">
              <div className="categoria-icono">📱</div>
              <h3 className="categoria-nombre">Electrónicos</h3>
              <p className="categoria-descripcion">Los mejores precios</p>
              <span className="categoria-badge">HOT</span>
            </div>
            
            <div className="categoria-card">
              <div className="categoria-icono">👕</div>
              <h3 className="categoria-nombre">Ropa y Moda</h3>
              <p className="categoria-descripcion">Tendencias actuales</p>
            </div>
            
            <div className="categoria-card">
              <div className="categoria-icono">🚗</div>
              <h3 className="categoria-nombre">Vehículos</h3>
              <p className="categoria-descripcion">Encuentra tu auto</p>
              <span className="categoria-badge nuevo">NUEVO</span>
            </div>
            
            <div className="categoria-card">
              <div className="categoria-icono">🏠</div>
              <h3 className="categoria-nombre">Hogar</h3>
              <p className="categoria-descripcion">Decora tu espacio</p>
            </div>

            <div className="categoria-card">
              <div className="categoria-icono">⚽</div>
              <h3 className="categoria-nombre">Deportes</h3>
              <p className="categoria-descripcion">Mantente activo</p>
            </div>

            <div className="categoria-card">
              <div className="categoria-icono">💄</div>
              <h3 className="categoria-nombre">Belleza</h3>
              <p className="categoria-descripcion">Luce radiante</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="beneficios-section">
        <div className="contenedor-beneficios">
          <div className="beneficio-item">
            <div className="beneficio-icono">🚚</div>
            <div className="beneficio-contenido">
              <h3>Envío Gratis</h3>
              <p>En compras superiores a $100.000</p>
            </div>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">🔄</div>
            <div className="beneficio-contenido">
              <h3>Devoluciones Gratis</h3>
              <p>Hasta 30 días después de la compra</p>
            </div>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">🛡️</div>
            <div className="beneficio-contenido">
              <h3>Compra Segura</h3>
              <p>Protección total en tus pagos</p>
            </div>
          </div>

          <div className="beneficio-item">
            <div className="beneficio-icono">📞</div>
            <div className="beneficio-contenido">
              <h3>Soporte 24/7</h3>
              <p>Atención al cliente siempre disponible</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
