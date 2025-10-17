import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import './ChatEnVivo.css'
import { clienteSupabase, obtenerSessionId } from '../../configuracion/supabase'

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
  const { usuario, sesionInicializada } = useAuth()
  const sesionIniciada = sesionInicializada
  
  // Estados del chat
  const [chatAbierto, setChatAbierto] = useState(false)
  const [chatPuedeIniciar, setChatPuedeIniciar] = useState(false)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [chatId, setChatId] = useState('')
  
  // Datos guest y captura progresiva (sin modal)
  const [datosGuest, setDatosGuest] = useState<DatosGuest>({
    nombre: '',
    email: '',
    whatsapp: '',
    tipoConsulta: 'general'
  })
  const pasosCaptura: Array<keyof DatosGuest> = ['nombre', 'email', 'whatsapp', 'tipoConsulta']
  const [pasoActual, setPasoActual] = useState<keyof DatosGuest | null>(null)
  const [perfilCompleto, setPerfilCompleto] = useState(false)
  const leadRegistradoRef = useRef(false)
  
  const contenedorMensajesRef = useRef<HTMLDivElement>(null)
  const inputMensajeRef = useRef<HTMLInputElement>(null)
  
  const tiposConsulta = [
    { valor: 'general', texto: 'Consulta general' },
    { valor: 'productos', texto: 'Información sobre productos' },
    { valor: 'precios', texto: 'Precios y ofertas' },
    { valor: 'envios', texto: 'Envíos y entregas' },
    { valor: 'devolucion', texto: 'Devoluciones' },
    { valor: 'tecnico', texto: 'Soporte técnico' },
    { valor: 'otro', texto: 'Otro tema' }
  ]

  // Utilidades para renderizar imágenes dentro del mensaje
  const extraerUrls = (texto: string): string[] => {
    const urls = texto.match(/https?:\/\/[^\s)]+/g) || []
    // Eliminar duplicados manteniendo orden
    return Array.from(new Set(urls))
  }

  const obtenerDriveId = (url: string): string | null => {
    const m1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (m1?.[1]) return m1[1]
    const m2 = url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*id=([^&]+)/)
    if (m2?.[1]) return m2[1]
    return null
  }

  const transformarDriveUrl = (url: string): string => {
    // URL primaria para mostrar imagen inline
    const id = obtenerDriveId(url)
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`
    return url
  }

  const transformarDriveUrlFallback = (url: string): string => {
    // Fallback robusto: miniatura directa
    const id = obtenerDriveId(url)
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`
    return url
  }

  const esImagenUrl = (url: string): boolean => {
    return (
      /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(url) ||
      /drive\.google\.com\/file\/d\//.test(url) ||
      /drive\.google\.com\/(?:open|uc)\?/.test(url)
    )
  }

  // Renderiza el contenido del mensaje intercalando texto, enlaces y
  // reemplazando URLs de imagen por la imagen embebida.
  const renderContenidoMensaje = (texto: string) => {
    const elementos: JSX.Element[] = []
    const regex = /https?:\/\/[^\s)]+/g
    let ultimo = 0
    const matches = texto.matchAll(regex)
    for (const m of matches) {
      const idx = m.index || 0
      const urlOriginal = m[0]
      // Texto previo
      if (idx > ultimo) {
        elementos.push(<span key={`t-${idx}`}>{texto.slice(ultimo, idx)}</span>)
      }
      // Imagen o enlace
      if (esImagenUrl(urlOriginal)) {
        const src = transformarDriveUrl(urlOriginal)
        elementos.push(
          <a
            key={`img-${idx}`}
            href={urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="imagen-chat-link"
          >
            <img
              src={src}
              alt="Imagen compartida"
              className="imagen-chat"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const fallback = transformarDriveUrlFallback(urlOriginal)
                if (fallback && e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback
                }
              }}
            />
          </a>
        )
      } else {
        elementos.push(
          <a
            key={`a-${idx}`}
            href={urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="mensaje-link"
          >
            {urlOriginal}
          </a>
        )
      }
      ultimo = idx + urlOriginal.length
    }
    // Texto restante
    if (ultimo < texto.length) {
      elementos.push(<span key={`t-end`}>{texto.slice(ultimo)}</span>)
    }
    return elementos
  }
  
  // Webhook URL de n8n (usar el mismo del componente original)
