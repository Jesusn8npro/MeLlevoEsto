import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, ChevronDown, AlertTriangle, Loader } from 'lucide-react';
import './ArticuloBlog.css';
import SidebarBlog from './SidebarBlog';
import { clienteSupabase } from '../../configuracion/supabase';

// Página de detalle de artículo con contenido completo y tabla de contenidos
export default function ArticuloBlog() {
  const { slug } = useParams();
  const [resumenExpandido, setResumenExpandido] = useState(false);
  const [articuloData, setArticuloData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const formatearFecha = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  useEffect(() => {
    let activo = true;
    async function cargar() {
      if (!slug) {
        setCargando(false);
        setError('No se ha especificado un artículo para cargar.');
        return;
      }
      
      setCargando(true);
      setError(null);
      setArticuloData(null); // Reset data on new slug

      try {
        const { data, error: err } = await clienteSupabase
          .from('articulos_web')
          .select('slug,titulo,autor,autor_iniciales,fecha_publicacion,lectura_min,calificacion,portada_url,resumen_breve,resumen_completo,secciones,cta,estado_publicacion')
          .eq('slug', slug)
          .eq('estado_publicacion', 'publicado')
          .limit(1)
          .maybeSingle();
        
        if (err) throw err;

        if (activo) {
          if (data) {
            // Asegurarse de que las secciones y CTA son objetos JSON
            const secciones = typeof data.secciones === 'string' ? JSON.parse(data.secciones) : data.secciones;
            const cta = typeof data.cta === 'string' ? JSON.parse(data.cta) : data.cta;
            setArticuloData({ ...data, secciones, cta });
          } else {
            // No se encontró el artículo o no está publicado
            setArticuloData(null);
          }
        }
      } catch (e) {
        if (activo) {
          console.error("Error al cargar el artículo:", e);
          setError(e?.message || 'Error cargando el artículo. Por favor, intente de nuevo más tarde.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }
    
    cargar();

    return () => {
      activo = false;
    };
  }, [slug]);

  // Renderizado basado en el estado de carga
  if (cargando) {
    return (
      <div className="pagina-blog-estado">
        <Loader className="animate-spin" size={48} />
        <p>Cargando artículo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pagina-blog-estado error">
        <AlertTriangle size={48} />
        <h2>Error al Cargar</h2>
        <p>{error}</p>
        <Link to="/blog" className="btn-cta">Volver al Blog</Link>
      </div>
    );
  }

  if (!articuloData) {
    return (
      <div className="pagina-blog-estado">
        <AlertTriangle size={48} />
        <h2>Artículo no encontrado</h2>
        <p>El artículo que buscas no existe o no está disponible.</p>
        <Link to="/blog" className="btn-cta">Volver al Blog</Link>
      </div>
    );
  }

  // Una vez que los datos están listos, preparamos la información para renderizar
  const cabecera = {
    titulo: articuloData.titulo,
    autor: articuloData.autor,
    autorIniciales: articuloData.autor_iniciales || '...',
    fecha: formatearFecha(articuloData.fecha_publicacion),
    lecturaMin: articuloData.lectura_min ?? 0,
    rating: articuloData.calificacion ?? 0,
    portada: articuloData.portada_url || 'https://picsum.photos/1200/700'
  };

  const resumenBreveActual = articuloData.resumen_breve;
  const resumenCompletoActual = articuloData.resumen_completo;

  return (
    <div className="pagina-blog">
      <section className="seccion-articulos articulo-contenedor">
        <div className="grid-blog">
          {/* Contenido del artículo */}
          <article className="articulo">
            {/* Cabecera del artículo */}
            <header className="articulo-header">
              <h1 className="articulo-titulo">{cabecera.titulo}</h1>
              <div className="articulo-meta">
                <div className="avatar" aria-label="Autor">{cabecera.autorIniciales}</div>
                <span>Por {cabecera.autor}</span>
                <span className="fecha">{cabecera.fecha}</span>
                <span className="dot">•</span>
                <span className="lectura" aria-label="Tiempo de lectura"><Clock size={14} /> {cabecera.lecturaMin} min</span>
                <span className="dot">•</span>
                <span className="rating" aria-label="Valoración"><Star size={14} className="icono" /> {cabecera.rating}</span>
              </div>
            </header>

            {/* Imagen de portada */}
            <div className="articulo-imagen">
              <img
                src={cabecera.portada}
                alt={cabecera.titulo}
                loading="lazy"
                decoding="async"
                width="1200"
                height="700"
              />
            </div>

            {/* Resumen expandible */}
            {(resumenBreveActual || resumenCompletoActual) && (
              <div className="resumen-destacado" aria-live="polite">
                <p className={`resumen-texto ${resumenExpandido ? 'expandido' : 'clamp'}`}>
                  {resumenExpandido && resumenCompletoActual ? resumenCompletoActual : resumenBreveActual}
                </p>
                {resumenCompletoActual && (
                  <button
                    className={`btn-resumen ${resumenExpandido ? 'activo' : ''}`}
                    onClick={() => setResumenExpandido(v => !v)}
                    aria-expanded={resumenExpandido}
                  >
                    <span>{resumenExpandido ? 'Ocultar resumen' : 'Ver Resumen Completo'}</span>
                    <ChevronDown size={16} className="icono" />
                  </button>
                )}
              </div>
            )}

            {/* Contenido principal con TOC y secciones ancladas */}
            <div className="articulo-contenido">
              {/* Tabla de contenidos dinámica */}
              {Array.isArray(articuloData.secciones) && articuloData.secciones.length > 0 && (
                <nav className="tabla-contenidos" aria-label="Tabla de contenidos">
                  <p className="toc-title">Contenido</p>
                  <ul>
                    {articuloData.secciones.map(sec => (
                      <li key={sec.id}><a href={`#${sec.id}`}>{sec.titulo}</a></li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Secciones dinámicas */}
              {Array.isArray(articuloData.secciones) && articuloData.secciones.map(sec => (
                <section id={sec.id} className="bloque" key={sec.id}>
                  <h2 className="bloque-titulo">{sec.titulo}</h2>
                  {Array.isArray(sec.parrafos) && sec.parrafos.map((p, i) => (
                    <p className="bloque-texto" key={`p-${i}`}>{p}</p>
                  ))}
                  {Array.isArray(sec.lista_items) && sec.lista_items.length > 0 && (
                    <ul className="bloque-texto">
                      {sec.lista_items.map((item, i) => (
                        <li key={`li-${i}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {Array.isArray(sec.lista_ordenada) && sec.lista_ordenada.length > 0 && (
                    <ol className="bloque-texto">
                      {sec.lista_ordenada.map((item, i) => (
                        <li key={`ol-${i}`}>{item}</li>
                      ))}
                    </ol>
                  )}
                  {sec.imagen?.url && (
                    <figure className="imagen-inline">
                      <img src={sec.imagen.url} alt={sec.imagen.alt || sec.titulo} loading="lazy" decoding="async" width="960" height="540" />
                      {sec.imagen.caption && <figcaption>{sec.imagen.caption}</figcaption>}
                    </figure>
                  )}
                  {Array.isArray(sec.subsecciones) && sec.subsecciones.map((sub, j) => (
                    <React.Fragment key={`sub-${j}`}>
                      <h3 className="bloque-subtitulo">{sub.titulo}</h3>
                      {Array.isArray(sub.parrafos) && sub.parrafos.map((sp, k) => (
                        <p className="bloque-texto" key={`sp-${j}-${k}`}>{sp}</p>
                      ))}
                    </React.Fragment>
                  ))}
                </section>
              ))}

              {/* CTA dinámica */}
              {Array.isArray(articuloData.cta?.items) && articuloData.cta.items.length > 0 && (
                <div className="cta-articulo" aria-label="Acciones recomendadas">
                  {articuloData.cta.items.map((item, idx) => {
                    const estilo = item.estilo === 'outline' ? 'outline' : item.estilo === 'whatsapp' ? 'whatsapp' : '';
                    const target = item.estilo === 'whatsapp' ? '_blank' : undefined;
                    const rel = item.estilo === 'whatsapp' ? 'noopener noreferrer' : undefined;
                    return (
                      <a key={idx} className={`btn-cta ${estilo}`} href={item.href} target={target} rel={rel}>{item.texto}</a>
                    );
                  })}
                </div>
              )}
            </div>
          </article>

          {/* Sidebar reutilizable (sticky en desktop) */}
          <SidebarBlog />
        </div>
      </section>
    </div>
  );
}