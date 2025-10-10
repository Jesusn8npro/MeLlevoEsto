import React, { useEffect, useMemo, useState } from 'react'
import { X, Truck, Shield, Star, CreditCard, CheckCircle, Lock, ChevronRight, BadgeDollarSign, Info } from 'lucide-react'
import { formatearPrecioCOP } from '../../utilidades/formatoPrecio'
import { validarNombre, validarTelefono, validarDireccion, validarEmail } from '../../utilidades/validaciones'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { clienteSupabase } from '../../configuracion/supabase'
import { useNavigate } from 'react-router-dom'
import './ContraEntregaModal.css'

/**
 * Modal de "Pago Contra Entrega" inspirado en Releasit
 * - Sin login obligatorio
 * - Ofertas por cantidad
 * - Formulario de envío simplificado en español
 */
const ContraEntregaModal = ({
  abierto,
  onCerrar,
  producto,
  onConfirmar,
}) => {
  const precioUnitario = producto?.precio || 0
  // Número de WhatsApp configurable vía env; normaliza agregando +57 si falta
  const WHATSAPP_NUMERO_RAW = import.meta.env?.VITE_WHATSAPP_NUMERO ?? '3214892176'
  const WHATSAPP_NUMERO = WHATSAPP_NUMERO_RAW.startsWith('57') ? WHATSAPP_NUMERO_RAW : `57${WHATSAPP_NUMERO_RAW}`

  // Ofertas por cantidad (ajustables)
  const OFERTAS = [
    { id: 1, titulo: 'Compra 1 unidad', subtitulo: 'Precio de Oferta', cantidad: 1, descuento: 0 },
    { id: 2, titulo: 'Compra 2 unidades con un 15 % de descuento adicional', subtitulo: 'Ahorra 15 % Más', cantidad: 2, descuento: 15 },
    { id: 3, titulo: 'Compra 3 unidades con un 25 % de descuento adicional', subtitulo: 'Ahorras 25 % Más', cantidad: 3, descuento: 25 },
  ]

  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(OFERTAS[0])
  const [agregarUpsell, setAgregarUpsell] = useState(false)
  const PRECIO_UPSELL = 32000

  // Formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    apto: '',
    barrio: '',
    departamento: '',
    ciudad: '',
  })
  const [errores, setErrores] = useState({})
  const { registrarse, sesionInicializada, usuario } = useAuth()
  const [compraConfirmada, setCompraConfirmada] = useState(null)
  const [contador, setContador] = useState(8)
  const [redireccionEnCurso, setRedireccionEnCurso] = useState(false)
  const [cerrandoAuto, setCerrandoAuto] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!abierto) return
    setErrores({})
    // Bloquear scroll del body cuando el modal está abierto
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [abierto])

  // Lista rápida de departamentos (se puede mover a util)
  const DEPARTAMENTOS_CO = useMemo(() => ([
    'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá','Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada'
  ]), [])

  const calcularSubtotal = (oferta) => {
    const base = precioUnitario * oferta.cantidad
    const conDescuento = base * (1 - (oferta.descuento || 0) / 100)
    return Math.round(conDescuento)
  }

  const subtotal = useMemo(() => calcularSubtotal(ofertaSeleccionada), [ofertaSeleccionada])
  const envio = 0
  const total = useMemo(() => subtotal + (agregarUpsell ? PRECIO_UPSELL : 0), [subtotal, agregarUpsell])

  const actualizar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  const construirUrlWhatsapp = () => {
    const base = `https://wa.me/${WHATSAPP_NUMERO}`
    const texto = `Hola 👋, acabo de completar mi compra${producto?.nombre ? ` de ${producto.nombre}` : ''} por ${formatearPrecioCOP(total)}. Tengo dudas y me gustaría hablar con un asesor.`
    return `${base}?text=${encodeURIComponent(texto)}`
  }

  // Redirección a WhatsApp ya no ocurre aquí automáticamente; se hará desde la página de perfil.

  const validar = () => {
    const e = {}
    if (!validarNombre(form.nombre)) e.nombre = 'Nombre inválido'
    if (!validarNombre(form.apellido)) e.apellido = 'Apellido inválido'
    // Email requerido por la tabla 'pedidos': usar el del usuario o pedirlo
    if (!usuario?.email && !form.email) e.email = 'Ingresa tu correo'
    if (form.email && !validarEmail(form.email)) e.email = 'Email inválido'
    if (!validarTelefono(form.telefono)) e.telefono = 'Teléfono inválido (ej: 300 123 4567)'
    if (!validarDireccion(form.direccion)) e.direccion = 'Dirección muy corta'
    if (!form.apto) e.apto = 'Especifica apartamento/casa/bloque/piso'
    if (!form.barrio) e.barrio = 'Ingresa barrio'
    if (!form.departamento) e.departamento = 'Selecciona departamento'
    if (!form.ciudad) e.ciudad = 'Ingresa ciudad'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const generarPasswordAleatoria = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+'
    let pwd = ''
    for (let i = 0; i < 12; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)]
    }
    return pwd
  }

  const manejarConfirmar = async (e) => {
    e.preventDefault()
    if (!validar()) return

    // Crear usuario automáticamente si no hay sesión y hay email
    if (!sesionInicializada && form.email) {
      try {
        const nombreCompleto = `${form.nombre} ${form.apellido}`.trim()
        const passwordTemporal = generarPasswordAleatoria()
        const res = await registrarse(form.email, passwordTemporal, {
          nombre: nombreCompleto,
          telefono: form.telefono
        })
        if (!res?.success) {
          console.warn('No se pudo registrar automáticamente al usuario:', res?.error)
        }
      } catch (err) {
        console.warn('Error registrando usuario automáticamente:', err?.message)
      }
    }

    const payload = {
      producto_id: producto?.id,
      producto_nombre: producto?.nombre,
      oferta: ofertaSeleccionada,
      upsell_agregado: agregarUpsell,
      total,
      formulario: form,
    }
    onConfirmar?.(payload)
    // Mostrar confirmación en lugar de cerrar/redirigir
    setCompraConfirmada(payload)

    // Guardar pedido en Supabase para que aparezca en /perfil/pedidos
    ;(async () => {
      try {
        // Asegurar sesión: si acabamos de registrar, esperar a que exista
        let userId = usuario?.id || null
        let userEmail = usuario?.email || null
        if (!userId) {
          const { data: { session } } = await clienteSupabase.auth.getSession()
          userId = session?.user?.id || null
          userEmail = session?.user?.email || userEmail
        }
        if (!userId) {
          console.error('❌ No hay usuario autenticado para asociar el pedido')
          return
        }

        const base = precioUnitario * ofertaSeleccionada.cantidad
        const descuento = base - subtotal
        const direccionEnvio = {
          direccion: form.direccion,
          ciudad: form.ciudad,
          departamento: form.departamento,
          barrio: form.barrio,
          apto: form.apto,
          pais: 'Colombia',
          codigo_postal: ''
        }
        const productos = [
          {
            producto_id: producto?.id,
            nombre: producto?.nombre,
            cantidad: ofertaSeleccionada.cantidad,
            precio_unitario: precioUnitario
          }
        ]

        // Generar número de pedido legible y único
        const generarNumeroPedido = () => {
          const fecha = new Date()
          const ymd = `${fecha.getFullYear()}${String(fecha.getMonth()+1).padStart(2,'0')}${String(fecha.getDate()).padStart(2,'0')}`
          const rnd = Math.floor(Math.random()*9000)+1000
          return `ME-${ymd}-${rnd}`
        }

        const pedido = {
          numero_pedido: generarNumeroPedido(),
          usuario_id: userId,
          nombre_cliente: `${form.nombre} ${form.apellido}`.trim(),
          email_cliente: form.email || userEmail,
          telefono_cliente: form.telefono,
          direccion_envio: direccionEnvio,
          productos,
          subtotal: base,
          descuento_aplicado: descuento,
          costo_envio: envio,
          total,
          estado: 'pendiente',
          metodo_pago: 'contraentrega'
        }

        const { error } = await clienteSupabase
          .from('pedidos')
          .insert(pedido)

        if (error) {
          console.error('❌ Error guardando pedido en Supabase:', error.message, { pedido })
        } else {
          console.log('✅ Pedido guardado en Supabase y asociado al usuario')
        }
      } catch (err) {
        console.error('💥 Error inesperado al guardar pedido:', err?.message)
      }
    })()

    // Navegar a la página de pedidos del perfil y cerrar el modal
    onCerrar?.()
    navigate('/perfil/pedidos?after=cod')
  }

  if (!abierto) return null

  return (
    <div className="cod-modal-overlay" onClick={onCerrar}>
      <div className={`cod-modal ${cerrandoAuto ? 'cod-cerrar-anim' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="cod-cerrar" onClick={onCerrar} aria-label="Cerrar">
          <X size={20} />
        </button>

        <div className="cod-header">
          <div className="cod-cod-banner">
            <div className="cod-cod-left">
              <BadgeDollarSign size={18} />
              <strong>Pago Contra Entrega</strong>
            </div>
            <div className="cod-cod-right">
              <span>Pagas al recibir, sin pagos online</span>
            </div>
          </div>
        </div>

        {/* Ofertas */}
        <div className="cod-ofertas">
          {OFERTAS.map((o) => (
            <label key={o.id} className={`cod-oferta ${ofertaSeleccionada.id === o.id ? 'seleccionada' : ''}`}>
              <input
                type="radio"
                name="oferta"
                checked={ofertaSeleccionada.id === o.id}
                onChange={() => setOfertaSeleccionada(o)}
              />
              <div className="cod-oferta-contenido">
                <div className="cod-oferta-titulos">
                  <span className="cod-oferta-titulo">{o.titulo}</span>
                  <span className="cod-oferta-subtitulo">{o.subtitulo}</span>
                </div>
                <div className="cod-oferta-precio">{formatearPrecioCOP(calcularSubtotal(o))}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Resumen */}
        <div className="cod-resumen">
          <div className="cod-resumen-linea">
            <span>Subtotal</span>
            <span>{formatearPrecioCOP(subtotal)}</span>
          </div>
          <div className="cod-resumen-linea">
            <span>Envío</span>
            <span className="cod-envio-gratis">Gratis</span>
          </div>
          <div className="cod-resumen-linea cod-total">
            <span>Total</span>
            <span className="cod-precio-total">{formatearPrecioCOP(total)}</span>
          </div>
        </div>

        {/* Formulario o confirmación */}
        {!compraConfirmada ? (
        <form className="cod-form" onSubmit={manejarConfirmar}>
          <div className="cod-section-title">Datos de Envío</div>
          <p className="cod-form-nota">ATENCIÓN: Ingresa tus datos de envío lo más completos posible para garantizar la entrega de tu pedido en oferta</p>

          {/* Mensaje de bienvenida y aclaración de WhatsApp */}
          <div className="cod-bienvenida" role="note">
            <strong>¡Hola!</strong> Al completar tu compra, si agregas tu correo, crearemos tu cuenta automáticamente para que puedas ver tu pedido en "Mi Cuenta".
            <br />
            Cuando hagas clic en <strong>"Aceptar"</strong> te llevaremos a nuestro WhatsApp por si tienes más dudas sobre tu nueva compra. ¡Gracias por tu confianza!
          </div>

          <div className="cod-grid-2">
            <div className="cod-campo">
              <label>Nombre</label>
              <input type="text" value={form.nombre} onChange={(e)=>actualizar('nombre', e.target.value)} placeholder="Nombre" />
              {errores.nombre && <span className="cod-error">{errores.nombre}</span>}
            </div>
            <div className="cod-campo">
              <label>Apellido</label>
              <input type="text" value={form.apellido} onChange={(e)=>actualizar('apellido', e.target.value)} placeholder="Apellido" />
              {errores.apellido && <span className="cod-error">{errores.apellido}</span>}
            </div>
          </div>

          <div className="cod-campo">
            <label>Teléfono (Ejemplo: 3102345678)</label>
            <input type="tel" value={form.telefono} onChange={(e)=>actualizar('telefono', e.target.value)} placeholder="Teléfono" />
            {errores.telefono && <span className="cod-error">{errores.telefono}</span>}
            <small className="cod-ayuda">Asegúrate que sea correcto, un número equivocado impedirá el envío del producto.</small>
          </div>

          <div className="cod-campo">
            <label>Correo (opcional, para crear tu cuenta automáticamente)</label>
            <input type="email" value={form.email} onChange={(e)=>actualizar('email', e.target.value)} placeholder="tucorreo@ejemplo.com" />
            {errores.email && <span className="cod-error">{errores.email}</span>}
            <small className="cod-ayuda">Si lo agregas, te creamos una cuenta y podrás ver tu pedido en "Mi Cuenta".</small>
          </div>

          <div className="cod-campo">
            <label>Dirección (EJEMPLO: CALLE 2 # 12 - 32)</label>
            <input type="text" value={form.direccion} onChange={(e)=>actualizar('direccion', e.target.value)} placeholder="Dirección" />
            {errores.direccion && <span className="cod-error">{errores.direccion}</span>}
          </div>

          <div className="cod-campo">
            <label>Casa o Apartamento (Ej: Apto, torre, bloque o piso)</label>
            <input type="text" value={form.apto} onChange={(e)=>actualizar('apto', e.target.value)} placeholder="Apto, torre, bloque o piso" />
            {errores.apto && <span className="cod-error">{errores.apto}</span>}
          </div>

          <div className="cod-grid-2">
            <div className="cod-campo">
              <label>Barrio</label>
              <input type="text" value={form.barrio} onChange={(e)=>actualizar('barrio', e.target.value)} placeholder="Barrio" />
              {errores.barrio && <span className="cod-error">{errores.barrio}</span>}
            </div>
            <div className="cod-campo">
              <label>Departamento</label>
              <select value={form.departamento} onChange={(e)=>actualizar('departamento', e.target.value)}>
                <option value="">Departamento</option>
                {DEPARTAMENTOS_CO.map((d)=> <option key={d} value={d}>{d}</option>)}
              </select>
              {errores.departamento && <span className="cod-error">{errores.departamento}</span>}
            </div>
          </div>

          <div className="cod-campo">
            <label>Ciudad</label>
            <input type="text" value={form.ciudad} onChange={(e)=>actualizar('ciudad', e.target.value)} placeholder="Ciudad" />
            {errores.ciudad && <span className="cod-error">{errores.ciudad}</span>}
          </div>

          {/* Upsell simple */}
          <div className="cod-upsell">
            <label>
              <input type="checkbox" checked={agregarUpsell} onChange={(e)=>setAgregarUpsell(e.target.checked)} />
              <span> ¿Deseas agregar un kit por solo {formatearPrecioCOP(PRECIO_UPSELL)}?</span>
            </label>
            <span className="cod-upsell-badge">¡UNIDADES LIMITADAS!</span>
          </div>

          <button type="submit" className="cod-cta-principal" aria-label="Aceptar y completar compra, pagar al recibir">
            <Lock size={16} />
            <span>ACEPTAR Y COMPLETAR TU COMPRA:</span>
            <strong>{formatearPrecioCOP(total)}</strong>
            <ChevronRight size={16} className="cod-cta-arrow" />
          </button>
          <p className="cod-cod-note">
            <Info size={14} /> Pagarás el total mostrado cuando el pedido llegue a tu domicilio (Contra Entrega).
          </p>
        </form>
        ) : (
          <div className="cod-confirmacion" role="dialog" aria-label="Compra exitosa">
            <div className="cod-confirmacion-header">
              <CheckCircle size={22} color="#16a34a" />
              <strong>¡Compra registrada con éxito!</strong>
            </div>
            <p className="cod-confirmacion-mensaje">
              Estamos procesando tu pedido y te llegará lo más pronto posible. Si tienes dudas, puedes escribirnos por WhatsApp.
            </p>
            <div className="cod-confirmacion-detalles">
              <div className="cod-resumen-linea"><span>Producto</span><span>{compraConfirmada.producto_nombre || 'Producto'}</span></div>
              <div className="cod-resumen-linea"><span>Cantidad</span><span>{compraConfirmada.oferta?.cantidad || 1}</span></div>
              <div className="cod-resumen-linea"><span>Total</span><span className="cod-precio-total">{formatearPrecioCOP(compraConfirmada.total)}</span></div>
              <div className="cod-resumen-linea"><span>Teléfono</span><span>{compraConfirmada.formulario?.telefono}</span></div>
              {compraConfirmada.formulario?.email && (
                <div className="cod-resumen-linea"><span>Correo</span><span>{compraConfirmada.formulario.email}</span></div>
              )}
              <div className="cod-resumen-linea"><span>Dirección</span><span>{compraConfirmada.formulario?.direccion}</span></div>
              <div className="cod-resumen-linea"><span>Ciudad</span><span>{compraConfirmada.formulario?.ciudad}</span></div>
            </div>
            <div className="cod-confirmacion-acciones">
              <button type="button" className="cod-cta-whatsapp" onClick={() => {
                if (redireccionEnCurso) return
                const waUrl = construirUrlWhatsapp()
                setRedireccionEnCurso(true)
                window.location.href = waUrl
              }}>
                Consultar por WhatsApp {contador > 0 ? `(se abrirá en ${contador}s)` : ''}
              </button>
              <button type="button" className="cod-cta-secundario" onClick={onCerrar}>Cerrar</button>
            </div>
          </div>
        )}
        
        {/* Sellos de confianza (imagen completa) */}
        {!compraConfirmada && (
          <div className="cod-sellos">
            <img
              className="cod-sellos-img"
              src="/images/Garantia%20de%20compra.webp"
              alt="Envío rápido, pago seguro y satisfacción garantizada"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Botón de pago en plataforma y logos */}
        {!compraConfirmada && (
          <div className="cod-plataforma">
            <button type="button" className="cod-cta-plataforma" onClick={() => console.log('Pagar en plataforma')}>
              AHORRA 5% PAGANDO AQUÍ, CON TARJETA DE CRÉDITO O PSE
              <span className="cod-hand">👈</span>
            </button>
            <p className="cod-plataforma-desc">
              Pago en línea: pagas ahora. Contra Entrega: pagas al recibir.
            </p>
            <div className="cod-logos-pago-wrap">
              <img
                className="cod-logos-pago"
                src="/images/Imagen%20para%20los%20pagos.jpg"
                alt="Medios de pago: PSE, Wompi, PayU, Visa, Mastercard, Diners, MercadoPago, Addi"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContraEntregaModal
