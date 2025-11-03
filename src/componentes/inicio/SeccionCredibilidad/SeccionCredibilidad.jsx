import React from 'react';
import { 
  Shield, 
  Truck, 
  CreditCard, 
  Users, 
  Star, 
  CheckCircle, 
  Award,
  ShoppingBag,
  Heart,
  Zap,
  User
} from 'lucide-react';
import './SeccionCredibilidad.css';

const SeccionCredibilidad = () => {
  // Datos de estadísticas de confianza
  const estadisticasConfianza = [
    {
      icono: <Users size={32} />,
      numero: "50,000+",
      texto: "Clientes Satisfechos",
      descripcion: "Confían en nosotros diariamente"
    },
    {
      icono: <ShoppingBag size={32} />,
      numero: "200,000+",
      texto: "Productos Vendidos",
      descripcion: "Con calidad garantizada"
    },
    {
      icono: <Star size={32} />,
      numero: "4.9/5",
      texto: "Calificación Promedio",
      descripcion: "Basada en reseñas reales"
    },
    {
      icono: <Award size={32} />,
      numero: "5 Años",
      texto: "En el Mercado",
      descripcion: "Experiencia comprobada"
    }
  ];

  // Datos de garantías
  const garantias = [
    {
      icono: <Shield size={24} />,
      titulo: "Garantía de Calidad",
      descripcion: "Todos nuestros productos pasan por estrictos controles de calidad antes de llegar a ti."
    },
    {
      icono: <Truck size={24} />,
      titulo: "Envío Gratis",
      descripcion: "Envío gratuito en compras superiores a $50.000. Entrega rápida y segura."
    },
    {
      icono: <CreditCard size={24} />,
      titulo: "Pago Seguro",
      descripcion: "Procesamos tus pagos con la máxima seguridad. Múltiples métodos de pago disponibles."
    },
    {
      icono: <CheckCircle size={24} />,
      titulo: "Devolución Fácil",
      descripcion: "30 días para devolver tu producto si no estás completamente satisfecho."
    },
    {
      icono: <Zap size={24} />,
      titulo: "Soporte 24/7",
      descripcion: "Nuestro equipo está disponible las 24 horas para ayudarte con cualquier consulta."
    },
    {
      icono: <Heart size={24} />,
      titulo: "Satisfacción Garantizada",
      descripcion: "Tu satisfacción es nuestra prioridad. Trabajamos para superar tus expectativas."
    }
  ];

  // Datos de testimonios
  const testimonios = [
    {
      nombre: "María González",
      ubicacion: "Bogotá, Colombia",
      avatar: "MG",
      calificacion: 5,
      comentario: "Excelente calidad y servicio. Los productos llegaron súper rápido y en perfectas condiciones. Definitivamente volveré a comprar.",
      producto: "iPhone 15 Pro Max"
    },
    {
      nombre: "Carlos Rodríguez",
      ubicacion: "Medellín, Colombia",
      avatar: "CR",
      calificacion: 5,
      comentario: "La mejor experiencia de compra online que he tenido. Atención al cliente excepcional y productos originales.",
      producto: "MacBook Air M2"
    },
    {
      nombre: "Ana Martínez",
      ubicacion: "Cali, Colombia",
      avatar: "AM",
      calificacion: 5,
      comentario: "Increíble variedad de productos y precios competitivos. El proceso de compra es muy fácil y seguro.",
      producto: "AirPods Pro"
    }
  ];

  const renderEstrellas = (cantidad) => {
    return Array.from({ length: cantidad }, (_, index) => (
      <Star key={index} size={16} fill="currentColor" />
    ));
  };

  return (
    <section className="seccion-credibilidad">
      <div className="contenedor-credibilidad">
        {/* Header con imagen de stock */}
        <div className="credibilidad-header">
          <div className="header-contenido">
            <h2 className="credibilidad-titulo">
              <span className="titulo-principal">¿Por qué elegir</span>
              <span className="titulo-destacado">nuestra tienda?</span>
            </h2>
            <p className="credibilidad-subtitulo">
              Somos la tienda online líder en tecnología y productos premium. 
              Miles de clientes confían en nosotros por nuestra calidad, 
              servicio excepcional y garantía total.
            </p>
          </div>
          
          <div className="imagen-stock-contenedor">
            <div className="imagen-stock">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Equipo profesional trabajando"
                className="stock-imagen"
              />
              <div className="stock-overlay">
                <div className="stock-badge">
                  <CheckCircle size={20} />
                  Empresa Verificada
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de confianza */}
        <div className="estadisticas-confianza">
          {estadisticasConfianza.map((estadistica, index) => (
            <div key={index} className="estadistica-item">
              <div className="estadistica-icono">
                {estadistica.icono}
              </div>
              <div className="estadistica-numero">
                {estadistica.numero}
              </div>
              <div className="estadistica-texto">
                {estadistica.texto}
              </div>
              <div className="estadistica-descripcion">
                {estadistica.descripcion}
              </div>
            </div>
          ))}
        </div>

        {/* Garantías */}
        <div className="garantias-contenedor">
          <h3 className="garantias-titulo">Nuestras Garantías</h3>
          <div className="garantias-grid">
            {garantias.map((garantia, index) => (
              <div key={index} className="garantia-item">
                <div className="garantia-icono">
                  {garantia.icono}
                </div>
                <div>
                  <h4 className="garantia-titulo">{garantia.titulo}</h4>
                  <p className="garantia-descripcion">{garantia.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonios */}
        <div className="testimonios-contenedor">
          <h3 className="testimonios-titulo">Lo que dicen nuestros clientes</h3>
          <div className="testimonios-grid">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="testimonio-item">
                <div className="testimonio-header">
                  <div className="testimonio-avatar">
                    {testimonio.avatar}
                  </div>
                  <div className="testimonio-info">
                    <div className="testimonio-nombre">{testimonio.nombre}</div>
                    <div className="testimonio-ubicacion">{testimonio.ubicacion}</div>
                  </div>
                  <div className="testimonio-calificacion">
                    {renderEstrellas(testimonio.calificacion)}
                  </div>
                </div>
                <p className="testimonio-comentario">"{testimonio.comentario}"</p>
                <div className="testimonio-producto">
                  Compró: {testimonio.producto}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="credibilidad-cta">
          <div className="cta-contenido">
            <h3 className="cta-titulo">¡Únete a miles de clientes satisfechos!</h3>
            <p className="cta-descripcion">
              Descubre por qué somos la tienda online preferida. 
              Calidad garantizada, envío gratis y la mejor atención al cliente.
            </p>
            <div className="cta-botones">
              <a href="/tienda" className="btn-cta-principal">
                <ShoppingBag size={20} />
                Explorar Productos
              </a>
              <a href="/contacto" className="btn-cta-secundario">
                <User size={20} />
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeccionCredibilidad;