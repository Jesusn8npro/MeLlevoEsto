import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import TarjetaProductoLujo from '../../producto/TarjetaProductoLujo'
import { Flame, TrendingUp, Zap, Loader, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './SeccionProductosVendidos.css'

/**
 * SeccionProductosVendidos - Sección de productos más vendidos para la página de inicio
 * 
 * Características:
 * - Muestra los últimos productos publicados
 * - Reutiliza la funcionalidad del GridProductosVendedor
 * - Diseño responsivo y atractivo
 * - Enlace directo a la tienda completa
 */
export default function SeccionProductosVendidos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos más vendidos desde Supabase - MISMA LÓGICA QUE GridProductosVendedor
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        setError(null)

        // Consulta EXACTA como en GridProductosVendedor
        let query = clienteSupabase
          .from('productos')
          .select(`
            *,
            categorias (
              id,
              nombre,
              icono
            ),
            producto_imagenes (
              imagen_principal,
              imagen_secundaria_1,
              imagen_secundaria_2,
              imagen_secundaria_3,
              imagen_secundaria_4
            )
          `)
          .eq('activo', true)
          .or('stock.gt.0,estado.eq.vendido') // Productos con stock O productos vendidos
          .order('destacado', { ascending: false })
          .order('creado_el', { ascending: false })
          .limit(8)

        const { data, error: errorQuery } = await query

        if (errorQuery) {
          console.error('❌ Error cargando productos más vendidos:', {
            message: errorQuery.message,
            code: errorQuery.code,
            details: errorQuery.details,
            hint: errorQuery.hint
          })
          throw errorQuery
        }

        console.log('📦 Productos más vendidos cargados:', data?.length || 0)
        setProductos(data || [])
      } catch (err) {
        console.error('Error cargando productos más vendidos:', err)
        setError(err.message || 'Error cargando productos')
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  if (error) {
    return (
      <section className="seccion-productos-vendidos">
        <div className="contenedor-productos-vendidos">
          <div className="productos-vendidos-error">
            <AlertCircle size={48} />
            <h3>Error al cargar productos</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-reintentar">
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="seccion-productos-vendidos">
      <div className="contenedor-productos-vendidos">
        {/* Header de la sección */}
        <div className="productos-vendidos-header">
          <div className="header-contenido">
            <div className="header-badge">
              <Flame className="badge-icono" />
              <span>Más Vendidos</span>
            </div>
            <h2 className="productos-vendidos-titulo">
              Productos Más Vendidos
            </h2>
            <p className="productos-vendidos-subtitulo">
              Los últimos productos que están arrasando en ventas. ¡No te quedes sin el tuyo!
            </p>
          </div>
          <div className="header-acciones">
            <Link to="/tienda" className="btn-ver-todos">
              Ver todos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="productos-vendidos-stats">
          <div className="stat-item">
            <TrendingUp className="stat-icono" />
            <span className="stat-texto">Tendencias actuales</span>
          </div>
          <div className="stat-item">
            <Zap className="stat-icono" />
            <span className="stat-texto">Envío rápido disponible</span>
          </div>
          <div className="stat-item ofertas">
            <Flame className="stat-icono" />
            <span className="stat-texto">Ofertas limitadas</span>
          </div>
        </div>

        {/* Grid de productos */}
        {cargando ? (
          <div className="productos-vendidos-cargando">
            <Loader className="spinner" />
            <p>Cargando productos increíbles...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="productos-vendidos-vacio">
            <AlertCircle size={48} />
            <h3>No hay productos disponibles</h3>
            <p>Pronto tendremos productos increíbles para ti</p>
            <Link to="/tienda" className="btn-explorar">
              Explorar tienda
            </Link>
          </div>
        ) : (
          <div className="productos-vendidos-grid">
            {productos.map((producto, index) => (
              <TarjetaProductoLujo
                key={producto.id}
                producto={producto}
                modoAccion="auto"
              />
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="productos-vendidos-cta">
          <div className="cta-contenido">
            <h3>¿Te gustó lo que viste?</h3>
            <p>Descubre miles de productos más en nuestra tienda completa</p>
            <Link to="/tienda" className="btn-cta-principal">
              Explorar toda la tienda
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}