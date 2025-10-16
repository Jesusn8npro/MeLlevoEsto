import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contextos/ContextoAutenticacion'
import DisposicionAdmin from '../../../componentes/admin/DisposicionAdmin/DisposicionAdmin'
import MetricasEcommerce from '../../../componentes/admin/ecommerce/Pagina_AdminPrincipal/MetricasEcommerce'
import PedidosRecientes from '../../../componentes/admin/ecommerce/Pagina_AdminPrincipal/PedidosRecientes'
import '../../../componentes/admin/ecommerce/Pagina_AdminPrincipal/EstilosEcommerceComponentes.css'
import './AdminDashboard.css'

const ContenidoDashboardAdmin = () => {
  const { usuario } = useAuth()

  return (
    <div className="admin-test-content">
      <div className="admin-test-header">
        <div>
          <h1 className="admin-test-title">Dashboard Ecommerce</h1>
          <p className="admin-test-subtitle">
            Bienvenido de vuelta, {usuario?.nombre?.split(' ')[0] || 'Admin'}
          </p>
        </div>
      </div>

      {/* Métricas de Ecommerce con datos reales */}
      <MetricasEcommerce />

      {/* Pedidos Recientes con datos reales */}
      <div style={{ marginTop: '2rem' }}>
        <PedidosRecientes />
      </div>
    </div>
  )
}

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const { usuario, cargando, sesionInicializada, esAdmin } = useAuth()
  const [yaVerificado, setYaVerificado] = useState(false)

  useEffect(() => {
    console.log('🔍 DashboardAdmin - Estado auth:', {
      cargando,
      sesionInicializada,
      usuario: usuario?.id,
      yaVerificado
    })

    // Solo verificar una vez cuando todo esté listo
    if (!cargando && !yaVerificado) {
      verificarAcceso()
      setYaVerificado(true)
    }
  }, [cargando, sesionInicializada, usuario, yaVerificado])

  const verificarAcceso = () => {
    console.log('🔍 Verificando acceso UNA SOLA VEZ...', { 
      sesionInicializada, 
      usuario: !!usuario 
    })
    
    // Marcar como verificado para evitar loops
    setYaVerificado(true)

    if (!sesionInicializada || !usuario) {
      console.log('🚪 No hay sesión o usuario, redirigiendo a login')
      navigate('/login')
      return
    }

    if (!esAdmin()) {
      console.log('🚫 Usuario no es admin, redirigiendo a home')
      navigate('/')
      return
    }
    
    console.log('✅ Acceso verificado correctamente - Usuario admin confirmado')
  }

  // Mostrar loading mientras esté cargando
  if (cargando) {
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
        <div>Cargando dashboard...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Verificando sesión...
        </div>
      </div>
    )
  }

  // Si ya se inicializó pero no hay usuario/sesión, mostrar loading un momento más
  if (!cargando && (!usuario || !sesionInicializada) && !yaVerificado) {
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
        <div>Verificando acceso...</div>
      </div>
    )
  }

  return (
    <DisposicionAdmin>
      <ContenidoDashboardAdmin />
    </DisposicionAdmin>
  )
}
