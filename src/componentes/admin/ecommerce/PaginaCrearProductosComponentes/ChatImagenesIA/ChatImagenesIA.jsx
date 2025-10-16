import React, { useState, useEffect, useRef } from 'react'
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  Camera, 
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { clienteSupabase } from '../../../../../configuracion/supabase'
import './ChatImagenesIA.css'

const ChatImagenesIA = ({ 
  mostrar, 
  onCerrar, 
  producto,
  onImagenesGeneradas 
}) => {
  const [mensajes, setMensajes] = useState([])
  const [mensajeActual, setMensajeActual] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [sessionId] = useState(`img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const mensajesRef = useRef(null)

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight
    }
  }, [mensajes])

  // Mensaje de bienvenida cuando se abre el chat
  useEffect(() => {
    if (mostrar && producto && mensajes.length === 0) {
      const esBorrador = producto.id && producto.id.startsWith('borrador-')
      const nombreProducto = producto.nombre === 'Producto sin nombre' ? 'tu producto' : producto.nombre
      
      const mensajeBienvenida = {
        id: Date.now(),
        tipo: 'ia',
        texto: `¡Hola! 👋 Soy tu asistente de imágenes con IA.

${esBorrador ? 
  `Voy a ayudarte a generar imágenes increíbles para **${nombreProducto}**.

💡 **Tip:** Puedes generar imágenes incluso antes de guardar el producto.` :
  `Voy a ayudarte a generar imágenes increíbles para tu producto:
**"${nombreProducto}"**`
}

Puedes pedirme:
🎨 Generar imágenes profesionales
📸 Crear variaciones de estilo
🖼️ Combinar imágenes existentes
✨ Editar imágenes actuales

¿Qué tipo de imagen quieres crear?`,
        timestamp: new Date(),
        imagenes: []
      }
      setMensajes([mensajeBienvenida])
    }
  }, [mostrar, producto, mensajes.length])

  const enviarMensaje = async () => {
    if (!mensajeActual.trim() || cargando) return

    const nuevoMensajeUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      texto: mensajeActual.trim(),
      timestamp: new Date()
    }

    setMensajes(prev => [...prev, nuevoMensajeUsuario])
    setMensajeActual('')
    setCargando(true)
    setError('')

    try {
      // Preparar datos para enviar al webhook de N8N (formato original que funcionaba)
      const datosWebhook = {
        session_id: sessionId,
        message: {
          text: mensajeActual.trim()
        },
        producto_info: {
          id: producto?.id,
          nombre: producto?.nombre,
          descripcion: producto?.descripcion,
          categoria_id: producto?.categoria_id,
          fotos_principales: producto?.fotos_principales || [],
          fotos_secundarias: producto?.fotos_secundarias || []
        }
      }

      console.log('🚀 Enviando a N8N (formato original):', datosWebhook)

      // Webhook URL
      const webhookUrl = 'https://velostrategix-n8n.lnrubg.easypanel.host/webhook-test/generar-imagenes-ia'
      
      const respuesta = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosWebhook)
      })

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`)
      }

      const resultado = await respuesta.json()
      console.log('📥 Respuesta de N8N:', resultado)

      // Procesar respuesta de la IA (formato original)
      const mensajeIA = {
        id: Date.now() + 1,
        tipo: 'ia',
        texto: resultado.output || resultado.message || 'Imagen generada exitosamente',
        timestamp: new Date(),
        imagenes: resultado.imagenes || []
      }

      setMensajes(prev => [...prev, mensajeIA])

      // Si se generaron imágenes, notificar al componente padre
      if (resultado.imagenes && resultado.imagenes.length > 0) {
        onImagenesGeneradas && onImagenesGeneradas(resultado.imagenes)
      }

    } catch (error) {
      console.error('❌ Error enviando mensaje:', error)
      setError(`Error: ${error.message}`)
      
      const mensajeError = {
        id: Date.now() + 1,
        tipo: 'error',
        texto: `Lo siento, hubo un error al procesar tu solicitud: ${error.message}`,
        timestamp: new Date()
      }
      
      setMensajes(prev => [...prev, mensajeError])
    } finally {
      setCargando(false)
    }
  }

  const manejarKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  const [imagenTemporal, setImagenTemporal] = useState(null)
  const [pieDeFoto, setPieDeFoto] = useState('')

  const subirImagenASupabase = async (archivo) => {
    try {
      const nombreArchivo = `chat-imagenes/${Date.now()}-${archivo.name}`
      
      const { data, error } = await clienteSupabase.storage
        .from('imagenes')
        .upload(nombreArchivo, archivo)
      
      if (error) throw error
      
      const { data: urlData } = clienteSupabase.storage
        .from('imagenes')
        .getPublicUrl(nombreArchivo)
      
      return urlData.publicUrl
    } catch (error) {
      console.error('Error subiendo imagen a Supabase:', error)
      throw error
    }
  }

  const manejarSubidaImagen = async (evento) => {
    const archivo = evento.target.files[0]
    if (!archivo) return

    try {
      setCargando(true)
      
      // INTENTAR SUBIR A SUPABASE PRIMERO (como antes)
      try {
        const urlSupabase = await subirImagenASupabase(archivo)
        console.log('✅ Imagen subida a Supabase:', urlSupabase)
        
        // Convertir imagen a base64 para preview local
        const reader = new FileReader()
        reader.onload = (e) => {
          const imagenBase64 = e.target.result
          
          // Guardar imagen temporal con URL de Supabase
          setImagenTemporal({
            base64: imagenBase64, // Para preview local
            url: urlSupabase, // URL real de Supabase
            nombre: archivo.name
          })
          setPieDeFoto('')
          setCargando(false)
        }
        
        reader.onerror = () => {
          setError('Error leyendo la imagen para preview')
          setCargando(false)
        }
        
        reader.readAsDataURL(archivo)
        
      } catch (supabaseError) {
        console.warn('⚠️ Error con Supabase, usando base64:', supabaseError.message)
        
        // FALLBACK: Usar base64 si Supabase falla
        const reader = new FileReader()
        reader.onload = (e) => {
          const imagenBase64 = e.target.result
          
          console.log('✅ Usando base64 como fallback:', archivo.name)
          
          // Guardar imagen temporal con base64
          setImagenTemporal({
            base64: imagenBase64, // Para preview local
            url: imagenBase64, // Base64 como fallback
            nombre: archivo.name
          })
          setPieDeFoto('')
          setCargando(false)
        }
        
        reader.onerror = () => {
          setError('Error leyendo la imagen')
          setCargando(false)
        }
        
        reader.readAsDataURL(archivo)
      }
      
    } catch (error) {
      setError('Error procesando imagen: ' + error.message)
      setCargando(false)
    }
  }

  const enviarImagenConPie = async () => {
    if (!imagenTemporal) return

    try {
      setCargando(true)
      setError('')

      // Crear mensaje para mostrar en el chat (usando URL de Supabase)
      const mensajeImagen = {
        id: Date.now(),
        tipo: 'usuario',
        texto: pieDeFoto.trim() || 'Imagen enviada',
        timestamp: new Date(),
        imagenes: [imagenTemporal.url] // Usar URL de Supabase para mostrar en chat
      }
      
      setMensajes(prev => [...prev, mensajeImagen])

      // Detectar si es URL de Supabase o base64
      const esUrlSupabase = imagenTemporal.url.startsWith('http')
      const esBase64 = imagenTemporal.url.startsWith('data:image')
      
      // Preparar datos para enviar al webhook (formato original)
      const datosWebhook = {
        session_id: sessionId,
        message: pieDeFoto.trim() || 'Imagen enviada',
        ...(esUrlSupabase ? 
          { image_url: imagenTemporal.url } : // URL de Supabase
          { image: imagenTemporal.url }       // Base64
        ),
        producto_info: {
          id: producto?.id,
          nombre: producto?.nombre,
          descripcion: producto?.descripcion,
          categoria_id: producto?.categoria_id,
          fotos_principales: producto?.fotos_principales || [],
          fotos_secundarias: producto?.fotos_secundarias || []
        },
        timestamp: new Date().toISOString()
      }

      console.log('🖼️ Enviando imagen con pie de foto a N8N:', {
        session_id: datosWebhook.session_id,
        message: datosWebhook.message,
        tipo_imagen: esUrlSupabase ? 'URL_SUPABASE' : 'BASE64',
        ...(esUrlSupabase ? 
          { image_url: datosWebhook.image_url } : 
          { image_size: datosWebhook.image?.length || 0 }
        ),
        producto_info: datosWebhook.producto_info
      })

      // Webhook URL
      const webhookUrl = 'https://velostrategix-n8n.lnrubg.easypanel.host/webhook-test/generar-imagenes-ia'
      
      const respuesta = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosWebhook)
      })

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`)
      }

      const resultado = await respuesta.json()
      console.log('📥 Respuesta de N8N para imagen:', resultado)

      // Procesar respuesta de la IA
      let textoRespuesta = 'Imagen procesada exitosamente'
      let imagenesGeneradas = []

      // Procesar la respuesta de N8N (igual que en enviarMensaje)
      let datosRespuesta = resultado
      if (Array.isArray(resultado) && resultado.length > 0) {
        datosRespuesta = resultado[0]
      }
      if (datosRespuesta.output) {
        datosRespuesta = datosRespuesta.output
      }
      if (typeof datosRespuesta === 'string') {
        try {
          datosRespuesta = JSON.parse(datosRespuesta)
        } catch (e) {
          // Si no es JSON, usar como texto
        }
      }

      if (datosRespuesta.message) {
        textoRespuesta = datosRespuesta.message
      } else if (datosRespuesta.text) {
        textoRespuesta = datosRespuesta.text
      } else if (typeof datosRespuesta === 'string') {
        textoRespuesta = datosRespuesta
      }

      if (datosRespuesta.imagenes && Array.isArray(datosRespuesta.imagenes)) {
        imagenesGeneradas = datosRespuesta.imagenes
        onImagenesGeneradas && onImagenesGeneradas(imagenesGeneradas)
      }

      const respuestaIA = {
        id: Date.now() + 1,
        tipo: 'ia',
        texto: textoRespuesta,
        timestamp: new Date(),
        imagenes: imagenesGeneradas
      }
      
      setMensajes(prev => [...prev, respuestaIA])
      
    } catch (error) {
      console.error('❌ Error enviando imagen al webhook:', error)
      setError(`Error enviando imagen: ${error.message}`)
      
      const mensajeError = {
        id: Date.now() + 1,
        tipo: 'ia',
        texto: `Lo siento, hubo un error al procesar la imagen: ${error.message}`,
        timestamp: new Date(),
        imagenes: []
      }
      
      setMensajes(prev => [...prev, mensajeError])
    } finally {
      setCargando(false)
      // Limpiar imagen temporal y pie de foto
      setImagenTemporal(null)
      setPieDeFoto('')
    }
  }

  const cancelarImagen = () => {
    setImagenTemporal(null)
    setPieDeFoto('')
  }

  return (
    <div className="chat-imagenes-ia">
      {/* Header del Chat */}
      <div className="chat-header">
        <div className="chat-header-info">
          <button 
            className="boton-volver"
            onClick={onCerrar}
          >
            <X className="icono" />
            Cerrar Chat
          </button>
          
          <div className="chat-titulo">
            <div className="titulo-principal">
              <Camera className="icono-titulo" />
              <h2>Chat de Imágenes IA</h2>
            </div>
            <div className="subtitulo">
              {producto?.id?.startsWith('borrador-') ? 
                'Borrador: ' : 
                'Producto: '
              }
              <strong>
                {producto?.nombre === 'Producto sin nombre' ? 
                  'Sin nombre definido' : 
                  producto?.nombre
                }
              </strong>
            </div>
          </div>
        </div>

        <div className="chat-estado">
          <div className="estado-conexion">
            <div className="punto-verde"></div>
            <span>Conectado</span>
          </div>
        </div>
      </div>

      {/* Mensajes del Chat */}
      <div className="chat-mensajes" ref={mensajesRef}>
        {mensajes.map((mensaje) => (
          <div key={mensaje.id} className={`mensaje ${mensaje.tipo}`}>
            <div className="mensaje-contenido">
              <div className="mensaje-avatar">
                {mensaje.tipo === 'usuario' ? '👤' : mensaje.tipo === 'error' ? '⚠️' : '🤖'}
              </div>
              
              <div className="mensaje-cuerpo">
                <div className="mensaje-texto">
                  {mensaje.texto}
                </div>
                
                {/* Mostrar imágenes si las hay */}
                {mensaje.imagenes && mensaje.imagenes.length > 0 && (
                  <div className="mensaje-imagenes">
                    {mensaje.imagenes.map((imagen, index) => (
                      <div key={index} className="imagen-generada">
                        <img 
                          src={imagen} 
                          alt={`Imagen generada ${index + 1}`}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div className="imagen-error" style={{display: 'none'}}>
                          <AlertCircle size={20} />
                          <span>Error cargando imagen</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mensaje-timestamp">
                  {mensaje.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de carga */}
        {cargando && (
          <div className="mensaje ia cargando">
            <div className="mensaje-contenido">
              <div className="mensaje-avatar">🤖</div>
              <div className="mensaje-cuerpo">
                <div className="mensaje-texto">
                  <Loader2 className="icono-girando" />
                  Generando imagen...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="chat-error">
          <AlertCircle className="icono" />
          {error}
        </div>
      )}

      {/* Preview de imagen con pie de foto */}
      {imagenTemporal && (
        <div className="preview-imagen-pie">
          <div className="preview-header">
            <h4>📸 Agregar pie de foto a tu imagen</h4>
          </div>
          
          <div className="preview-contenido">
            <div className="imagen-preview">
              <img src={imagenTemporal.base64} alt="Preview" />
            </div>
            
            <div className="pie-foto-input">
              <textarea
                value={pieDeFoto}
                onChange={(e) => setPieDeFoto(e.target.value)}
                placeholder="Escribe una descripción para tu imagen (opcional)..."
                rows="2"
                maxLength="200"
              />
              <div className="contador-caracteres">
                {pieDeFoto.length}/200
              </div>
            </div>
          </div>
          
          <div className="preview-acciones">
            <button 
              className="boton-cancelar-preview"
              onClick={cancelarImagen}
            >
              <X className="icono" />
              Cancelar
            </button>
            <button 
              className="boton-enviar-preview"
              onClick={enviarImagenConPie}
            >
              <Send className="icono" />
              Enviar Imagen
            </button>
          </div>
        </div>
      )}

       {/* Input del Chat */}
       <div className="chat-input">
         <div className="input-acciones">
           <label className="boton-subir-imagen" title="Subir imagen">
             <ImageIcon className="icono" />
             <input
               type="file"
               accept="image/*"
               onChange={manejarSubidaImagen}
               style={{ display: 'none' }}
             />
           </label>
         </div>

        <div className="input-mensaje">
          <textarea
            value={mensajeActual}
            onChange={(e) => setMensajeActual(e.target.value)}
            onKeyPress={manejarKeyPress}
            placeholder="Describe la imagen que quieres generar..."
            rows="1"
            disabled={cargando}
          />
        </div>

        <button 
          className="boton-enviar"
          onClick={enviarMensaje}
          disabled={!mensajeActual.trim() || cargando}
        >
          {cargando ? (
            <Loader2 className="icono icono-girando" />
          ) : (
            <Send className="icono" />
          )}
        </button>
      </div>

      {/* Footer con información */}
      <div className="chat-footer">
        <div className="footer-info">
          <Sparkles className="icono" />
          <span>Powered by Nano Banana AI • Session: {sessionId.slice(-8)}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatImagenesIA
