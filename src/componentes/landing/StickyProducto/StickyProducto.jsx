import React, { useState, useEffect } from "react";
import { useDeteccionScroll } from "../../../hooks/useDeteccionScroll";
import { useCarrito } from "../../../contextos/CarritoContext";
import ContraEntregaModal from "../../checkout/ContraEntregaModal";
import StickyProductoEscritorio from "./StickyProductoEscritorio";
import "./StickyProducto.css";

const StickyProducto = ({ producto, mostrar }) => {
  // Usar detección de scroll para mostrar el sticky después de la imagen de pagos
  const { mostrarSticky } = useDeteccionScroll('.hero-temu-metodos-pago', 50);
  
  // Estado para controlar la animación de aparición
  const [visible, setVisible] = useState(false);
  
  // Estado para detectar si es escritorio
  const [esEscritorio, setEsEscritorio] = useState(false);
  
  // Hook para detectar el tamaño de pantalla
  useEffect(() => {
    const detectarTamañoPantalla = () => {
      setEsEscritorio(window.innerWidth >= 768); // 768px es el breakpoint para tablet/escritorio
    };
    
    // Detectar al cargar
    detectarTamañoPantalla();
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', detectarTamañoPantalla);
    
    return () => {
      window.removeEventListener('resize', detectarTamañoPantalla);
    };
  }, []);
  
  // Estados para el modal de contra entrega
  const [modalContraEntregaAbierto, setModalContraEntregaAbierto] = useState(false);
  
  // Hook del carrito
  const { agregarAlCarrito, items } = useCarrito();
  
  // Estado para controlar si el producto ya fue añadido
  const [productoAnadido, setProductoAnadido] = useState(false);
  
  // Función para verificar si el producto está en el carrito
  const estaEnCarrito = (productoId) => {
    return items.some(item => item.producto_id === productoId);
  };
  
  // Efecto para activar la animación cuando debe mostrarse
  useEffect(() => {
    if (mostrarSticky && mostrar && producto) {
      // Pequeño delay para que la animación se vea suave
      const timer = setTimeout(() => {
        setVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [mostrarSticky, mostrar, producto]);
  
  // Efecto para verificar si el producto está en el carrito
  useEffect(() => {
    if (producto?.id) {
      setProductoAnadido(estaEnCarrito(producto.id));
    }
  }, [producto?.id, items]);
  
  // Función para manejar agregar al carrito
  const manejarAgregarCarrito = async () => {
    if (!producto || productoAnadido) return;
    
    try {
      await agregarAlCarrito(producto, 1);
      setProductoAnadido(true);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  // Función para hacer scroll suave hacia la galería de imágenes del HeroTemu
  const scrollHaciaGaleria = () => {
    const galeriaElemento = document.querySelector('.hero-temu-contenedor-galeria');
    
    if (galeriaElemento) {
      // Calcular la posición con un offset para mejor visualización
      const offsetTop = galeriaElemento.offsetTop - 20; // 20px de margen superior
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    } else {
      console.warn('No se encontró la galería de imágenes del HeroTemu');
    }
  };
  
  // No mostrar si no hay producto, mostrar está en false, o no se ha pasado la imagen de pagos
  if (!mostrar || !producto || !mostrarSticky) return null;

  // Si es escritorio, usar el componente de escritorio
  if (esEscritorio) {
    return (
      <StickyProductoEscritorio 
        producto={producto}
        mostrar={mostrar}
        visible={visible}
        modalContraEntregaAbierto={modalContraEntregaAbierto}
        setModalContraEntregaAbierto={setModalContraEntregaAbierto}
        manejarAgregarCarrito={manejarAgregarCarrito}
        productoAnadido={productoAnadido}
        scrollHaciaGaleria={scrollHaciaGaleria}
      />
    );
  }

  // Para móvil, usar el componente original
  return (
    <div className={`sticky-producto ${visible ? 'visible' : ''}`}>
      <div className="sticky-contenedor-principal">
        
        {/* Contenedor de la Imagen (izquierda) */}
        <div className="contenedor-imagen" onClick={scrollHaciaGaleria}>
          {producto.imagenes?.imagen_principal ? (
            <img 
              src={producto.imagenes.imagen_principal} 
              alt={producto.nombre || 'Producto'}
              loading="lazy"
            />
          ) : (
            <div className="imagen-placeholder">
              📦
            </div>
          )}
        </div>

        {/* Contenedor de la información (derecha) */}
        <div className="contenedor-info">
          
          {/* Título (arriba) */}
          <div className="contenedor-titulo">
            {producto.nombre || 'Producto sin nombre'}
          </div>

          {/* Contenedor inferior con precio y botones */}
          <div className="contenedor-inferior">
            
            {/* Precio (izquierda) */}
            <div className="contenedor-precio">
              <div className="precio-actual">
                ${producto.precio || '0'}
              </div>
              {producto.precio_original && producto.precio_original > producto.precio && (
                <div className="precio-info">
                  <span className="precio-original">${producto.precio_original}</span>
                  <span className="descuento-porcentaje">
                    -{producto.descuento || Math.round(((producto.precio_original - producto.precio) / producto.precio_original) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Botones (derecha) */}
            <div className="contenedor-botones">
              <button 
                className="boton-1"
                onClick={() => setModalContraEntregaAbierto(true)}
              >
                Contra Entrega
              </button>
              <button 
                className={`boton-2 ${productoAnadido ? 'producto-anadido' : ''}`}
                onClick={manejarAgregarCarrito}
                disabled={productoAnadido}
              >
                {productoAnadido ? 'Producto Añadido' : 'Añadir Carrito'}
              </button>
            </div>

          </div>

        </div>

      </div>
      
      {/* Modal de Contra Entrega */}
      <ContraEntregaModal
        abierto={modalContraEntregaAbierto}
        onCerrar={() => setModalContraEntregaAbierto(false)}
        producto={producto}
        onConfirmar={(payload) => {
          console.log('Pedido COD creado desde sticky:', payload);
          setModalContraEntregaAbierto(false);
        }}
      />
    </div>
  );
};

export default StickyProducto;