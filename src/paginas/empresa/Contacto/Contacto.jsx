import React from 'react'
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle, Users, HeadphonesIcon } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'

const Contacto = () => {
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
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
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
          color: #f59e0b;
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
        .contacto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin: 1rem 0;
        }
        .contacto-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #22c55e;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.2s ease;
        }
        .contacto-card:hover {
          transform: translateY(-2px);
        }
        .contacto-card h5 {
          color: #15803d;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .contacto-card p {
          color: #15803d;
          margin: 0.25rem 0;
        }
        .contacto-card a {
          color: #15803d;
          text-decoration: none;
          font-weight: 500;
        }
        .contacto-card a:hover {
          text-decoration: underline;
        }
        .horario-box {
          background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
          border: 1px solid #a855f7;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
        }
        .horario-box h4 {
          color: #7c3aed;
          margin-bottom: 1rem;
        }
        .horario-box ul {
          color: #7c3aed;
        }
        .redes-sociales {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin: 1rem 0;
        }
        .red-social {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: transform 0.2s ease;
        }
        .red-social:hover {
          transform: translateY(-2px);
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
          .contacto-grid {
            grid-template-columns: 1fr;
          }
          .redes-sociales {
            flex-direction: column;
            align-items: center;
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
          <Phone className="icono" />
          <h1>Información de Contacto</h1>
        </div>
        
        <p className="subtitulo">
          Estamos aquí para ayudarte. Contáctanos por cualquier consulta o inquietud
        </p>
        
        <span className="fecha-actualizacion">
          Última actualización: {new Date().toLocaleDateString('es-CO')}
        </span>
      </div>

      <div className="politica-content">
        <div className="seccion">
          <div className="seccion-header">
            <Phone className="seccion-icono" />
            <h2 className="seccion-titulo">Canales de Contacto</h2>
          </div>
          <div className="seccion-contenido">
            <div className="contacto-grid">
              <div className="contacto-card">
                <h5>📱 WhatsApp</h5>
                <p><strong>Número:</strong> +57 300 000 0000</p>
                <p><strong>Disponible:</strong> 24/7</p>
                <p><strong>Respuesta:</strong> Inmediata</p>
                <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer">
                  Chatear ahora
                </a>
              </div>
              
              <div className="contacto-card">
                <h5>📧 Email</h5>
                <p><strong>General:</strong> info@mellevoesto.com</p>
                <p><strong>Soporte:</strong> soporte@mellevoesto.com</p>
                <p><strong>Respuesta:</strong> 24 horas</p>
                <a href="mailto:info@mellevoesto.com">
                  Enviar email
                </a>
              </div>
              
              <div className="contacto-card">
                <h5>📞 Teléfono</h5>
                <p><strong>Fijo:</strong> +57 (2) 123 4567</p>
                <p><strong>Móvil:</strong> +57 300 000 0000</p>
                <p><strong>Horario:</strong> Lun-Vie 8AM-6PM</p>
                <a href="tel:+573000000000">
                  Llamar ahora
                </a>
              </div>
            </div>

            <div className="destacado">
              <strong>💡 Recomendación:</strong> Para consultas urgentes, te recomendamos usar WhatsApp 
              ya que tenemos respuesta inmediata las 24 horas del día.
            </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <Clock className="seccion-icono" />
            <h2 className="seccion-titulo">Horarios de Atención</h2>
          </div>
          <div className="seccion-contenido">
            <div className="horario-box">
              <h4>🕒 Horarios de Atención</h4>
              <ul>
                <li><strong>Lunes a Viernes:</strong> 8:00 AM - 12:30 PM y 2:00 PM - 5:30 PM</li>
                <li><strong>Sábados:</strong> 8:00 AM - 12:00 PM</li>
                <li><strong>Domingos:</strong> Cerrado</li>
                <li><strong>Festivos:</strong> Horario especial (consultar)</li>
              </ul>
            </div>

            <div className="info-box">
              <h4>📱 Atención 24/7</h4>
              <p>• WhatsApp disponible las 24 horas</p>
              <p>• Respuesta automática fuera de horario</p>
              <p>• Soporte técnico en horario extendido</p>
              <p>• Emergencias atendidas inmediatamente</p>
                  </div>

            <div className="importante">
              <strong>⚠️ Nota importante:</strong> Durante festivos nacionales y fines de semana, 
              nuestro servicio telefónico puede tener horarios reducidos. Sin embargo, WhatsApp 
              y email siguen disponibles.
            </div>
          </div>
                  </div>

        <div className="seccion">
          <div className="seccion-header">
            <MapPin className="seccion-icono" />
            <h2 className="seccion-titulo">Ubicación y Oficinas</h2>
          </div>
          <div className="seccion-contenido">
            <div className="info-box">
              <h4>🏢 Oficina Principal</h4>
              <p><strong>Dirección:</strong> Calle 123 #45-67, Cali, Colombia</p>
              <p><strong>Ciudad:</strong> Santiago de Cali, Valle del Cauca</p>
              <p><strong>Código Postal:</strong> 760001</p>
              <p><strong>Barrio:</strong> Centro</p>
                  </div>

            <div className="destacado">
              <strong>📍 Ubicación:</strong> Nuestra oficina principal está ubicada en el centro de Cali, 
              con fácil acceso por transporte público y privado. Contamos con estacionamiento para 
              nuestros clientes.
                  </div>

            <div className="info-box">
              <h4>🚚 Centro de Distribución</h4>
              <p><strong>Dirección:</strong> Zona Industrial, Cali, Colombia</p>
              <p><strong>Horario de recogidas:</strong> Lunes a Viernes 8:00 AM - 4:00 PM</p>
              <p><strong>Servicios:</strong> Recogida de productos, devoluciones</p>
                </div>

            <div className="importante">
              <strong>⚠️ Visitas:</strong> Si necesitas visitar nuestras oficinas, te recomendamos 
              agendar una cita previa para garantizar la mejor atención.
              </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <Users className="seccion-icono" />
            <h2 className="seccion-titulo">Departamentos Especializados</h2>
          </div>
          <div className="seccion-contenido">
            <div className="contacto-grid">
              <div className="contacto-card">
                <h5>🛒 Ventas</h5>
                <p><strong>Email:</strong> ventas@mellevoesto.com</p>
                <p><strong>Teléfono:</strong> +57 300 000 0001</p>
                <p><strong>Horario:</strong> Lun-Vie 8AM-6PM</p>
                <p>Consultas sobre productos y precios</p>
        </div>
              
              <div className="contacto-card">
                <h5>📦 Soporte Técnico</h5>
                <p><strong>Email:</strong> soporte@mellevoesto.com</p>
                <p><strong>Teléfono:</strong> +57 300 000 0002</p>
                <p><strong>Horario:</strong> Lun-Vie 8AM-8PM</p>
                <p>Ayuda con pedidos y problemas técnicos</p>
                </div>
              
              <div className="contacto-card">
                <h5>🔄 Devoluciones</h5>
                <p><strong>Email:</strong> devoluciones@mellevoesto.com</p>
                <p><strong>Teléfono:</strong> +57 300 000 0003</p>
                <p><strong>Horario:</strong> Lun-Vie 8AM-5PM</p>
                <p>Procesos de cambio y devolución</p>
                </div>
              
              <div className="contacto-card">
                <h5>🚗 Vehículos</h5>
                <p><strong>Email:</strong> vehiculos@mellevoesto.com</p>
                <p><strong>Teléfono:</strong> +57 300 000 0004</p>
                <p><strong>Horario:</strong> Lun-Vie 8AM-6PM</p>
                <p>Consultas sobre automóviles</p>
              </div>
            </div>
            
            <div className="destacado">
              <strong>💼 Equipo especializado:</strong> Cada departamento cuenta con personal 
              especializado para brindarte la mejor atención según tu necesidad específica.
            </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <MessageCircle className="seccion-icono" />
            <h2 className="seccion-titulo">Redes Sociales</h2>
          </div>
          <div className="seccion-contenido">
            <p>
              Síguenos en nuestras redes sociales para estar al día con nuestras ofertas, 
              nuevos productos y noticias.
            </p>

            <div className="redes-sociales">
              <a href="https://facebook.com/mellevoesto" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>📘</span>
                Facebook
              </a>
              <a href="https://instagram.com/mellevoesto" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>📷</span>
                Instagram
              </a>
              <a href="https://twitter.com/mellevoesto" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>🐦</span>
                Twitter
              </a>
              <a href="https://tiktok.com/@mellevoesto" target="_blank" rel="noopener noreferrer" className="red-social">
                <span>🎵</span>
                TikTok
              </a>
            </div>

            <div className="info-box">
              <h4>📱 Beneficios de seguirnos</h4>
              <p>• Ofertas exclusivas para seguidores</p>
              <p>• Lanzamientos de productos en primicia</p>
              <p>• Tips y consejos de uso</p>
              <p>• Concursos y sorteos</p>
              <p>• Atención directa por mensaje privado</p>
            </div>
          </div>
        </div>

        <div className="seccion">
          <div className="seccion-header">
            <HeadphonesIcon className="seccion-icono" />
            <h2 className="seccion-titulo">Soporte al Cliente</h2>
          </div>
          <div className="seccion-contenido">
            <div className="destacado">
              <strong>🎯 Nuestro compromiso:</strong> En ME LLEVO ESTO nos comprometemos a brindarte 
              la mejor experiencia de compra y atención al cliente. Tu satisfacción es nuestra prioridad.
            </div>

            <div className="info-box">
              <h4>⭐ Servicios de soporte</h4>
              <p>• Asistencia en la selección de productos</p>
              <p>• Ayuda con el proceso de compra</p>
              <p>• Seguimiento de pedidos</p>
              <p>• Resolución de problemas técnicos</p>
              <p>• Soporte post-venta</p>
              <p>• Consultas sobre garantías</p>
            </div>

            <div className="importante">
              <strong>📋 Para una mejor atención:</strong>
              <ul>
                <li>Tener a la mano el número de pedido (si aplica)</li>
                <li>Describir claramente tu consulta o problema</li>
                <li>Proporcionar información de contacto actualizada</li>
                <li>Ser específico sobre el producto o servicio</li>
              </ul>
            </div>

            <div className="horario-box">
              <h4>🏆 Calidad de servicio</h4>
              <ul>
                <li><strong>Tiempo de respuesta:</strong> Máximo 2 horas en horario laboral</li>
                <li><strong>Resolución:</strong> 95% de consultas resueltas en primera respuesta</li>
                <li><strong>Satisfacción:</strong> 98% de clientes satisfechos con nuestro servicio</li>
                <li><strong>Disponibilidad:</strong> 24/7 por WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacto