import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  ArrowLeft, 
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Heart,
  Shield,
  Truck,
  CreditCard,
  Gift,
  Tag,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Star,
  Clock
} from 'lucide-react'
import { useCarrito } from '../../../contextos/CarritoContext'
import { useAuth } from '../../../contextos/ContextoAutenticacion'
import ItemCarrito from '../../../componentes/carrito/ItemCarrito'
import './PaginaCarrito.css'

const PaginaCarrito = () => {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const {
    items,
    cargando,
    totalItems,
    subtotal,
    descuentos,
    envio,
    total,
    formatearPrecio,
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito
  } = useCarrito()

  const [stepActual, setStepActual] = useState(1)
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    instrucciones: ''
  })
  const [metodoPago, setMetodoPago] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState('')
  const [codigoCupon, setCodigoCupon] = useState('')

  // Steps del checkout
  const steps = [
    { id: 1, titulo: 'Carrito', icono: ShoppingCart },
    { id: 2, titulo: 'Envío', icono: Truck },
    { id: 3, titulo: 'Pago', icono: CreditCard },
    { id: 4, titulo: 'Confirmación', icono: CheckCircle }
  ]

  // Cargar datos del usuario si está logueado
  useEffect(() => {
    if (usuario) {
      setDatosEnvio(prev => ({
        ...prev,
        nombre: usuario.user_metadata?.nombre || '',
        apellido: usuario.user_metadata?.apellido || '',
        email: usuario.email || '',
        telefono: usuario.user_metadata?.telefono || ''
      }))
    }
  }, [usuario])

  // Manejar cambios en formulario de envío
  const manejarCambioEnvio = (campo, valor) => {
    setDatosEnvio(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Aplicar cupón
  const aplicarCupon = () => {
    // Lógica para aplicar cupón
    if (codigoCupon.toLowerCase() === 'descuento10') {
      setCuponAplicado('DESCUENTO10 - 10% de descuento')
    }
  }

  // Procesar pago
  const procesarPago = () => {
    // Aquí iría la lógica de pago real
    setStepActual(4)
  }

  // Si el carrito está vacío
  if (!cargando && items.length === 0) {
    return (
      <div className="pagina-carrito">
        <div className="contenedor-carrito">
          <div className="carrito-vacio">
            <ShoppingCart size={80} className="icono-carrito-vacio" />
            <h2>Tu carrito está vacío</h2>
            <p>¡Descubre nuestros increíbles productos y encuentra lo que necesitas!</p>
            <Link to="/tienda" className="boton-explorar">
              Explorar productos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pagina-carrito">
      <div className="contenedor-carrito">
        {/* Header con breadcrumb */}
        <div className="carrito-header">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Inicio</Link>
            <span className="breadcrumb-separador">/</span>
            <span className="breadcrumb-actual">Carrito</span>
          </div>
          <h1>
            <ShoppingCart size={28} />
            Mi Carrito ({totalItems} productos)
          </h1>
        </div>

        {/* Indicador de steps */}
        <div className="steps-indicador">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`step ${stepActual >= step.id ? 'activo' : ''} ${stepActual === step.id ? 'actual' : ''}`}
            >
              <div className="step-icono">
                <step.icono size={20} />
              </div>
              <span className="step-titulo">{step.titulo}</span>
              {index < steps.length - 1 && <div className="step-linea" />}
            </div>
          ))}
        </div>

        <div className="carrito-contenido">
          {/* Columna principal */}
          <div className="carrito-principal">
            {/* Step 1: Carrito */}
            {stepActual === 1 && (
              <div className="step-contenido">
                <div className="carrito-items">
                  <div className="items-header">
                    <h3>Productos en tu carrito</h3>
                    <button 
                      onClick={limpiarCarrito}
                      className="boton-limpiar"
                    >
                      <Trash2 size={16} />
                      Limpiar carrito
                    </button>
                  </div>

                  {items.map((item) => (
                    <ItemCarrito 
                      key={item.id}
                      item={item}
                      onActualizarCantidad={actualizarCantidad}
                      onEliminar={eliminarDelCarrito}
                      mostrarDescripcion={true}
                    />
                  ))}
                </div>

                {/* Sección de productos relacionados eliminada por solicitud */}
              </div>
            )}

            {/* Step 2: Información de envío */}
            {stepActual === 2 && (
              <div className="step-contenido">
                <h3>
                  <Truck size={24} />
                  Información de envío
                </h3>
                
                <form className="formulario-envio">
                  <div className="fila-formulario">
                    <div className="campo-formulario">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        value={datosEnvio.nombre}
                        onChange={(e) => manejarCambioEnvio('nombre', e.target.value)}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="campo-formulario">
                      <label>Apellido *</label>
                      <input
                        type="text"
                        value={datosEnvio.apellido}
                        onChange={(e) => manejarCambioEnvio('apellido', e.target.value)}
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  <div className="fila-formulario">
                    <div className="campo-formulario">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={datosEnvio.email}
                        onChange={(e) => manejarCambioEnvio('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div className="campo-formulario">
                      <label>Teléfono *</label>
                      <input
                        type="tel"
                        value={datosEnvio.telefono}
                        onChange={(e) => manejarCambioEnvio('telefono', e.target.value)}
                        placeholder="300 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="campo-formulario">
                    <label>Dirección completa *</label>
                    <input
                      type="text"
                      value={datosEnvio.direccion}
                      onChange={(e) => manejarCambioEnvio('direccion', e.target.value)}
                      placeholder="Calle 123 #45-67, Apartamento 8B"
                      required
                    />
                  </div>

                  <div className="fila-formulario">
                    <div className="campo-formulario">
                      <label>Ciudad *</label>
                      <input
                        type="text"
                        value={datosEnvio.ciudad}
                        onChange={(e) => manejarCambioEnvio('ciudad', e.target.value)}
                        placeholder="Bogotá"
                        required
                      />
                    </div>
                    <div className="campo-formulario">
                      <label>Departamento *</label>
                      <select
                        value={datosEnvio.departamento}
                        onChange={(e) => manejarCambioEnvio('departamento', e.target.value)}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="cundinamarca">Cundinamarca</option>
                        <option value="antioquia">Antioquia</option>
                        <option value="valle">Valle del Cauca</option>
                        <option value="atlantico">Atlántico</option>
                        <option value="santander">Santander</option>
                      </select>
                    </div>
                    <div className="campo-formulario">
                      <label>Código Postal</label>
                      <input
                        type="text"
                        value={datosEnvio.codigoPostal}
                        onChange={(e) => manejarCambioEnvio('codigoPostal', e.target.value)}
                        placeholder="110111"
                      />
                    </div>
                  </div>

                  <div className="campo-formulario">
                    <label>Instrucciones especiales</label>
                    <textarea
                      value={datosEnvio.instrucciones}
                      onChange={(e) => manejarCambioEnvio('instrucciones', e.target.value)}
                      placeholder="Ej: Tocar el timbre, casa de color azul..."
                      rows={3}
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Método de pago */}
            {stepActual === 3 && (
              <div className="step-contenido">
                <h3>
                  <CreditCard size={24} />
                  Método de pago
                </h3>

                <div className="metodos-pago">
                  <div 
                    className={`metodo-pago ${metodoPago === 'tarjeta' ? 'seleccionado' : ''}`}
                    onClick={() => setMetodoPago('tarjeta')}
                  >
                    <CreditCard size={24} />
                    <div>
                      <h4>Tarjeta de crédito/débito</h4>
                      <p>Visa, Mastercard, American Express</p>
                    </div>
                  </div>

                  <div 
                    className={`metodo-pago ${metodoPago === 'pse' ? 'seleccionado' : ''}`}
                    onClick={() => setMetodoPago('pse')}
                  >
                    <Shield size={24} />
                    <div>
                      <h4>PSE</h4>
                      <p>Pago seguro en línea</p>
                    </div>
                  </div>

                  <div 
                    className={`metodo-pago ${metodoPago === 'contraentrega' ? 'seleccionado' : ''}`}
                    onClick={() => setMetodoPago('contraentrega')}
                  >
                    <Truck size={24} />
                    <div>
                      <h4>Pago contraentrega</h4>
                      <p>Paga cuando recibas tu pedido</p>
                    </div>
                  </div>
                </div>

                {metodoPago === 'tarjeta' && (
                  <div className="formulario-tarjeta">
                    <div className="campo-formulario">
                      <label>Número de tarjeta</label>
                      <input type="text" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="fila-formulario">
                      <div className="campo-formulario">
                        <label>Fecha de vencimiento</label>
                        <input type="text" placeholder="MM/AA" />
                      </div>
                      <div className="campo-formulario">
                        <label>CVV</label>
                        <input type="text" placeholder="123" />
                      </div>
                    </div>
                    <div className="campo-formulario">
                      <label>Nombre en la tarjeta</label>
                      <input type="text" placeholder="Como aparece en la tarjeta" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmación */}
            {stepActual === 4 && (
              <div className="step-contenido confirmacion">
                <div className="confirmacion-exito">
                  <CheckCircle size={80} className="icono-exito" />
                  <h2>¡Pedido confirmado!</h2>
                  <p>Tu pedido #12345 ha sido procesado exitosamente</p>
                  
                  <div className="detalles-pedido">
                    <h4>Detalles del pedido:</h4>
                    <p><strong>Email:</strong> {datosEnvio.email}</p>
                    <p><strong>Dirección:</strong> {datosEnvio.direccion}, {datosEnvio.ciudad}</p>
                    <p><strong>Total:</strong> {formatearPrecio(total)}</p>
                  </div>

                  <div className="acciones-confirmacion">
                    <Link to="/perfil/pedidos" className="boton-ver-pedidos">
                      Ver mis pedidos
                    </Link>
                    <Link to="/tienda" className="boton-seguir-comprando">
                      Seguir comprando
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar con resumen */}
          <div className="carrito-sidebar">
            <div className="resumen-pedido">
              <h3>Resumen del pedido</h3>
              
              <div className="resumen-lineas">
                <div className="resumen-linea">
                  <span>Subtotal ({totalItems} productos)</span>
                  <span>{formatearPrecio(subtotal)}</span>
                </div>
                
                {descuentos > 0 && (
                  <div className="resumen-linea descuento">
                    <span>Descuentos</span>
                    <span>-{formatearPrecio(descuentos)}</span>
                  </div>
                )}
                
                <div className="resumen-linea">
                  <span>Envío</span>
                  <span>{envio === 0 ? 'Gratis' : formatearPrecio(envio)}</span>
                </div>
                
                <div className="resumen-linea total">
                  <span>Total</span>
                  <span className="precio-total">{formatearPrecio(total)}</span>
                </div>
              </div>

              {/* Cupón de descuento */}
              {stepActual <= 3 && (
                <div className="seccion-cupon">
                  <h4>
                    <Tag size={16} />
                    Código de descuento
                  </h4>
                  <div className="input-cupon">
                    <input
                      type="text"
                      value={codigoCupon}
                      onChange={(e) => setCodigoCupon(e.target.value)}
                      placeholder="Ingresa tu código"
                    />
                    <button onClick={aplicarCupon}>Aplicar</button>
                  </div>
                  {cuponAplicado && (
                    <div className="cupon-aplicado">
                      <CheckCircle size={16} />
                      {cuponAplicado}
                    </div>
                  )}
                </div>
              )}

              {/* Botones de navegación */}
              {stepActual < 4 && (
                <div className="botones-navegacion">
                  {stepActual > 1 && (
                    <button 
                      onClick={() => setStepActual(stepActual - 1)}
                      className="boton-anterior"
                    >
                      <ArrowLeft size={16} />
                      Anterior
                    </button>
                  )}
                  
                  {stepActual < 3 && (
                    <button 
                      onClick={() => setStepActual(stepActual + 1)}
                      className="boton-siguiente"
                    >
                      Siguiente
                      <ArrowRight size={16} />
                    </button>
                  )}
                  
                  {stepActual === 3 && (
                    <button 
                      onClick={procesarPago}
                      className="boton-pagar"
                      disabled={!metodoPago}
                    >
                      Confirmar pedido
                      <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Garantías */}
              <div className="garantias">
                <div className="garantia-item">
                  <Shield size={16} />
                  <span>Compra 100% segura</span>
                </div>
                <div className="garantia-item">
                  <Truck size={16} />
                  <span>Envío gratis desde $50.000</span>
                </div>
                <div className="garantia-item">
                  <Star size={16} />
                  <span>Garantía de satisfacción</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginaCarrito

