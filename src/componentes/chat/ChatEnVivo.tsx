import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle, Phone, User, Mail, ChevronDown } from 'lucide-react'
import './ChatEnVivo.css'

interface Mensaje {
  id: string
  texto: string
  esUsuario: boolean
  timestamp: Date
  tipo?: 'texto' | 'sistema' | 'recomendacion'
}

interface DatosGuest {
  nombre: string
  email: string
  whatsapp: string
  tipoConsulta: string
}

interface Pais {
  codigo: string
  pais: string
  bandera: string
  digitos: number
  formato: string
}

export default function ChatEnVivo() {
  const { usuario, sesionIniciada } = useAutenticacionOpcional()
  
  // Estados del chat
  const [chatAbierto, setChatAbierto] = useState(false)
  const [chatPuedeIniciar, setChatPuedeIniciar] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [chatId, setChatId] = useState('')
  
  // Modal de datos guest
  const [mostrarModalDatos, setMostrarModalDatos] = useState(false)
  const [datosGuest, setDatosGuest] = useState<DatosGuest>({
    nombre: '',
    email: '',
    whatsapp: '',
    tipoConsulta: 'general'
  })
  
  // Configuración de países
  const [paisSeleccionado, setPaisSeleccionado] = useState({
    codigo: '+57',
    pais: 'CO',
    bandera: '🇨🇴',
    digitos: 10,
    formato: '3XX XXX XXXX'
  })
  
  const [numeroTelefono, setNumeroTelefono] = useState('')
  const [selectorVisible, setSelectorVisible] = useState(false)
  const [selectorConsultaVisible, setSelectorConsultaVisible] = useState(false)
  
  const contenedorMensajesRef = useRef<HTMLDivElement>(null)
  const inputMensajeRef = useRef<HTMLInputElement>(null)
  
  // Lista de países principales
  const paisesPrincipales: Pais[] = [
    { codigo: '+57', pais: 'Colombia', bandera: '🇨🇴', digitos: 10, formato: '3XX XXX XXXX' },
    { codigo: '+58', pais: 'Venezuela', bandera: '🇻🇪', digitos: 10, formato: '4XX XXX XXXX' },
    { codigo: '+1', pais: 'Estados Unidos', bandera: '🇺🇸', digitos: 10, formato: 'XXX XXX XXXX' },
    { codigo: '+56', pais: 'Chile', bandera: '🇨🇱', digitos: 9, formato: '9X XXX XXXX' },
    { codigo: '+52', pais: 'México', bandera: '🇲🇽', digitos: 10, formato: '1 XXX XXX XXXX' },
    { codigo: '+54', pais: 'Argentina', bandera: '🇦🇷', digitos: 10, formato: '9 XX XXXX XXXX' },
    { codigo: '+51', pais: 'Perú', bandera: '🇵🇪', digitos: 9, formato: '9XX XXX XXX' },
    { codigo: '+593', pais: 'Ecuador', bandera: '🇪🇨', digitos: 8, formato: '9X XXX XXXX' },
    { codigo: '+55', pais: 'Brasil', bandera: '🇧🇷', digitos: 11, formato: 'XX 9XXXX XXXX' }
  ]
  
  const tiposConsulta = [
    { valor: 'general', texto: '💬 Consulta general' },
    { valor: 'productos', texto: '📦 Información sobre productos' },
    { valor: 'precios', texto: '💰 Precios y ofertas' },
    { valor: 'envios', texto: '🚚 Envíos y entregas' },
    { valor: 'devolucion', texto: '↩️ Devoluciones' },
    { valor: 'tecnico', texto: '🔧 Soporte técnico' },
    { valor: 'otro', texto: '❓ Otro tema' }
  ]
  
  // Webhook URL de n8n (usar el mismo del componente original)
  const WEBHOOK_URL = 'https://mellevoesto.app.n8n.cloud/webhook/chat-widget'
  
  // Inicializar chat
  useEffect(() => {
    if (chatAbierto && !chatPuedeIniciar) {
      inicializarChat()
    }
  }, [chatAbierto])
  
  // Scroll automático al final
  useEffect(() => {
    if (contenedorMensajesRef.current) {
      contenedorMensajesRef.current.scrollTop = contenedorMensajesRef.current.scrollHeight
    }
  }, [mensajes])
  
  const inicializarChat = () => {
    if (sesionIniciada && usuario) {
      // Usuario autenticado
      setChatPuedeIniciar(true)
      setChatId(`user_${usuario.id}_${Date.now()}`)
      
      // Mensaje de bienvenida personalizado
      const mensajeBienvenida: Mensaje = {
        id: `msg_${Date.now()}`,
        texto: `¡Hola ${usuario.nombre}! 👋 Soy tu asistente virtual de ME LLEVO ESTO. ¿En qué puedo ayudarte hoy?`,
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'sistema'
      }
      
      setMensajes([mensajeBienvenida])
    } else {
      // Usuario guest - mostrar modal para datos
      setMostrarModalDatos(true)
    }
  }
  
  const completarDatosGuest = () => {
    if (!datosGuest.nombre || !datosGuest.email) {
      alert('Por favor completa al menos tu nombre y email')
      return
    }
    
    setChatPuedeIniciar(true)
    setChatId(`guest_${Date.now()}`)
    setMostrarModalDatos(false)
    
    // Mensaje de bienvenida para guest
    const mensajeBienvenida: Mensaje = {
      id: `msg_${Date.now()}`,
      texto: `¡Hola ${datosGuest.nombre}! 👋 Gracias por contactarnos. Soy tu asistente virtual de ME LLEVO ESTO. ¿En qué puedo ayudarte con ${tiposConsulta.find(t => t.valor === datosGuest.tipoConsulta)?.texto.toLowerCase()}?`,
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'sistema'
    }
    
    setMensajes([mensajeBienvenida])
  }
  
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !chatPuedeIniciar) return
    
    // Agregar mensaje del usuario
    const mensajeUsuario: Mensaje = {
      id: `msg_${Date.now()}`,
      texto: nuevoMensaje.trim(),
      esUsuario: true,
      timestamp: new Date(),
      tipo: 'texto'
    }
    
    setMensajes(prev => [...prev, mensajeUsuario])
    setNuevoMensaje('')
    setEscribiendo(true)
    
    try {
      // Preparar datos para el webhook
      const datosWebhook = {
        chatId,
        mensaje: nuevoMensaje.trim(),
        usuario: sesionIniciada ? {
          id: usuario?.id,
          nombre: usuario?.nombre,
          email: usuario?.email,
          autenticado: true
        } : {
          nombre: datosGuest.nombre,
          email: datosGuest.email,
          whatsapp: datosGuest.whatsapp,
          tipoConsulta: datosGuest.tipoConsulta,
          autenticado: false
        },
        timestamp: new Date().toISOString(),
        plataforma: 'ME LLEVO ESTO',
        url: window.location.href
      }
      
      console.log('📤 Enviando mensaje al webhook:', datosWebhook)
      
      // Enviar al webhook de n8n
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosWebhook)
      })
      
      if (response.ok) {
        const respuestaBot = await response.json()
        
        // Agregar respuesta del bot
        const mensajeBot: Mensaje = {
          id: `msg_${Date.now()}_bot`,
          texto: respuestaBot.mensaje || '¡Gracias por tu mensaje! Te responderemos pronto.',
          esUsuario: false,
          timestamp: new Date(),
          tipo: respuestaBot.tipo || 'texto'
        }
        
        setTimeout(() => {
          setMensajes(prev => [...prev, mensajeBot])
          setEscribiendo(false)
        }, 1500)
        
      } else {
        throw new Error('Error en la respuesta del servidor')
      }
      
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error)
      
      // Mensaje de error
      const mensajeError: Mensaje = {
        id: `msg_${Date.now()}_error`,
        texto: 'Lo siento, hay un problema técnico. Por favor intenta de nuevo o contáctanos por WhatsApp.',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'sistema'
      }
      
      setTimeout(() => {
        setMensajes(prev => [...prev, mensajeError])
        setEscribiendo(false)
      }, 1000)
    }
  }
  
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    enviarMensaje()
  }
  
  const seleccionarPais = (pais: Pais) => {
    setPaisSeleccionado(pais)
    setNumeroTelefono('')
    setSelectorVisible(false)
  }
  
  const validarNumeroTelefono = (numero: string) => {
    const numeroLimpio = numero.replace(/\D/g, '')
    
    if (numeroLimpio.length === paisSeleccionado.digitos) {
      setDatosGuest(prev => ({
        ...prev,
        whatsapp: paisSeleccionado.codigo + numeroLimpio
      }))
      return true
    }
    return false
  }
  
  const formatearNumeroInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '')
    
    if (valor.length > paisSeleccionado.digitos) {
      valor = valor.slice(0, paisSeleccionado.digitos)
    }
    
    setNumeroTelefono(valor)
    validarNumeroTelefono(valor)
  }
  
  const cerrarChat = () => {
    setChatAbierto(false)
    setChatPuedeIniciar(false)
    setMensajes([])
    setMostrarModalDatos(false)
    setDatosGuest({
      nombre: '',
      email: '',
      whatsapp: '',
      tipoConsulta: 'general'
    })
  }
  
  return (
    <>
      {/* Botón flotante del chat */}
      <div className={`chat-widget-container ${chatAbierto ? 'abierto' : ''}`}>
        <button
          className="chat-toggle-btn"
          onClick={() => setChatAbierto(!chatAbierto)}
          aria-label={chatAbierto ? 'Cerrar chat' : 'Abrir chat'}
        >
          {chatAbierto ? <X size={24} /> : <MessageCircle size={24} />}
          {!chatAbierto && (
            <div className="chat-notification-badge">
              <span>💬</span>
            </div>
          )}
        </button>
        
        {/* Ventana del chat */}
        {chatAbierto && (
          <div className="chat-window">
            {/* Header del chat */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3>ME LLEVO ESTO</h3>
                  <p>Asistente Virtual</p>
                </div>
              </div>
              <button
                className="chat-close-btn"
                onClick={cerrarChat}
                aria-label="Cerrar chat"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Contenido del chat */}
            <div className="chat-content">
              {!chatPuedeIniciar ? (
                <div className="chat-welcome">
                  <div className="welcome-icon">👋</div>
                  <h3>¡Hola! Bienvenido a ME LLEVO ESTO</h3>
                  <p>Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos y servicios.</p>
                  <button
                    className="start-chat-btn"
                    onClick={inicializarChat}
                  >
                    Iniciar Chat
                  </button>
                </div>
              ) : (
                <>
                  {/* Mensajes */}
                  <div className="chat-messages" ref={contenedorMensajesRef}>
                    {mensajes.map((mensaje) => (
                      <div
                        key={mensaje.id}
                        className={`mensaje ${mensaje.esUsuario ? 'usuario' : 'bot'} ${mensaje.tipo}`}
                      >
                        <div className="mensaje-contenido">
                          <p>{mensaje.texto}</p>
                          <span className="mensaje-tiempo">
                            {mensaje.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {escribiendo && (
                      <div className="mensaje bot">
                        <div className="mensaje-contenido escribiendo">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Input de mensaje */}
                  <form className="chat-input-form" onSubmit={manejarEnvio}>
                    <input
                      ref={inputMensajeRef}
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="chat-input"
                      disabled={escribiendo}
                    />
                    <button
                      type="submit"
                      className="chat-send-btn"
                      disabled={!nuevoMensaje.trim() || escribiendo}
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de datos para usuarios guest */}
      {mostrarModalDatos && (
        <div className="modal-overlay" onClick={() => setMostrarModalDatos(false)}>
          <div className="modal-datos-guest" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cuéntanos sobre ti</h3>
              <button
                className="modal-close-btn"
                onClick={() => setMostrarModalDatos(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <p>Para brindarte una mejor atención, necesitamos algunos datos:</p>
              
              <form className="datos-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      id="nombre"
                      type="text"
                      value={datosGuest.nombre}
                      onChange={(e) => setDatosGuest(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      id="email"
                      type="email"
                      value={datosGuest.email}
                      onChange={(e) => setDatosGuest(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp (opcional)</label>
                  <div className="whatsapp-input">
                    <div className="country-selector">
                      <button
                        type="button"
                        className="country-btn"
                        onClick={() => setSelectorVisible(!selectorVisible)}
                      >
                        <span>{paisSeleccionado.bandera} {paisSeleccionado.codigo}</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      {selectorVisible && (
                        <div className="country-dropdown">
                          {paisesPrincipales.map((pais) => (
                            <button
                              key={pais.codigo}
                              type="button"
                              className="country-option"
                              onClick={() => seleccionarPais(pais)}
                            >
                              <span>{pais.bandera} {pais.codigo}</span>
                              <span>{pais.pais}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="phone-input">
                      <Phone size={18} />
                      <input
                        id="whatsapp"
                        type="tel"
                        value={numeroTelefono}
                        onChange={formatearNumeroInput}
                        placeholder={paisSeleccionado.formato}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="tipoConsulta">Tipo de consulta</label>
                  <div className="select-wrapper">
                    <select
                      id="tipoConsulta"
                      value={datosGuest.tipoConsulta}
                      onChange={(e) => setDatosGuest(prev => ({ ...prev, tipoConsulta: e.target.value }))}
                    >
                      {tiposConsulta.map((tipo) => (
                        <option key={tipo.valor} value={tipo.valor}>
                          {tipo.texto}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>
              </form>
              
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMostrarModalDatos(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={completarDatosGuest}
                  disabled={!datosGuest.nombre || !datosGuest.email}
                >
                  Iniciar Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 