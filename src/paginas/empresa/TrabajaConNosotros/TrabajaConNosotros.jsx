import { useState } from 'react'
import { 
  Users, 
  Laptop, 
  TrendingUp, 
  Heart, 
  Zap, 
  Award, 
  Globe,
  Send,
  CheckCircle,
  Shield,
  Clock,
  Coffee,
  Gift,
  Star,
  MessageSquare,
  Mail,
  FileText,
  Download,
  Upload
} from 'lucide-react'
import './TrabajaConNosotros.css'

export default function TrabajaConNosotros() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    experiencia: '',
    motivo: '',
    cv: null
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const ventajas = [
    {
      icono: Globe,
      titulo: '100% Digital y Remoto',
      descripcion: 'Trabaja desde donde quieras, cuando quieras. Flexibilidad total.',
      destacado: true
    },
    {
      icono: TrendingUp,
      titulo: 'Crecimiento Profesional',
      descripcion: 'Desarrolla tu carrera en una empresa que crece exponencialmente.',
      destacado: true
    },
    {
      icono: Heart,
      titulo: 'Ambiente Familiar',
      descripcion: 'Somos un equipo unido que se apoya mutuamente.',
      destacado: false
    },
    {
      icono: Zap,
      titulo: 'Innovación Constante',
      descripcion: 'Trabajamos con las últimas tecnologías y metodologías.',
      destacado: false
    },
    {
      icono: Award,
      titulo: 'Reconocimiento al Talento',
      descripcion: 'Premiamos el esfuerzo y la excelencia en el trabajo.',
      destacado: false
    },
    {
      icono: Coffee,
      titulo: 'Equilibrio Vida-Trabajo',
      descripcion: 'Entendemos que la vida personal es igual de importante.',
      destacado: false
    }
  ]

  const beneficios = [
    {
      icono: Gift,
      titulo: 'Bonos por Rendimiento',
      descripcion: 'Premios mensuales por cumplir y superar objetivos'
    },
    {
      icono: Clock,
      titulo: 'Horarios Flexibles',
      descripcion: 'Adaptamos los horarios a tu estilo de vida'
    },
    {
      icono: Laptop,
      titulo: 'Equipo de Trabajo',
      descripcion: 'Te proporcionamos todo lo necesario para trabajar'
    },
    {
      icono: Star,
      titulo: 'Desarrollo Profesional',
      descripcion: 'Cursos, certificaciones y crecimiento continuo'
    }
  ]

  const areas = [
    {
      titulo: 'Desarrollo Web',
      descripcion: 'Frontend, Backend, Full Stack',
      icono: Laptop,
      color: '#3b82f6'
    },
    {
      titulo: 'Marketing Digital',
      descripcion: 'SEO, SEM, Redes Sociales',
      icono: TrendingUp,
      color: '#10b981'
    },
    {
      titulo: 'Atención al Cliente',
      descripcion: 'Soporte, Ventas, Experiencia',
      icono: MessageSquare,
      color: '#f59e0b'
    },
    {
      titulo: 'Gestión de Proyectos',
      descripcion: 'Coordinación, Planificación',
      icono: Users,
      color: '#8b5cf6'
    },
    {
      titulo: 'Diseño UX/UI',
      descripcion: 'Interfaces, Experiencia de Usuario',
      icono: Heart,
      color: '#ef4444'
    },
    {
      titulo: 'Análisis de Datos',
      descripcion: 'Analytics, Reportes, Insights',
      icono: Award,
      color: '#06b6d4'
    }
  ]

  const testimonios = [
    {
      nombre: 'María González',
      cargo: 'Desarrolladora Frontend',
      testimonio: 'Llevo 8 meses aquí y es increíble. El ambiente es súper colaborativo, aprendo algo nuevo cada día y tengo total flexibilidad para trabajar desde casa.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'
    },
    {
      nombre: 'Carlos Ramírez',
      cargo: 'Especialista en Marketing',
      testimonio: 'La cultura digital de ME LLEVO ESTO es única. Me siento valorado, tengo autonomía para tomar decisiones y veo mi impacto directo en el crecimiento de la empresa.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
    },
    {
      nombre: 'Ana Martínez',
      cargo: 'Coordinadora de Proyectos',
      testimonio: 'Es un lugar donde realmente puedes crecer profesionalmente. El equipo es increíble, los proyectos son desafiantes y siempre hay oportunidades de aprender.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
    }
  ]

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const manejarArchivo = (e) => {
    setFormData({
      ...formData,
      cv: e.target.files[0]
    })
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setEnviando(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setEnviado(true)
    setEnviando(false)
    setFormData({ 
      nombre: '', 
      email: '', 
      telefono: '', 
      experiencia: '', 
      motivo: '', 
      cv: null 
    })
  }

  return (
    <div className="trabaja-page">
      {/* Hero Section */}
      <section className="trabaja-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Users className="hero-badge-icon" />
              <span>ÚNETE AL EQUIPO DIGITAL MÁS VENDEDOR</span>
            </div>
            <h1 className="hero-titulo">
              <span className="hero-destacado">Trabaja con Nosotros</span>
            </h1>
            <p className="hero-subtitulo">
              ¡Únete al equipo digital más vendedor! Somos 100% digitales, remotos, flexibles y siempre en crecimiento.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <Users className="hero-stat-icon" />
                <span>+50</span>
                <span>Colaboradores</span>
              </div>
              <div className="hero-stat">
                <Globe className="hero-stat-icon" />
                <span>100%</span>
                <span>Remoto</span>
              </div>
              <div className="hero-stat">
                <TrendingUp className="hero-stat-icon" />
                <span>+200%</span>
                <span>Crecimiento</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas Section */}
      <section className="ventajas-section">
        <div className="container">
          <h2 className="section-titulo">
            ¿Por qué trabajar en <span className="titulo-destacado">ME LLEVO ESTO</span>?
          </h2>
          <p className="section-subtitulo">
            Somos diferentes porque valoramos el talento, la innovación y el bienestar de nuestro equipo
          </p>
          
          <div className="ventajas-grid">
            {ventajas.map((ventaja, index) => {
              const Icono = ventaja.icono
              return (
                <div key={index} className={`ventaja-card ${ventaja.destacado ? 'destacado' : ''}`}>
                  <div className="ventaja-icono">
                    <Icono className="ventaja-icon" />
                  </div>
                  <h3 className="ventaja-titulo">{ventaja.titulo}</h3>
                  <p className="ventaja-descripcion">{ventaja.descripcion}</p>
                  {ventaja.destacado && (
                    <span className="ventaja-badge">Exclusivo</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="beneficios-section">
        <div className="container">
          <h2 className="section-titulo">
            Beneficios que <span className="titulo-destacado">te encantarán</span>
          </h2>
          
          <div className="beneficios-grid">
            {beneficios.map((beneficio, index) => {
              const Icono = beneficio.icono
              return (
                <div key={index} className="beneficio-card">
                  <Icono className="beneficio-icon" />
                  <h3 className="beneficio-titulo">{beneficio.titulo}</h3>
                  <p className="beneficio-descripcion">{beneficio.descripcion}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Áreas de Trabajo */}
      <section className="areas-section">
        <div className="container">
          <h2 className="section-titulo">
            Áreas donde puedes <span className="titulo-destacado">desarrollarte</span>
          </h2>
          <p className="section-subtitulo">
            Buscamos talento en diferentes áreas. Si no ves tu área, ¡escríbenos igual!
          </p>
          
          <div className="areas-grid">
            {areas.map((area, index) => {
              const Icono = area.icono
              return (
                <div key={index} className="area-card">
                  <div 
                    className="area-icono"
                    style={{ backgroundColor: area.color }}
                  >
                    <Icono className="area-icon" />
                  </div>
                  <h3 className="area-titulo">{area.titulo}</h3>
                  <p className="area-descripcion">{area.descripcion}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonios-section">
        <div className="container">
          <h2 className="section-titulo">
            Lo que dice nuestro <span className="titulo-destacado">equipo</span>
          </h2>
          <p className="section-subtitulo">
            Conoce las experiencias reales de quienes ya forman parte de nuestro equipo
          </p>
          
          <div className="testimonios-grid">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="testimonio-card">
                <div className="testimonio-header">
                  <img src={testimonio.avatar} alt={testimonio.nombre} className="testimonio-avatar" />
                  <div>
                    <h3 className="testimonio-nombre">{testimonio.nombre}</h3>
                    <p className="testimonio-cargo">{testimonio.cargo}</p>
                  </div>
                </div>
                <p className="testimonio-texto">"{testimonio.testimonio}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de Aplicación */}
      <section className="formulario-section">
        <div className="container">
          <div className="formulario-content">
            <div className="formulario-header">
              <h2 className="formulario-titulo">
                ¿Listo para <span className="titulo-destacado">unirte</span>?
              </h2>
              <p className="formulario-subtitulo">
                Completa el formulario y te contactaremos pronto
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
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={manejarCambio}
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="experiencia">Área de Experiencia *</label>
                    <select
                      id="experiencia"
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona tu área</option>
                      <option value="desarrollo">Desarrollo Web</option>
                      <option value="marketing">Marketing Digital</option>
                      <option value="atencion">Atención al Cliente</option>
                      <option value="gestion">Gestión de Proyectos</option>
                      <option value="diseno">Diseño UX/UI</option>
                      <option value="analisis">Análisis de Datos</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="motivo">¿Por qué quieres trabajar con nosotros? *</label>
                    <textarea
                      id="motivo"
                      name="motivo"
                      value={formData.motivo}
                      onChange={manejarCambio}
                      required
                      rows="4"
                      placeholder="Cuéntanos qué te motiva a unirte a nuestro equipo..."
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="cv">CV o LinkedIn (Opcional)</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="cv"
                        name="cv"
                        onChange={manejarArchivo}
                        accept=".pdf,.doc,.docx"
                      />
                      <label htmlFor="cv" className="file-label">
                        <Upload className="upload-icon" />
                        <span>{formData.cv ? formData.cv.name : 'Subir archivo'}</span>
                      </label>
                    </div>
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
                        Enviar Aplicación
                      </>
                    )}
                  </button>
                  
                  <div className="formulario-garantia">
                    <Shield className="garantia-icon" />
                    <span>Tus datos se manejan con absoluta confidencialidad</span>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mensaje-exito">
                <CheckCircle className="exito-icon" />
                <h3>¡Aplicación enviada!</h3>
                <p>Gracias por tu interés. Revisaremos tu perfil y te contactaremos pronto.</p>
                <button 
                  className="btn-secundario"
                  onClick={() => setEnviado(false)}
                >
                  Enviar otra aplicación
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-titulo">
              ¿Tienes dudas sobre el <span className="cta-destacado">proceso</span>?
            </h2>
            <p className="cta-subtitulo">
              Escríbenos y te explicamos todo sobre trabajar con nosotros
            </p>
            <div className="cta-buttons">
              <a href="https://wa.me/573012345678" className="btn-primario">
                <MessageSquare className="btn-icon" />
                Contactar por WhatsApp
              </a>
              <a href="mailto:trabajo@mellevoesto.com" className="btn-secundario">
                <Mail className="btn-icon" />
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}










