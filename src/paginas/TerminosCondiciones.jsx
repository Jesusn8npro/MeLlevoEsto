import { 
  FileText, 
  Shield, 
  CreditCard, 
  RotateCcw, 
  Truck, 
  Users, 
  CheckCircle,
  AlertCircle,
  Heart,
  Zap,
  Globe,
  MessageSquare,
  Mail
} from 'lucide-react'
import './TerminosCondiciones.css'

export default function TerminosCondiciones() {
  const secciones = [
    {
      icono: Heart,
      titulo: 'Introducción',
      contenido: [
        'Bienvenido a ME LLEVO ESTO, tu tienda digital de confianza.',
        'Somos una plataforma 100% digital que conecta a compradores con productos increíbles.',
        'Al usar nuestra plataforma, aceptas estos términos de manera voluntaria y consciente.',
        'Nos comprometemos a ser transparentes y claros en todo momento.'
      ]
    },
    {
      icono: Globe,
      titulo: 'Uso de la Plataforma',
      contenido: [
        'Nuestra plataforma es para uso personal y comercial legítimo.',
        'Debes ser mayor de 18 años o tener autorización de tus padres.',
        'No puedes usar la plataforma para actividades ilegales o fraudulentas.',
        'Nos reservamos el derecho de suspender cuentas que violen estos términos.'
      ]
    },
    {
      icono: CreditCard,
      titulo: 'Compras y Pagos',
      contenido: [
        'Todas nuestras transacciones son digitales, seguras y protegidas.',
        'Aceptamos tarjetas de crédito/débito, transferencias bancarias y PayPal.',
        'Los precios incluyen todos los impuestos aplicables.',
        'Las promociones tienen términos específicos que se comunican claramente.',
        'Tu compra está protegida por ley y nuestras políticas de garantía.'
      ]
    },
    {
      icono: Truck,
      titulo: 'Envíos y Entregas',
      contenido: [
        'Ofrecemos entrega contra pago en Bogotá para mayor comodidad.',
        'Los tiempos de entrega varían según la ubicación y disponibilidad.',
        'Te notificamos el estado de tu pedido en cada paso.',
        'Si no estás disponible, coordinamos una nueva entrega sin costo adicional.',
        'Los productos se entregan en perfecto estado o te reembolsamos.'
      ]
    },
    {
      icono: RotateCcw,
      titulo: 'Devoluciones y Reembolsos',
      contenido: [
        'Tienes derecho a devolución según nuestras políticas de garantía.',
        'Productos defectuosos: devolución completa en 30 días.',
        'Cambio de opinión: devolución en 7 días si el producto está sin usar.',
        'Los reembolsos se procesan en 5-10 días hábiles.',
        'Cualquier duda sobre devoluciones, contáctanos inmediatamente.'
      ]
    },
    {
      icono: Shield,
      titulo: 'Protección de Datos',
      contenido: [
        'Tus datos nunca se comparten sin tu consentimiento explícito.',
        'Usamos encriptación de nivel bancario para proteger tu información.',
        'Cumplimos con todas las leyes de protección de datos de Colombia.',
        'Puedes solicitar la eliminación de tus datos en cualquier momento.',
        'Tu privacidad es nuestra prioridad absoluta.'
      ]
    },
    {
      icono: Users,
      titulo: 'Cuentas de Usuario',
      contenido: [
        'Tu cuenta es personal e intransferible.',
        'Debes mantener tu información actualizada y veraz.',
        'Eres responsable de la seguridad de tu contraseña.',
        'Puedes cerrar tu cuenta cuando quieras sin penalizaciones.',
        'Nos reservamos el derecho de verificar la identidad cuando sea necesario.'
      ]
    },
    {
      icono: Zap,
      titulo: 'Servicio al Cliente',
      contenido: [
        'Ofrecemos atención 24/7 por WhatsApp y email.',
        'Respondemos consultas en menos de 2 horas.',
        'Nuestro equipo está capacitado para resolver cualquier duda.',
        'Si no estás satisfecho, trabajamos hasta solucionarlo.',
        'Tu satisfacción es nuestro compromiso principal.'
      ]
    }
  ]

  const garantias = [
    {
      icono: CheckCircle,
      titulo: 'Compra Protegida',
      descripcion: 'Tu compra está protegida por ley y nuestras políticas'
    },
    {
      icono: Shield,
      titulo: 'Datos Seguros',
      descripcion: 'Tus datos están protegidos con tecnología de nivel bancario'
    },
    {
      icono: Heart,
      titulo: 'Satisfacción Garantizada',
      descripcion: 'Trabajamos hasta que estés 100% satisfecho'
    }
  ]

  return (
    <div className="terminos-page">
      {/* Hero Section */}
      <section className="terminos-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <FileText className="hero-badge-icon" />
              <span>TRANSPARENCIA TOTAL</span>
            </div>
            <h1 className="hero-titulo">
              <span className="hero-destacado">Términos y Condiciones</span>
            </h1>
            <p className="hero-subtitulo">
              Cero letra chiquita, 100% claro y amigable. Te explicamos todo de manera transparente.
            </p>
            <div className="hero-garantias">
              {garantias.map((garantia, index) => {
                const Icono = garantia.icono
                return (
                  <div key={index} className="hero-garantia">
                    <Icono className="hero-garantia-icon" />
                    <span>{garantia.titulo}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="terminos-content">
        <div className="container">
          <div className="terminos-intro">
            <div className="intro-card">
              <AlertCircle className="intro-icon" />
              <h2>Importante: Lee esto antes de comprar</h2>
              <p>
                Estos términos son tu garantía de que trabajamos de manera justa y transparente. 
                Si algo no te queda claro, contáctanos y te lo explicamos mejor.
              </p>
            </div>
          </div>

          <div className="secciones-grid">
            {secciones.map((seccion, index) => {
              const Icono = seccion.icono
              return (
                <div key={index} className="seccion-card">
                  <div className="seccion-header">
                    <div className="seccion-icono">
                      <Icono className="seccion-icon" />
                    </div>
                    <h3 className="seccion-titulo">{seccion.titulo}</h3>
                  </div>
                  <div className="seccion-contenido">
                    <ul className="seccion-lista">
                      {seccion.contenido.map((item, itemIndex) => (
                        <li key={itemIndex} className="seccion-item">
                          <CheckCircle className="item-icon" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Información Adicional */}
      <section className="info-adicional">
        <div className="container">
          <div className="info-content">
            <h2 className="info-titulo">
              ¿Algo no te queda claro?
            </h2>
            <p className="info-subtitulo">
              Estamos aquí para explicarte cualquier punto de estos términos
            </p>
            
            <div className="info-cards">
              <div className="info-card">
                <MessageSquare className="info-card-icon" />
                <h3>Contacto Directo</h3>
                <p>Escríbenos por WhatsApp o email para aclarar cualquier duda</p>
                <a href="https://wa.me/573012345678" className="info-link">
                  Contactar por WhatsApp
                </a>
              </div>
              
              <div className="info-card">
                <Mail className="info-card-icon" />
                <h3>Email Legal</h3>
                <p>Para consultas específicas sobre términos legales</p>
                <a href="mailto:legal@mellevoesto.com" className="info-link">
                  legal@mellevoesto.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cambios y Actualizaciones */}
      <section className="cambios-section">
        <div className="container">
          <div className="cambios-content">
            <h2 className="cambios-titulo">
              Cambios en estos Términos
            </h2>
            <div className="cambios-info">
              <div className="cambio-item">
                <CheckCircle className="cambio-icon" />
                <div>
                  <h3>Actualizaciones</h3>
                  <p>Nos reservamos el derecho de actualizar estos términos cuando sea necesario</p>
                </div>
              </div>
              
              <div className="cambio-item">
                <AlertCircle className="cambio-icon" />
                <div>
                  <h3>Notificación</h3>
                  <p>Siempre te avisaremos con anticipación sobre cualquier cambio importante</p>
                </div>
              </div>
              
              <div className="cambio-item">
                <Heart className="cambio-icon" />
                <div>
                  <h3>Tu Bienestar</h3>
                  <p>Cualquier cambio será siempre en beneficio de tu experiencia de compra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-titulo">
              ¿Listo para comprar con <span className="cta-destacado">confianza total</span>?
            </h2>
            <p className="cta-subtitulo">
              Estos términos son tu garantía de que trabajamos de manera justa y transparente
            </p>
            <div className="cta-buttons">
              <a href="/productos" className="btn-primario">
                <Heart className="btn-icon" />
                Explorar Productos
              </a>
              <a href="/contacto" className="btn-secundario">
                <MessageSquare className="btn-icon" />
                Hacer Pregunta
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
