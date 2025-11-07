import React from 'react'
import { ArrowLeft, FileText, ShoppingCart, CreditCard, Truck, Package, Users, Shield } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'

const TerminosCondiciones = () => {
  return (
    <div className="politica-container">
      <style jsx>{`
        .politica-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .politica-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .header-navegacion {
          margin-bottom: 1.5rem;
        }
        .boton-volver {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f1f5f9;
          color: #475569;
          text-decoration: none;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .boton-volver:hover {
          background: #e2e8f0;
          color: #334155;
          transform: translateX(-2px);
        }
        .titulo-principal {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        .titulo-principal h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }
        .subtitulo {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .fecha-actualizacion {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          display: inline-block;
        }
        .politica-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .seccion {
          margin-bottom: 2.5rem;
        }
        .seccion:last-child {
          margin-bottom: 0;
        }
        .seccion-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .seccion-icono {
          width: 24px;
          height: 24px;
          color: #059669;
        }
        .seccion-titulo {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        .seccion-contenido {
          color: #475569;
          line-height: 1.7;
          font-size: 1rem;
        }
        .seccion-contenido p {
          margin-bottom: 1rem;
        }
        .seccion-contenido ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .seccion-contenido li {
          margin-bottom: 0.5rem;
        }
        .destacado {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          border-radius: 12px;
          padding: 1rem;
          margin: 1rem 0;
        }
        .destacado strong {
          color: #92400e;
        }
        .importante {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 1px solid #ef4444;
          border-radius: 12px;
          padding: 1rem;
          margin: 1rem 0;
        }
        .importante strong {
          color: #dc2626;
        }
        .info-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 1px solid #3b82f6;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
        }
        .info-box h4 {
          color: #1e40af;
          margin-bottom: 0.5rem;
        }
        .info-box p {
          margin: 0.25rem 0;
          color: #1e40af;
        }
        .vehiculos-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #22c55e;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
        }
        .vehiculos-section h4 {
          color: #15803d;
          margin-bottom: 1rem;
        }
        .vehiculos-section ul {
          color: #15803d;
        }
        @media (max-width: 768px) {
          .politica-container {
            padding: 1rem;
          }
          .titulo-principal h1 {
            font-size: 2rem;
          }
          .politica-header,
          .politica-content {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="politica-header">
        <div className="header-navegacion">
          <RouterLink to="/" className="boton-volver">
            <ArrowLeft className="icono" />
            Volver al Inicio
          </RouterLink>
        </div>
        
        <div className="titulo-principal">
          <FileText className="icono" />
          <h1>Términos y Condiciones</h1>
        </div>
        
        <p className="subtitulo">
          Conoce los términos que rigen el uso de nuestra plataforma y servicios
        </p>
        
        <span className="fecha-actualizacion">
          Última actualización: {new Date().toLocaleDateString('es-CO')}
        </span>
      </div>

      <div className="politica-content">
        <div className="seccion">
          <div className="seccion-header">
            <FileText className="seccion-icono" />
            <h2 className="seccion-titulo">Información General</h2>
            </div>
          <div className="seccion-contenido">
            <p>
              Para todos los efectos transaccionales y legales, será el vendedor <strong>ME LLEVO ESTO</strong>, 
              sociedad distribuidora de artículos para el hogar y vehículos, sujeta a las leyes colombianas, 
              con existencia legal y domicilio principal en la ciudad de Cali, Colombia.
            </p>
            <p>
              Las transacciones que se efectúen a través del sitio ME LLEVO ESTO (el "Sitio") se sujetan 
              a los presentes términos y condiciones (los "Términos y Condiciones") y particularmente lo 
              previsto para las ventas a distancia por las disposiciones colombianas aplicables a la materia.
            </p>
            <div className="destacado">
              <strong>Importante:</strong> Al realizar una transacción en el Sitio, se entiende el conocimiento 
              y aceptación de los Términos y Condiciones descritos a continuación. Igualmente, cualquier 
              usuario que visite el Sitio se entiende que conoce y acepta todas y cada una de las condiciones 
              de estos Términos y Condiciones.
            </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <Users className="seccion-icono" />
            <h2 className="seccion-titulo">Registro de Cliente</h2>
          </div>
          <div className="seccion-contenido">
            <p>
              ME LLEVO ESTO opera el Sitio, mediante el cual los clientes podrán comprar los productos que 
              se ofrecen a través del mismo, entre los cuales se encuentran a manera enunciativa: artículos 
              de hogar, cuidado personal, deporte, tecnología, mascotas y vehículos.
            </p>
            
            <div className="importante">
              <strong>⚠️ Requisito obligatorio:</strong> El registro del cliente en este Sitio es indispensable 
              para comprar productos a través del mismo.
            </div>

            <p>Para el registro, el Cliente debe proporcionar sus datos básicos incluyendo:</p>
            <ul>
              <li>Información personal como el número de cédula de ciudadanía</li>
              <li>Dirección completa</li>
              <li>Números de teléfono</li>
              <li>Dirección de correo electrónico</li>
            </ul>

            <div className="destacado">
              <strong>Declaración del cliente:</strong> El Cliente al ingresar sus datos declara de buena 
              fe que los mismos corresponden a información veraz y vigente.
            </div>

            <p>
              Los datos de los clientes serán tratados de acuerdo con las políticas de tratamiento de la 
              información de ME LLEVO ESTO que se integran a los presentes términos y condiciones.
            </p>

            <div className="importante">
              <strong>⚠️ Restricción de edad:</strong> El registro y las compras en el sitio por su parte 
              como cliente, deberán ser realizados por personas capaces de conformidad con la ley colombiana 
              exclusivamente.
            </div>
            </div>
          </div>

        <div className="seccion">
                  <div className="seccion-header">
            <ShoppingCart className="seccion-icono" />
            <h2 className="seccion-titulo">Productos y Precios</h2>
                  </div>
                  <div className="seccion-contenido">
            <p>
              Las características esenciales de cada uno de los productos que se comercializan a través de 
              esta página son las exhibidas gráficamente para cada uno de ellos, anotando que en ocasiones, 
              el color o algunas otras características pueden variar.
            </p>

            <div className="info-box">
              <h4>💰 Información de Precios</h4>
              <p>• Encontrará el precio de cada producto, incluyendo todos los impuestos y costos adicionales</p>
              <p>• El cliente declara entender y aceptar que el precio de los productos puede cambiar dependiendo el color o modelo que escoja</p>
              <p>• Los precios están expresados en pesos colombianos (COP)</p>
                  </div>

            <div className="importante">
              <strong>⚠️ Disponibilidad del producto:</strong> El cliente del portal web ME LLEVO ESTO 
              declara entender y aceptar que entre el momento en que realiza la selección del producto 
              y el momento en el que efectivamente se realiza la aceptación de la transacción por parte 
              de la respectiva entidad financiera, el producto seleccionado se puede agotar.
                </div>

            <p>
              En caso de agotamiento, ME LLEVO ESTO queda facultado para devolver la transacción y en 
              consecuencia devolver el dinero pagado por el producto agotado, informando dicha situación 
              al cliente dentro de los dos (2) días hábiles siguientes al momento en que se generó la 
              compra.
            </p>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <Truck className="seccion-icono" />
            <h2 className="seccion-titulo">Entrega y Envío</h2>
          </div>
          <div className="seccion-contenido">
            <p>
              ME LLEVO ESTO enviará el producto por medio de <strong>SERVIENTREGA</strong> y este llegará 
              a su destino en un tiempo máximo de ocho (8) días hábiles siguientes al momento en que se 
              generó y comprobó el pago de la compra según la ciudad de destino.
            </p>

            <div className="info-box">
              <h4>📦 Información de Entrega</h4>
              <p>• El cliente recibirá una notificación con el número de guía una vez su pedido sea despachado</p>
              <p>• En la etapa inicial del proyecto solo se realizarán envíos nacionales</p>
              <p>• Los pedidos se envían solo en días hábiles (lunes a viernes, excluyendo festivos)</p>
              <p>• Todas las entregas irán acompañadas con un acuse de recibo</p>
              </div>
              
            <div className="destacado">
              <strong>🚚 Costo de envío:</strong> Estamos ofreciendo como una modalidad el envío gratis 
              que será por tiempo limitado, sin embargo hay ciudades o municipios para las cuales no 
              aplica el flete gratis y deberán pagar el valor del envío.
              </div>

            <p>
              El costo del envío de estas ciudades será determinado en cada caso particular dependiendo 
              del destino, peso y volumen del paquete. Este valor se calculará en el proceso de la compra 
              y te será informado en el momento de la liquidación de la orden, antes de que realices el pago.
            </p>

            <div className="importante">
              <strong>⚠️ Áreas remotas:</strong> Debido a dificultades logísticas a la hora de realizar 
              envíos a determinadas áreas remotas, nos reservamos el derecho a cancelar el pedido y/o a 
              aplicar términos y condiciones adicionales a dicho pedido.
            </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <Package className="seccion-icono" />
            <h2 className="seccion-titulo">Política de Envío</h2>
          </div>
          <div className="seccion-contenido">
            <div className="info-box">
              <h4>📋 Términos de Envío</h4>
              <p><strong>⏱️ Tiempo de envío:</strong> 48/72 horas a ciudades principales</p>
              <p><strong>📅 Tiempo estimado:</strong> Esto puede variar dependiendo de los días hábiles</p>
              <p><strong>🆓 Envío gratis:</strong> El envío será gratis siempre y cuando se especifique en la oferta</p>
              <p><strong>⚙️ Procesamiento:</strong> El tiempo de procesamiento es de 24 hr hábiles aproximadamente</p>
              <p><strong>📱 Seguimiento:</strong> Después del procesamiento recibirás tu guía para rastrear tu pedido</p>
            </div>
                </div>
              </div>

        <div className="seccion">
          <div className="seccion-header">
            <Shield className="seccion-icono" />
            <h2 className="seccion-titulo">Políticas Especiales para Vehículos</h2>
          </div>
          <div className="seccion-contenido">
            <div className="vehiculos-section">
              <h4>🚗 Condiciones Especiales para Automóviles</h4>
              <p>
                Para la venta de vehículos, aplican términos y condiciones especiales debido a la 
                naturaleza de estos productos:
              </p>
              
              <ul>
                <li><strong>Inspección previa:</strong> Todos los vehículos están sujetos a inspección técnica antes de la entrega</li>
                <li><strong>Documentación:</strong> Se requiere documentación adicional para la transferencia de propiedad</li>
                <li><strong>Tiempo de entrega:</strong> Los vehículos pueden tener tiempos de entrega extendidos (hasta 15 días hábiles)</li>
                <li><strong>Garantía:</strong> Los vehículos cuentan con garantía específica según el modelo y año</li>
                <li><strong>Financiación:</strong> Disponemos de opciones de financiación para vehículos</li>
                <li><strong>Seguro:</strong> Recomendamos contratar seguro vehicular antes de la entrega</li>
                <li><strong>Matrícula:</strong> El proceso de matrícula puede tomar tiempo adicional</li>
              </ul>
            </div>

            <div className="importante">
              <strong>⚠️ Restricciones para vehículos:</strong>
              <ul>
                <li>No aplica derecho de retracto para vehículos usados</li>
                <li>Los cambios están limitados a defectos de fábrica únicamente</li>
                <li>Se requiere inspección técnica obligatoria</li>
                <li>El comprador debe tener licencia de conducción vigente</li>
              </ul>
            </div>

            <div className="destacado">
              <strong>📋 Documentos requeridos para vehículos:</strong>
              <ul>
                <li>Cédula de ciudadanía</li>
                <li>Licencia de conducción vigente</li>
                <li>Certificado de ingresos (si aplica financiación)</li>
                <li>Referencias comerciales</li>
              </ul>
            </div>
                </div>
              </div>
              
        <div className="seccion">
          <div className="seccion-header">
            <CreditCard className="seccion-icono" />
            <h2 className="seccion-titulo">Promociones y Cupones</h2>
          </div>
          <div className="seccion-contenido">
            <p>
              Los Clientes autorizan expresamente a ME LLEVO ESTO para enviarles promociones al correo 
              electrónico registrado en el Sitio, conforme a las características de cada Cliente según 
              las compras y enlaces visitados.
            </p>

            <div className="info-box">
              <h4>🎟️ Uso de Cupones</h4>
              <p>• El uso de los cupones de descuento no es acumulable con otras promociones o descuentos</p>
              <p>• Únicamente deberá ser usado una vez por cada cliente</p>
              <p>• Solo podrá ser usado por personas mayores de 18 años</p>
              <p>• Los cupones tienen fecha de vencimiento específica</p>
            </div>

            <div className="destacado">
              <strong>📅 Vigencia de promociones:</strong> Las ofertas y/o promociones tendrán una vigencia 
              indicada y comunicada al usuario, de lo contrario se entenderá que la promoción se extiende 
              hasta agotar el inventario destinado para esta oferta.
            </div>

            <p>
              Las promociones no son acumulables con otras promociones o descuentos a menos que en el 
              sitio se especifique lo contrario.
            </p>

            <div className="importante">
              <strong>⚠️ Cancelación de promociones:</strong> El Cliente podrá solicitar la suspensión 
              de toda comunicación promocional o publicitaria enviada a su correo electrónico, enviando 
              un correo en este sentido a info@mellevoesto.com
            </div>
                </div>
              </div>

        <div className="seccion">
          <div className="seccion-header">
            <Shield className="seccion-icono" />
            <h2 className="seccion-titulo">Seguridad y Protección</h2>
          </div>
          <div className="seccion-contenido">
            <p>
              Por razones de seguridad en la transacción y proteger a sus clientes, ME LLEVO ESTO se 
              reserva el derecho de solicitar datos adicionales con el fin de corroborar datos personales 
              así como también no procesar temporal o definitivamente las compras realizadas por aquellos 
              clientes cuyos datos no hayan podido ser confirmados.
            </p>

            <div className="importante">
              <strong>⚠️ Reserva de derechos:</strong> ME LLEVO ESTO se reserva el derecho de eliminar 
              cualquier registro previamente aceptado o rechazar una nueva solicitud, sin que esté 
              obligado a comunicar o exponer las razones de su decisión y sin que ello genere derecho 
              para el cliente a solicitar de su parte, el resarcimiento de perjuicios.
            </div>

            <div className="destacado">
              <strong>🔒 Autorización de datos:</strong> Adicionalmente, autorizan los términos y condiciones 
              de PayU y su manejo de datos personales, los cuales están disponibles en www.payulatam.co, 
              ya que son ellos la plataforma de pagos contratada por ME LLEVO ESTO.
            </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <FileText className="seccion-icono" />
            <h2 className="seccion-titulo">Modificaciones</h2>
          </div>
          <div className="seccion-contenido">
            <p>
              ME LLEVO ESTO se reserva el derecho de modificar estos términos y condiciones en cualquier 
              momento. Los cambios serán notificados a través de nuestro sitio web y por correo electrónico 
              a los usuarios registrados.
            </p>
            
            <div className="destacado">
              <strong>📝 Aceptación:</strong> El uso continuado del sitio después de cualquier modificación 
              constituye la aceptación de los nuevos términos y condiciones.
            </div>

            <div className="info-box">
              <h4>📞 Contacto</h4>
              <p><strong>📧 Email:</strong> info@mellevoesto.com</p>
              <p><strong>📱 Teléfono:</strong> +57 300 000 0000</p>
              <p><strong>🏢 Dirección:</strong> Cali, Colombia</p>
              <p><strong>🕒 Horario:</strong> Lunes a Viernes 8:00 AM - 12:30 PM y 2:00 PM - 5:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TerminosCondiciones