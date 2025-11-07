import React, { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { clienteSupabase } from '../../configuracion/supabase'
import './ModalAutenticacion.css'

export default function ModalAutenticacion({ abierto, onCerrar }) {
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const { iniciarSesion, registrarse, sesionInicializada, obtenerRutaRedireccion, usuario } = useAuth()
  
  // Estados del modal
  const [vistaRegistro, setVistaRegistro] = useState(false)
  const [vistaRecuperar, setVistaRecuperar] = useState(false)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mostrarContrasenaRegistro, setMostrarContrasenaRegistro] = useState(false)
  const [error, setError] = useState('')
  const [mensajeRecuperar, setMensajeRecuperar] = useState('')

  // Campos de login
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')

  // Campos de registro
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [emailRegistro, setEmailRegistro] = useState('')
  const [contrasenaRegistro, setContrasenaRegistro] = useState('')
  const [telefono, setTelefono] = useState('')
  const [codigoPais, setCodigoPais] = useState('+57')

  // Recuperar contraseña
  const [emailRecuperar, setEmailRecuperar] = useState('')

  const inputRef = useRef(null)

  // Lista de países
  const paises = [
    { codigo: '+57', nombre: 'Colombia', bandera: '🇨🇴' },
    { codigo: '+52', nombre: 'México', bandera: '🇲🇽' },
    { codigo: '+1', nombre: 'Estados Unidos', bandera: '🇺🇸' },
    { codigo: '+34', nombre: 'España', bandera: '🇪🇸' },
    { codigo: '+54', nombre: 'Argentina', bandera: '🇦🇷' },
    { codigo: '+56', nombre: 'Chile', bandera: '🇨🇱' },
    { codigo: '+51', nombre: 'Perú', bandera: '🇵🇪' },
    { codigo: '+58', nombre: 'Venezuela', bandera: '🇻🇪' },
    { codigo: '+593', nombre: 'Ecuador', bandera: '🇪🇨' },
    { codigo: '+507', nombre: 'Panamá', bandera: '🇵🇦' }
  ]

  // Enfocar primer input cuando se abre
  useEffect(() => {
    if (abierto && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [abierto])

  // Limpiar formularios al cerrar
  useEffect(() => {
    if (!abierto) {
      limpiarFormularios()
    }
  }, [abierto])

  // Cerrar automáticamente sólo si el usuario está autenticado (incluye OAuth)
  useEffect(() => {
    if (abierto && usuario) {
      onCerrar()
    }
  }, [abierto, usuario])

  // Prevenir scroll del body
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  const limpiarFormularios = () => {
    setVistaRegistro(false)
    setVistaRecuperar(false)
    setMostrarContrasena(false)
    setMostrarContrasenaRegistro(false)
    setError('')
    setMensajeRecuperar('')
    setEmail('')
    setContrasena('')
    setNombre('')
    setApellido('')
    setEmailRegistro('')
    setContrasenaRegistro('')
    setTelefono('')
    setCodigoPais('+57')
    setEmailRecuperar('')
  }

  const manejarLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    if (!email || !contrasena) {
      setError('Por favor completa todos los campos')
      setCargando(false)
      return
    }

    try {
      const resultado = await iniciarSesion(email, contrasena)
      
      if (resultado.error) {
        setError(resultado.error)
        setCargando(false)
      } else {
        // Cerrar modal inmediatamente
        onCerrar()
        
        // Esperar un poco para que el contexto se actualice completamente
        setTimeout(() => {
          const rutaRedireccion = obtenerRutaRedireccion()
          console.log('🚀 Redirigiendo a:', rutaRedireccion)
          navigate(rutaRedireccion)
        }, 500)
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
      setCargando(false)
    }
  }

  const manejarRegistro = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    if (!nombre || !apellido || !emailRegistro || !contrasenaRegistro) {
      setError('Por favor completa todos los campos obligatorios')
      setCargando(false)
      return
    }

    if (contrasenaRegistro.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setCargando(false)
      return
    }

    const telefonoCompleto = telefono ? `${codigoPais}${telefono}` : undefined

    try {
      const resultado = await registrarse(emailRegistro, contrasenaRegistro, {
        nombre: `${nombre} ${apellido}`,
        telefono: telefonoCompleto
      })
      
      if (!resultado.success) {
        setError(resultado.error)
        setCargando(false)
      } else {
        // Cerrar modal inmediatamente
        onCerrar()
        
        // Esperar un poco para que el contexto se actualice completamente
        setTimeout(() => {
          const rutaRedireccion = obtenerRutaRedireccion()
          console.log('🚀 Redirigiendo después del registro a:', rutaRedireccion)
          navigate(rutaRedireccion)
        }, 500)
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
      setCargando(false)
    }
  }

  const manejarRecuperacion = async (e) => {
    e.preventDefault()
    setMensajeRecuperar('')
    setCargando(true)

    if (!emailRecuperar) {
      setMensajeRecuperar('Por favor ingresa tu email')
      setCargando(false)
      return
    }

    try {
      const { error } = await clienteSupabase.auth.resetPasswordForEmail(emailRecuperar, {
        redirectTo: `${window.location.origin}/restablecer-contrasena`
      })
      
      if (error) {
        setMensajeRecuperar(error.message)
      } else {
        setMensajeRecuperar('✅ Revisa tu correo para restablecer tu contraseña')
      }
    } catch (error) {
      setMensajeRecuperar('Error de conexión. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  const manejarGoogleLogin = async () => {
    setCargando(true)
    try {
      const { error } = await clienteSupabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      
      if (error) {
        setError(error.message)
      }
      // Si es exitoso, el modal se cerrará automáticamente por el useEffect
    } catch (error) {
      setError('Error de conexión con Google. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  const manejarClickModal = (e) => {
    if (e.target === e.currentTarget) {
      onCerrar()
    }
  }

  if (!abierto) return null

  return (
    <div className="fondo-modal" onClick={manejarClickModal}>
      <div className="modal-inicio-sesion" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button 
          className="boton-cerrar-modal" 
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>

        {/* Logo y branding */}
        <div className="logo-modal">
          <div className="logo-contenedor">
            <h1 className="logo-texto">ME LLEVO ESTO</h1>
            <span className="logo-dominio">.com</span>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="contenido-modal">
          {vistaRecuperar ? (
            // Vista de recuperar contraseña
            <>
              <h2 className="titulo-modal">Recuperar contraseña</h2>
              <p className="login-desc">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              
              <form className="formulario-inicio-sesion" onSubmit={manejarRecuperacion}>
                <div className="campo-formulario">
                  <label htmlFor="emailRecuperar">Correo electrónico</label>
                  <div className="input-icono">
                    <input
                      id="emailRecuperar"
                      ref={inputRef}
                      type="email"
                      value={emailRecuperar}
                      onChange={(e) => setEmailRecuperar(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                    <Mail className="icono-input" size={20} />
                  </div>
                </div>

                {mensajeRecuperar && (
                  <div className={`mensaje-info ${mensajeRecuperar.includes('✅') ? 'success' : 'error'}`}>
                    {mensajeRecuperar}
                  </div>
                )}

                <button type="submit" className="boton-enviar" disabled={cargando}>
                  {cargando ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>

              <div className="enlaces-extra">
                <button 
                  type="button" 
                  className="enlace-olvido" 
                  onClick={() => {
                    setVistaRecuperar(false)
                    setMensajeRecuperar('')
                    setEmailRecuperar('')
                  }}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </>
          ) : !vistaRegistro ? (
            // Vista de login
            <>
              <h2 className="titulo-modal">¡Bienvenido de nuevo!</h2>
              <p className="login-desc">
                Accede a tu cuenta para disfrutar de todos los beneficios de ME LLEVO ESTO.
              </p>
              
              <form className="formulario-inicio-sesion" onSubmit={manejarLogin}>
                <div className="campo-formulario">
                  <label htmlFor="email">Correo electrónico</label>
                  <div className="input-icono">
                    <input
                      id="email"
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                    <Mail className="icono-input" size={20} />
                  </div>
                </div>

                <div className="campo-formulario">
                  <label htmlFor="contrasena">Contraseña</label>
                  <div className="input-icono">
                    <input
                      id="contrasena"
                      type={mostrarContrasena ? 'text' : 'password'}
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      className="boton-mostrar-contrasena"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mensaje-error">{error}</div>
                )}

                <button type="submit" className="boton-enviar" disabled={cargando}>
                  {cargando ? 'Ingresando...' : 'Entrar'}
                </button>
              </form>

              {/* Separador */}
              <div className="separador-o">
                <div className="linea"></div>
                <span className="texto-o">o continúa con</span>
                <div className="linea"></div>
              </div>

              {/* Botón de Google */}
              <div className="botones-sociales">
                <button 
                  type="button" 
                  className="boton-google" 
                  onClick={manejarGoogleLogin}
                  disabled={cargando}
                >
                  <svg className="google-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="google-texto">
                    {cargando ? 'Conectando...' : 'Continuar con Google'}
                  </span>
                </button>
              </div>

              <div className="enlaces-extra">
                <button 
                  type="button" 
                  className="enlace-olvido" 
                  onClick={() => setVistaRecuperar(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <button 
                  type="button" 
                  className="enlace-registrarse" 
                  onClick={() => setVistaRegistro(true)}
                >
                  ¿No tienes cuenta? <b>Regístrate</b>
                </button>
              </div>
            </>
          ) : (
            // Vista de registro
            <>
              <h2 className="titulo-modal">Crear cuenta nueva</h2>
              <p className="login-desc">
                Únete a la comunidad y accede a todas las ofertas y beneficios exclusivos.
              </p>
              
              <form className="formulario-inicio-sesion" onSubmit={manejarRegistro}>
                <div className="fila-nombre-apellido">
                  <div className="campo-formulario">
                    <label htmlFor="nombre">Nombre</label>
                    <div className="input-icono">
                      <input
                        id="nombre"
                        ref={inputRef}
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Juan"
                        required
                      />
                      <User className="icono-input" size={20} />
                    </div>
                  </div>
                  <div className="campo-formulario">
                    <label htmlFor="apellido">Apellido</label>
                    <div className="input-icono">
                      <input
                        id="apellido"
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        placeholder="Ej: Pérez"
                        required
                      />
                      <User className="icono-input" size={20} />
                    </div>
                  </div>
                </div>

                <div className="campo-formulario">
                  <label htmlFor="telefono">WhatsApp (opcional)</label>
                  <div className="input-whatsapp">
                    <div className="selector-pais-container">
                      <select 
                        className="selector-pais" 
                        value={codigoPais}
                        onChange={(e) => setCodigoPais(e.target.value)}
                      >
                        {paises.map((pais) => (
                          <option key={pais.codigo} value={pais.codigo}>
                            {pais.bandera} {pais.codigo}
                          </option>
                        ))}
                      </select>
                      <span className="flecha-selector">▼</span>
                    </div>
                    <div className="input-numero">
                      <input
                        id="telefono"
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Número sin código de país"
                      />
                      <Phone className="icono-input" size={20} />
                    </div>
                  </div>
                </div>

                <div className="campo-formulario">
                  <label htmlFor="emailRegistro">Correo electrónico</label>
                  <div className="input-icono">
                    <input
                      id="emailRegistro"
                      type="email"
                      value={emailRegistro}
                      onChange={(e) => setEmailRegistro(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                    <Mail className="icono-input" size={20} />
                  </div>
                </div>

                <div className="campo-formulario">
                  <label htmlFor="contrasenaRegistro">Contraseña</label>
                  <div className="input-icono">
                    <input
                      id="contrasenaRegistro"
                      type={mostrarContrasenaRegistro ? 'text' : 'password'}
                      value={contrasenaRegistro}
                      onChange={(e) => setContrasenaRegistro(e.target.value)}
                      placeholder="Crea una contraseña segura"
                      required
                    />
                    <button
                      type="button"
                      className="boton-mostrar-contrasena"
                      onClick={() => setMostrarContrasenaRegistro(!mostrarContrasenaRegistro)}
                      aria-label={mostrarContrasenaRegistro ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {mostrarContrasenaRegistro ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mensaje-error">{error}</div>
                )}

                <button type="submit" className="boton-enviar" disabled={cargando}>
                  {cargando ? 'Registrando...' : 'Registrarme'}
                </button>
              </form>

              <div className="enlaces-extra">
                <button 
                  type="button" 
                  className="enlace-olvido" 
                  onClick={() => setVistaRegistro(false)}
                >
                  ¿Ya tienes cuenta? <b>Inicia sesión</b>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
