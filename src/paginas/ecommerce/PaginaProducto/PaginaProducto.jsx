import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usarProducto } from '../../../hooks/usarProducto'
import { usarLandingData } from '../../../hooks/usarLandingData'
import LandingPage from '../../../componentes/landing/LandingPage'
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2,
  Package,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Tag,
  Globe,
  User
} from 'lucide-react'

/**
 * PaginaProducto - Página que detecta automáticamente la plantilla del producto
 * 
 * Esta página ahora funciona como un router inteligente que:
 * 1. Carga el producto
 * 2. Detecta qué plantilla tiene asignada (landing_tipo)
 * 3. Renderiza automáticamente la plantilla correcta
 * 
 * Ya NO necesitas hacer clic en "Ver Landing Page", se detecta automáticamente
 */
export default function PaginaProducto() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  // Usar los hooks para cargar datos
  const { producto, cargando, error } = usarProducto(slug)
  const { 
    landingConfig, 
    reviews, 
    notificaciones, 
    cargando: cargandoLanding 
  } = usarLandingData(producto?.id)

  // Estado de carga
  if (cargando || cargandoLanding) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Cargando producto y detectando plantilla...</p>
      </div>
    )
  }

  // Estado de error
  if (error || !producto) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <AlertCircle size={48} color="#e74c3c" />
        <h2>Producto no encontrado</h2>
        <p>{error || 'El producto que buscas no existe o no está disponible'}</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={20} />
          Volver al inicio
        </button>
      </div>
    )
  }

  // 🎯 DETECCIÓN AUTOMÁTICA DE PLANTILLA
  const tipoPlantilla = producto?.landing_tipo || 'catalogo'
  
  console.log('🎨 Auto-detectando plantilla para producto:', producto.nombre)
  console.log('📋 Tipo de plantilla detectado:', tipoPlantilla)
  console.log('📊 Datos de landing cargados:', { landingConfig, reviews, notificaciones })

  // 🚀 RENDERIZAR AUTOMÁTICAMENTE LA PLANTILLA CORRECTA
  return (
    <div className="pagina-producto-auto">
      <LandingPage 
        producto={producto}
        config={landingConfig}
        reviews={reviews}
        notificaciones={notificaciones}
      />

      {/* Estilos para animación de carga */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}
