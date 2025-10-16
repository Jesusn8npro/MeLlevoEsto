import { useState } from 'react'
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  ShoppingCart,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  MessageSquare,
  User,
  Trash2,
  Heart,
  Zap,
  Phone,
  Mail,
  Search
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './PreguntasFrecuentes.css'

export default function PreguntasFrecuentes() {
  const [preguntaAbierta, setPreguntaAbierta] = useState(null)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  const categorias = [
    {
      icono: ShoppingCart,
      titulo: 'Compras',
      color: '#ff6b35'
    },
    {
      icono: CreditCard,
      titulo: 'Pagos',
      color: '#10b981'
    },
    {
      icono: Truck,
      titulo: 'Envíos',
      color: '#3b82f6'
    },
    {
      icono: RotateCcw,
      titulo: 'Devoluciones',
      color: '#f59e0b'
    },
    {
      icono: Shield,
      titulo: 'Seguridad',
      color: '#8b5cf6'
    },
    {
      icono: User,
      titulo: 'Cuenta',
      color: '#ef4444'
    }
  ]

  const preguntas = [
    {
      categoria: 'Compras',
      pregunta: '¿Cómo comprar en ME LLEVO ESTO?',
      respuesta: 'Es súper fácil: 1) Busca el producto que quieres, 2) Haz clic en "Comprar ahora", 3) Completa tus datos de entrega, 4) Elige tu método de pago, 5) ¡Confirma tu pedido! Te enviaremos todos los detalles por WhatsApp y email.',
      icono: ShoppingCart
    },
    {
      categoria: 'Compras',
      pregunta: '¿Qué productos venden?',
      respuesta: 'Tenemos de TODO: electrónicos (iPhone, Samsung, laptops), ropa y moda, productos para el hogar, repuestos de vehículos, deportes, belleza y mucho más. Si no encuentras algo, escríbenos y lo conseguimos.',
      icono: ShoppingCart
    },
    {
      categoria: 'Compras',
      pregunta: '¿Los precios incluyen impuestos?',
      respuesta: 'Sí, todos nuestros precios ya incluyen IVA y cualquier impuesto aplicable. Lo que ves es lo que pagas, sin sorpresas.',
      icono: ShoppingCart
    },
    {
      categoria: 'Pagos',
      pregunta: '¿Qué métodos de pago aceptan?',
      respuesta: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, PSE, PayPal y en Bogotá también ofrecemos pago contra entrega. Todos los pagos son 100% seguros.',
      icono: CreditCard
    },
    {
      categoria: 'Pagos',
      pregunta: '¿Es seguro pagar con tarjeta?',
      respuesta: '¡Absolutamente! Usamos encriptación de nivel bancario y procesadores de pago certificados. Nunca almacenamos los datos de tu tarjeta. Tu información está protegida con la mejor tecnología.',
      icono: CreditCard
    },
    {
      categoria: 'Pagos',
      pregunta: '¿Puedo pagar contra entrega?',
      respuesta: 'Sí, en Bogotá ofrecemos pago contra entrega para tu mayor comodidad. Pagas solo cuando recibes tu pedido y verificas que todo esté perfecto.',
      icono: CreditCard
    },
    {
      categoria: 'Envíos',
      pregunta: '¿Cuánto tarda el envío?',
      respuesta: 'En Bogotá: 1-2 días hábiles. Otras ciudades: 2-5 días hábiles. Te enviamos el número de seguimiento para que puedas rastrear tu pedido en tiempo real.',
      icono: Truck
    },
    {
      categoria: 'Envíos',
      pregunta: '¿Cuánto cuesta el envío?',
      respuesta: 'Envío GRATIS en compras superiores a $150.000. Para compras menores, el costo varía según la ciudad (entre $8.000 y $15.000). En Bogotá siempre es gratis.',
      icono: Truck
    },
    {
      categoria: 'Envíos',
      pregunta: '¿Puedo cambiar la dirección de entrega?',
      respuesta: 'Sí, puedes cambiar la dirección hasta 2 horas después de hacer el pedido. Después de eso, contáctanos por WhatsApp y haremos lo posible por ayudarte.',
      icono: Truck
    },
    {
      categoria: 'Devoluciones',
      pregunta: '¿Cómo pedir una devolución?',
      respuesta: 'Es fácil: 1) Escríbenos por WhatsApp explicando el motivo, 2) Te damos un número de autorización, 3) Coordinamos la recogida, 4) Procesamos el reembolso en 5-10 días hábiles.',
      icono: RotateCcw
    },
    {
      categoria: 'Devoluciones',
      pregunta: '¿Cuándo puedo devolver un producto?',
      respuesta: 'Productos defectuosos: hasta 30 días. Cambio de opinión: hasta 7 días si el producto está sin usar y en su empaque original. Siempre te ayudamos a resolver cualquier situación.',
      icono: RotateCcw
    },
    {
      categoria: 'Devoluciones',
      pregunta: '¿Cuánto tarda el reembolso?',
      respuesta: 'Una vez que recibimos el producto, procesamos el reembolso en 5-10 días hábiles. Te notificamos cuando esté listo y aparece en tu cuenta bancaria en 1-2 días adicionales.',
      icono: RotateCcw
    },
    {
      categoria: 'Seguridad',
      pregunta: '¿Es seguro comprar aquí?',
      respuesta: '¡Totalmente! Somos una empresa legalmente constituida, usamos tecnología de seguridad de nivel bancario, cumplimos con todas las leyes de protección de datos y tenemos miles de clientes satisfechos.',
      icono: Shield
    },
    {
      categoria: 'Seguridad',
      pregunta: '¿Qué garantía tienen los productos?',
      respuesta: 'Todos nuestros productos tienen garantía del fabricante. Además, ofrecemos nuestra garantía de satisfacción: si no estás contento, trabajamos hasta solucionarlo o te devolvemos tu dinero.',
      icono: Shield
    },
    {
      categoria: 'Cuenta',
      pregunta: '¿Cómo creo una cuenta?',
      respuesta: 'Haz clic en "Registrarse", completa tu nombre, email y teléfono, crea una contraseña segura y ¡listo! También puedes comprar como invitado sin crear cuenta.',
      icono: User
    },
    {
      categoria: 'Cuenta',
      pregunta: '¿Cómo borro mi cuenta?',
      respuesta: 'Escríbenos por WhatsApp o email solicitando la eliminación de tu cuenta. Eliminaremos todos tus datos personales en un plazo máximo de 30 días, respetando tu privacidad.',
      icono: Trash2
    },
    {
      categoria: 'Cuenta',
      pregunta: '¿Puedo cambiar mis datos?',
      respuesta: 'Sí, puedes actualizar tu información desde tu perfil o escribiéndonos por WhatsApp. Mantener tus datos actualizados nos ayuda a darte un mejor servicio.',
      icono: User
    }
  ]

  const preguntasFiltradas = preguntas.filter(pregunta => 
    pregunta.pregunta.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    pregunta.respuesta.toLowerCase().includes(terminoBusqueda.toLowerCase())
  )

  const togglePregunta = (index) => {
    setPreguntaAbierta(preguntaAbierta === index ? null : index)
  }

  const preguntasPorCategoria = categorias.map(categoria => ({
    ...categoria,
    preguntas: preguntasFiltradas.filter(p => p.categoria === categoria.titulo)
  }))

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <HelpCircle className="hero-badge-icon" />
              <span>RESOLVEMOS TUS DUDAS AL INSTANTE</span>
            </div>
            <h1 className="hero-titulo">
              <span className="hero-destacado">Preguntas Frecuentes</span>
            </h1>
            <p className="hero-subtitulo">
              Encuentra respuestas rápidas a las dudas más comunes. Si no encuentras tu respuesta, contáctanos.
            </p>
            
            {/* Buscador */}
            <div className="buscador-faq">
              <div className="buscador-input">
                <Search className="buscador-icon" />
                <input
                  type="text"
                  placeholder="Busca tu pregunta..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categorias-section">
        <div className="container">
          <h2 className="section-titulo">
            Explora por <span className="titulo-destacado">categoría</span>
          </h2>
          <div className="categorias-grid">
            {categorias.map((categoria, index) => (
              <div key={index} className="categoria-card">
                <div 
                  className="categoria-icono"
                  style={{ backgroundColor: categoria.color }}
                >
                  <categoria.icono className="categoria-icon" />
                </div>
                <h3 className="categoria-titulo">{categoria.titulo}</h3>
                <p className="categoria-count">
                  {preguntas.filter(p => p.categoria === categoria.titulo).length} preguntas
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas y Respuestas */}
      <section className="preguntas-section">
        <div className="container">
          <h2 className="section-titulo">
            {terminoBusqueda ? `Resultados para "${terminoBusqueda}"` : 'Todas las preguntas'}
          </h2>
          
          {preguntasPorCategoria.map((categoria, categoriaIndex) => {
            if (categoria.preguntas.length === 0) return null
            
            return (
              <div key={categoriaIndex} className="categoria-preguntas">
                <h3 className="categoria-nombre">
                  <categoria.icono className="categoria-nombre-icon" />
                  {categoria.titulo}
                </h3>
                
                <div className="preguntas-lista">
                  {categoria.preguntas.map((pregunta, preguntaIndex) => {
                    const indexGlobal = preguntasFiltradas.indexOf(pregunta)
                    const Icono = pregunta.icono
                    
                    return (
                      <div key={preguntaIndex} className="pregunta-item">
                        <button
                          className="pregunta-header"
                          onClick={() => togglePregunta(indexGlobal)}
                        >
                          <div className="pregunta-contenido">
                            <Icono className="pregunta-icon" />
                            <span className="pregunta-texto">{pregunta.pregunta}</span>
                          </div>
                          {preguntaAbierta === indexGlobal ? (
                            <ChevronUp className="pregunta-chevron" />
                          ) : (
                            <ChevronDown className="pregunta-chevron" />
                          )}
                        </button>
                        
                        {preguntaAbierta === indexGlobal && (
                          <div className="pregunta-respuesta">
                            <p>{pregunta.respuesta}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          
          {preguntasFiltradas.length === 0 && terminoBusqueda && (
            <div className="sin-resultados">
              <HelpCircle className="sin-resultados-icon" />
              <h3>No encontramos resultados</h3>
              <p>Intenta con otras palabras o contáctanos directamente</p>
              <Link to="/contacto" className="btn-contacto">
                <MessageSquare className="btn-icon" />
                Contactar Soporte
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Contacto Directo */}
      <section className="contacto-directo">
        <div className="container">
          <div className="contacto-content">
            <h2 className="contacto-titulo">
              ¿No encuentras tu respuesta?
            </h2>
            <p className="contacto-subtitulo">
              Nuestro equipo está listo para ayudarte al instante
            </p>
            
            <div className="contacto-opciones">
              <a href="https://wa.me/573012345678" className="contacto-opcion whatsapp">
                <MessageSquare className="opcion-icon" />
                <h3>WhatsApp</h3>
                <p>Respuesta inmediata 24/7</p>
                <span className="opcion-badge">Recomendado</span>
              </a>
              
              <a href="mailto:hola@mellevoesto.com" className="contacto-opcion email">
                <Mail className="opcion-icon" />
                <h3>Email</h3>
                <p>Respuesta en menos de 2 horas</p>
              </a>
              
              <a href="tel:+5712345678" className="contacto-opcion telefono">
                <Phone className="opcion-icon" />
                <h3>Teléfono</h3>
                <p>Lunes a Viernes 8AM - 6PM</p>
              </a>
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
              Todas tus dudas resueltas, ahora puedes comprar tranquilo
            </p>
            <div className="cta-buttons">
              <Link to="/productos" className="btn-primario">
                <Heart className="btn-icon" />
                Explorar Productos
              </Link>
              <Link to="/contacto" className="btn-secundario">
                <MessageSquare className="btn-icon" />
                Hacer Pregunta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}










