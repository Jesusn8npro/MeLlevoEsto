import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Shield, 
  Clock,
  MapPin,
  Users,
  Heart,
  Zap
} from 'lucide-react'
import './Contacto.css'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tema: '',
    mensaje: ''
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const temas = [
    'Consulta General',
    'Soporte Técnico',
    'Información de Productos',
    'Problema con Pedido',
    'Devolución/Reembolso',
    'Sugerencia/Feedback',
    'Trabajar con Nosotros',
    'Otro'
  ]

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setEnviando(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setEnviado(true)
    setEnviando(false)
    setFormData({ nombre: '', email: '', tema: '', mensaje: '' })
  }

  const contactos = [
    {
      icono: Mail,
      titulo: 'Email',
      info: 'hola@mellevoesto.com',
      descripcion: 'Respuesta en menos de 2 horas',
      accion: 'mailto:hola@mellevoesto.com'
    },
    {
      icono: MessageSquare,
      titulo: 'WhatsApp',
      info: '+57 301 234 5678',
      descripcion: 'Atención inmediata 24/7',
      accion: 'https://wa.me/573012345678'
    },
    {
      icono: Phone,
      titulo: 'Teléfono',
      info: '+57 1 234 5678',
      descripcion: 'Lunes a Viernes 8AM - 6PM',
      accion: 'tel:+5712345678'
    }
  ]

  const beneficios = [
    {
      icono: Zap,
      titulo: 'Respuesta Rápida',
      descripcion: 'Respondemos en menos de 2 horas'
    },
    {
      icono: Shield,
      titulo: 'Datos Protegidos',
      descripcion: 'Tus datos están 100% seguros'
    },
    {
      icono: Heart,
      titulo: 'Atención Personalizada',
      descripcion: 'Te ayudamos como si fuéramos familia'
    }
  ]

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <section className="contacto-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <MessageSquare className="hero-badge-icon" />
              <span>ESTAMOS PARA AYUDARTE</span>
            </div>
            <h1 className="hero-titulo">
              ¡<span className="hero-destacado">Contáctanos</span>! 
              <br />Estamos para ayudarte
            </h1>
            <p className="hero-subtitulo">
              Tu consulta es nuestra prioridad. Respondemos rápido y siempre con la mejor actitud.
            </p>
            <div className="hero-beneficios">
              {beneficios.map((beneficio, index) => {
                const Icono = beneficio.icono
                return (
                  <div key={index} className="hero-beneficio">
                    <Icono className="hero-beneficio-icon" />
                    <span>{beneficio.titulo}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="formulario-section">
        <div className="container">
          <div className="formulario-content">
            <div className="formulario-header">
              <h2 className="formulario-titulo">
                Cuéntanos <span className="titulo-destacado">¿En qué te ayudamos?</span>
              </h2>
              <p className="formulario-subtitulo">
                Completa el formulario y te responderemos súper rápido
              </p>
            </div>

            {!enviado ? (
              <form className="formulario" onSubmit={manejarEnvio}>
                <div className="formulario-grid">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={manejarCambio}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={manejarCambio}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tema">Tema de tu consulta *</label>
                    <select
                      id="tema"
                      name="tema"
                      value={formData.tema}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un tema</option>
                      {temas.map((tema, index) => (
                        <option key={index} value={tema}>{tema}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="mensaje">Mensaje *</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={manejarCambio}
                      required
                      rows="6"
                      placeholder="Cuéntanos en detalle cómo podemos ayudarte..."
                    />
                  </div>
                </div>

                <div className="formulario-actions">
                  <button 
                    type="submit" 
                    className="btn-enviar"
                    disabled={enviando}
                  >
                    {enviando ? (
                      <>
                        <div className="spinner"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="btn-icon" />
                        Enviar Consulta
                      </>
                    )}
                  </button>
                  
                  <div className="formulario-garantia">
                    <Shield className="garantia-icon" />
                    <span>Tus datos están protegidos y nunca se comparten</span>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mensaje-exito">
                <CheckCircle className="exito-icon" />
                <h3>¡Gracias por escribirnos!</h3>
                <p>Te responderemos en breve. Revisa tu email o WhatsApp.</p>
                <button 
                  className="btn-secundario"
                  onClick={() => setEnviado(false)}
                >
                  Enviar otra consulta
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="contacto-info-section">
        <div className="container">
          <h2 className="section-titulo">
            Otras formas de <span className="titulo-destacado">contactarnos</span>
          </h2>
          
          <div className="contactos-grid">
            {contactos.map((contacto, index) => {
              const Icono = contacto.icono
              return (
                <a 
                  key={index} 
                  href={contacto.accion}
                  className="contacto-card"
                >
                  <div className="contacto-icono">
                    <Icono className="contacto-icon" />
                  </div>
                  <h3 className="contacto-titulo">{contacto.titulo}</h3>
                  <p className="contacto-info">{contacto.info}</p>
                  <p className="contacto-descripcion">{contacto.descripcion}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Horarios y Ubicación */}
      <section className="horarios-section">
        <div className="container">
          <div className="horarios-content">
            <div className="horarios-info">
              <Clock className="horarios-icon" />
              <h3>Horarios de Atención</h3>
              <div className="horarios-lista">
                <div className="horario-item">
                  <span className="horario-dia">WhatsApp y Email:</span>
                  <span className="horario-hora">24/7 - Siempre disponibles</span>
                </div>
                <div className="horario-item">
                  <span className="horario-dia">Teléfono:</span>
                  <span className="horario-hora">Lunes a Viernes 8AM - 6PM</span>
                </div>
              </div>
            </div>
            
            <div className="ubicacion-info">
              <MapPin className="ubicacion-icon" />
              <h3>Ubicación</h3>
              <p>Somos 100% digitales</p>
              <p>Atendemos desde Bogotá, Colombia</p>
              <p>Servicio a toda Colombia</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-titulo">
              ¿Tienes una <span className="cta-destacado">emergencia</span>?
            </h2>
            <p className="cta-subtitulo">
              Para consultas urgentes, escríbenos por WhatsApp
            </p>
            <a 
              href="https://wa.me/573012345678" 
              className="btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="btn-icon" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}


