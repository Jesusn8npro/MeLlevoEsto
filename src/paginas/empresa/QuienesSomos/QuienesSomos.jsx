import { Phone, Mail, MapPin, Users, Award, Heart } from 'lucide-react'
import './QuienesSomos.css'

export default function QuienesSomos() {
  const valores = [
    {
      icono: Users,
      titulo: 'Compromiso',
      descripcion: 'Nos dedicamos a cada cliente con atención personalizada y servicio excepcional.'
    },
    {
      icono: Award,
      titulo: 'Calidad',
      descripcion: 'Seleccionamos cuidadosamente cada producto para garantizar la mejor experiencia.'
    },
    {
      icono: Heart,
      titulo: 'Pasión',
      descripcion: 'Amamos lo que hacemos y trabajamos cada día para superar expectativas.'
    }
  ]

  const equipo = [
    {
      nombre: 'Equipo Fundador',
      rol: 'Visión y Estrategia',
      descripcion: 'Profesionales con años de experiencia en comercio digital y atención al cliente.'
    },
    {
      nombre: 'Equipo de Ventas',
      rol: 'Atención Personalizada',
      descripcion: 'Especialistas comprometidos con encontrar la mejor solución para cada cliente.'
    },
    {
      nombre: 'Equipo de Soporte',
      rol: 'Soporte 24/7',
      descripcion: 'Siempre disponibles para resolver cualquier duda o inquietud de forma rápida.'
    }
  ]

  return (
    <div className="quienes-minimal">
      <div className="quienes-container">
        {/* Hero Section */}
        <section className="quienes-hero">
          <div className="quienes-hero-content">
            <h1 className="quienes-title">
              Sobre <span className="quienes-highlight">Nosotros</span>
            </h1>
            <p className="quienes-subtitle">
              En Me Llevo Esto, conectamos personas con productos de calidad, 
              brindando un servicio excepcional y experiencias memorables.
            </p>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="quienes-mision-vision">
          <div className="mision-vision-grid">
            <div className="mision-card">
              <h2 className="section-title">Nuestra Misión</h2>
              <p className="section-text">
                Facilitar el acceso a productos de calidad con un servicio personalizado, 
                rápido y confiable, creando valor para nuestros clientes y comunidad.
              </p>
            </div>
            <div className="vision-card">
              <h2 className="section-title">Nuestra Visión</h2>
              <p className="section-text">
                Ser la plataforma de comercio preferida en Colombia, reconocida por 
                nuestra excelencia en servicio y compromiso con la satisfacción del cliente.
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="quienes-valores">
          <div className="section-header">
            <h2 className="section-title">Nuestros Valores</h2>
            <p className="section-subtitle">Los principios que guían cada decisión</p>
          </div>
          <div className="valores-grid">
            {valores.map((valor, index) => {
              const Icon = valor.icono
              return (
                <div key={index} className="valor-card">
                  <div className="valor-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="valor-title">{valor.titulo}</h3>
                  <p className="valor-description">{valor.descripcion}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Equipo */}
        <section className="quienes-equipo">
          <div className="section-header">
            <h2 className="section-title">Nuestro Equipo</h2>
            <p className="section-subtitle">Profesionales dedicados a tu satisfacción</p>
          </div>
          <div className="equipo-grid">
            {equipo.map((miembro, index) => (
              <div key={index} className="equipo-card">
                <div className="equipo-header">
                  <h3 className="equipo-nombre">{miembro.nombre}</h3>
                  <p className="equipo-rol">{miembro.rol}</p>
                </div>
                <p className="equipo-descripcion">{miembro.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section className="quienes-contacto">
          <div className="contacto-card">
            <h2 className="contacto-title">¿Listo para comenzar?</h2>
            <p className="contacto-text">
              Estamos aquí para ayudarte. Contáctanos y descubre cómo podemos 
              hacer tu experiencia de compra excepcional.
            </p>
            <div className="contacto-info">
              <div className="contacto-item">
                <Phone size={20} />
                <span>WhatsApp: +57 321 489 2176</span>
              </div>
              <div className="contacto-item">
                <Mail size={20} />
                <span>info@mellevolesto.com</span>
              </div>
              <div className="contacto-item">
                <MapPin size={20} />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
            <a 
              href="https://wa.me/573214892176" 
              className="whatsapp-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={20} />
              Contactar por WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}