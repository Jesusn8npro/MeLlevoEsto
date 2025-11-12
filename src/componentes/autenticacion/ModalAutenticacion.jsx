import React, { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { clienteSupabase } from '../../configuracion/supabase'
import styles from './ModalAutenticacion.module.css'

export default function ModalAutenticacion({ abierto, onCerrar }) {
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const { iniciarSesion, registrarse, obtenerRutaRedireccion, usuario } = useAuth()

  const [vistaRegistro, setVistaRegistro] = useState(false)
  const [vistaRecuperar, setVistaRecuperar] = useState(false)
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mostrarContrasenaRegistro, setMostrarContrasenaRegistro] = useState(false)
  const [error, setError] = useState('')
  const [mensajeRecuperar, setMensajeRecuperar] = useState('')

  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [emailRegistro, setEmailRegistro] = useState('')
  const [contrasenaRegistro, setContrasenaRegistro] = useState('')

  const [emailRecuperar, setEmailRecuperar] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (abierto && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100)
  }, [abierto])

  useEffect(() => { if (!abierto) limpiarFormularios() }, [abierto])

  useEffect(() => { if (abierto && usuario) onCerrar() }, [abierto, usuario])

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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
        onCerrar()
        setTimeout(() => navigate(obtenerRutaRedireccion()), 500)
      }
    } catch {
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
    try {
      const resultado = await registrarse(emailRegistro, contrasenaRegistro, { nombre: `${nombre} ${apellido}` })
      if (!resultado.success) {
        setError(resultado.error)
        setCargando(false)
      } else {
        onCerrar()
        setTimeout(() => navigate(obtenerRutaRedireccion()), 500)
      }
    } catch {
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
      setMensajeRecuperar(error ? error.message : '✅ Revisa tu correo para restablecer tu contraseña')
    } catch {
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
        options: { redirectTo: window.location.origin }
      })
      if (error) setError(error.message)
    } catch {
      setError('Error de conexión con Google. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  const manejarClickModal = (e) => { if (e.target === e.currentTarget) onCerrar() }

  if (!abierto) return null

  return (
    <div className={styles.overlay} onClick={manejarClickModal}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onCerrar} aria-label="Cerrar modal">
          <X size={24} />
        </button>
        <div className={styles.content}>
          <div className={styles.logoWrapper}>
            <h1 className={styles.logoText}>ME LLEVO ESTO</h1>
            <span className={styles.logoDomain}>.com</span>
          </div>
          {vistaRecuperar ? (
            <div className={styles.formSection}>
              <h2 className={styles.title}>Recuperar Contraseña</h2>
              <p className={styles.subtitle}>Ingresa tu correo y te enviaremos un enlace.</p>
              <form className={styles.form} onSubmit={manejarRecuperacion}>
                <div className={styles.inputGroup}>
                  <label htmlFor="emailRecuperar">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
                    <input id="emailRecuperar" ref={inputRef} type="email" value={emailRecuperar} onChange={(e) => setEmailRecuperar(e.target.value)} placeholder="ejemplo@correo.com" required />
                    <Mail className={styles.inputIcon} size={20} />
                  </div>
                </div>
                {mensajeRecuperar && (<div className={`${styles.message} ${mensajeRecuperar.includes('✅') ? styles.isSuccess : styles.isError}`}>{mensajeRecuperar}</div>)}
                <button type="submit" className={styles.submitButton} disabled={cargando}>{cargando ? 'Enviando...' : 'Enviar Enlace'}</button>
              </form>
              <div className={styles.links}>
                <button type="button" className={styles.link} onClick={() => { setVistaRecuperar(false); setMensajeRecuperar(''); setEmailRecuperar('') }}>Volver a Iniciar Sesión</button>
              </div>
            </div>
          ) : !vistaRegistro ? (
            <div className={styles.formSection}>
              <h2 className={styles.title}>¡Bienvenido de nuevo!</h2>
              <p className={styles.subtitle}>Accede a tu cuenta para disfrutar de todos los beneficios.</p>
              <form className={styles.form} onSubmit={manejarLogin}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
                    <input id="email" ref={inputRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
                    <Mail className={styles.inputIcon} size={20} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="contrasena">Contraseña</label>
                  <div className={styles.inputWrapper}>
                    <input id="contrasena" type={mostrarContrasena ? 'text' : 'password'} value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Tu contraseña" required />
                    <button type="button" className={styles.showPassword} onClick={() => setMostrarContrasena(!mostrarContrasena)} aria-label={mostrarContrasena ? 'Ocultar' : 'Mostrar'}>
                      {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {error && (<div className={`${styles.message} ${styles.isError}`}>{error}</div>)}
                <button type="submit" className={styles.submitButton} disabled={cargando}>{cargando ? 'Ingresando...' : 'Entrar'}</button>
              </form>
              <div className={styles.separator}><span>o continúa con</span></div>
              <div className={styles.socialButtons}>
                <button type="button" className={`${styles.socialButton} ${styles.isGoogle}`} onClick={manejarGoogleLogin} disabled={cargando}>
                  <svg className={styles.googleIcon} viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>{cargando ? 'Conectando...' : 'Continuar con Google'}</span>
                </button>
              </div>
              <div className={styles.links}>
                <button type="button" className={styles.link} onClick={() => setVistaRecuperar(true)}>¿Olvidaste tu contraseña?</button>
                <button type="button" className={styles.link} onClick={() => setVistaRegistro(true)}>¿No tienes cuenta? <strong>Regístrate</strong></button>
              </div>
            </div>
          ) : (
            <div className={styles.formSection}>
              <h2 className={styles.title}>Crear Cuenta Nueva</h2>
              <p className={styles.subtitle}>Únete y accede a beneficios exclusivos.</p>
              <form className={styles.form} onSubmit={manejarRegistro}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <div className={styles.inputWrapper}>
                      <input id="nombre" ref={inputRef} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan" required />
                      <User className={styles.inputIcon} size={20} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="apellido">Apellido</label>
                    <div className={styles.inputWrapper}>
                      <input id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Pérez" required />
                      <User className={styles.inputIcon} size={20} />
                    </div>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="emailRegistro">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
                    <input id="emailRegistro" type="email" value={emailRegistro} onChange={(e) => setEmailRegistro(e.target.value)} placeholder="ejemplo@correo.com" required />
                    <Mail className={styles.inputIcon} size={20} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="contrasenaRegistro">Contraseña</label>
                  <div className={styles.inputWrapper}>
                    <input id="contrasenaRegistro" type={mostrarContrasenaRegistro ? 'text' : 'password'} value={contrasenaRegistro} onChange={(e) => setContrasenaRegistro(e.target.value)} placeholder="Mínimo 6 caracteres" required />
                    <button type="button" className={styles.showPassword} onClick={() => setMostrarContrasenaRegistro(!mostrarContrasenaRegistro)} aria-label={mostrarContrasenaRegistro ? 'Ocultar' : 'Mostrar'}>
                      {mostrarContrasenaRegistro ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {error && (<div className={`${styles.message} ${styles.isError}`}>{error}</div>)}
                <button type="submit" className={styles.submitButton} disabled={cargando}>{cargando ? 'Registrando...' : 'Crear Cuenta'}</button>
              </form>
              <div className={styles.links}>
                <button type="button" className={styles.link} onClick={() => setVistaRegistro(false)}>¿Ya tienes cuenta? <strong>Inicia Sesión</strong></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
