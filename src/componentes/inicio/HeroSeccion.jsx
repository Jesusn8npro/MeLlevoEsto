import React, { useState, useEffect, useRef } from 'react';
import './HeroSeccion.css';

const HeroSeccion = () => {
  const [indiceSliderActual, setIndiceSliderActual] = useState(0);
  const scrollRef = useRef(null);

  // Estados para el arrastre del mouse
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const [posicionInicial, setPosicionInicial] = useState(0);
  const [scrollInicial, setScrollInicial] = useState(0);

  // Imágenes del slider principal
  const imagenesSlider = [
    {
      src: '/images/Home/Imagen Principal HOME.jpg',
      alt: 'Imagen Principal Home',
      titulo: 'Ofertas Especiales',
      descripcion: 'Encuentra los mejores productos al mejor precio'
    },
    {
      src: '/images/Home/Venta de camionetas.jpg',
      alt: 'Venta de Camionetas',
      titulo: 'Venta de Camionetas',
      descripcion: 'Camionetas en excelente estado'
    },
    {
      src: '/images/Home/Banner de oferta 1.jpg',
      alt: 'Banner de Ofertas',
      titulo: 'Banner de Ofertas',
      descripcion: 'No te pierdas nuestras promociones'
    }
  ];

  // Categorías para el grid de la derecha
  const categorias = [
    {
      src: '/images/Home/Categorias/Autos usados.jpg',
      alt: 'Autos Usados',
      titulo: 'Autos Usados',
      enlace: '/categoria/autos-usados'
    },
    {
      src: '/images/Home/Categorias/Motos usadas.jpg',
      alt: 'Motos Usadas',
      titulo: 'Motos Usadas',
      enlace: '/categoria/motos-usadas'
    },
    {
      src: '/images/Home/Categorias/Ropa nueva.jpg',
      alt: 'Ropa Nueva',
      titulo: 'Ropa Nueva',
      enlace: '/categoria/ropa-nueva'
    },
    {
      src: '/images/Home/Categorias/Perfumeria arabe.jpg',
      alt: 'Perfumería Árabe',
      titulo: 'Perfumería Árabe',
      enlace: '/categoria/perfumeria-arabe'
    }
  ];

  // Categorías circulares para el scroll horizontal
  const categoriasCirculares = [
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Cosas para el hogar.jpg',
      alt: 'Cosas para el hogar',
      nombre: 'Hogar',
      enlace: '/categoria/hogar'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Gamin y accesorios.jpg',
      alt: 'Gaming y accesorios',
      nombre: 'Gaming',
      enlace: '/categoria/gaming'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Instrumentos Musicales.jpg',
      alt: 'Instrumentos Musicales',
      nombre: 'Música',
      enlace: '/categoria/instrumentos'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Jugueteria.jpg',
      alt: 'Juguetería',
      nombre: 'Juguetes',
      enlace: '/categoria/juguetes'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Motocicletas en Venta.jpg',
      alt: 'Motocicletas en Venta',
      nombre: 'Motos',
      enlace: '/categoria/motocicletas'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Pc y accesorios.jpg',
      alt: 'PC y accesorios',
      nombre: 'Tecnología',
      enlace: '/categoria/tecnologia'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Perfumeria Europea.jpg',
      alt: 'Perfumería Europea',
      nombre: 'Perfumes',
      enlace: '/categoria/perfumeria'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Ropa.jpg',
      alt: 'Ropa',
      nombre: 'Moda',
      enlace: '/categoria/ropa'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Vehiculos usados.jpg',
      alt: 'Vehículos usados',
      nombre: 'Autos',
      enlace: '/categoria/vehiculos'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Venta de casas.jpg',
      alt: 'Venta de casas',
      nombre: 'Inmuebles',
      enlace: '/categoria/inmuebles'
    },
    {
      src: '/images/Home/Categorias/Categorias fondo blanco/Zapatos originales.jpg',
      alt: 'Zapatos originales',
      nombre: 'Calzado',
      enlace: '/categoria/zapatos'
    }
  ];

  // Función para avanzar al siguiente slide
  const siguienteSlide = () => {
    setIndiceSliderActual((prevIndice) => 
      prevIndice === imagenesSlider.length - 1 ? 0 : prevIndice + 1
    );
  };

  // Función para ir al slide anterior
  const slideAnterior = () => {
    setIndiceSliderActual((prevIndice) => 
      prevIndice === 0 ? imagenesSlider.length - 1 : prevIndice - 1
    );
  };

  // Función para ir a un slide específico
  const irASlide = (indice) => {
    setIndiceSliderActual(indice);
  };

  // Auto-play del slider
  useEffect(() => {
    const intervalo = setInterval(siguienteSlide, 5000); // Cambia cada 5 segundos
    return () => clearInterval(intervalo);
  }, []);

  // Funciones para el arrastre del mouse en el scroll de categorías
  const iniciarArrastre = (e) => {
    setEstaArrastrando(true);
    setPosicionInicial(e.pageX - scrollRef.current.offsetLeft);
    setScrollInicial(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const finalizarArrastre = () => {
    setEstaArrastrando(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const manejarArrastre = (e) => {
    if (!estaArrastrando) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const caminar = (x - posicionInicial) * 2; // Multiplicador para velocidad
    scrollRef.current.scrollLeft = scrollInicial - caminar;
  };

  // Agregar event listeners para el mouse
  useEffect(() => {
    const handleMouseUp = () => finalizarArrastre();
    const handleMouseLeave = () => finalizarArrastre();

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Prevenir selección de texto durante el arrastre
  useEffect(() => {
    if (estaArrastrando) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
  }, [estaArrastrando]);

  // Manejo de eventos táctiles para móvil
  const [inicioToque, setInicioToque] = useState(null);

  const manejarInicioToque = (e) => {
    setInicioToque(e.touches[0].clientX);
  };

  const manejarFinToque = (e) => {
    if (!inicioToque) return;
    
    const finToque = e.changedTouches[0].clientX;
    const diferencia = inicioToque - finToque;
    
    if (Math.abs(diferencia) > 50) { // Mínimo 50px de deslizamiento
      if (diferencia > 0) {
        siguienteSlide();
      } else {
        slideAnterior();
      }
    }
    
    setInicioToque(null);
  };

  return (
    <section className="hero-seccion">
      <div className="hero-contenedor">
        {/* Slider Principal */}
        <div className="slider-principal">
          <div 
            className="slider-contenido"
            onTouchStart={manejarInicioToque}
            onTouchEnd={manejarFinToque}
          >
            {imagenesSlider.map((imagen, indice) => (
              <div
                key={indice}
                className={`slide ${indice === indiceSliderActual ? 'activo' : ''}`}
              >
                <img 
                  src={imagen.src} 
                  alt={imagen.alt}
                  className="imagen-slide"
                />
              </div>
            ))}
          </div>

          {/* Navegación del slider - solo indicadores */}
          <div className="navegacion-slider">
            {imagenesSlider.map((_, index) => (
              <button
                key={index}
                className={`indicador ${index === indiceSliderActual ? 'activo' : ''}`}
                onClick={() => irASlide(index)}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Grid de Categorías */}
        <div className="grid-categorias">
          {categorias.map((categoria, indice) => (
            <div key={indice} className="tarjeta-categoria">
              <img 
                src={categoria.src} 
                alt={categoria.alt}
                className="imagen-categoria"
              />
              <div className="overlay-categoria">
                <h3 className="titulo-categoria">{categoria.titulo}</h3>
                <button className="boton-categoria">Explorar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Me Llevo Esto - Ancho Completo */}
      <div className="banner-me-llevo-esto">
        <img 
          src="/images/Home/Banner Me llevo esto.jpg" 
          alt="Banner Me Llevo Esto - Todo a un solo clic"
          className="banner-imagen"
        />
      </div>

      {/* Sección de Categorías con Scroll Horizontal */}
      <div className="seccion-categorias-scroll">
        <div className="encabezado-categorias">
          <h2 className="titulo-categorias">Explora por Categorías</h2>
          <button className="boton-ver-mas" onClick={() => window.location.href = '/tienda'}>
            Ver Más
          </button>
        </div>
        
        <div className="contenedor-scroll-categorias">
          <div 
            className="scroll-categorias"
            ref={scrollRef}
            onMouseDown={iniciarArrastre}
            onMouseMove={manejarArrastre}
            onMouseUp={finalizarArrastre}
            onMouseLeave={finalizarArrastre}
            style={{ cursor: estaArrastrando ? 'grabbing' : 'grab' }}
          >
            {categoriasCirculares.map((categoria, indice) => (
              <div 
                key={indice} 
                className="categoria-circular"
                onClick={() => !estaArrastrando && (window.location.href = categoria.enlace)}
                style={{ cursor: estaArrastrando ? 'grabbing' : 'pointer' }}
              >
                <div className="contenedor-imagen-circular">
                  <img 
                    src={categoria.src} 
                    alt={categoria.alt}
                    className="imagen-categoria-circular"
                    draggable={false} // Prevenir arrastre de imagen
                  />
                </div>
                <h3 className="nombre-categoria">{categoria.nombre}</h3>
              </div>
            ))}
          </div>
          
          {/* Indicador de scroll */}
          <div className="indicador-scroll">
            <span className="texto-indicador">Desliza para ver más →</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSeccion;