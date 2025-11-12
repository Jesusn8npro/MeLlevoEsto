import React, { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { clienteSupabase } from '../../configuracion/supabase'
<<<<<<< HEAD
import styles from './ModalAutenticacion.module.css'
=======
import './ModalAutenticacion.css'
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc

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
<<<<<<< HEAD
    <div className={styles.overlay} onClick={manejarClickModal}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Botón de cierre */}
        <button 
          className={styles.closeButton} 
=======
    <div className="fondo-modal-auth" onClick={manejarClickModal}>
      <div className="modal-inicio-sesion" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button 
          className="boton-cerrar-modal" 
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>

<<<<<<< HEAD
        {/* Contenido principal */}
        <div className={styles.content}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <h1 className={styles.logoText}>ME LLEVO ESTO</h1>
            <span className={styles.logoDomain}>.com</span>
          </div>

          {vistaRecuperar ? (
            // Vista de Recuperar Contraseña
            <div className={styles.formSection}>
              <h2 className={styles.title}>Recuperar Contraseña</h2>
              <p className={styles.subtitle}>
                Ingresa tu correo y te enviaremos un enlace para que la recuperes.
              </p>
              
              <form className={styles.form} onSubmit={manejarRecuperacion}>
                <div className={styles.inputGroup}>
                  <label htmlFor="emailRecuperar">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
=======
        {/* Logo y branding */}
        <div className="logo-modal">
          <div className="logo-contenedor">
            <h1 className="logo-texto">ME LLEVO ESTO</h1>
            <span className="logo-dominio">.com</span>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="contenido-modal-auth">
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
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    <input
                      id="emailRecuperar"
                      ref={inputRef}
                      type="email"
                      value={emailRecuperar}
                      onChange={(e) => setEmailRecuperar(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                    />
<<<<<<< HEAD
                    <Mail className={styles.inputIcon} size={20} />
=======
                    <Mail className="icono-input" size={20} />
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                  </div>
                </div>

                {mensajeRecuperar && (
<<<<<<< HEAD
                  <div className={`${styles.message} ${mensajeRecuperar.includes('✅') ? styles.isSuccess : styles.isError}`}>
=======
                  <div className={`mensaje-info-auth ${mensajeRecuperar.includes('✅') ? 'success' : 'error'}`}>
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    {mensajeRecuperar}
                  </div>
                )}

<<<<<<< HEAD
                <button type="submit" className={styles.submitButton} disabled={cargando}>
                  {cargando ? 'Enviando...' : 'Enviar Enlace'}
                </button>
              </form>

              <div className={styles.links}>
                <button 
                  type="button" 
                  className={styles.link} 
=======
                <button type="submit" className="boton-enviar-auth" disabled={cargando}>
                  {cargando ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>

              <div className="enlaces-extra">
                <button 
                  type="button" 
                  className="enlace-olvido" 
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                  onClick={() => {
                    setVistaRecuperar(false)
                    setMensajeRecuperar('')
                    setEmailRecuperar('')
                  }}
                >
<<<<<<< HEAD
                  Volver a Iniciar Sesión
                </button>
              </div>
            </div>
          ) : !vistaRegistro ? (
            // Vista de Login
            <div className={styles.formSection}>
              <h2 className={styles.title}>¡Bienvenido de nuevo!</h2>
              <p className={styles.subtitle}>
                Accede a tu cuenta para disfrutar de todos los beneficios.
              </p>
              
              <form className={styles.form} onSubmit={manejarLogin}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
=======
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
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    <input
                      id="email"
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                    />
<<<<<<< HEAD
                    <Mail className={styles.inputIcon} size={20} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="contrasena">Contraseña</label>
                  <div className={styles.inputWrapper}>
=======
                    <Mail className="icono-input" size={20} />
                  </div>
                </div>

                <div className="campo-formulario">
                  <label htmlFor="contrasena">Contraseña</label>
                  <div className="input-icono">
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
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
<<<<<<< HEAD
                      className={styles.showPassword}
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      aria-label={mostrarContrasena ? 'Ocultar' : 'Mostrar'}
=======
                      className="boton-mostrar-contrasena"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    >
                      {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
<<<<<<< HEAD
                  <div className={`${styles.message} ${styles.isError}`}>{error}</div>
                )}

                <button type="submit" className={styles.submitButton} disabled={cargando}>
=======
                  <div className="mensaje-error-auth">{error}</div>
                )}

                <button type="submit" className="boton-enviar-auth" disabled={cargando}>
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                  {cargando ? 'Ingresando...' : 'Entrar'}
                </button>
              </form>

<<<<<<< HEAD
              <div className={styles.separator}>
                <span>o continúa con</span>
              </div>

              <div className={styles.socialButtons}>
                <button 
                  type="button" 
                  className={`${styles.socialButton} ${styles.isGoogle}`} 
                  onClick={manejarGoogleLogin}
                  disabled={cargando}
                >
                  <svg className={styles.googleIcon} viewBox="0 0 24 24">
=======
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
                  className="boton-google-auth" 
                  onClick={manejarGoogleLogin}
                  disabled={cargando}
                >
                  <svg className="google-icon" viewBox="0 0 24 24" fill="none">
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
<<<<<<< HEAD
                  <span>{cargando ? 'Conectando...' : 'Continuar con Google'}</span>
                </button>
              </div>

              <div className={styles.links}>
                <button 
                  type="button" 
                  className={styles.link} 
=======
                  <span className="google-texto">
                    {cargando ? 'Conectando...' : 'Continuar con Google'}
                  </span>
                </button>
              </div>

              <div className="enlaces-extra">
                <button 
                  type="button" 
                  className="enlace-olvido" 
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                  onClick={() => setVistaRecuperar(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <button 
                  type="button" 
<<<<<<< HEAD
                  className={styles.link} 
                  onClick={() => setVistaRegistro(true)}
                >
                  ¿No tienes cuenta? <strong>Regístrate</strong>
                </button>
              </div>
            </div>
          ) : (
            // Vista de Registro
            <div className={styles.formSection}>
              <h2 className={styles.title}>Crear Cuenta Nueva</h2>
              <p className={styles.subtitle}>
                Únete y accede a beneficios exclusivos.
              </p>
              
              <form className={styles.form} onSubmit={manejarRegistro}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <div className={styles.inputWrapper}>
=======
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
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                      <input
                        id="nombre"
                        ref={inputRef}
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
<<<<<<< HEAD
                        placeholder="Juan"
                        required
                      />
                      <User className={styles.inputIcon} size={20} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="apellido">Apellido</label>
                    <div className={styles.inputWrapper}>
=======
                        placeholder="Ej: Juan"
                        required
                      />
                      <User className="icono-input" size={20} />
                    </div>
                  </div>
                  <div className="campo-formulario">
                    <label htmlFor="apellido">Apellido</label>
                    <div className="input-icono">
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                      <input
                        id="apellido"
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
<<<<<<< HEAD
                        placeholder="Pérez"
                        required
                      />
                      <User className={styles.inputIcon} size={20} />
=======
                        placeholder="Ej: Pérez"
                        required
                      />
                      <User className="icono-input" size={20} />
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                <div className={styles.inputGroup}>
                  <label htmlFor="emailRegistro">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
=======
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
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    <input
                      id="emailRegistro"
                      type="email"
                      value={emailRegistro}
                      onChange={(e) => setEmailRegistro(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      required
                    />
<<<<<<< HEAD
                    <Mail className={styles.inputIcon} size={20} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="contrasenaRegistro">Contraseña</label>
                  <div className={styles.inputWrapper}>
=======
                    <Mail className="icono-input" size={20} />
                  </div>
                </div>

                <div className="campo-formulario">
                  <label htmlFor="contrasenaRegistro">Contraseña</label>
                  <div className="input-icono">
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    <input
                      id="contrasenaRegistro"
                      type={mostrarContrasenaRegistro ? 'text' : 'password'}
                      value={contrasenaRegistro}
                      onChange={(e) => setContrasenaRegistro(e.target.value)}
<<<<<<< HEAD
                      placeholder="Mínimo 6 caracteres"
=======
                      placeholder="Crea una contraseña segura"
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                      required
                    />
                    <button
                      type="button"
<<<<<<< HEAD
                      className={styles.showPassword}
                      onClick={() => setMostrarContrasenaRegistro(!mostrarContrasenaRegistro)}
                      aria-label={mostrarContrasenaRegistro ? 'Ocultar' : 'Mostrar'}
=======
                      className="boton-mostrar-contrasena"
                      onClick={() => setMostrarContrasenaRegistro(!mostrarContrasenaRegistro)}
                      aria-label={mostrarContrasenaRegistro ? 'Ocultar contraseña' : 'Mostrar contraseña'}
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
                    >
                      {mostrarContrasenaRegistro ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
<<<<<<< HEAD
                  <div className={`${styles.message} ${styles.isError}`}>{error}</div>
                )}

                <button type="submit" className={styles.submitButton} disabled={cargando}>
                  {cargando ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </form>

              <div className={styles.links}>
                <button 
                  type="button" 
                  className={styles.link} 
                  onClick={() => setVistaRegistro(false)}
                >
                  ¿Ya tienes cuenta? <strong>Inicia Sesión</strong>
                </button>
              </div>
            </div>
=======
                  <div className="mensaje-error-auth">{error}</div>
                )}

                <button type="submit" className="boton-enviar-auth" disabled={cargando}>
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
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
          )}
        </div>
      </div>
    </div>
  )
}
