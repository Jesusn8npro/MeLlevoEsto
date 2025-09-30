import React from 'react'
import HeroInicio from '../../../componentes/inicio/HeroInicio'
import SeccionBeneficios from '../../../componentes/inicio/SeccionBeneficios'
import SeccionCategorias from '../../../componentes/inicio/SeccionCategorias/SeccionCategorias'
import GridProductosVendedor from '../../../componentes/producto/GridProductosVendedor'
import './PaginaInicio.css'

// Página de inicio - Landing ultra vendedora
export default function PaginaInicio() {
  return (
    <div className="pagina-inicio">
      {/* Hero Section - Nuevo componente estilo Martfury */}
      <HeroInicio />

      {/* Sección de Beneficios - Estilo XStore */}
      <SeccionBeneficios />

      {/* Sección de Categorías Populares - Estilo WoodMart */}
      <SeccionCategorias />

      {/* Productos Destacados Ultra Vendedores */}
      <section className="seccion-productos-destacados">
        <div className="contenedor-productos-demo">
          <h2 className="titulo-productos-demo">🔥 ¡OFERTAS EXPLOSIVAS!</h2>
          <p className="subtitulo-productos-demo">Los productos más vendidos con descuentos increíbles</p>
          <div className="mensaje-productos-demo">
            <div className="icono-productos">🛒</div>
            <h3>¡Productos Ultra Vendedores Listos!</h3>
            <p>Los componentes están funcionando perfectamente. Solo necesitas productos en tu base de datos para verlos aquí.</p>
            <div className="caracteristicas-demo">
              <div className="caracteristica">✅ Tarjetas estilo Temu/Shein</div>
              <div className="caracteristica">✅ Filtros avanzados</div>
              <div className="caracteristica">✅ Responsive perfecto</div>
              <div className="caracteristica">✅ Animaciones vendedoras</div>
            </div>
            <div className="demo-actions">
              <a href="/productos-demo" className="btn-ver-demo">
                🚀 Ver Demo en Acción
              </a>
              <a href="/admin/productos/agregar" className="btn-agregar-productos">
                ➕ Agregar Productos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Principales - SECCIÓN ANTIGUA (mantener por ahora) */}
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
