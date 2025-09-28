import React, { useState, useEffect, useRef } from 'react'
import './TestimoniosTemu.css'

/**
 * TestimoniosTemu - Sección de testimonios HIJUEPUTAMENTE PODEROSA
 * 
 * Características:
 * - Grid masonry de testimonios con fotos reales
 * - Animaciones ultra vendedoras
 * - Contador de clientes satisfechos
 * - Efectos de hover malparidos
 * - Preparado para Supabase
 * - Todo en español y súper convincente
 */

const TestimoniosTemu = ({ 
  testimoniosData = null,
  mostrarAnimaciones = true,
  mostrarContador = true,
  producto = null
}) => {
  
  const [contadorClientes, setContadorClientes] = useState(0)
  const [testimonioActivo, setTestimonioActivo] = useState(null)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const sectionRef = useRef(null)
  
  // Datos ficticios ULTRA VENDEDORES
  const testimoniosFicticios = {
    titulo: "¡+15.847 CLIENTES YA TRANSFORMARON SU VIDA!",
    subtitulo: "Lee lo que dicen nuestros clientes reales sobre su experiencia",
    estadisticas: {
      totalClientes: 15847,
      satisfaccion: 4.9,
      recomiendan: 98
    },
    testimonios: [
      {
        id: 1,
        nombre: "María González",
        ubicacion: "Bogotá, Colombia",
        rating: 5,
        fecha: "Hace 2 días",
        comentario: "¡INCREÍBLE! No puedo creer lo bien que funciona. En solo 3 días ya veo resultados. Mi familia está sorprendida. ¡100% recomendado!",
        imagen: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        imagenProducto: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
        verificado: true,
        compraVerificada: true,
        likes: 234
      },
      {
        id: 2,
        nombre: "Carlos Rodríguez",
        ubicacion: "Medellín, Colombia",
        rating: 5,
        fecha: "Hace 1 semana",
        comentario: "Hermano, esto es una BESTIALIDAD. Llevo 2 semanas usándolo y la diferencia es BRUTAL. Mi esposa dice que parezco otra persona. ¡Gracias!",
        imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        imagenProducto: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        verificado: true,
        compraVerificada: true,
        likes: 189
      },
      {
        id: 3,
        nombre: "Ana Martínez",
        ubicacion: "Cali, Colombia",
        rating: 5,
        fecha: "Hace 3 días",
        comentario: "¡DIOS MÍO! Esto cambió mi vida completamente. Antes sufría todos los días, ahora soy otra persona. Lo recomiendo con los ojos cerrados.",
        imagen: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        imagenProducto: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop",
        verificado: true,
        compraVerificada: true,
        likes: 312
      },
      {
        id: 4,
        nombre: "Javier Pérez",
        ubicacion: "Barranquilla, Colombia",
        rating: 5,
        fecha: "Hace 5 días",
        comentario: "Marica, esto es LO MÁXIMO. Pensé que era mentira pero NO. Funciona de verdad. Ya pedí 3 más para mi familia. ¡BRUTAL!",
        imagen: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        imagenProducto: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop",
        verificado: true,
        compraVerificada: true,
        likes: 278
      },
      {
        id: 5,
        nombre: "Lucía Ramírez",
        ubicacion: "Bucaramanga, Colombia",
        rating: 5,
        fecha: "Hace 1 día",
        comentario: "¡ESPECTACULAR! Mi vida cambió 180 grados. Todos me preguntan qué hice. El secreto es este producto. ¡Mil gracias!",
        imagen: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        imagenProducto: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
        verificado: true,
        compraVerificada: true,
        likes: 445
      },
      {
        id: 6,
        nombre: "Roberto Silva",
        ubicacion: "Cartagena, Colombia",
        rating: 5,
        fecha: "Hace 4 días",
        comentario: "Esto es una CHIMBA total. No creía en estos productos pero este SÍ FUNCIONA. Ya llevo 1 mes y los resultados son IMPRESIONANTES.",
        imagen: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        imagenProducto: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        verificado: true,
        compraVerificada: true,
        likes: 356
      }
    ]
  }

  const datos = testimoniosData || testimoniosFicticios

  // Contador animado de clientes
  useEffect(() => {
    if (!mostrarContador) return
    
    let inicio = 0
    const final = datos.estadisticas.totalClientes
    const duracion = 2000
    const incremento = final / (duracion / 16)
    
    const timer = setInterval(() => {
      inicio += incremento
      if (inicio >= final) {
        setContadorClientes(final)
        clearInterval(timer)
      } else {
        setContadorClientes(Math.floor(inicio))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [mostrarContador, datos.estadisticas.totalClientes])

  // Animaciones al hacer scroll
  useEffect(() => {
    if (!mostrarAnimaciones) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('testimonios-temu-item-visible')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const items = sectionRef.current?.querySelectorAll('.testimonios-temu-testimonio')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [mostrarAnimaciones])

  const formatearNumero = (numero) => {
    return numero.toLocaleString('es-CO')
  }

  const abrirTestimonio = (testimonio) => {
    setTestimonioActivo(testimonio)
  }

  const cerrarTestimonio = () => {
    setTestimonioActivo(null)
  }

  const toggleMostrarTodos = () => {
    setMostrarTodos(!mostrarTodos)
  }

  // Mapear imágenes desde la nueva tabla producto_imagenes
  const testimoniosConImagenes = datos.testimonios.map((testimonio, index) => ({
    ...testimonio,
    imagen: producto?.imagenes?.[`imagen_testimonio_persona_${index + 1}`] || testimonio.imagen,
    imagenProducto: producto?.imagenes?.[`imagen_testimonio_producto_${index + 1}`] || testimonio.imagenProducto
  }))

  // Mostrar solo los primeros 3 testimonios inicialmente
  const testimoniosAMostrar = mostrarTodos ? testimoniosConImagenes : testimoniosConImagenes.slice(0, 3)

  return (
    <section className="testimonios-temu-seccion" ref={sectionRef}>
      
      {/* HEADER ULTRA VENDEDOR */}
      <div className="testimonios-temu-header">
        <div className="testimonios-temu-badge-viral">
          🔥 VIRAL EN REDES SOCIALES 🔥
        </div>
        
        <h2 className="testimonios-temu-titulo">
          {datos.titulo}
        </h2>
        
        <p className="testimonios-temu-subtitulo">
          {datos.subtitulo}
        </p>

        {/* ESTADÍSTICAS IMPACTANTES */}
        <div className="testimonios-temu-estadisticas">
          <div className="testimonios-temu-stat">
            <div className="testimonios-temu-stat-numero">
              +{formatearNumero(contadorClientes)}
            </div>
            <div className="testimonios-temu-stat-texto">
              Clientes Satisfechos
            </div>
          </div>
          
          <div className="testimonios-temu-stat">
            <div className="testimonios-temu-stat-numero">
              {datos.estadisticas.satisfaccion}⭐
            </div>
            <div className="testimonios-temu-stat-texto">
              Calificación Promedio
            </div>
          </div>
          
          <div className="testimonios-temu-stat">
            <div className="testimonios-temu-stat-numero">
              {datos.estadisticas.recomiendan}%
            </div>
            <div className="testimonios-temu-stat-texto">
              Lo Recomiendan
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE TESTIMONIOS MASONRY */}
      <div className="testimonios-temu-grid">
        {testimoniosAMostrar.map((testimonio, index) => (
          <div 
            key={testimonio.id}
            className="testimonios-temu-testimonio"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => abrirTestimonio(testimonio)}
          >
            
            {/* HEADER DEL TESTIMONIO */}
            <div className="testimonios-temu-testimonio-header">
              <div className="testimonios-temu-avatar-container">
                <img 
                  src={testimonio.imagen} 
                  alt={testimonio.nombre}
                  className="testimonios-temu-avatar"
                />
                {testimonio.verificado && (
                  <div className="testimonios-temu-verificado">
                    ✓
                  </div>
                )}
              </div>
              
              <div className="testimonios-temu-info">
                <h4 className="testimonios-temu-nombre">
                  {testimonio.nombre}
                </h4>
                <p className="testimonios-temu-ubicacion">
                  📍 {testimonio.ubicacion}
                </p>
                <div className="testimonios-temu-fecha">
                  {testimonio.fecha}
                </div>
              </div>

              <div className="testimonios-temu-rating">
                {[...Array(testimonio.rating)].map((_, i) => (
                  <span key={i} className="testimonios-temu-estrella">⭐</span>
                ))}
              </div>
            </div>

            {/* IMAGEN DEL PRODUCTO EN USO */}
            {testimonio.imagenProducto && (
              <div className="testimonios-temu-imagen-producto">
                <img 
                  src={testimonio.imagenProducto} 
                  alt="Cliente usando el producto"
                  className="testimonios-temu-producto-img"
                />
                <div className="testimonios-temu-producto-overlay">
                  <span className="testimonios-temu-zoom-icon">🔍</span>
                </div>
              </div>
            )}

            {/* COMENTARIO */}
            <div className="testimonios-temu-comentario">
              <p className="testimonios-temu-texto">
                "{testimonio.comentario}"
              </p>
            </div>

            {/* FOOTER CON BADGES */}
            <div className="testimonios-temu-footer">
              {testimonio.compraVerificada && (
                <div className="testimonios-temu-badge">
                  ✅ Compra Verificada
                </div>
              )}
              
              <div className="testimonios-temu-likes">
                ❤️ {testimonio.likes} personas encontraron esto útil
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* BOTÓN VER MÁS TESTIMONIOS */}
        {testimoniosConImagenes.length > 3 && (
        <div className="testimonios-temu-ver-mas">
          <button 
            className="testimonios-temu-ver-mas-boton"
            onClick={toggleMostrarTodos}
          >
            {mostrarTodos ? '👆 Ver Menos Testimonios' : '👇 Ver Más Testimonios'}
          </button>
          <p className="testimonios-temu-ver-mas-texto">
              {mostrarTodos 
                ? `Mostrando todos los ${testimoniosConImagenes.length} testimonios`
                : `Mostrando 3 de ${testimoniosConImagenes.length} testimonios`
              }
          </p>
        </div>
      )}

      {/* CTA FINAL MALPARIDO */}
      <div className="testimonios-temu-cta-final">
        <h3 className="testimonios-temu-cta-titulo">
          ¡ÚNETE A LOS MILES DE CLIENTES SATISFECHOS!
        </h3>
        <p className="testimonios-temu-cta-texto">
          No esperes más. Tu transformación comienza HOY.
        </p>
        <button className="testimonios-temu-cta-boton">
          🚀 ¡QUIERO MI TRANSFORMACIÓN AHORA!
        </button>
        <div className="testimonios-temu-cta-garantia">
          🛡️ Garantía de satisfacción del 100% o te devolvemos tu dinero
        </div>
      </div>

      {/* MODAL PARA VER TESTIMONIO COMPLETO */}
      {testimonioActivo && (
        <div className="testimonios-temu-modal" onClick={cerrarTestimonio}>
          <div className="testimonios-temu-modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button 
              className="testimonios-temu-modal-cerrar"
              onClick={cerrarTestimonio}
            >
              ✕
            </button>
            
            <div className="testimonios-temu-modal-header">
              <img 
                src={testimonioActivo.imagen} 
                alt={testimonioActivo.nombre}
                className="testimonios-temu-modal-avatar"
              />
              <div>
                <h3>{testimonioActivo.nombre}</h3>
                <p>{testimonioActivo.ubicacion}</p>
                <div className="testimonios-temu-modal-rating">
                  {[...Array(testimonioActivo.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            </div>

            {testimonioActivo.imagenProducto && (
              <img 
                src={testimonioActivo.imagenProducto} 
                alt="Producto en uso"
                className="testimonios-temu-modal-imagen"
              />
            )}

            <p className="testimonios-temu-modal-comentario">
              "{testimonioActivo.comentario}"
            </p>
          </div>
        </div>
      )}

    </section>
  )
}

export default TestimoniosTemu

