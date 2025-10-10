import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contextos/ContextoAutenticacion'

// Guard de ruta para área Admin: requiere sesión y rol admin
export default function RutaAdmin({ children }) {
  const { sesionInicializada, esAdmin, cargando, usuario } = useAuth()
  const location = useLocation()

  // Si tenemos sesión pero aún no se ha resuelto el rol, mantenemos loader
  const esperandoRol = sesionInicializada && !!usuario && typeof usuario.rol === 'undefined'
  const mostrandoCargando = cargando || esperandoRol

  // Mostrar loader mientras auth no ha terminado o el rol aún se está resolviendo
  if (mostrandoCargando) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        gap: '10px'
      }}>
        <div>Cargando área admin...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Verificando permisos...
        </div>
      </div>
    )
  }

  // No logueado: enviar a login y recordar ruta origen
  if (!sesionInicializada) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Logueado sin rol admin: enviar a inicio
  const esUsuarioAdmin = typeof esAdmin === 'function' ? esAdmin() : false
  if (!esUsuarioAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}