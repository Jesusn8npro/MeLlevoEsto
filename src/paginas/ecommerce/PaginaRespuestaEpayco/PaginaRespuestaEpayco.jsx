import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  Package, 
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  ShoppingBag,
  Download,
  Share2,
  DollarSign,
  Hash,
  Building
} from 'lucide-react'
import { useCarrito } from '../../../contextos/CarritoContext'
import { formatearPrecioCOP } from '../../../utilidades/formatoPrecio'
import servicioEpayco from '../../../servicios/epayco/servicioEpayco'
import './PaginaRespuestaEpayco.css'

const PaginaRespuestaEpayco = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { limpiarCarrito } = useCarrito()
  const [datosTransaccion, setDatosTransaccion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const procesarRespuestaEpayco = async () => {
      try {
        // Obtener parámetros de la URL - USANDO LOS NOMBRES CORRECTOS DE EPAYCO
        const x_ref_payco = searchParams.get('x_ref_payco')
        const x_response = searchParams.get('x_response')
        const x_response_reason_text = searchParams.get('x_response_reason_text')
        const x_amount = searchParams.get('x_amount')
        const x_fecha_transaccion = searchParams.get('x_fecha_transaccion')
        const x_bank_name = searchParams.get('x_bank_name')
        const x_receipt = searchParams.get('x_receipt')
        const x_franchise = searchParams.get('x_franchise')
        const x_cod_response = searchParams.get('x_cod_response')
        const x_description = searchParams.get('x_description')
        const x_transaction_id = searchParams.get('x_transaction_id')
        const x_approval_code = searchParams.get('x_approval_code')
        const x_signature = searchParams.get('x_signature')
        const x_currency_code = searchParams.get('x_currency_code')
        const x_test_request = searchParams.get('x_test_request')

        // También capturar parámetros alternativos por compatibilidad
        const ref_payco = x_ref_payco || searchParams.get('ref_payco')
        const estado = x_response || searchParams.get('estado')
        const respuesta = x_response_reason_text || searchParams.get('respuesta')

        console.log('🔍 Parámetros recibidos de ePayco:', {
          x_ref_payco,
          x_response,
          x_response_reason_text,
          x_amount,
          x_fecha_transaccion,
          x_bank_name,
          x_receipt,
          x_franchise,
          x_cod_response,
          x_description,
          x_transaction_id,
          x_approval_code,
          x_signature,
          x_currency_code,
          x_test_request
        })

        if (!ref_payco) {
          console.error('No se encontró referencia de pago')
          setCargando(false)
          return
        }

        // Registrar la transacción en nuestra base de datos con TODOS los datos
        await servicioEpayco.registrarTransaccion({
          referenciaPago: ref_payco,
          estado: estado,
          tipo: 'response',
          respuestaCompleta: {
            x_ref_payco,
            x_transaction_id,
            x_cod_response,
            x_response_reason_text,
            x_amount,
            x_fecha_transaccion,
            x_bank_name,
            x_receipt,
            x_franchise,
            x_description,
            x_approval_code,
            x_signature,
            x_currency_code,
            x_test_request,
            x_response,
            // Datos adicionales para compatibilidad
            ref_payco,
            estado,
            respuesta,
            timestamp: new Date().toISOString()
          }
        })

        // Configurar datos para mostrar
        const datosCompletos = {
          ref_payco,
          x_ref_payco,
          estado,
          x_response,
          respuesta,
          x_response_reason_text,
          valor: x_amount ? parseFloat(x_amount) : 0,
          x_amount,
          fecha: x_fecha_transaccion,
          banco: x_bank_name,
          recibo: x_receipt,
          franquicia: x_franchise,
          cod_respuesta: x_cod_response,
          descripcion: x_description,
          transaction_id: x_transaction_id,
          approval_code: x_approval_code,
          signature: x_signature,
          currency_code: x_currency_code,
          test_request: x_test_request,
          // Datos simulados del pedido (en producción vendrían de tu backend)
          cliente: {
            nombre: 'Cliente de Prueba',
            email: 'cliente@ejemplo.com',
            telefono: '+57 300 123 4567'
          },
          direccion: {
            direccion: 'Calle 123 #45-67',
            ciudad: 'Bogotá',
            departamento: 'Cundinamarca',
            codigoPostal: '110111'
          },
          productos: [
            {
              id: 1,
              nombre: 'Producto de Ejemplo',
              cantidad: 1,
              precio: x_amount ? parseFloat(x_amount) : 0,
              imagen: '/images/producto-ejemplo.jpg'
            }
          ]
        }

        setDatosTransaccion(datosCompletos)

        // Si el pago fue exitoso, limpiar el carrito
        if (estado === 'Aceptada' || cod_respuesta === '1') {
          limpiarCarrito()
        }

      } catch (error) {
        console.error('Error al procesar respuesta de ePayco:', error)
      } finally {
        setCargando(false)
      }
    }

    procesarRespuestaEpayco()
  }, [searchParams, limpiarCarrito])

  const obtenerEstadoTransaccion = () => {
    if (!datosTransaccion) return 'pendiente'
    
    const { estado, cod_respuesta } = datosTransaccion
    
    if (estado === 'Aceptada' || cod_respuesta === '1') {
      return 'exitoso'
    } else if (estado === 'Rechazada' || cod_respuesta === '2') {
      return 'rechazado'
    } else {
      return 'pendiente'
    }
  }

  const obtenerMensajeEstado = () => {
    const estadoTransaccion = obtenerEstadoTransaccion()
    
    switch (estadoTransaccion) {
      case 'exitoso':
        return {
          titulo: '¡Pago Exitoso!',
          mensaje: 'Tu transacción ha sido procesada correctamente',
          icono: CheckCircle
        }
      case 'rechazado':
        return {
          titulo: 'Pago Rechazado',
          mensaje: 'Tu transacción no pudo ser procesada',
          icono: AlertCircle
        }
      default:
        return {
          titulo: 'Pago Pendiente',
          mensaje: 'Tu transacción está siendo procesada',
          icono: Clock
        }
    }
  }

  if (cargando) {
    return (
      <div className="pagina-respuesta-epayco">
        <div className="contenedor-respuesta">
          <div className="cargando">
            <div className="spinner"></div>
            <p>Procesando respuesta de pago...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!datosTransaccion) {
    return (
      <div className="pagina-respuesta-epayco">
        <div className="contenedor-respuesta">
          <div className="cabecera-respuesta rechazado">
            <div className="icono-estado">
              <AlertCircle size={40} />
            </div>
            <h1 className="titulo-estado">Error</h1>
            <p className="mensaje-estado">No se encontraron datos de la transacción</p>
          </div>
          <div className="acciones-respuesta">
            <Link to="/" className="boton-accion boton-primario">
              <Home size={20} />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const estadoTransaccion = obtenerEstadoTransaccion()
  const mensajeEstado = obtenerMensajeEstado()
  const IconoEstado = mensajeEstado.icono

  return (
    <div className="pagina-respuesta-epayco">
      <div className="contenedor-respuesta">
        {/* Cabecera con estado */}
        <div className={`cabecera-respuesta ${estadoTransaccion}`}>
          <div className="icono-estado">
            <IconoEstado size={40} />
          </div>
          <h1 className="titulo-estado">{mensajeEstado.titulo}</h1>
          <p className="mensaje-estado">{mensajeEstado.mensaje}</p>
        </div>

        <div className="contenido-respuesta">
          {/* Información de la transacción */}
          <div className="info-transaccion">
            <h3 className="titulo-seccion">
              <CreditCard size={24} />
              Detalles de la Transacción
            </h3>
            <div className="grid-info">
              <div className="campo-info">
                <Hash className="icono-campo" />
                <div className="info-campo">
                  <p className="etiqueta-campo">Referencia de Pago</p>
                  <p className="valor-campo">{datosTransaccion.ref_payco}</p>
                </div>
              </div>
              
              <div className="campo-info">
                <DollarSign className="icono-campo" />
                <div className="info-campo">
                  <p className="etiqueta-campo">Valor Total</p>
                  <p className="valor-campo monto">{formatearPrecioCOP(datosTransaccion.valor)}</p>
                </div>
              </div>
              
              <div className="campo-info">
                <Calendar className="icono-campo" />
                <div className="info-campo">
                  <p className="etiqueta-campo">Fecha de Transacción</p>
                  <p className="valor-campo">{datosTransaccion.fecha || 'No disponible'}</p>
                </div>
              </div>
              
              <div className="campo-info">
                <Building className="icono-campo" />
                <div className="info-campo">
                  <p className="etiqueta-campo">Banco</p>
                  <p className="valor-campo">{datosTransaccion.banco || 'No disponible'}</p>
                </div>
              </div>
              
              {datosTransaccion.franquicia && (
                <div className="campo-info">
                  <CreditCard className="icono-campo" />
                  <div className="info-campo">
                    <p className="etiqueta-campo">Franquicia</p>
                    <p className="valor-campo">{datosTransaccion.franquicia}</p>
                  </div>
                </div>
              )}
              
              {datosTransaccion.recibo && (
                <div className="campo-info">
                  <Package className="icono-campo" />
                  <div className="info-campo">
                    <p className="etiqueta-campo">Recibo</p>
                    <p className="valor-campo">{datosTransaccion.recibo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="resumen-pedido">
            <h3 className="titulo-seccion">
              <ShoppingBag size={24} />
              Resumen del Pedido
            </h3>
            <ul className="lista-productos">
              {datosTransaccion.productos.map((producto) => (
                <li key={producto.id} className="item-producto">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="imagen-producto"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="info-producto">
                    <h4 className="nombre-producto">{producto.nombre}</h4>
                    <p className="cantidad-producto">Cantidad: {producto.cantidad}</p>
                  </div>
                  <div className="precio-producto">
                    {formatearPrecioCOP(producto.precio)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="total-pedido">
              <span className="etiqueta-total">Total:</span>
              <span className="valor-total">{formatearPrecioCOP(datosTransaccion.valor)}</span>
            </div>
          </div>

          {/* Información adicional según el estado */}
          {estadoTransaccion === 'exitoso' && (
            <div className="info-adicional">
              <h4>¡Felicitaciones por tu compra!</h4>
              <p>
                Recibirás un correo electrónico con los detalles de tu pedido y la información de seguimiento. 
                Si tienes alguna pregunta, no dudes en contactarnos.
              </p>
            </div>
          )}

          {estadoTransaccion === 'rechazado' && (
            <div className="info-adicional">
              <h4>¿Qué puedes hacer ahora?</h4>
              <p>
                Tu pago no pudo ser procesado. Esto puede deberse a fondos insuficientes, datos incorrectos 
                o restricciones del banco. Puedes intentar nuevamente con otra tarjeta o método de pago.
              </p>
            </div>
          )}

          {estadoTransaccion === 'pendiente' && (
            <div className="info-adicional">
              <h4>Tu pago está siendo verificado</h4>
              <p>
                Estamos procesando tu transacción. Recibirás una confirmación por correo electrónico 
                una vez que se complete el proceso. Esto puede tomar unos minutos.
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="acciones-respuesta">
          {estadoTransaccion === 'exitoso' && (
            <>
              <Link to="/mis-pedidos" className="boton-accion boton-exito">
                <Package size={20} />
                Ver Mis Pedidos
              </Link>
              <Link to="/tienda" className="boton-accion boton-secundario">
                <ShoppingBag size={20} />
                Seguir Comprando
              </Link>
            </>
          )}
          
          {estadoTransaccion === 'rechazado' && (
            <>
              <Link to="/carrito" className="boton-accion boton-primario">
                <ArrowLeft size={20} />
                Intentar Nuevamente
              </Link>
              <Link to="/tienda" className="boton-accion boton-secundario">
                <ShoppingBag size={20} />
                Seguir Comprando
              </Link>
            </>
          )}
          
          {estadoTransaccion === 'pendiente' && (
            <>
              <button 
                onClick={() => window.location.reload()} 
                className="boton-accion boton-primario"
              >
                <Clock size={20} />
                Actualizar Estado
              </button>
              <Link to="/" className="boton-accion boton-secundario">
                <Home size={20} />
                Volver al Inicio
              </Link>
            </>
          )}
          
          <Link to="/" className="boton-accion boton-secundario">
            <Home size={20} />
            Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaginaRespuestaEpayco