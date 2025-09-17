import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  UserCheck, 
  Trash2, 
  Download,
  CheckCircle,
  AlertCircle,
  Heart,
  Zap,
  Globe,
  MessageSquare,
  Mail,
  FileText
} from 'lucide-react'
import './PoliticaPrivacidad.css'

export default function PoliticaPrivacidad() {
  const secciones = [
    {
      icono: Eye,
      titulo: 'Qué datos recopilamos',
      contenido: [
        'Información personal: nombre, email, teléfono cuando te registras.',
        'Datos de compra: dirección de entrega, método de pago (encriptado).',
        'Información de navegación: páginas visitadas, tiempo en sitio (anónimo).',
        'Comunicaciones: mensajes que nos envías por WhatsApp, email o formularios.',
        'Nunca recopilamos datos sensibles como contraseñas completas o información bancaria.'
      ]
    },
    {
      icono: Database,
      titulo: 'Cómo usamos tus datos',
      contenido: [
        'Solo para mejorar tu experiencia de compra y nuestro servicio.',
        'Para procesar tus pedidos y coordinar entregas.',
        'Para enviarte actualizaciones sobre tus compras (no spam).',
        'Para responder tus consultas y brindarte soporte.',
        'Para mejorar nuestros productos basándonos en tus preferencias.',
        'Nunca vendemos ni compartimos tus datos con terceros sin tu consentimiento.'
      ]
    },
    {
      icono: Lock,
      titulo: 'Cómo protegemos tus datos',
      contenido: [
        'Usamos encriptación de nivel bancario (SSL/TLS) en toda la plataforma.',
        'Tus datos se almacenan en servidores seguros con acceso restringido.',
        'Implementamos medidas de seguridad físicas y digitales.',
        'Nuestro equipo recibe capacitación constante en protección de datos.',
        'Realizamos auditorías de seguridad regulares.',
        'Cumplimos con todas las leyes de protección de datos de Colombia.'
      ]
    },
    {
      icono: UserCheck,
      titulo: 'Tus derechos',
      contenido: [
        'Puedes acceder a todos los datos que tenemos sobre ti.',
        'Puedes corregir información incorrecta o desactualizada.',
        'Puedes solicitar la eliminación completa de tus datos.',
        'Puedes retirar tu consentimiento en cualquier momento.',
        'Puedes solicitar una copia de tus datos en formato legible.',
        'Puedes oponerte al procesamiento de tus datos para marketing.'
      ]
    },
    {
      icono: Globe,
      titulo: 'Cookies y tecnologías similares',
      contenido: [
        'Usamos cookies esenciales para el funcionamiento del sitio.',
        'Cookies de análisis para entender cómo usas nuestra plataforma.',
        'Puedes desactivar las cookies en tu navegador si lo prefieres.',
        'Algunas funciones pueden no estar disponibles sin cookies.',
        'No usamos cookies para rastrearte fuera de nuestra plataforma.',
        'Todas las cookies tienen propósitos legítimos y transparentes.'
      ]
    },
    {
      icono: Zap,
      titulo: 'Comunicaciones',
      contenido: [
        'Te enviamos emails solo sobre tus pedidos y servicios.',
        'Puedes recibir ofertas especiales si te suscribes (opcional).',
        'WhatsApp solo para soporte y actualizaciones de pedidos.',
        'Puedes darte de baja de cualquier comunicación en cualquier momento.',
        'Nunca compartimos tu información de contacto con otros.',
        'Respetamos tu preferencia de comunicación.'
      ]
    }
  ]

  const garantias = [
    {
      icono: Shield,
      titulo: 'Tu Privacidad es Nuestra Prioridad',
      descripcion: 'Protegemos tus datos como si fueran nuestros'
    },
    {
      icono: Lock,
      titulo: 'Encriptación de Nivel Bancario',
      descripcion: 'Tus datos están protegidos con la mejor tecnología'
    },
    {
      icono: Heart,
      titulo: 'Transparencia Total',
      descripcion: 'Te explicamos todo de manera clara y honesta'
    }
  ]

  const derechos = [
    {
      icono: Eye,
      titulo: 'Acceso',
      descripcion: 'Ver qué datos tenemos sobre ti'
    },
    {
      icono: UserCheck,
      titulo: 'Rectificación',
      descripcion: 'Corregir información incorrecta'
    },
    {
      icono: Trash2,
      titulo: 'Eliminación',
      descripcion: 'Borrar tus datos cuando quieras'
    },
    {
      icono: Download,
      titulo: 'Portabilidad',
      descripcion: 'Obtener una copia de tus datos'
    }
  ]

  return (
    <div className="privacidad-page">
      {/* Hero Section */}
      <section className="privacidad-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="hero-badge-icon" />
              <span>TU PRIVACIDAD ES NUESTRA PRIORIDAD</span>
            </div>
            <h1 className="hero-titulo">
              <span className="hero-destacado">Política de Privacidad</span>
            </h1>
            <p className="hero-subtitulo">
              Máxima confianza, protección de datos y transparencia total. Te explicamos todo de manera amigable.
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

      {/* Mensaje Principal */}
      <section className="mensaje-principal">
        <div className="container">
          <div className="mensaje-card">
            <Shield className="mensaje-icon" />
            <h2>Tu privacidad es nuestra prioridad absoluta</h2>
            <p>
              En ME LLEVO ESTO, tratamos tus datos personales con el máximo respeto y cuidado. 
              Esta política explica de manera clara y transparente cómo recopilamos, usamos y protegemos tu información.
            </p>
            <div className="mensaje-badges">
              <span className="mensaje-badge">Cumplimos la ley de protección de datos</span>
              <span className="mensaje-badge">Tú controlas tus datos</span>
              <span className="mensaje-badge">Nunca vendemos información</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="privacidad-content">
        <div className="container">
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

      {/* Tus Derechos */}
      <section className="derechos-section">
        <div className="container">
          <h2 className="section-titulo">
            Tus <span className="titulo-destacado">Derechos</span>
          </h2>
          <p className="section-subtitulo">
            Tienes control total sobre tus datos personales
          </p>
          
          <div className="derechos-grid">
            {derechos.map((derecho, index) => {
              const Icono = derecho.icono
              return (
                <div key={index} className="derecho-card">
                  <div className="derecho-icono">
                    <Icono className="derecho-icon" />
                  </div>
                  <h3 className="derecho-titulo">{derecho.titulo}</h3>
                  <p className="derecho-descripcion">{derecho.descripcion}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contacto para Privacidad */}
      <section className="contacto-privacidad">
        <div className="container">
          <div className="contacto-content">
            <h2 className="contacto-titulo">
              ¿Tienes dudas sobre tu privacidad?
            </h2>
            <p className="contacto-subtitulo">
              Nuestro equipo de privacidad está aquí para ayudarte
            </p>
            
            <div className="contacto-cards">
              <div className="contacto-card">
                <MessageSquare className="contacto-card-icon" />
                <h3>WhatsApp Privacidad</h3>
                <p>Para consultas urgentes sobre tus datos</p>
                <a href="https://wa.me/573012345678" className="contacto-link">
                  Contactar por WhatsApp
                </a>
              </div>
              
              <div className="contacto-card">
                <Mail className="contacto-card-icon" />
                <h3>Email Privacidad</h3>
                <p>Para solicitudes formales de datos</p>
                <a href="mailto:privacidad@mellevoesto.com" className="contacto-link">
                  privacidad@mellevoesto.com
                </a>
              </div>
              
              <div className="contacto-card">
                <FileText className="contacto-card-icon" />
                <h3>Descargar Política</h3>
                <p>Obtén una copia en PDF</p>
                <button className="contacto-link" onClick={() => window.print()}>
                  <Download className="download-icon" />
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información Legal */}
      <section className="info-legal">
        <div className="container">
          <div className="legal-content">
            <h2 className="legal-titulo">
              Información Legal
            </h2>
            <div className="legal-info">
              <div className="legal-item">
                <AlertCircle className="legal-icon" />
                <div>
                  <h3>Responsable del Tratamiento</h3>
                  <p>ME LLEVO ESTO S.A.S. - NIT: 900.123.456-7</p>
                  <p>Dirección: Bogotá, Colombia</p>
                </div>
              </div>
              
              <div className="legal-item">
                <Shield className="legal-icon" />
                <div>
                  <h3>Base Legal</h3>
                  <p>Cumplimos con la Ley 1581 de 2012 y el Decreto 1377 de 2013</p>
                  <p>Regulación General de Protección de Datos (RGPD)</p>
                </div>
              </div>
              
              <div className="legal-item">
                <Heart className="legal-icon" />
                <div>
                  <h3>Compromiso</h3>
                  <p>Nos comprometemos a proteger tus datos con la máxima diligencia</p>
                  <p>Actualizamos esta política cuando sea necesario</p>
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
              ¿Listo para comprar con <span className="cta-destacado">privacidad garantizada</span>?
            </h2>
            <p className="cta-subtitulo">
              Tus datos están seguros con nosotros. Compra con total confianza.
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