const WEBHOOK_URL = 'https://velostrategix-n8n.lnrubg.easypanel.host/webhook-test/chat_web_mellevoesto'

  // Mapear registro de Supabase a estructura de Mensaje
  const mapRegistroAMensaje = (registro: any): Mensaje | null => {
    try {
      const raw = registro?.message ?? registro?.message_json
      const msg = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!msg) return null
      const esUsuario = msg.type === 'human' || msg.type === 'user'
      const texto = msg.content ?? msg.text ?? ''
      const ts = msg.timestamp ?? registro.created_at ?? new Date().toISOString()
      return {
        id: `sb_${registro.id}`,
        texto,
        esUsuario,
        timestamp: new Date(ts),
        tipo: msg.tipo || 'texto'
      }
    } catch {
      return null
    }
  }

  // Cargar historial de mensajes por session/chat id
  const cargarHistorialSupabase = async (sessionId: string): Promise<Mensaje[]> => {
    try {
      if (!sessionId) return []
      const { data, error } = await clienteSupabase
        .from('chats_de_la_web')
        .select('id, session_id, message, message_json, created_at')
        .eq('session_id', sessionId)
        .order('id', { ascending: true })
        .limit(500)
      if (error || !data) return []
      const mensajesMapeados = data.map(mapRegistroAMensaje).filter(Boolean) as Mensaje[]
      return mensajesMapeados
    } catch {
      return []
    }
  }

  // Recuperar chat_id anterior por email (para usuarios autenticados)
  const recuperarChatIdAnteriorPorEmail = async (email?: string | null): Promise<string | null> => {
    try {
      if (!email) return null
      const { data, error } = await clienteSupabase
        .from('leads_chat')
        .select('chat_id, updated_at')
        .eq('email', email)
        .order('updated_at', { ascending: false })
        .limit(1)
      if (error || !data || !data.length) return null
      return data[0].chat_id || null
    } catch {
      return null
    }
  }

  const obtenerLeadPorChatId = async (idChat: string): Promise<any | null> => {
    try {
      const { data, error } = await clienteSupabase
        .from('leads_chat')
        .select('*')
        .eq('chat_id', idChat)
        .limit(1)
      if (error || !data || !data.length) return null
      return data[0]
    } catch {
      return null
    }
  }

  // Persistencia en Supabase
  const registrarMensajeSupabase = async (sessionId: string, payload: any) => {
    try {
      if (!sessionId) return
      await clienteSupabase
        .from('chats_de_la_web')
        .insert({
          session_id: sessionId,
          message_json: payload,
          created_at: new Date().toISOString()
        })
    } catch (e) {
      console.warn('⚠️ No se pudo registrar mensaje en Supabase:', e)
    }
  }

  const registrarLeadSupabase = async (primerMensaje?: string, chatIdOverride?: string) => {
    try {
      const effectiveId = chatIdOverride || chatId
      if (!effectiveId) return
      const payload: any = {
        chat_id: effectiveId,
        nombre: sesionIniciada ? (usuario?.nombre || null) : (datosGuest.nombre || null),
        email: sesionIniciada ? (usuario?.email || null) : (datosGuest.email || null),
        whatsapp: sesionIniciada ? null : (datosGuest.whatsapp || null),
        tipo_consulta: sesionIniciada ? 'general' : (datosGuest.tipoConsulta || 'general'),
        converted: !!sesionIniciada,
        first_message: primerMensaje || null,
        source: 'web'
      }
      await clienteSupabase
        .from('leads_chat')
        .upsert([payload], { onConflict: 'chat_id' })
      leadRegistradoRef.current = true
    } catch (e) {
      console.warn('⚠️ No se pudo registrar/actualizar lead en Supabase:', e)
    }
  }
  
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

  // Auto-focus en el input cuando el chat puede iniciar
  useEffect(() => {
    if (chatPuedeIniciar && inputMensajeRef.current) {
      // Usar setTimeout para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        if (inputMensajeRef.current) {
          inputMensajeRef.current.focus()
          // En móvil, también intentar hacer scroll al input
          inputMensajeRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
    }
  }, [chatPuedeIniciar])
  
  const inicializarChat = async () => {
    if (sesionIniciada && usuario) {
      // Usuario autenticado
      setChatPuedeIniciar(true)
      // Intentar reutilizar conversación anterior por email
      const anterior = await recuperarChatIdAnteriorPorEmail(usuario?.email)
      const nuevoId = anterior || `user_${usuario.id}`
      setChatId(nuevoId)
      
      // Mensaje de bienvenida personalizado
      const mensajeBienvenida: Mensaje = {
        id: `msg_${Date.now()}`,
        texto: `¡Hola ${usuario.nombre}! 👋 Soy tu asistente virtual de ME LLEVO ESTO. ¿En qué puedo ayudarte hoy?`,
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'sistema'
      }
      
      // Cargar historial si existe; si no, mostrar bienvenida
      const historial = await cargarHistorialSupabase(nuevoId)
      if (historial.length) {
        setMensajes(historial)
      } else {
        setMensajes([mensajeBienvenida])
      }

      // Registrar lead autenticado en Supabase (sin bloquear UI) con el ID correcto
      registrarLeadSupabase(undefined, nuevoId).catch(() => {})
    } else {
      // Usuario guest - iniciar captura progresiva dentro del chat
      setChatPuedeIniciar(true)
      const sid = obtenerSessionId()
      const nuevoId = `guest_${sid}`
      setChatId(nuevoId)
      const bienvenida: Mensaje = {
        id: `msg_${Date.now()}`,
        texto: '¡Hola! 👋 Soy tu asistente virtual. Para ayudarte mejor, te haré unas preguntas rápidas.',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'sistema'
      }
      const preguntaNombre: Mensaje = {
        id: `msg_${Date.now()}_q1`,
        texto: '¿Cuál es tu nombre?',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'sistema'
      }
      // Cargar historial si existe
      const historial = await cargarHistorialSupabase(nuevoId)
      if (historial.length) {
        setMensajes(historial)
        const lead = await obtenerLeadPorChatId(nuevoId)
        if (lead) {
          setDatosGuest({
            nombre: lead.nombre || '',
            email: lead.email || '',
            whatsapp: lead.whatsapp || '',
            tipoConsulta: lead.tipo_consulta || 'general'
          })
          const completo = !!(lead.nombre && lead.email && lead.whatsapp)
          setPerfilCompleto(completo)
          setPasoActual(completo ? null : 'nombre')
        } else {
          setPasoActual('nombre')
        }
      } else {
        setMensajes([bienvenida, preguntaNombre])
        setPasoActual('nombre')
      }
    }
  }
  
  // Validaciones básicas para captura progresiva
  const esEmailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const esTelefonoValido = (tel: string) => {
    const limpio = tel.replace(/\s/g, '')
    return /^\+?\d{7,15}$/.test(limpio)
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
    const contenido = mensajeUsuario.texto

    // Crear/actualizar registro de lead en el primer mensaje si aún no existe
    if (!leadRegistradoRef.current) {
      registrarLeadSupabase(contenido).catch(() => {})
    }

    // Guardar mensaje del usuario en Supabase (no bloqueante)
    registrarMensajeSupabase(chatId, { type: 'human', content: contenido }).catch(() => {})
    
    // Captura progresiva para usuarios guest
    if (!sesionIniciada && !perfilCompleto && pasoActual) {
      const respuesta = contenido
      let siguientePaso: keyof DatosGuest | null = null

      if (pasoActual === 'nombre') {
        setDatosGuest(prev => ({ ...prev, nombre: respuesta }))
        siguientePaso = 'email'
        setMensajes(prev => [...prev, {
          id: `msg_${Date.now()}_sys_email`,
          texto: `Gracias, ${respuesta}. ¿Cuál es tu email?`,
          esUsuario: false,
          timestamp: new Date(),
          tipo: 'sistema'
        }])
      } else if (pasoActual === 'email') {
        if (!esEmailValido(respuesta)) {
          setMensajes(prev => [...prev, {
            id: `msg_${Date.now()}_sys_email_invalid`,
            texto: 'El email no parece válido. Por favor intenta de nuevo (ej: tu@correo.com).',
            esUsuario: false,
            timestamp: new Date(),
            tipo: 'sistema'
          }])
          setEscribiendo(false)
          return
        }
        setDatosGuest(prev => ({ ...prev, email: respuesta }))
        siguientePaso = 'whatsapp'
        setMensajes(prev => [...prev, {
          id: `msg_${Date.now()}_sys_tel`,
          texto: 'Perfecto. ¿Cuál es tu WhatsApp con indicativo (ej: +57 3001234567)?',
          esUsuario: false,
          timestamp: new Date(),
          tipo: 'sistema'
        }])
      } else if (pasoActual === 'whatsapp') {
        if (!esTelefonoValido(respuesta)) {
          setMensajes(prev => [...prev, {
            id: `msg_${Date.now()}_sys_tel_invalid`,
            texto: 'Ese número no parece válido. Incluye indicativo y solo números (ej: +57 3001234567).',
            esUsuario: false,
            timestamp: new Date(),
            tipo: 'sistema'
          }])
          setEscribiendo(false)
          return
        }
        setDatosGuest(prev => ({ ...prev, whatsapp: respuesta }))
        siguientePaso = 'tipoConsulta'
        setMensajes(prev => [...prev, {
          id: `msg_${Date.now()}_sys_tipo`,
          texto: 'Gracias. ¿Cuál es el tema de tu consulta? (general, productos, precios, envios, devolucion, tecnico, otro)',
          esUsuario: false,
          timestamp: new Date(),
          tipo: 'sistema'
        }])
      } else if (pasoActual === 'tipoConsulta') {
        const valor = respuesta.toLowerCase()
        const valido = tiposConsulta.some(t => t.valor === valor)
        setDatosGuest(prev => ({ ...prev, tipoConsulta: valido ? valor : 'general' }))
        setPerfilCompleto(true)
        setPasoActual(null)
        setMensajes(prev => [...prev, {
          id: `msg_${Date.now()}_sys_ready`,
          texto: '¡Excelente! Ya tengo tus datos y continuaré con tu consulta. ¿En qué puedo ayudarte?',
          esUsuario: false,
          timestamp: new Date(),
          tipo: 'sistema'
        }])

        // Registrar lead guest una vez completado el perfil
        if (!leadRegistradoRef.current) {
          registrarLeadSupabase(contenido).catch(() => {})
        }
      }

      if (siguientePaso) setPasoActual(siguientePaso)
    }
    
    try {
      // Preparar datos para el webhook
      const datosWebhook = {
        chatId,
        mensaje: contenido,
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
        perfilCompleto,
        pasoActual,
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
        // Manejo robusto de distintos formatos de respuesta del webhook
        const contentType = response.headers.get('content-type') || ''
        let data: any = null
        let bodyText = ''

        try {
          if (contentType.includes('application/json')) {
            // Intentar parsear como JSON directo
            data = await response.json()
          } else if (response.status !== 204) {
            // Intentar como texto y parsear si es JSON embebido
            bodyText = await response.text()
            try {
              data = JSON.parse(bodyText)
            } catch {
              data = { mensaje: bodyText }
            }
          } else {
            data = null
          }
        } catch (e) {
          // Fallback: si falló json(), intentar leer como texto
          console.warn('⚠️ No se pudo parsear la respuesta del webhook. Intentando fallback a texto.', e)
          try {
            bodyText = await response.text()
            try {
              data = JSON.parse(bodyText)
            } catch {
              data = { mensaje: bodyText }
            }
          } catch (e2) {
            console.warn('⚠️ Falló también el fallback a texto.', e2)
            data = null
          }
        }

        // Extraer mensaje del bot desde diferentes estructuras posibles (n8n / custom)
        const extraerTextoBot = (d: any): string | undefined => {
          if (!d) return undefined
          if (typeof d === 'string') return d
          if (Array.isArray(d)) {
            // n8n a veces devuelve arrays de items
            const item = d[0]
            return (
              item?.json?.bot ||
              item?.json?.mensaje ||
              item?.json?.output ||
              item?.json?.respuesta_final ||
              item?.bot ||
              item?.mensaje ||
              item?.output ||
              item?.respuesta_final ||
              undefined
            )
          }
          return (
            d.mensaje ||
            d.bot ||
            d.output ||
            d.respuesta_final ||
            d.message ||
            d?.data?.mensaje ||
            d?.data?.bot ||
            d?.data?.output ||
            d?.data?.respuesta_final ||
            d?.json?.bot ||
            d?.json?.mensaje ||
            d?.json?.output ||
            d?.json?.respuesta_final ||
            undefined
          )
        }

        const textoBot = extraerTextoBot(data) || '¡Gracias por tu mensaje! Te responderemos pronto.'
        const tipoBot: Mensaje['tipo'] = (data && (data.tipo || data?.json?.tipo)) || 'texto'

        console.log('✅ Respuesta webhook', {
          status: response.status,
          contentType,
          dataPreview: typeof data === 'string' ? data : (data ? JSON.stringify(data).slice(0, 300) : null)
        })

        // Agregar respuesta del bot
        const mensajeBot: Mensaje = {
          id: `msg_${Date.now()}_bot`,
          texto: textoBot,
          esUsuario: false,
          timestamp: new Date(),
          tipo: tipoBot
        }

        setTimeout(() => {
          setMensajes(prev => [...prev, mensajeBot])
          setEscribiendo(false)
        }, 800)

        // Guardar mensaje del bot en Supabase (no bloqueante)
        registrarMensajeSupabase(chatId, { type: 'ai', content: textoBot, metadata: { tipo: tipoBot } }).catch(() => {})

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
    // No resetear chatPuedeIniciar ni mensajes para mantener el estado
    // Solo resetear si es necesario para la funcionalidad
  }
  
  return (
    <>
      {/* Botón flotante del chat */}
      <div className={`chat-widget-container ${chatAbierto ? 'chat-abierto' : ''}`}>
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
                    {mensajes.map((mensaje) => {
                      const urls = extraerUrls(mensaje.texto)
                      const imagenes = urls.filter(esImagenUrl).map(transformarDriveUrl)
                      return (
                        <div
                          key={mensaje.id}
                          className={`mensaje ${mensaje.esUsuario ? 'usuario' : 'bot'} ${mensaje.tipo}`}
                        >
                          <div className="mensaje-contenido">
                            <div className="mensaje-cuerpo">{renderContenidoMensaje(mensaje.texto)}</div>
                            <span className="mensaje-tiempo">
                              {mensaje.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    
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
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="sentences"
                      spellCheck="true"
                      inputMode="text"
                      enterKeyHint="send"
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
      
      {/* Modal eliminado: la captura de datos ahora ocurre dentro del chat */}
    </>
  )
}