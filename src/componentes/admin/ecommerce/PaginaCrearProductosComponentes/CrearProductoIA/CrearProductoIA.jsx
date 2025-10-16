import React, { useState } from 'react'
import { 
  X, 
  Sparkles, 
  Send, 
  Loader2, 
  Package, 
  DollarSign, 
  FileText, 
  Settings, 
  Image, 
  CheckCircle,
  Edit3,
  RotateCcw,
  Upload,
  Trash2,
  Plus,
  Video,
  Camera
} from 'lucide-react'
import { clienteSupabase } from '../../../../../configuracion/supabase'
import './CrearProductoIA.css'

const CrearProductoIA = ({ 
  mostrar, 
  onCerrar, 
  onProductoCreado,
  categorias = [],
  modo = 'modal' 
}) => {
  const [paso, setPaso] = useState(1) // 1: Formulario, 2: Cargando, 3: Vista previa, 4: Edición
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [productoGenerado, setProductoGenerado] = useState(null)
  const [productoEditado, setProductoEditado] = useState(null)
  const [conversacionId, setConversacionId] = useState(null)

  // Estado del formulario simple
  const [formularioIA, setFormularioIA] = useState({
    nombre: '',
    precio: '',
    categoria_id: '',
    de_que_trata: '',
    como_funciona: '',
    caracteristicas: '',
    imagenes: ''
  })

  const manejarCambio = (campo, valor) => {
    setFormularioIA(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const validarFormulario = () => {
    const errores = []
    // SOLO validar campos esenciales - el resto es opcional
    if (!formularioIA.nombre.trim()) errores.push('El nombre del producto es obligatorio')
    if (!formularioIA.precio || formularioIA.precio <= 0) errores.push('El precio debe ser mayor a 0')
    
    // Los demás campos son opcionales - el agente puede trabajar solo con el nombre
    return errores
  }

  const enviarAIA = async () => {
    try {
      setCargando(true)
      setError('')
      setPaso(2)

      const errores = validarFormulario()
      if (errores.length > 0) {
        setError(errores.join(', '))
        setPaso(1)
        return
      }

      // Generar ID único para la conversación (solo si no existe)
      let idConversacion = conversacionId
      if (!idConversacion) {
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 15)
        idConversacion = `producto_${timestamp}_${randomId}`
        setConversacionId(idConversacion)
      }

      // DATOS SIMPLIFICADOS - Solo lo que necesita el agente según el prompt
      const datosParaIA = {
        session_id: idConversacion,
        nombre_producto: formularioIA.nombre,
        precio: parseFloat(formularioIA.precio),
        categoria_id: formularioIA.categoria_id || null,
        de_que_trata: formularioIA.de_que_trata,
        como_funciona: formularioIA.como_funciona,
        caracteristicas_principales: formularioIA.caracteristicas
      }

      console.log('📤 Enviando datos a IA:', datosParaIA)
      console.log('📤 URL del webhook:', 'https://velostrategix-n8n.lnrubg.easypanel.host/webhook/crear_productos')
      console.log('📤 Datos JSON stringificados:', JSON.stringify(datosParaIA, null, 2))

      // Enviar al webhook de N8N
      const respuesta = await fetch('https://velostrategix-n8n.lnrubg.easypanel.host/webhook/crear_productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(datosParaIA)
      })

      console.log('📥 Status de respuesta:', respuesta.status)
      console.log('📥 Headers de respuesta:', Object.fromEntries(respuesta.headers.entries()))

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`)
      }

      let resultado = await respuesta.json()
      console.log('📥 RESPUESTA COMPLETA DEL WEBHOOK:', resultado)
      console.log('📥 Tipo de respuesta:', typeof resultado)
      
      // Verificar si hay error en la respuesta
      if (resultado.error) {
        throw new Error(resultado.mensaje || resultado.descripcion || 'Error en la respuesta del agente')
      }

      // PROCESAMIENTO ROBUSTO DE LA RESPUESTA DE N8N
      let datosProducto = resultado
      
      console.log('🔍 ANALIZANDO RESPUESTA COMPLETA:')
      console.log('🔍 Tipo:', typeof resultado)
      console.log('🔍 Es Array:', Array.isArray(resultado))
      console.log('🔍 Keys disponibles:', resultado ? Object.keys(resultado) : 'No hay keys')
      
      // Caso 1: Array con datos
      if (Array.isArray(resultado) && resultado.length > 0) {
        datosProducto = resultado[0]
        console.log('📦 Usando primer elemento del array:', datosProducto)
      }
      
      // Caso 2: Objeto con campo 'output' (común en N8N)
      else if (resultado && resultado.output) {
        datosProducto = resultado.output
        console.log('📦 Usando campo output:', datosProducto)
      }
      
      // Caso 3: Objeto con campo 'data' (común en N8N)
      else if (resultado && resultado.data) {
        datosProducto = resultado.data
        console.log('📦 Usando campo data:', datosProducto)
      }
      
      // Caso 4: Objeto con campo 'json' (común en N8N)
      else if (resultado && resultado.json) {
        datosProducto = resultado.json
        console.log('📦 Usando campo json:', datosProducto)
      }
      
      // Caso 5: String JSON que necesita parsing
      if (typeof datosProducto === 'string') {
        try {
          datosProducto = JSON.parse(datosProducto)
          console.log('📦 JSON parseado desde string:', datosProducto)
        } catch (e) {
          console.error('❌ Error parseando JSON string:', e)
          // Intentar extraer JSON del string
          const jsonMatch = datosProducto.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              datosProducto = JSON.parse(jsonMatch[0])
              console.log('📦 JSON extraído de string complejo:', datosProducto)
            } catch (e2) {
              throw new Error('No se pudo parsear la respuesta JSON del agente')
            }
          } else {
            throw new Error('Respuesta del agente no contiene JSON válido')
          }
        }
      }
      
      // Verificar que tenemos un objeto válido
      if (!datosProducto || typeof datosProducto !== 'object') {
        console.error('❌ datosProducto no es un objeto válido:', datosProducto)
        throw new Error('La respuesta del agente no tiene el formato esperado')
      }

      console.log('📦 DATOS FINALES A PROCESAR:', datosProducto)
      console.log('📦 Campos disponibles:', Object.keys(datosProducto))

      // FUNCIÓN HELPER PARA EXTRAER ARRAYS
      const extraerArray = (campo) => {
        const valor = datosProducto[campo]
        if (Array.isArray(valor)) {
          console.log(`✅ ${campo} es array:`, valor)
          return valor
        }
        if (typeof valor === 'string' && valor.trim()) {
          // Intentar parsear como JSON array
          try {
            const parsed = JSON.parse(valor)
            if (Array.isArray(parsed)) {
              console.log(`✅ ${campo} parseado como array:`, parsed)
              return parsed
            }
          } catch (e) {
            // Si no es JSON, dividir por comas o saltos de línea
            const dividido = valor.split(/[,\n\r]/).map(item => item.trim()).filter(item => item)
            console.log(`✅ ${campo} dividido por comas:`, dividido)
            return dividido
          }
        }
        console.log(`⚠️ ${campo} no es array válido:`, valor)
        return []
      }

      // FUNCIÓN HELPER PARA EXTRAER TEXTO
      const extraerTexto = (campo) => {
        const valor = datosProducto[campo]
        if (typeof valor === 'string' && valor.trim()) {
          console.log(`✅ ${campo} extraído:`, valor.substring(0, 100) + '...')
          return valor.trim()
        }
        console.log(`⚠️ ${campo} no es texto válido:`, valor)
        return ''
      }

      // MAPEO ROBUSTO CON LOGS DETALLADOS
      const productoFinal = {
        nombre: extraerTexto('nombre') || formularioIA.nombre,
        precio: datosProducto.precio || parseFloat(formularioIA.precio),
        categoria_id: formularioIA.categoria_id,
        descripcion: extraerTexto('descripcion'),
        slug: extraerTexto('slug') || formularioIA.nombre.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        ganchos: extraerArray('ganchos'),
        beneficios: extraerArray('beneficios'),
        ventajas: extraerArray('ventajas'),
        palabras_clave: extraerArray('palabras_clave'),
        meta_title: extraerTexto('meta_title') || `${formularioIA.nombre} - ME LLEVO ESTO`,
        meta_description: extraerTexto('meta_description'),
        fotos_principales: extraerArray('fotos_principales'),
        fotos_secundarias: extraerArray('fotos_secundarias'),
        videos: extraerArray('videos'),
        stock: datosProducto.stock || 10,
        stock_minimo: datosProducto.stock_minimo || 5,
        destacado: datosProducto.destacado || false,
        activo: datosProducto.activo !== undefined ? datosProducto.activo : true
      }

      console.log('🎯 PRODUCTO FINAL PROCESADO:', productoFinal)
      console.log('📝 Descripción:', productoFinal.descripcion ? 'SÍ (' + productoFinal.descripcion.length + ' chars)' : 'NO')
      console.log('📝 Ganchos:', productoFinal.ganchos.length, 'elementos')
      console.log('📝 Beneficios:', productoFinal.beneficios.length, 'elementos')
      console.log('📝 Ventajas:', productoFinal.ventajas.length, 'elementos')

      // Verificar si tenemos datos mínimos
      if (!productoFinal.descripcion || productoFinal.descripcion.length < 10) {
        console.log('⚠️ Respuesta vacía, usando datos de prueba para debug')
        
        // Datos de prueba para debug
        const datosPrueba = {
          nombre: formularioIA.nombre,
          precio: parseFloat(formularioIA.precio),
          categoria_id: formularioIA.categoria_id,
          descripcion: `¡Descubre el increíble ${formularioIA.nombre}! 🚀 Este producto revolucionario te ofrece la mejor experiencia al precio más competitivo del mercado. Con tecnología de última generación y calidad premium garantizada. ¡No te quedes sin el tuyo! Stock limitado. 💎`,
          slug: formularioIA.nombre.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
          ganchos: [
            '🚀 ENVÍO GRATIS en 24h',
            '💎 Calidad PREMIUM garantizada',
            '⭐ Miles de clientes satisfechos',
            '🔥 OFERTA LIMITADA - Solo hoy',
            '✅ Garantía total o te devolvemos tu dinero'
          ],
          beneficios: [
            'Ahorra tiempo y dinero con esta solución innovadora',
            'Obtén resultados profesionales desde el primer uso',
            'Disfruta de la comodidad que necesitas',
            'Mejora tu calidad de vida inmediatamente'
          ],
          ventajas: [
            'Mejor precio del mercado actual',
            'Tecnología de última generación',
            'Soporte técnico incluido'
          ],
          palabras_clave: ['producto-premium', 'calidad-garantizada', 'mejor-precio', 'innovador'],
          meta_title: `${formularioIA.nombre} - Mejor Precio | ME LLEVO ESTO`,
          meta_description: `Descubre el ${formularioIA.nombre} con envío gratis. Calidad premium al mejor precio. ¡Oferta limitada!`,
          fotos_principales: formularioIA.imagenes ? formularioIA.imagenes.split(',').map(img => img.trim()).filter(img => img) : [],
          fotos_secundarias: [],
          videos: [],
          stock: 10,
          stock_minimo: 5,
          destacado: false,
          activo: true
        }
        
        setProductoGenerado(datosPrueba)
        console.log('🧪 Usando datos de prueba:', datosPrueba)
      } else {
        console.log('🎯 Producto final generado:', productoFinal)
        setProductoGenerado(productoFinal)
      }

      setPaso(3)

    } catch (error) {
      console.error('❌ Error enviando a IA:', error)
      setError(`Error al generar producto: ${error.message}`)
      setPaso(1)
    } finally {
      setCargando(false)
    }
  }

  const aprobarProducto = () => {
    if (productoGenerado && onProductoCreado) {
      onProductoCreado(productoGenerado)
    }
    cerrarModal()
  }

  const editarProducto = () => {
    setProductoEditado({
      ...productoGenerado,
      fotos_principales: productoGenerado.fotos_principales || [],
      fotos_secundarias: productoGenerado.fotos_secundarias || [],
      videos: productoGenerado.videos || []
    })
    setPaso(4) // Ir al paso de edición
  }

  const regenerarProducto = () => {
    enviarAIA()
  }

  // Funciones para manejar la edición
  const manejarCambioEdicion = (campo, valor) => {
    setProductoEditado(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const manejarCambioArray = (campo, index, valor) => {
    setProductoEditado(prev => ({
      ...prev,
      [campo]: prev[campo].map((item, i) => i === index ? valor : item)
    }))
  }

  const agregarElementoArray = (campo) => {
    setProductoEditado(prev => ({
      ...prev,
      [campo]: [...prev[campo], '']
    }))
  }

  const eliminarElementoArray = (campo, index) => {
    setProductoEditado(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }))
  }

  const guardarEdicion = () => {
    setProductoGenerado({...productoEditado})
    setPaso(3) // Volver a vista previa
  }

  // Funciones para manejar imágenes
  const subirImagen = async (archivo) => {
    try {
      const nombreArchivo = `productos/${Date.now()}-${archivo.name}`
      
      const { data, error } = await clienteSupabase.storage
        .from('imagenes')
        .upload(nombreArchivo, archivo)
      
      if (error) throw error
      
      // Obtener URL pública
      const { data: urlData } = clienteSupabase.storage
        .from('imagenes')
        .getPublicUrl(nombreArchivo)
      
      return urlData.publicUrl
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      throw error
    }
  }

  const manejarSubidaImagen = async (evento, campo, index = null) => {
    const archivo = evento.target.files[0]
    if (!archivo) return
    
    try {
      const url = await subirImagen(archivo)
      
      if (index !== null) {
        // Reemplazar imagen específica en array
        manejarCambioArray(campo, index, url)
      } else {
        // Agregar nueva imagen al array
        setProductoEditado(prev => ({
          ...prev,
          [campo]: [...prev[campo], url]
        }))
      }
    } catch (error) {
      setError('Error subiendo imagen: ' + error.message)
    }
  }

  const eliminarImagen = (campo, index) => {
    setProductoEditado(prev => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }))
  }

  const probarConDatosFalsos = () => {
    console.log('🧪 Probando con datos falsos para debug')
    
    const datosPrueba = {
      nombre: formularioIA.nombre,
      precio: parseFloat(formularioIA.precio),
      categoria_id: formularioIA.categoria_id,
      descripcion: `¡Descubre el increíble ${formularioIA.nombre}! 🚀 Este producto revolucionario te ofrece la mejor experiencia al precio más competitivo del mercado. Con tecnología de última generación y calidad premium garantizada. ¡No te quedes sin el tuyo! Stock limitado. 💎`,
      slug: formularioIA.nombre.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      ganchos: [
        '🚀 ENVÍO GRATIS en 24h - ¡Recíbelo mañana mismo!',
        '💎 Calidad PREMIUM al precio más bajo del mercado',
        '⭐ +15,000 clientes satisfechos no pueden estar equivocados',
        '🔥 OFERTA FLASH - Solo las primeras 100 unidades',
        '✅ Garantía TOTAL de 2 años o te devolvemos hasta el último peso'
      ],
      beneficios: [
        'Ahorra tiempo y dinero con esta solución innovadora',
        'Obtén resultados profesionales desde el primer uso',
        'Disfruta de la comodidad que necesitas día a día',
        'Mejora tu calidad de vida de forma inmediata',
        'Accede a tecnología de última generación',
        'Invierte en tu bienestar y satisfacción personal'
      ],
      ventajas: [
        'Mejor relación calidad-precio del mercado actual',
        'Diseño exclusivo que no encontrarás en otro lugar',
        'Tecnología avanzada con materiales de primera calidad',
        'Soporte técnico especializado incluido sin costo extra'
      ],
      palabras_clave: ['producto-premium', 'calidad-garantizada', 'mejor-precio', 'innovador', 'tecnologia-avanzada'],
      meta_title: `${formularioIA.nombre} - Mejor Precio | ME LLEVO ESTO`,
      meta_description: `Descubre el ${formularioIA.nombre} con envío gratis. Calidad premium al mejor precio. ¡Oferta limitada!`,
      fotos_principales: formularioIA.imagenes ? formularioIA.imagenes.split(',').map(img => img.trim()).filter(img => img) : [],
      stock: 10,
      stock_minimo: 5,
      destacado: false,
      activo: true
    }
    
    setProductoGenerado(datosPrueba)
    setPaso(3)
    console.log('🧪 Datos de prueba aplicados:', datosPrueba)
  }

  const cerrarModal = () => {
    setPaso(1)
    setFormularioIA({
      nombre: '',
      precio: '',
      categoria_id: '',
      de_que_trata: '',
      como_funciona: '',
      caracteristicas: '',
      imagenes: ''
    })
    setProductoGenerado(null)
    setProductoEditado(null)
    setConversacionId(null) // Limpiar ID de conversación
    setError('')
    onCerrar()
  }

  // En modo modal, respetar prop "mostrar"; en modo embed, siempre mostrar dentro del contenedor
  if (modo !== 'embed' && !mostrar) return null

  // Renderizado: si es embed, no usamos overlay, solo un contenedor a pantalla completa dentro de la tarjeta
  if (modo === 'embed') {
    return (
      <div className="embed-container-ia">
        {/* Header */}
        <div className="modal-header-ia">
          <div className="header-titulo-ia">
            <Sparkles className="icono-sparkles" />
            <h2>Crear Producto con IA</h2>
          </div>
          <button 
            className="boton-cerrar-ia"
            onClick={cerrarModal}
            disabled={cargando}
          >
            <X className="icono" />
          </button>
        </div>

        {/* Indicador de Pasos */}
        <div className="pasos-indicador">
          <div className={`paso-item ${paso >= 1 ? 'activo' : ''}`}>
            <div className="paso-numero">1</div>
            <span>Información</span>
          </div>
          <div className={`paso-linea ${paso >= 2 ? 'activo' : ''}`}></div>
          <div className={`paso-item ${paso >= 2 ? 'activo' : ''}`}>
            <div className="paso-numero">2</div>
            <span>Generando</span>
          </div>
          <div className={`paso-linea ${paso >= 3 ? 'activo' : ''}`}></div>
          <div className={`paso-item ${paso >= 3 ? 'activo' : ''}`}>
            <div className="paso-numero">3</div>
            <span>Vista Previa</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="modal-contenido-ia">
          {/* PASO 1: Formulario Simple */}
          {paso === 1 && (
            <div className="formulario-ia">
              <div className="intro-ia">
                <p>Completa esta información básica y nuestra IA creará una descripción súper persuasiva para tu producto.</p>
                <div className="info-minima-ia">
                  💡 <strong>¡Solo necesitas el nombre y precio!</strong> La IA puede generar contenido completo y persuasivo incluso con información mínima.
                </div>
              </div>

              {error && (
                <div className="mensaje-error-ia">
                  {error}
                </div>
              )}

              <div className="campos-ia">
                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Package className="icono-campo" />
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    className="campo-input-ia"
                    placeholder="Ej: iPhone 15 Pro Max 256GB"
                    value={formularioIA.nombre}
                    onChange={(e) => manejarCambio('nombre', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <DollarSign className="icono-campo" />
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="campo-input-ia"
                    placeholder="0.00"
                    value={formularioIA.precio}
                    onChange={(e) => manejarCambio('precio', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Settings className="icono-campo" />
                    Categoría
                  </label>
                  <select
                    className="campo-select-ia"
                    value={formularioIA.categoria_id}
                    onChange={(e) => manejarCambio('categoria_id', e.target.value)}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <FileText className="icono-campo" />
                    ¿De qué trata el producto? <span className="opcional">(Opcional)</span>
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="3"
                    placeholder="Ej: Consola de grabación profesional... (La IA puede generar contenido solo con el nombre)"
                    value={formularioIA.de_que_trata}
                    onChange={(e) => manejarCambio('de_que_trata', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Settings className="icono-campo" />
                    ¿Cómo funciona? <span className="opcional">(Opcional)</span>
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="3"
                    placeholder="Ej: Se conecta por USB y graba audio... (La IA puede completar esta información)"
                    value={formularioIA.como_funciona}
                    onChange={(e) => manejarCambio('como_funciona', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <FileText className="icono-campo" />
                    Características Principales <span className="opcional">(Opcional)</span>
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="4"
                    placeholder="Ej: Alta calidad, portátil, fácil de usar... (La IA puede investigar y completar)"
                    value={formularioIA.caracteristicas}
                    onChange={(e) => manejarCambio('caracteristicas', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Image className="icono-campo" />
                    Imágenes (URLs separadas por comas)
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="2"
                    placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                    value={formularioIA.imagenes}
                    onChange={(e) => manejarCambio('imagenes', e.target.value)}
                  />
                </div>
              </div>

              <div className="acciones-ia">
                <button 
                  className="boton-cancelar-ia"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button 
                  className="boton-prueba-ia"
                  onClick={probarConDatosFalsos}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🧪 Prueba (Debug)
                </button>
                <button 
                  className="boton-generar-ia"
                  onClick={enviarAIA}
                  disabled={cargando}
                >
                  <Sparkles className="icono" />
                  Generar con IA
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Cargando */}
          {paso === 2 && (
            <div className="cargando-ia">
              <div className="cargando-contenido">
                <Loader2 className="icono-cargando" />
                <h3>Generando tu producto...</h3>
                <p>Nuestra IA está creando una descripción súper persuasiva para tu producto. Esto tomará unos segundos.</p>
                {conversacionId && (
                  <div className="id-conversacion">
                    <small>ID de conversación: {conversacionId}</small>
                  </div>
                )}
                <div className="cargando-pasos">
                  <div className="cargando-paso">✨ Analizando información...</div>
                  <div className="cargando-paso">🎯 Creando ganchos de venta...</div>
                  <div className="cargando-paso">💎 Generando beneficios...</div>
                  <div className="cargando-paso">🚀 Optimizando para ventas...</div>
                </div>
                {/* BOTÓN DE DEBUG TEMPORAL */}
                <div style={{marginTop: '20px'}}>
                  <button 
                    className="boton-debug-ia"
                    onClick={probarConDatosFalsos}
                    style={{
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🧪 Prueba (Debug)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Vista Previa */}
          {paso === 3 && productoGenerado && (
            <div className="vista-previa-ia">
              <div className="vista-previa-header">
                <h3>Vista Previa del Producto</h3>
                <p>Revisa cómo quedó tu producto generado por IA</p>
              </div>

              <div className="vista-previa-contenido">
                <div className="producto-info">
                  <h4 className="producto-nombre">{productoGenerado.nombre}</h4>
                  <div className="producto-precio">${productoGenerado.precio.toFixed(2)}</div>
                </div>

                <div className="producto-descripcion">
                  <h5>Descripción:</h5>
                  <p>{productoGenerado.descripcion}</p>
                </div>

                {productoGenerado.ganchos && productoGenerado.ganchos.length > 0 && (
                  <div className="producto-ganchos">
                    <h5>Ganchos de Venta:</h5>
                    <ul>
                      {productoGenerado.ganchos.map((gancho, index) => (
                        <li key={index}>{gancho}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {productoGenerado.beneficios && productoGenerado.beneficios.length > 0 && (
                  <div className="producto-beneficios">
                    <h5>Beneficios:</h5>
                    <ul>
                      {productoGenerado.beneficios.map((beneficio, index) => (
                        <li key={index}>{beneficio}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {productoGenerado.ventajas && productoGenerado.ventajas.length > 0 && (
                  <div className="producto-ventajas">
                    <h5>Ventajas Competitivas:</h5>
                    <ul>
                      {productoGenerado.ventajas.map((ventaja, index) => (
                        <li key={index}>{ventaja}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {productoGenerado.palabras_clave && productoGenerado.palabras_clave.length > 0 && (
                  <div className="producto-palabras-clave">
                    <h5>Palabras Clave:</h5>
                    <div className="palabras-clave-tags">
                      {productoGenerado.palabras_clave.map((palabra, index) => (
                        <span key={index} className="palabra-clave-tag">{palabra}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="producto-seo">
                  <h5>SEO:</h5>
                  <p><strong>Slug:</strong> {productoGenerado.slug}</p>
                  <p><strong>Meta Title:</strong> {productoGenerado.meta_title}</p>
                  <p><strong>Meta Description:</strong> {productoGenerado.meta_description}</p>
                </div>

                <div className="producto-configuracion">
                  <h5>Configuración:</h5>
                  <p><strong>Stock:</strong> {productoGenerado.stock} unidades</p>
                  <p><strong>Stock Mínimo:</strong> {productoGenerado.stock_minimo} unidades</p>
                  <p><strong>Destacado:</strong> {productoGenerado.destacado ? 'Sí' : 'No'}</p>
                  <p><strong>Activo:</strong> {productoGenerado.activo ? 'Sí' : 'No'}</p>
                </div>

                {/* Fotos Principales */}
                {productoGenerado.fotos_principales && productoGenerado.fotos_principales.length > 0 && (
                  <div className="producto-imagenes">
                    <h5>
                      <Camera className="icono-seccion" />
                      Fotos Principales ({productoGenerado.fotos_principales.length})
                    </h5>
                    <div className="imagenes-preview-grid">
                      {productoGenerado.fotos_principales.map((foto, index) => (
                        <div key={index} className="imagen-preview-item">
                          <img 
                            src={foto} 
                            alt={`Foto principal ${index + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="imagen-error" style={{display: 'none'}}>
                            <span>❌ Imagen no disponible</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fotos Secundarias */}
                {productoGenerado.fotos_secundarias && productoGenerado.fotos_secundarias.length > 0 && (
                  <div className="producto-imagenes">
                    <h5>
                      <Image className="icono-seccion" />
                      Fotos Secundarias ({productoGenerado.fotos_secundarias.length})
                    </h5>
                    <div className="imagenes-preview-grid">
                      {productoGenerado.fotos_secundarias.map((foto, index) => (
                        <div key={index} className="imagen-preview-item">
                          <img 
                            src={foto} 
                            alt={`Foto secundaria ${index + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="imagen-error" style={{display: 'none'}}>
                            <span>❌ Imagen no disponible</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {productoGenerado.videos && productoGenerado.videos.length > 0 && (
                  <div className="producto-videos">
                    <h5>
                      <Video className="icono-seccion" />
                      Videos del Producto ({productoGenerado.videos.length})
                    </h5>
                    <div className="videos-preview-grid">
                      {productoGenerado.videos.map((video, index) => (
                        <div key={index} className="video-preview-item">
                          <video 
                            controls
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          >
                            <source src={video} type="video/mp4" />
                            Tu navegador no soporta videos.
                          </video>
                          <div className="video-error" style={{display: 'none'}}>
                            <span>❌ Video no disponible</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="acciones-vista-previa">
                <button 
                  className="boton-editar-ia"
                  onClick={editarProducto}
                >
                  <Edit3 className="icono" />
                  Editar
                </button>
                <button 
                  className="boton-regenerar-ia"
                  onClick={regenerarProducto}
                >
                  <RotateCcw className="icono" />
                  Regenerar
                </button>
                <button 
                  className="boton-aprobar-ia"
                  onClick={aprobarProducto}
                >
                  <CheckCircle className="icono" />
                  Aprobar y Crear
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: Edición */}
          {paso === 4 && productoEditado && (
            <div className="edicion-ia">
              <div className="edicion-header">
                <h3>Editar Producto</h3>
                <p>Modifica los campos que necesites ajustar</p>
              </div>

              <div className="edicion-contenido">
                {/* Información Básica */}
                <div className="edicion-seccion">
                  <h4>Información Básica</h4>
                  
                  <div className="campo-grupo-edicion">
                    <label>Nombre del Producto:</label>
                    <input
                      type="text"
                      value={productoEditado.nombre}
                      onChange={(e) => manejarCambioEdicion('nombre', e.target.value)}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Precio:</label>
                    <input
                      type="number"
                      value={productoEditado.precio}
                      onChange={(e) => manejarCambioEdicion('precio', parseFloat(e.target.value))}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Slug:</label>
                    <input
                      type="text"
                      value={productoEditado.slug}
                      onChange={(e) => manejarCambioEdicion('slug', e.target.value)}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Descripción:</label>
                    <textarea
                      value={productoEditado.descripcion}
                      onChange={(e) => manejarCambioEdicion('descripcion', e.target.value)}
                      className="campo-textarea-edicion"
                      rows="6"
                    />
                  </div>
                </div>

                {/* Ganchos de Venta */}
                <div className="edicion-seccion">
                  <h4>Ganchos de Venta</h4>
                  {productoEditado.ganchos.map((gancho, index) => (
                    <div key={index} className="campo-array-edicion">
                      <input
                        type="text"
                        value={gancho}
                        onChange={(e) => manejarCambioArray('ganchos', index, e.target.value)}
                        className="campo-input-edicion"
                      />
                      <button 
                        onClick={() => eliminarElementoArray('ganchos', index)}
                        className="boton-eliminar-array"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => agregarElementoArray('ganchos')}
                    className="boton-agregar-array"
                  >
                    + Agregar Gancho
                  </button>
                </div>

                {/* Beneficios */}
                <div className="edicion-seccion">
                  <h4>Beneficios</h4>
                  {productoEditado.beneficios.map((beneficio, index) => (
                    <div key={index} className="campo-array-edicion">
                      <input
                        type="text"
                        value={beneficio}
                        onChange={(e) => manejarCambioArray('beneficios', index, e.target.value)}
                        className="campo-input-edicion"
                      />
                      <button 
                        onClick={() => eliminarElementoArray('beneficios', index)}
                        className="boton-eliminar-array"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => agregarElementoArray('beneficios')}
                    className="boton-agregar-array"
                  >
                    + Agregar Beneficio
                  </button>
                </div>

                {/* Ventajas */}
                <div className="edicion-seccion">
                  <h4>Ventajas Competitivas</h4>
                  {productoEditado.ventajas.map((ventaja, index) => (
                    <div key={index} className="campo-array-edicion">
                      <input
                        type="text"
                        value={ventaja}
                        onChange={(e) => manejarCambioArray('ventajas', index, e.target.value)}
                        className="campo-input-edicion"
                      />
                      <button 
                        onClick={() => eliminarElementoArray('ventajas', index)}
                        className="boton-eliminar-array"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => agregarElementoArray('ventajas')}
                    className="boton-agregar-array"
                  >
                    + Agregar Ventaja
                  </button>
                </div>

                {/* SEO */}
                <div className="edicion-seccion">
                  <h4>SEO</h4>
                  
                  <div className="campo-grupo-edicion">
                    <label>Meta Title:</label>
                    <input
                      type="text"
                      value={productoEditado.meta_title}
                      onChange={(e) => manejarCambioEdicion('meta_title', e.target.value)}
                      className="campo-input-edicion"
                    />
                  </div>
                  
                  <div className="campo-grupo-edicion">
                    <label>Meta Description:</label>
                    <textarea
                      value={productoEditado.meta_description}
                      onChange={(e) => manejarCambioEdicion('meta_description', e.target.value)}
                      className="campo-textarea-edicion"
                      rows="3"
                    />
                  </div>
                  
                  <div className="campo-grupo-edicion">
                    <label>Palabras Clave:</label>
                    {productoEditado.palabras_clave.map((palabra, index) => (
                      <div key={index} className="campo-array-edicion">
                        <input
                          type="text"
                          value={palabra}
                          onChange={(e) => manejarCambioArray('palabras_clave', index, e.target.value)}
                          className="campo-input-edicion"
                        />
                        <button 
                          onClick={() => eliminarElementoArray('palabras_clave', index)}
                          className="boton-eliminar-array"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => agregarElementoArray('palabras_clave')}
                      className="boton-agregar-array"
                    >
                      + Agregar Palabra Clave
                    </button>
                  </div>
                </div>

                {/* Imágenes Principales */}
                <div className="edicion-seccion">
                  <h4>
                    <Camera className="icono-seccion" />
                    Fotos Principales
                  </h4>
                  
                  <div className="imagenes-grid">
                    {productoEditado.fotos_principales.map((foto, index) => (
                      <div key={index} className="imagen-item">
                        <div className="imagen-preview">
                          <img src={foto} alt={`Foto ${index + 1}`} />
                          <button 
                            className="boton-eliminar-imagen"
                            onClick={() => eliminarImagen('fotos_principales', index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="imagen-url">
                          <input
                            type="url"
                            value={foto}
                            onChange={(e) => manejarCambioArray('fotos_principales', index, e.target.value)}
                            placeholder="URL de la imagen"
                            className="campo-input-edicion"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => manejarSubidaImagen(e, 'fotos_principales', index)}
                            className="campo-file-edicion"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="agregar-imagen">
                    <button 
                      onClick={() => agregarElementoArray('fotos_principales')}
                      className="boton-agregar-imagen"
                    >
                      <Plus size={16} />
                      Agregar URL
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => manejarSubidaImagen(e, 'fotos_principales')}
                      className="campo-file-edicion"
                    />
                  </div>
                </div>

                {/* Fotos Secundarias */}
                <div className="edicion-seccion">
                  <h4>
                    <Image className="icono-seccion" />
                    Fotos Secundarias
                  </h4>
                  
                  <div className="imagenes-grid">
                    {productoEditado.fotos_secundarias.map((foto, index) => (
                      <div key={index} className="imagen-item">
                        <div className="imagen-preview">
                          <img src={foto} alt={`Foto secundaria ${index + 1}`} />
                          <button 
                            className="boton-eliminar-imagen"
                            onClick={() => eliminarImagen('fotos_secundarias', index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="imagen-url">
                          <input
                            type="url"
                            value={foto}
                            onChange={(e) => manejarCambioArray('fotos_secundarias', index, e.target.value)}
                            placeholder="URL de la imagen"
                            className="campo-input-edicion"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => manejarSubidaImagen(e, 'fotos_secundarias', index)}
                            className="campo-file-edicion"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="agregar-imagen">
                    <button 
                      onClick={() => agregarElementoArray('fotos_secundarias')}
                      className="boton-agregar-imagen"
                    >
                      <Plus size={16} />
                      Agregar URL
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => manejarSubidaImagen(e, 'fotos_secundarias')}
                      className="campo-file-edicion"
                    />
                  </div>
                </div>

                {/* Videos */}
                <div className="edicion-seccion">
                  <h4>
                    <Video className="icono-seccion" />
                    Videos del Producto
                  </h4>
                  
                  <div className="videos-grid">
                    {productoEditado.videos.map((video, index) => (
                      <div key={index} className="video-item">
                        <div className="video-preview">
                          <video controls>
                            <source src={video} type="video/mp4" />
                            Tu navegador no soporta videos.
                          </video>
                          <button 
                            className="boton-eliminar-imagen"
                            onClick={() => eliminarImagen('videos', index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="video-url">
                          <input
                            type="url"
                            value={video}
                            onChange={(e) => manejarCambioArray('videos', index, e.target.value)}
                            placeholder="URL del video"
                            className="campo-input-edicion"
                          />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => manejarSubidaImagen(e, 'videos', index)}
                            className="campo-file-edicion"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="agregar-imagen">
                    <button 
                      onClick={() => agregarElementoArray('videos')}
                      className="boton-agregar-imagen"
                    >
                      <Plus size={16} />
                      Agregar URL
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => manejarSubidaImagen(e, 'videos')}
                      className="campo-file-edicion"
                    />
                  </div>
                </div>

                {/* Configuración */}
                <div className="edicion-seccion">
                  <h4>Configuración</h4>
                  
                  <div className="campo-grupo-edicion">
                    <label>Stock:</label>
                    <input
                      type="number"
                      value={productoEditado.stock}
                      onChange={(e) => manejarCambioEdicion('stock', parseInt(e.target.value))}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Stock Mínimo:</label>
                    <input
                      type="number"
                      value={productoEditado.stock_minimo}
                      onChange={(e) => manejarCambioEdicion('stock_minimo', parseInt(e.target.value))}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>
                      <input
                        type="checkbox"
                        checked={productoEditado.destacado}
                        onChange={(e) => manejarCambioEdicion('destacado', e.target.checked)}
                      />
                      Producto Destacado
                    </label>
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>
                      <input
                        type="checkbox"
                        checked={productoEditado.activo}
                        onChange={(e) => manejarCambioEdicion('activo', e.target.checked)}
                      />
                      Producto Activo
                    </label>
                  </div>
                </div>
              </div>

              <div className="acciones-edicion">
                <button 
                  className="boton-cancelar-edicion"
                  onClick={() => setPaso(3)}
                >
                  Cancelar
                </button>
                <button 
                  className="boton-guardar-edicion"
                  onClick={guardarEdicion}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Modo modal clásico (overlay)
  return (
    <div className="modal-overlay-ia">
      <div className="modal-container-ia">
        
        {/* Header del Modal */}
        <div className="modal-header-ia">
          <div className="header-titulo-ia">
            <Sparkles className="icono-sparkles" />
            <h2>Crear Producto con IA</h2>
          </div>
          <button 
            className="boton-cerrar-ia"
            onClick={cerrarModal}
            disabled={cargando}
          >
            <X className="icono" />
          </button>
        </div>

        {/* Indicador de Pasos */}
        <div className="pasos-indicador">
          <div className={`paso-item ${paso >= 1 ? 'activo' : ''}`}>
            <div className="paso-numero">1</div>
            <span>Información</span>
          </div>
          <div className={`paso-linea ${paso >= 2 ? 'activo' : ''}`}></div>
          <div className={`paso-item ${paso >= 2 ? 'activo' : ''}`}>
            <div className="paso-numero">2</div>
            <span>Generando</span>
          </div>
          <div className={`paso-linea ${paso >= 3 ? 'activo' : ''}`}></div>
          <div className={`paso-item ${paso >= 3 ? 'activo' : ''}`}>
            <div className="paso-numero">3</div>
            <span>Vista Previa</span>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="modal-contenido-ia">
          
          {/* PASO 1: Formulario Simple */}
          {paso === 1 && (
            <div className="formulario-ia">
              <div className="intro-ia">
                <p>Completa esta información básica y nuestra IA creará una descripción súper persuasiva para tu producto.</p>
                <div className="info-minima-ia">
                  💡 <strong>¡Solo necesitas el nombre y precio!</strong> La IA puede generar contenido completo y persuasivo incluso con información mínima.
                </div>
              </div>

              {error && (
                <div className="mensaje-error-ia">
                  {error}
                </div>
              )}

              <div className="campos-ia">
                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Package className="icono-campo" />
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    className="campo-input-ia"
                    placeholder="Ej: iPhone 15 Pro Max 256GB"
                    value={formularioIA.nombre}
                    onChange={(e) => manejarCambio('nombre', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <DollarSign className="icono-campo" />
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="campo-input-ia"
                    placeholder="0.00"
                    value={formularioIA.precio}
                    onChange={(e) => manejarCambio('precio', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Settings className="icono-campo" />
                    Categoría
                  </label>
                  <select
                    className="campo-select-ia"
                    value={formularioIA.categoria_id}
                    onChange={(e) => manejarCambio('categoria_id', e.target.value)}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <FileText className="icono-campo" />
                    ¿De qué trata el producto? <span className="opcional">(Opcional)</span>
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="3"
                    placeholder="Ej: Consola de grabación profesional... (La IA puede generar contenido solo con el nombre)"
                    value={formularioIA.de_que_trata}
                    onChange={(e) => manejarCambio('de_que_trata', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Settings className="icono-campo" />
                    ¿Cómo funciona? <span className="opcional">(Opcional)</span>
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="3"
                    placeholder="Ej: Se conecta por USB y graba audio... (La IA puede completar esta información)"
                    value={formularioIA.como_funciona}
                    onChange={(e) => manejarCambio('como_funciona', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <FileText className="icono-campo" />
                    Características Principales <span className="opcional">(Opcional)</span>
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="4"
                    placeholder="Ej: Alta calidad, portátil, fácil de usar... (La IA puede investigar y completar)"
                    value={formularioIA.caracteristicas}
                    onChange={(e) => manejarCambio('caracteristicas', e.target.value)}
                  />
                </div>

                <div className="campo-grupo-ia">
                  <label className="campo-label-ia">
                    <Image className="icono-campo" />
                    Imágenes (URLs separadas por comas)
                  </label>
                  <textarea
                    className="campo-textarea-ia"
                    rows="2"
                    placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                    value={formularioIA.imagenes}
                    onChange={(e) => manejarCambio('imagenes', e.target.value)}
                  />
                </div>
              </div>

              <div className="acciones-ia">
                <button 
                  className="boton-cancelar-ia"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button 
                  className="boton-prueba-ia"
                  onClick={probarConDatosFalsos}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🧪 Prueba (Debug)
                </button>
                <button 
                  className="boton-generar-ia"
                  onClick={enviarAIA}
                  disabled={cargando}
                >
                  <Sparkles className="icono" />
                  Generar con IA
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Cargando */}
          {paso === 2 && (
            <div className="cargando-ia">
              <div className="cargando-contenido">
                <Loader2 className="icono-cargando" />
                <h3>Generando tu producto...</h3>
                <p>Nuestra IA está creando una descripción súper persuasiva para tu producto. Esto tomará unos segundos.</p>
                {conversacionId && (
                  <div className="id-conversacion">
                    <small>ID de conversación: {conversacionId}</small>
                  </div>
                )}
                <div className="cargando-pasos">
                  <div className="cargando-paso">✨ Analizando información...</div>
                  <div className="cargando-paso">🎯 Creando ganchos de venta...</div>
                  <div className="cargando-paso">💎 Generando beneficios...</div>
                  <div className="cargando-paso">🚀 Optimizando para ventas...</div>
                </div>
                
                {/* BOTÓN DE DEBUG TEMPORAL */}
                <div style={{marginTop: '20px'}}>
                  <button 
                    className="boton-debug-ia"
                    onClick={probarConDatosFalsos}
                    style={{
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🧪 Prueba (Debug)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Vista Previa */}
          {paso === 3 && productoGenerado && (
            <div className="vista-previa-ia">
              <div className="vista-previa-header">
                <h3>Vista Previa del Producto</h3>
                <p>Revisa cómo quedó tu producto generado por IA</p>
              </div>

              <div className="vista-previa-contenido">
                <div className="producto-info">
                  <h4 className="producto-nombre">{productoGenerado.nombre}</h4>
                  <div className="producto-precio">${productoGenerado.precio.toFixed(2)}</div>
                </div>

                <div className="producto-descripcion">
                  <h5>Descripción:</h5>
                  <p>{productoGenerado.descripcion}</p>
                </div>

                {productoGenerado.ganchos && productoGenerado.ganchos.length > 0 && (
                  <div className="producto-ganchos">
                    <h5>Ganchos de Venta:</h5>
                    <ul>
                      {productoGenerado.ganchos.map((gancho, index) => (
                        <li key={index}>{gancho}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {productoGenerado.beneficios && productoGenerado.beneficios.length > 0 && (
                  <div className="producto-beneficios">
                    <h5>Beneficios:</h5>
                    <ul>
                      {productoGenerado.beneficios.map((beneficio, index) => (
                        <li key={index}>{beneficio}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {productoGenerado.ventajas && productoGenerado.ventajas.length > 0 && (
                  <div className="producto-ventajas">
                    <h5>Ventajas Competitivas:</h5>
                    <ul>
                      {productoGenerado.ventajas.map((ventaja, index) => (
                        <li key={index}>{ventaja}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {productoGenerado.palabras_clave && productoGenerado.palabras_clave.length > 0 && (
                  <div className="producto-palabras-clave">
                    <h5>Palabras Clave:</h5>
                    <div className="palabras-clave-tags">
                      {productoGenerado.palabras_clave.map((palabra, index) => (
                        <span key={index} className="palabra-clave-tag">{palabra}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="producto-seo">
                  <h5>SEO:</h5>
                  <p><strong>Slug:</strong> {productoGenerado.slug}</p>
                  <p><strong>Meta Title:</strong> {productoGenerado.meta_title}</p>
                  <p><strong>Meta Description:</strong> {productoGenerado.meta_description}</p>
                </div>

                <div className="producto-configuracion">
                  <h5>Configuración:</h5>
                  <p><strong>Stock:</strong> {productoGenerado.stock} unidades</p>
                  <p><strong>Stock Mínimo:</strong> {productoGenerado.stock_minimo} unidades</p>
                  <p><strong>Destacado:</strong> {productoGenerado.destacado ? 'Sí' : 'No'}</p>
                  <p><strong>Activo:</strong> {productoGenerado.activo ? 'Sí' : 'No'}</p>
                </div>

                {/* Fotos Principales */}
                {productoGenerado.fotos_principales && productoGenerado.fotos_principales.length > 0 && (
                  <div className="producto-imagenes">
                    <h5>
                      <Camera className="icono-seccion" />
                      Fotos Principales ({productoGenerado.fotos_principales.length})
                    </h5>
                    <div className="imagenes-preview-grid">
                      {productoGenerado.fotos_principales.map((foto, index) => (
                        <div key={index} className="imagen-preview-item">
                          <img 
                            src={foto} 
                            alt={`Foto principal ${index + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="imagen-error" style={{display: 'none'}}>
                            <span>❌ Imagen no disponible</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fotos Secundarias */}
                {productoGenerado.fotos_secundarias && productoGenerado.fotos_secundarias.length > 0 && (
                  <div className="producto-imagenes">
                    <h5>
                      <Image className="icono-seccion" />
                      Fotos Secundarias ({productoGenerado.fotos_secundarias.length})
                    </h5>
                    <div className="imagenes-preview-grid">
                      {productoGenerado.fotos_secundarias.map((foto, index) => (
                        <div key={index} className="imagen-preview-item">
                          <img 
                            src={foto} 
                            alt={`Foto secundaria ${index + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="imagen-error" style={{display: 'none'}}>
                            <span>❌ Imagen no disponible</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {productoGenerado.videos && productoGenerado.videos.length > 0 && (
                  <div className="producto-videos">
                    <h5>
                      <Video className="icono-seccion" />
                      Videos del Producto ({productoGenerado.videos.length})
                    </h5>
                    <div className="videos-preview-grid">
                      {productoGenerado.videos.map((video, index) => (
                        <div key={index} className="video-preview-item">
                          <video 
                            controls
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          >
                            <source src={video} type="video/mp4" />
                            Tu navegador no soporta videos.
                          </video>
                          <div className="video-error" style={{display: 'none'}}>
                            <span>❌ Video no disponible</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="acciones-vista-previa">
                <button 
                  className="boton-editar-ia"
                  onClick={editarProducto}
                >
                  <Edit3 className="icono" />
                  Editar
                </button>
                <button 
                  className="boton-regenerar-ia"
                  onClick={regenerarProducto}
                >
                  <RotateCcw className="icono" />
                  Regenerar
                </button>
                <button 
                  className="boton-aprobar-ia"
                  onClick={aprobarProducto}
                >
                  <CheckCircle className="icono" />
                  Aprobar y Crear
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: Edición */}
          {paso === 4 && productoEditado && (
            <div className="edicion-ia">
              <div className="edicion-header">
                <h3>Editar Producto</h3>
                <p>Modifica los campos que necesites ajustar</p>
              </div>

              <div className="edicion-contenido">
                {/* Información Básica */}
                <div className="edicion-seccion">
                  <h4>Información Básica</h4>
                  
                  <div className="campo-grupo-edicion">
                    <label>Nombre del Producto:</label>
                    <input
                      type="text"
                      value={productoEditado.nombre}
                      onChange={(e) => manejarCambioEdicion('nombre', e.target.value)}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Precio:</label>
                    <input
                      type="number"
                      value={productoEditado.precio}
                      onChange={(e) => manejarCambioEdicion('precio', parseFloat(e.target.value))}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Slug:</label>
                    <input
                      type="text"
                      value={productoEditado.slug}
                      onChange={(e) => manejarCambioEdicion('slug', e.target.value)}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Descripción:</label>
                    <textarea
                      value={productoEditado.descripcion}
                      onChange={(e) => manejarCambioEdicion('descripcion', e.target.value)}
                      className="campo-textarea-edicion"
                      rows="6"
                    />
                  </div>
                </div>

                {/* Ganchos de Venta */}
                <div className="edicion-seccion">
                  <h4>Ganchos de Venta</h4>
                  {productoEditado.ganchos.map((gancho, index) => (
                    <div key={index} className="campo-array-edicion">
                      <input
                        type="text"
                        value={gancho}
                        onChange={(e) => manejarCambioArray('ganchos', index, e.target.value)}
                        className="campo-input-edicion"
                      />
                      <button 
                        onClick={() => eliminarElementoArray('ganchos', index)}
                        className="boton-eliminar-array"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => agregarElementoArray('ganchos')}
                    className="boton-agregar-array"
                  >
                    + Agregar Gancho
                  </button>
                </div>

                {/* Beneficios */}
                <div className="edicion-seccion">
                  <h4>Beneficios</h4>
                  {productoEditado.beneficios.map((beneficio, index) => (
                    <div key={index} className="campo-array-edicion">
                      <input
                        type="text"
                        value={beneficio}
                        onChange={(e) => manejarCambioArray('beneficios', index, e.target.value)}
                        className="campo-input-edicion"
                      />
                      <button 
                        onClick={() => eliminarElementoArray('beneficios', index)}
                        className="boton-eliminar-array"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => agregarElementoArray('beneficios')}
                    className="boton-agregar-array"
                  >
                    + Agregar Beneficio
                  </button>
                </div>

                {/* Ventajas */}
                <div className="edicion-seccion">
                  <h4>Ventajas Competitivas</h4>
                  {productoEditado.ventajas.map((ventaja, index) => (
                    <div key={index} className="campo-array-edicion">
                      <input
                        type="text"
                        value={ventaja}
                        onChange={(e) => manejarCambioArray('ventajas', index, e.target.value)}
                        className="campo-input-edicion"
                      />
                      <button 
                        onClick={() => eliminarElementoArray('ventajas', index)}
                        className="boton-eliminar-array"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => agregarElementoArray('ventajas')}
                    className="boton-agregar-array"
                  >
                    + Agregar Ventaja
                  </button>
                </div>

                {/* SEO */}
                <div className="edicion-seccion">
                  <h4>SEO</h4>
                  
                  <div className="campo-grupo-edicion">
                    <label>Meta Title:</label>
                    <input
                      type="text"
                      value={productoEditado.meta_title}
                      onChange={(e) => manejarCambioEdicion('meta_title', e.target.value)}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Meta Description:</label>
                    <textarea
                      value={productoEditado.meta_description}
                      onChange={(e) => manejarCambioEdicion('meta_description', e.target.value)}
                      className="campo-textarea-edicion"
                      rows="3"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Palabras Clave:</label>
                    {productoEditado.palabras_clave.map((palabra, index) => (
                      <div key={index} className="campo-array-edicion">
                        <input
                          type="text"
                          value={palabra}
                          onChange={(e) => manejarCambioArray('palabras_clave', index, e.target.value)}
                          className="campo-input-edicion"
                        />
                        <button 
                          onClick={() => eliminarElementoArray('palabras_clave', index)}
                          className="boton-eliminar-array"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => agregarElementoArray('palabras_clave')}
                      className="boton-agregar-array"
                    >
                      + Agregar Palabra Clave
                    </button>
                  </div>
                </div>

                {/* Imágenes Principales */}
                <div className="edicion-seccion">
                  <h4>
                    <Camera className="icono-seccion" />
                    Fotos Principales
                  </h4>
                  
                  <div className="imagenes-grid">
                    {productoEditado.fotos_principales.map((foto, index) => (
                      <div key={index} className="imagen-item">
                        <div className="imagen-preview">
                          <img src={foto} alt={`Foto ${index + 1}`} />
                          <button 
                            className="boton-eliminar-imagen"
                            onClick={() => eliminarImagen('fotos_principales', index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="imagen-url">
                          <input
                            type="url"
                            value={foto}
                            onChange={(e) => manejarCambioArray('fotos_principales', index, e.target.value)}
                            placeholder="URL de la imagen"
                            className="campo-input-edicion"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => manejarSubidaImagen(e, 'fotos_principales', index)}
                            className="campo-file-edicion"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="agregar-imagen">
                    <button 
                      onClick={() => agregarElementoArray('fotos_principales')}
                      className="boton-agregar-imagen"
                    >
                      <Plus size={16} />
                      Agregar URL
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => manejarSubidaImagen(e, 'fotos_principales')}
                      className="campo-file-edicion"
                    />
                  </div>
                </div>

                {/* Fotos Secundarias */}
                <div className="edicion-seccion">
                  <h4>
                    <Image className="icono-seccion" />
                    Fotos Secundarias
                  </h4>
                  
                  <div className="imagenes-grid">
                    {productoEditado.fotos_secundarias.map((foto, index) => (
                      <div key={index} className="imagen-item">
                        <div className="imagen-preview">
                          <img src={foto} alt={`Foto secundaria ${index + 1}`} />
                          <button 
                            className="boton-eliminar-imagen"
                            onClick={() => eliminarImagen('fotos_secundarias', index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="imagen-url">
                          <input
                            type="url"
                            value={foto}
                            onChange={(e) => manejarCambioArray('fotos_secundarias', index, e.target.value)}
                            placeholder="URL de la imagen"
                            className="campo-input-edicion"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => manejarSubidaImagen(e, 'fotos_secundarias', index)}
                            className="campo-file-edicion"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="agregar-imagen">
                    <button 
                      onClick={() => agregarElementoArray('fotos_secundarias')}
                      className="boton-agregar-imagen"
                    >
                      <Plus size={16} />
                      Agregar URL
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => manejarSubidaImagen(e, 'fotos_secundarias')}
                      className="campo-file-edicion"
                    />
                  </div>
                </div>

                {/* Videos */}
                <div className="edicion-seccion">
                  <h4>
                    <Video className="icono-seccion" />
                    Videos del Producto
                  </h4>
                  
                  <div className="videos-grid">
                    {productoEditado.videos.map((video, index) => (
                      <div key={index} className="video-item">
                        <div className="video-preview">
                          <video controls>
                            <source src={video} type="video/mp4" />
                            Tu navegador no soporta videos.
                          </video>
                          <button 
                            className="boton-eliminar-imagen"
                            onClick={() => eliminarImagen('videos', index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="video-url">
                          <input
                            type="url"
                            value={video}
                            onChange={(e) => manejarCambioArray('videos', index, e.target.value)}
                            placeholder="URL del video"
                            className="campo-input-edicion"
                          />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => manejarSubidaImagen(e, 'videos', index)}
                            className="campo-file-edicion"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="agregar-imagen">
                    <button 
                      onClick={() => agregarElementoArray('videos')}
                      className="boton-agregar-imagen"
                    >
                      <Plus size={16} />
                      Agregar URL
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => manejarSubidaImagen(e, 'videos')}
                      className="campo-file-edicion"
                    />
                  </div>
                </div>

                {/* Configuración */}
                <div className="edicion-seccion">
                  <h4>Configuración</h4>
                  
                  <div className="campo-grupo-edicion">
                    <label>Stock:</label>
                    <input
                      type="number"
                      value={productoEditado.stock}
                      onChange={(e) => manejarCambioEdicion('stock', parseInt(e.target.value))}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>Stock Mínimo:</label>
                    <input
                      type="number"
                      value={productoEditado.stock_minimo}
                      onChange={(e) => manejarCambioEdicion('stock_minimo', parseInt(e.target.value))}
                      className="campo-input-edicion"
                    />
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>
                      <input
                        type="checkbox"
                        checked={productoEditado.destacado}
                        onChange={(e) => manejarCambioEdicion('destacado', e.target.checked)}
                      />
                      Producto Destacado
                    </label>
                  </div>

                  <div className="campo-grupo-edicion">
                    <label>
                      <input
                        type="checkbox"
                        checked={productoEditado.activo}
                        onChange={(e) => manejarCambioEdicion('activo', e.target.checked)}
                      />
                      Producto Activo
                    </label>
                  </div>
                </div>
              </div>

              <div className="acciones-edicion">
                <button 
                  className="boton-cancelar-edicion"
                  onClick={() => setPaso(3)}
                >
                  Cancelar
                </button>
                <button 
                  className="boton-guardar-edicion"
                  onClick={guardarEdicion}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default CrearProductoIA
