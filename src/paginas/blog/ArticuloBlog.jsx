import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, Star, ChevronDown } from 'lucide-react'
import './ArticuloBlog.css'
import SidebarBlog from './SidebarBlog'
import { clienteSupabase } from '../../configuracion/supabase'

// Página de detalle de artículo con contenido completo y tabla de contenidos
export default function ArticuloBlog() {
  const { slug } = useParams()
  const [resumenExpandido, setResumenExpandido] = useState(false)
  const [articuloData, setArticuloData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Datos ficticios para prototipo (imágenes de stock y texto vendedor)
  const articulo = {
    titulo: 'Audi A4 2025: Guía de compra definitiva',
    autor: 'Jesús González',
    autorIniciales: 'JG',
    fecha: '26 de junio de 2025',
    lecturaMin: 10,
    rating: 4.9,
    portada: 'https://picsum.photos/seed/audi-a4-'+(slug||'2025')+'/1200/700'
  }

  // Resumen del artículo (versión breve + extendida)
  const resumenBreve = 'Muchos sueñan con conducir un Audi A4 con estilo y eficiencia. Esta guía resume versiones, costos, financiación, comparativas y pasos prácticos para comprar inteligente en 2025.'
  const resumenCompleto = 'En esta guía condensamos los puntos clave para decidir con confianza: motorizaciones mild-hybrid, equipamientos y asistentes, costos totales (cuota inicial, mensualidad, seguro y mantenimiento), planes de financiación típicos en 2025, comparativa con BMW Serie 3 y Mercedes Clase C, y una ruta de compra paso a paso con recomendaciones para negociar extras y cerrar la mejor oferta. Si buscas lujo sobrio, tecnología intuitiva y eficiencia real para uso diario, el A4 2025 es una apuesta sólida con alta reventa.'

  const formatearFecha = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch {
      return iso
    }
  }

  useEffect(() => {
    let activo = true
    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const { data, error: err } = await clienteSupabase
          .from('ARTICULO')
          .select('slug,titulo,autor,autor_iniciales,fecha_publicacion,lectura_min,calificacion,portada_url,resumen_breve,resumen_completo,secciones,cta,estado_publicacion')
          .eq('slug', slug)
          .eq('estado_publicacion', 'publicado')
          .limit(1)
          .maybeSingle()
        if (err) throw err
        if (!data || data.estado_publicacion !== 'publicado') {
          if (activo) setArticuloData(null)
        } else {
          const secciones = typeof data.secciones === 'string' ? JSON.parse(data.secciones) : data.secciones
          const cta = typeof data.cta === 'string' ? JSON.parse(data.cta) : data.cta
          if (activo) setArticuloData({ ...data, secciones, cta })
        }
      } catch (e) {
        if (activo) setError(e?.message || 'Error cargando el artículo')
      } finally {
        if (activo) setCargando(false)
      }
    }
    if (slug) cargar()
    return () => { activo = false }
  }, [slug])

  const cabecera = articuloData ? {
    titulo: articuloData.titulo,
    autor: articuloData.autor,
    autorIniciales: articuloData.autor_iniciales || articulo.autorIniciales,
    fecha: formatearFecha(articuloData.fecha_publicacion),
    lecturaMin: articuloData.lectura_min ?? articulo.lecturaMin,
    rating: articuloData.calificacion ?? articulo.rating,
    portada: articuloData.portada_url || articulo.portada
  } : articulo

  const resumenBreveActual = articuloData?.resumen_breve || resumenBreve
  const resumenCompletoActual = articuloData?.resumen_completo || resumenCompleto

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

            {/* Imagen de portada (stock) */}
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

            {/* Resumen expandible debajo de la imagen */}
            <div className="resumen-destacado" aria-live="polite">
              <p className={`resumen-texto ${resumenExpandido ? 'expandido' : 'clamp'}`}>
                {resumenExpandido ? resumenCompletoActual : resumenBreveActual}
              </p>
              <button
                className={`btn-resumen ${resumenExpandido ? 'activo' : ''}`}
                onClick={() => setResumenExpandido(v => !v)}
                aria-expanded={resumenExpandido}
              >
                <span>{resumenExpandido ? 'Ocultar resumen' : 'Ver Resumen Completo'}</span>
                <ChevronDown size={16} className="icono" />
              </button>
            </div>

            {/* Contenido principal con TOC y secciones ancladas */}
            <div className="articulo-contenido">
              {articuloData ? (
                <>
                  {/* Tabla de contenidos dinámica */}
                  <nav className="tabla-contenidos" aria-label="Tabla de contenidos">
                    <p className="toc-title">Contenido</p>
                    <ul>
                      {Array.isArray(articuloData.secciones) && articuloData.secciones.map(sec => (
                        <li key={sec.id}><a href={`#${sec.id}`}>{sec.titulo}</a></li>
                      ))}
                    </ul>
                  </nav>

                  {/* Secciones dinámicas */}
                  {Array.isArray(articuloData.secciones) && articuloData.secciones.map(sec => (
                    <section id={sec.id} className="bloque" key={sec.id}>
                      <h2 className="bloque-titulo">{sec.titulo}</h2>
                      {Array.isArray(sec.parrafos) && sec.parrafos.map((p, i) => (
                        <p className="bloque-texto" key={`p-${i}`}>{p}</p>
                      ))}
                      {Array.isArray(sec.lista_items) && sec.lista_items.length > 0 ? (
                        <ul className="bloque-texto">
                          {sec.lista_items.map((item, i) => (
                            <li key={`li-${i}`}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                      {Array.isArray(sec.lista_ordenada) && sec.lista_ordenada.length > 0 ? (
                        <ol className="bloque-texto">
                          {sec.lista_ordenada.map((item, i) => (
                            <li key={`ol-${i}`}>{item}</li>
                          ))}
                        </ol>
                      ) : null}
                      {sec.imagen?.url ? (
                        <figure className="imagen-inline">
                          <img src={sec.imagen.url} alt={sec.imagen.alt || sec.titulo} loading="lazy" decoding="async" width="960" height="540" />
                          {sec.imagen.caption ? (<figcaption>{sec.imagen.caption}</figcaption>) : null}
                        </figure>
                      ) : null}
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
                  <div className="cta-articulo" aria-label="Acciones recomendadas">
                    {articuloData.cta?.items?.map((item, idx) => {
                      const estilo = item.estilo === 'outline' ? 'outline' : item.estilo === 'whatsapp' ? 'whatsapp' : ''
                      const target = item.estilo === 'whatsapp' ? '_blank' : undefined
                      const rel = item.estilo === 'whatsapp' ? 'noopener noreferrer' : undefined
                      return (
                        <a key={idx} className={`btn-cta ${estilo}`} href={item.href} target={target} rel={rel}>{item.texto}</a>
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* Tabla de contenidos navegable */}
                  <nav className="tabla-contenidos" aria-label="Tabla de contenidos">
                    <p className="toc-title">Contenido</p>
                    <ul>
                      <li><a href="#vision-general">Visión general</a></li>
                      <li><a href="#para-quien-beneficios">¿Para quién es? Beneficios</a></li>
                      <li><a href="#experiencia-conduccion">Experiencia de conducción</a></li>
                      <li><a href="#diseno-interior">Diseño e interior</a></li>
                      <li><a href="#tecnologia-seguridad">Tecnología y seguridad</a></li>
                      <li><a href="#costos-financiacion">Costos y financiación</a></li>
                      <li><a href="#comparativa-inteligente">Comparativa inteligente</a></li>
                      <li><a href="#guia-pasos">Guía de compra</a></li>
                      <li><a href="#objeciones-respuestas">Objeciones y respuestas</a></li>
                      <li><a href="#conclusion">Conclusión</a></li>
                    </ul>
                  </nav>

              {/* Visión general */}
              <section id="vision-general" className="bloque">
                <h2 className="bloque-titulo">Visión general: ¿Por qué el Audi A4 2025?</h2>
                <p className="bloque-texto">
                  El Audi A4 2025 llega con un paquete difícil de ignorar: diseño refinado, tecnología
                  premium y un manejo preciso que convierte cada trayecto en una experiencia. Si buscas un sedán
                  que proyecte confianza, comodidad y estatus sin sacrificar eficiencia, este modelo es una
                  apuesta segura para el 2025.
                </p>
                <p className="bloque-texto">
                  Este artículo te guía con criterio práctico: qué versión elegir, cómo evaluar el
                  equipamiento realmente útil y qué costos debes considerar para comprar sin sorpresas.
                  El objetivo es claro: que tomes una decisión informada y disfrutes cada kilómetro.
                </p>
                <h3 className="bloque-subtitulo">En qué destaca en 2025</h3>
                <p className="bloque-texto">
                  La actualización del año se centra en eficiencia y usabilidad: motores con apoyo mild-hybrid
                  para arranques más suaves, una calibración de chasis que reduce movimientos bruscos y una
                  interfaz MMI más clara que evita distracciones. La calidad percibida se mantiene, pero ahora
                  acompaña mejor el uso diario con menos complejidad.
                </p>
                <p className="bloque-texto">
                  En conjunto, el A4 2025 se siente coherente: todo suma a la experiencia sin abrumar.
                  No intenta ser el más llamativo; busca ser el más agradable de convivir y el más fácil de
                  recomendar a quien prioriza equilibrio y valor futuro.
                </p>
              </section>

              {/* Experiencia de conducción con imagen inline */}
              <section id="experiencia-conduccion" className="bloque">
                <h2 className="bloque-titulo">Experiencia de conducción</h2>
                <p className="bloque-texto">
                  Dirección precisa, suspensión equilibrada y una insonorización que reduce la fatiga. El A4
                  transmite seguridad y comodidad tanto en ciudad como en carretera. Su respuesta lineal permite
                  una conducción elegante y confiada, ideal para quienes buscan rendimiento sin sacrificar confort.
                </p>
                <figure className="imagen-inline">
                  <img src={`https://picsum.photos/seed/audi-a4-drive-${slug||'2025'}/960/540`} alt="Audi A4 2025 en conducción" loading="lazy" decoding="async" width="960" height="540" />
                  <figcaption>Una marcha serena y precisa para viajes largos.</figcaption>
                </figure>
                <p className="bloque-texto">
                  El tacto del volante y la progresividad del frenado inspiran confianza desde el primer
                  recorrido. Si priorizas comodidad sin perder sensación de control, el A4 está en el punto
                  ideal: menos brusco que alternativas deportivas y más firme que opciones enfocadas solo en lujo.
                </p>
                <h3 className="bloque-subtitulo">Lo que sentirás al volante</h3>
                <p className="bloque-texto">
                  La dirección comunica sin ser nerviosa, el apoyo en curvas es predecible y la pisada a
                  velocidad se mantiene estable. En ciudad filtra baches cortos y en autopista conserva serenidad
                  para viajes largos sin fatiga. Es un auto que invita a conducir relajado pero con control.
                </p>
                <h3 className="bloque-subtitulo">Ritmo y consumo</h3>
                <p className="bloque-texto">
                  El sistema mild-hybrid suaviza detenciones y ayuda a mantener consumos razonables en tráfico
                  mixto. El sonido está bien contenido: suficiente para sentir el motor sin invadir la cabina.
                  En el día a día, el equilibrio entre respuesta y confort es su mayor virtud.
                </p>
              </section>

              {/* Diseño e interior (imagen inline) */}
              <section id="diseno-interior" className="bloque">
                <h2 className="bloque-titulo">Diseño e interior</h2>
                <p className="bloque-texto">
                  Líneas sobrias por fuera y materiales agradables al tacto por dentro. El interior combina
                  ergonomía, visibilidad y un sistema MMI intuitivo que reduce distracciones. Los asientos
                  soportan bien jornadas largas y la calidad de acabado transmite durabilidad real.
                </p>
                <figure className="imagen-inline">
                  <img src={`https://picsum.photos/seed/audi-a4-cabin-${slug||'2025'}/960/540`} alt="Interior del Audi A4 2025" loading="lazy" decoding="async" width="960" height="540" />
                  <figcaption>Cabina minimalista y materiales consistentes al uso diario.</figcaption>
                </figure>
                <h3 className="bloque-subtitulo">Ergonomía y materiales</h3>
                <p className="bloque-texto">
                  Los mandos principales están donde esperas y los botones esenciales siguen presentes para
                  funciones críticas. Las superficies blandas y los ajustes precisos evitan crujidos y dan
                  sensación de producto bien ensamblado que resiste el paso del tiempo.
                </p>
                <h3 className="bloque-subtitulo">Espacio y confort</h3>
                <p className="bloque-texto">
                  Plazas delanteras amplias, traseras suficientes para dos adultos y un maletero útil para
                  semanas con equipaje. El aislamiento acústico es consistente: conversación normal sin elevar
                  la voz incluso en asfalto rugoso.
                </p>
              </section>

              {/* Tecnología y seguridad (reemplaza especificaciones) */}
              <section id="tecnologia-seguridad" className="bloque">
                <h2 className="bloque-titulo">Tecnología y seguridad</h2>
                <p className="bloque-texto">
                  El MMI de última generación es rápido y claro; integra navegación, conectividad estable y
                  asistentes que realmente ayudan: mantenimiento de carril, frenado autónomo y control de crucero
                  adaptativo. El enfoque es reducir carga cognitiva y aumentar tu sensación de control.
                </p>
                <ul className="bloque-texto">
                  <li>Asistencias: carril, frenado, crucero adaptativo y sensores 360°.</li>
                  <li>Infotenimiento: visualización nítida, comandos simples y personalización útil.</li>
                  <li>Seguridad pasiva: cabina estable y protecciones pensadas para uso real.</li>
                </ul>
                <figure className="imagen-inline">
                  <img src={`https://picsum.photos/seed/audi-a4-tech-${slug||'2025'}/960/540`} alt="Tecnología MMI del Audi A4 2025" loading="lazy" decoding="async" width="960" height="540" />
                  <figcaption>Interfaz rápida y asistentes que reducen la fatiga.</figcaption>
                </figure>
                <h3 className="bloque-subtitulo">Asistentes en uso real</h3>
                <p className="bloque-texto">
                  La calibración es poco intrusiva: corrige suavemente cuando te sales del carril y frena con
                  margen si detecta riesgo. En autopistas largas, el control adaptativo ayuda a mantener
                  ritmo sin constantes correcciones.
                </p>
                <h3 className="bloque-subtitulo">Infotenimiento y conectividad</h3>
                <p className="bloque-texto">
                  La interfaz prioriza legibilidad y accesos rápidos. La integración con smartphone es estable y
                  las opciones de personalización te permiten simplificar menús para evitar distracciones.
                </p>
              </section>

              {/* ¿Para quién es? Beneficios */}
              <section id="para-quien-beneficios" className="bloque">
                <h2 className="bloque-titulo">¿Para quién es? Beneficios clave</h2>
                <p className="bloque-texto">
                  Ideal para profesionales y familias que buscan comodidad diaria, imagen sobria y eficiencia.
                  Si valoras tecnología que no estorba y un manejo sereno, aquí encontrarás equilibrio entre
                  disfrute y sentido práctico.
                </p>
                <ul className="bloque-texto">
                  <li><strong>Comodidad diaria:</strong> diseño acústico y asientos que reducen fatiga.</li>
                  <li><strong>Imagen profesional:</strong> líneas discretas y presencia elegante.</li>
                  <li><strong>Eficiencia real:</strong> consumo sensato y mantenimiento predecible.</li>
                  <li><strong>Reventa:</strong> demanda sostenida en el segmento premium.</li>
                </ul>
                <h3 className="bloque-subtitulo">Perfiles recomendados</h3>
                <p className="bloque-texto">
                  Si conduces a diario entre ciudad y autopistas, valoras silencio a bordo y te interesa mantener
                  buen valor de reventa, el A4 encaja. También es sólido para familias pequeñas que priorizan
                  calidad y seguridad sin buscar una respuesta deportiva extrema.
                </p>
              </section>

              {/* Comparativa inteligente */}
              <section id="comparativa-inteligente" className="bloque">
                <h2 className="bloque-titulo">Comparativa inteligente</h2>
                <p className="bloque-texto">
                  Frente al BMW Serie 3 y el Mercedes-Benz Clase C, el A4 apuesta por serenidad y un tacto
                  de dirección que inspira confianza. Si quieres más deportividad, el Serie 3 te seducirá; si
                  prefieres lujo clásico, el Clase C es tu ventana. El A4 se ubica en el balance: intuitivo,
                  cómodo y consistente día a día.
                </p>
                <ul className="bloque-texto">
                  <li><strong>BMW Serie 3:</strong> más deportivo y comunicativo; exige aceptar firmeza.</li>
                  <li><strong>Mercedes Clase C:</strong> lujo tradicional y confort; menos enfoque dinámico.</li>
                  <li><strong>Audi A4:</strong> equilibrio de uso diario con tecnología clara y tacto sereno.</li>
                </ul>
              </section>

              {/* Costos y financiación */}
              <section id="costos-financiacion" className="bloque">
                <h2 className="bloque-titulo">Costos y financiación</h2>
                <p className="bloque-texto">
                  Considera el presupuesto total: cuota inicial, mensualidad, seguro, mantenimiento y
                  depreciación. En 2025, las tasas permiten mensualidades cómodas sin comprometer tu flujo de caja.
                  Para previsibilidad, evalúa planes de mantenimiento y garantías extendidas.
                </p>
                <ul className="bloque-texto">
                  <li><strong>Plan tradicional:</strong> cuota inicial + mensualidades; ideal si proyectas uso prolongado.</li>
                  <li><strong>Leasing:</strong> cuotas más bajas y opción de compra; útil si renuevas cada 2–3 años.</li>
                  <li><strong>Seguro amplio:</strong> incluye asistencia y reposición; clave para tranquilidad real.</li>
                </ul>
                <figure className="imagen-inline">
                  <img src={`https://picsum.photos/seed/audi-a4-finance-${slug||'2025'}/960/540`} alt="Opciones de financiación" loading="lazy" decoding="async" width="960" height="540" />
                  <figcaption>Elige el esquema que se adapte a tu flujo de caja.</figcaption>
                </figure>
                <h3 className="bloque-subtitulo">Presupuesto total real</h3>
                <p className="bloque-texto">
                  Además de la cuota, contempla mantenimientos programados y consumos. Un plan de servicios
                  a intervalos regulares ayuda a evitar gastos sorpresa y mantiene valor de reventa.
                </p>
                <h3 className="bloque-subtitulo">Recomendación financiera</h3>
                <p className="bloque-texto">
                  Si buscas previsibilidad, combina un plan de mantenimiento con seguro amplio y analiza leasing
                  cuando prefieres renovar auto cada pocos años. Tradicional funciona si proyectas uso prolongado.
                </p>
              </section>

              

              {/* Guía paso a paso */}
              <section id="guia-pasos" className="bloque">
                <h2 className="bloque-titulo">Guía de compra paso a paso</h2>
                <ol className="bloque-texto">
                  <li>Define uso y presupuesto: ciudad, viajes, familia y tope mensual.</li>
                  <li>Elige versión: motor, paquete de asistentes y tapicería.</li>
                  <li>Solicita cotización y compara: evita comprar sin comparar 2–3 opciones.</li>
                  <li>Agenda test drive: percibe asiento, visibilidad y respuesta en ruta.</li>
                  <li>Negocia extras: mantenimiento, garantía ampliada y accesorios útiles.</li>
                  <li>Cierra financiación y seguro: prioriza cobertura amplia y asistencia.</li>
                </ol>
                <h3 className="bloque-subtitulo">Consejos del vendedor</h3>
                <p className="bloque-texto">
                  No te quedes con la primera oferta. Pide beneficios en mantenimiento y garantías; suelen
                  marcar la diferencia a 3–5 años. En la prueba de manejo, verifica visibilidad, tacto de frenado
                  y confort del asiento: son los factores que más notarás a diario.
                </p>
              </section>

              

              

              

              

              {/* Objeciones y respuestas vendedor */}
              <section id="objeciones-respuestas" className="bloque">
                <h2 className="bloque-titulo">Objeciones y respuestas</h2>
                <ul className="bloque-texto">
                  <li><strong>“Es caro.”</strong> — Lo premium se percibe a diario: confort, seguridad y reventa. A 3–5 años, la diferencia se compensa en experiencia y valor.</li>
                  <li><strong>“La tecnología me abruma.”</strong> — El MMI es claro y configurable. Además, puedes desactivar asistencias y adaptar cada función a tu estilo.</li>
                  <li><strong>“Prefiero algo más deportivo.”</strong> — Prueba la versión con paquete dinámico; ganarás tacto y respuesta sin sacrificar el confort.</li>
                  <li><strong>“¿Y los costos?”</strong> — Con mantenimiento programado y garantías, mantienes previsibilidad. Te cotizamos planes que ajusten tu mensualidad.</li>
                </ul>
                <p className="bloque-texto">
                  La mejor respuesta siempre es una prueba de manejo enfocada: muestra la serenidad en marcha,
                  la claridad del MMI y la comodidad real en trayectos largos. Eso convierte dudas en confianza.
                </p>
              </section>

              

              {/* Conclusión */}
              <section id="conclusion" className="bloque">
                <h2 className="bloque-titulo">Conclusión</h2>
                <p className="bloque-texto">
                  Si buscas un sedán premium que combine eficiencia, tecnología y confort real, el A4 2025
                  ofrece una propuesta sólida y equilibrada. Con una marcha serena y equipamiento intuitivo,
                  es una compra inteligente para quienes valoran calidad sostenida y buena reventa.
                </p>
                <p className="bloque-texto">
                  Si encaja con tu uso y prioridades, no demores el test drive. Es la forma más rápida de confirmar
                  que este equilibrio se alinea con tu día a día y tu presupuesto.
                </p>
              </section>

              {/* CTA final */}
              <div className="cta-articulo" aria-label="Acciones recomendadas">
                <a className="btn-cta" href="/contacto">Solicitar cotización</a>
                <a className="btn-cta outline" href="/agendar">Agendar test drive</a>
                <a className="btn-cta whatsapp" href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
              </div>
              {/* Cierre del fragmento del branch estático */}
              </>
              )
            }
            </div>
          </article>

          {/* Sidebar reutilizable (sticky en desktop) */}
          <SidebarBlog />
        </div>
      </section>
    </div>
  )
}