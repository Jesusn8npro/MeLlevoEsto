import {
  Truck,
  Shield,
  Star,
  Users,
  Zap,
  Heart,
  Gift,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  Crown,
  Rocket
} from 'lucide-react'
import './QuienesSomos.css'

export default function QuienesSomos() {
  const beneficios = [
    {
      icono: Truck,
      titulo: 'Entrega Contra Pago',
      descripcion: 'En Bogotá pagas cuando recibes tu pedido. Sin riesgos, sin complicaciones.',
      destacado: true
    },
    {
      icono: Clock,
      titulo: 'Atención 24/7',
      descripcion: 'Nuestro equipo está disponible las 24 horas para resolver cualquier duda.',
      destacado: true
    },
    {
      icono: Zap,
      titulo: 'Respuesta Rápida',
      descripcion: 'Respondemos en minutos, no en días. Tu tiempo es valioso.',
      destacado: true
    },
    {
      icono: Shield,
      titulo: 'Compra Segura',
      descripcion: 'Protegemos tus datos y garantizamos productos auténticos.',
      destacado: false
    },
    {
      icono: Gift,
      titulo: 'Productos Innovadores',
      descripcion: 'Las últimas tendencias y exclusividades, solo aquí.',
      destacado: false
    },
    {
      icono: Award,
      titulo: 'Calidad Premium',
      descripcion: 'Control de calidad en cada producto antes de llegar a ti.',
      destacado: false
    }
  ]

  const categorias = [
    { nombre: 'Electrónicos', icono: '📱', productos: '500+' },
    { nombre: 'Ropa y Moda', icono: '👕', productos: '300+' },
    { nombre: 'Vehículos', icono: '🚗', productos: '200+' },
    { nombre: 'Repuestos', icono: '🔧', productos: '150+' },
    { nombre: 'Hogar', icono: '🏠', productos: '400+' },
    { nombre: 'Deportes', icono: '⚽', productos: '100+' }
  ]

  const testimonios = [
    {
      nombre: 'María González',
      ubicacion: 'Bogotá',
      calificacion: 5,
      comentario: '¡Increíble servicio! Compré mi iPhone y llegó al día siguiente. El pago contra entrega me dio mucha confianza.',
      producto: 'iPhone 15 Pro'
    },
    {
      nombre: 'Carlos Ramírez',
      ubicacion: 'Medellín',
      calificacion: 5,
      comentario: 'La atención 24/7 es genial. Resolvieron mi duda a las 2 AM y mi pedido llegó perfecto.',
      producto: 'Samsung Galaxy S24'
    },
    {
      nombre: 'Ana Martínez',
      ubicacion: 'Cali',
      calificacion: 5,
      comentario: 'Productos únicos que no encuentro en otras tiendas. La calidad es excelente y los precios justos.',
      producto: 'Ropa Deportiva Nike'
    }
  ]

  const estadisticas = [
    { numero: '10K+', label: 'Clientes Felices', icono: Users },
    { numero: '50K+', label: 'Productos Entregados', icono: Truck },
    { numero: '4.9/5', label: 'Calificación Promedio', icono: Star },
    { numero: '24/7', label: 'Soporte Disponible', icono: Clock }
  ]

  return (
    <div className="qs-root">
      {/* Hero Section */}
      <section className="qs-hero">
        <div className="qs-hero-bg"></div>
        <div className="qs-hero-container">
          <div className="qs-hero-info">
            <div className="qs-hero-badge">
              <Crown />
              <span>#1 Marketplace de Colombia</span>
            </div>
            <h1>
              <span>Somos</span>
              <span className="qs-hero-brand"> ME LLEVO ESTO</span>
            </h1>
            <p>
              Tu marketplace digital donde encuentras TODO lo que necesitas, con entrega contra pago en Bogotá y atención 24/7.
            </p>
            <div className="qs-hero-stats">
              {estadisticas.map((stat, i) => {
                const Icon = stat.icono
                return (
                  <div className="qs-stat-card" key={i}>
                    <div className="qs-stat-icon"><Icon /></div>
                    <div className="qs-stat-num">{stat.numero}</div>
                    <div className="qs-stat-label">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="qs-hero-imgbox">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
              alt="Equipo ME LLEVO ESTO"
              className="qs-hero-img"
            />
            <div className="qs-hero-imgbadge">
              <Sparkles />
              <span>Desde 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="qs-beneficios">
        <div className="qs-section-title">
          <h2>
            ¿Por qué elegir <span className="qs-highlight">ME LLEVO ESTO</span>?
          </h2>
          <p>
            Diferentes porque nos importas tú, no solo la venta.
          </p>
        </div>
        <div className="qs-beneficios-grid">
          {beneficios.map((b, i) => {
            const Icon = b.icono
            return (
              <div className={`qs-beneficio-card${b.destacado ? " destacado" : ""}`} key={i}>
                <div className="qs-beneficio-icon"><Icon /></div>
                <div className="qs-beneficio-text">
                  <h3>{b.titulo}</h3>
                  <p>{b.descripcion}</p>
                </div>
                {b.destacado && (
                  <span className="qs-beneficio-badge"><Rocket size={18} /> EXCLUSIVO</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Categorías */}
      <section className="qs-categorias">
        <div className="qs-section-title">
          <h2>
            <span className="qs-highlight">TODO</span> lo que necesitas
          </h2>
          <p>
            Electrónicos, moda, hogar, repuestos y mucho más.
          </p>
        </div>
        <div className="qs-categorias-grid">
          {categorias.map((cat, i) => (
            <div className="qs-categoria-card" key={i}>
              <div className="qs-categoria-icon">{cat.icono}</div>
              <div className="qs-categoria-title">{cat.nombre}</div>
              <div className="qs-categoria-count">{cat.productos} productos</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="qs-testimonios">
        <div className="qs-section-title qs-test-titulo">
          <h2>
            Lo que dicen nuestros <span className="qs-highlight">clientes</span>
          </h2>
          <p>
            Miles ya confían en nosotros. ¿Y tú?
          </p>
        </div>
        <div className="qs-testimonios-grid">
          {testimonios.map((t, i) => (
            <div className="qs-testimonio-card" key={i}>
              <div className="qs-testimonio-info">
                <div className="qs-testimonio-avatar">
                  <img
                    src={`https://randomuser.me/api/portraits/lego/${i+2}.jpg`}
                    alt={t.nombre}
                  />
                </div>
                <div>
                  <div className="qs-testimonio-nombre">{t.nombre}</div>
                  <div className="qs-testimonio-ubicacion">{t.ubicacion}</div>
                  <div className="qs-testimonio-stars">
                    {[...Array(t.calificacion)].map((_, s) => <Star key={s} size={16} />)}
                  </div>
                </div>
              </div>
              <div className="qs-testimonio-coment">"{t.comentario}"</div>
              <div className="qs-testimonio-prod">Compró: <span>{t.producto}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="qs-cta">
        <div className="qs-cta-content">
          <h2>
            ¿Listo para vivir la experiencia <span className="qs-highlight">ME LLEVO ESTO</span>?
          </h2>
          <p>
            Únete a miles que ya confían en nosotros. ¡Compra fácil, seguro y rápido!
          </p>
          <div className="qs-cta-buttons">
            <button className="qs-btn qs-btn-primary">
              <Heart size={20} />
              Explorar Productos
            </button>
            <button className="qs-btn qs-btn-secondary">
              <Shield size={20} />
              Atención Personalizada
            </button>
          </div>
          <div className="qs-cta-garantia">
            <Shield size={24} />
            <span>Compra 100% segura • Pago contra entrega en Bogotá</span>
          </div>
        </div>
      </section>
    </div>
  )
}