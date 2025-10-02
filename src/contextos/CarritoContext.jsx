import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { clienteSupabase } from '../configuracion/supabase'
import { useAuth } from './ContextoAutenticacion'

// Estado inicial del carrito
const estadoInicial = {
  items: [],
  cargando: false,
  error: null,
  modalAbierto: false,
  totalItems: 0,
  subtotal: 0,
  descuentos: 0,
  envio: 0,
  total: 0,
  sessionId: null,
  notificacion: {
    visible: false,
    tipo: 'success',
    titulo: '',
    mensaje: ''
  }
}

// Tipos de acciones
const TIPOS_ACCION = {
  CARGAR_CARRITO_INICIO: 'CARGAR_CARRITO_INICIO',
  CARGAR_CARRITO_EXITO: 'CARGAR_CARRITO_EXITO',
  CARGAR_CARRITO_ERROR: 'CARGAR_CARRITO_ERROR',
  AGREGAR_ITEM: 'AGREGAR_ITEM',
  ACTUALIZAR_CANTIDAD: 'ACTUALIZAR_CANTIDAD',
  ELIMINAR_ITEM: 'ELIMINAR_ITEM',
  LIMPIAR_CARRITO: 'LIMPIAR_CARRITO',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  CALCULAR_TOTALES: 'CALCULAR_TOTALES',
  ESTABLECER_SESSION_ID: 'ESTABLECER_SESSION_ID',
  MOSTRAR_NOTIFICACION: 'MOSTRAR_NOTIFICACION',
  OCULTAR_NOTIFICACION: 'OCULTAR_NOTIFICACION'
}

// Reducer del carrito
const carritoReducer = (estado, accion) => {
  switch (accion.type) {
    case TIPOS_ACCION.CARGAR_CARRITO_INICIO:
      return {
        ...estado,
        cargando: true,
        error: null
      }

    case TIPOS_ACCION.CARGAR_CARRITO_EXITO:
      return {
        ...estado,
        cargando: false,
        items: accion.payload,
        error: null
      }

    case TIPOS_ACCION.CARGAR_CARRITO_ERROR:
      return {
        ...estado,
        cargando: false,
        error: accion.payload
      }

    case TIPOS_ACCION.AGREGAR_ITEM:
      const itemExistente = estado.items.find(item => 
        item.producto_id === accion.payload.producto_id
      )

      let nuevosItems
      if (itemExistente) {
        nuevosItems = estado.items.map(item =>
          item.producto_id === accion.payload.producto_id
            ? { ...item, cantidad: item.cantidad + accion.payload.cantidad }
            : item
        )
      } else {
        nuevosItems = [...estado.items, accion.payload]
      }

      return {
        ...estado,
        items: nuevosItems
      }

    case TIPOS_ACCION.ACTUALIZAR_CANTIDAD:
      return {
        ...estado,
        items: estado.items.map(item =>
          item.id === accion.payload.id
            ? { ...item, cantidad: accion.payload.cantidad }
            : item
        ).filter(item => item.cantidad > 0)
      }

    case TIPOS_ACCION.ELIMINAR_ITEM:
      return {
        ...estado,
        items: estado.items.filter(item => item.id !== accion.payload)
      }

    case TIPOS_ACCION.LIMPIAR_CARRITO:
      return {
        ...estado,
        items: []
      }

    case TIPOS_ACCION.TOGGLE_MODAL:
      return {
        ...estado,
        modalAbierto: !estado.modalAbierto
      }

    case TIPOS_ACCION.CALCULAR_TOTALES:
      const totalItems = estado.items.reduce((total, item) => total + item.cantidad, 0)
      const subtotal = estado.items.reduce((total, item) => 
        total + (item.cantidad * item.precio_unitario), 0
      )
      
      // Calcular envío (gratis si es mayor a $50,000)
      const envio = subtotal >= 50000 ? 0 : 5000
      
      // Calcular descuentos (ejemplo: 10% si es mayor a $100,000)
      const descuentos = subtotal >= 100000 ? subtotal * 0.1 : 0
      
      const total = subtotal + envio - descuentos

      return {
        ...estado,
        totalItems,
        subtotal,
        descuentos,
        envio,
        total
      }

    case TIPOS_ACCION.ESTABLECER_SESSION_ID:
      return {
        ...estado,
        sessionId: accion.payload
      }

    case TIPOS_ACCION.MOSTRAR_NOTIFICACION:
      return {
        ...estado,
        notificacion: {
          visible: true,
          tipo: accion.payload.tipo || 'success',
          titulo: accion.payload.titulo || '',
          mensaje: accion.payload.mensaje || ''
        }
      }

    case TIPOS_ACCION.OCULTAR_NOTIFICACION:
      return {
        ...estado,
        notificacion: {
          ...estado.notificacion,
          visible: false
        }
      }

    default:
      return estado
  }
}

// Crear contexto
const CarritoContext = createContext()

// Hook personalizado para usar el contexto
export const useCarrito = () => {
  const contexto = useContext(CarritoContext)
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  }
  return contexto
}

// Proveedor del contexto
export const CarritoProvider = ({ children }) => {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial)
  const { usuario, sesionIniciada } = useAuth()

  // Generar o recuperar session ID
  useEffect(() => {
    let sessionId = localStorage.getItem('carrito_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('carrito_session_id', sessionId)
    }
    dispatch({ type: TIPOS_ACCION.ESTABLECER_SESSION_ID, payload: sessionId })
  }, [])

  // Cargar carrito al inicializar
  useEffect(() => {
    if (estado.sessionId) {
      cargarCarrito()
    }
  }, [estado.sessionId, usuario])

  // Calcular totales cuando cambien los items
  useEffect(() => {
    dispatch({ type: TIPOS_ACCION.CALCULAR_TOTALES })
  }, [estado.items])

  // Función para cargar el carrito desde Supabase
  const cargarCarrito = async () => {
    try {
      dispatch({ type: TIPOS_ACCION.CARGAR_CARRITO_INICIO })

      let query = clienteSupabase
        .from('carrito')
        .select(`
          *,
          productos (
            id,
            nombre,
            slug,
            precio,
            precio_original,
            activo,
            stock,
            producto_imagenes (
              imagen_principal,
              imagen_secundaria_1
            )
          )
        `)

      // Filtrar por usuario o session
      console.log('🔍 cargarCarrito - Verificando filtros:', {
        sesionIniciada,
        usuario,
        hasUsuario: !!usuario,
        usuarioId: usuario?.id,
        sessionId: estado.sessionId
      })
      
      if (sesionIniciada && usuario) {
        console.log('🔍 Filtrando por usuario_id:', usuario.id)
        query = query.eq('usuario_id', usuario.id)
      } else {
        console.log('🔍 Filtrando por session_id:', estado.sessionId)
        query = query.eq('session_id', estado.sessionId)
      }

      const { data, error } = await query.order('creado_el', { ascending: false })

      if (error) throw error

      dispatch({ 
        type: TIPOS_ACCION.CARGAR_CARRITO_EXITO, 
        payload: data || [] 
      })

    } catch (error) {
      console.error('Error al cargar carrito:', error)
      dispatch({ 
        type: TIPOS_ACCION.CARGAR_CARRITO_ERROR, 
        payload: error.message 
      })
    }
  }

  // Función para agregar producto al carrito
  const agregarAlCarrito = async (producto, cantidad = 1, variantes = {}) => {
    try {
      // Validaciones de entrada
      if (!producto || !producto.id) {
        throw new Error('Producto no válido')
      }

      if (cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0')
      }

      if (!Number.isInteger(cantidad)) {
        throw new Error('La cantidad debe ser un número entero')
      }

      // Límites de cantidad
      const CANTIDAD_MAXIMA_POR_PRODUCTO = 10
      const CANTIDAD_MAXIMA_CARRITO = 50

      if (cantidad > CANTIDAD_MAXIMA_POR_PRODUCTO) {
        throw new Error(`No puedes agregar más de ${CANTIDAD_MAXIMA_POR_PRODUCTO} unidades de este producto`)
      }

      // Verificar cantidad total en el carrito
      const cantidadTotalCarrito = estado.items.reduce((total, item) => total + item.cantidad, 0)
      if (cantidadTotalCarrito + cantidad > CANTIDAD_MAXIMA_CARRITO) {
        throw new Error(`No puedes tener más de ${CANTIDAD_MAXIMA_CARRITO} productos en tu carrito`)
      }

      // Verificar si el producto ya está en el carrito
      const itemExistente = estado.items.find(item => 
        item.producto_id === producto.id
      )

      if (itemExistente) {
        console.log('🔍 Item existente encontrado:', {
          itemExistente,
          hasId: !!itemExistente.id,
          id: itemExistente.id
        })
        
        const nuevaCantidad = itemExistente.cantidad + cantidad
        if (nuevaCantidad > CANTIDAD_MAXIMA_POR_PRODUCTO) {
          throw new Error(`Ya tienes ${itemExistente.cantidad} unidades. No puedes agregar más de ${CANTIDAD_MAXIMA_POR_PRODUCTO} en total`)
        }
        
        // Verificar que el item tenga ID antes de actualizar
        if (!itemExistente.id) {
          throw new Error('Error interno: El item del carrito no tiene ID válido')
        }
        
        // Si ya existe, actualizar cantidad
        return await actualizarCantidad(itemExistente.id, nuevaCantidad)
      }

      // Verificar disponibilidad del producto
      if (!producto.activo) {
        throw new Error('Este producto no está disponible')
      }

      // Verificar stock disponible
      if (!producto.stock || producto.stock < cantidad) {
        throw new Error(`Stock insuficiente. Solo quedan ${producto.stock || 0} unidades disponibles`)
      }

      const nuevoItem = {
        producto_id: producto.id,
        cantidad,
        precio_unitario: producto.precio,
        usuario_id: sesionIniciada && usuario ? usuario.id : null,
        session_id: !sesionIniciada ? estado.sessionId : null
      }

      // Guardar en Supabase
      const { data, error } = await clienteSupabase
        .from('carrito')
        .insert([nuevoItem])
        .select(`
          *,
          productos (
            id,
            nombre,
            slug,
            precio,
            precio_original,
            activo,
            stock,
            producto_imagenes (
              imagen_principal,
              imagen_secundaria_1
            )
          )
        `)

      if (error) throw error

      // Actualizar estado local
      dispatch({ 
        type: TIPOS_ACCION.AGREGAR_ITEM, 
        payload: data[0] 
      })

      // Mostrar notificación de éxito
      mostrarNotificacion('success', '¡Producto agregado!', 'El producto se ha agregado correctamente al carrito')

      return { success: true, message: 'Producto agregado al carrito' }

    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      return { success: false, message: error.message }
    }
  }

  // Función para actualizar cantidad
  const actualizarCantidad = async (itemId, nuevaCantidad) => {
    try {
      console.log('🔄 actualizarCantidad llamada con:', {
        itemId,
        nuevaCantidad,
        hasItemId: !!itemId,
        usuario: usuario,
        hasUsuario: !!usuario,
        usuarioId: usuario?.id,
        sesionIniciada
      })
      
      if (nuevaCantidad <= 0) {
        return await eliminarDelCarrito(itemId)
      }

      // Validaciones
      if (!Number.isInteger(nuevaCantidad)) {
        throw new Error('La cantidad debe ser un número entero')
      }

      const CANTIDAD_MAXIMA_POR_PRODUCTO = 10
      if (nuevaCantidad > CANTIDAD_MAXIMA_POR_PRODUCTO) {
        throw new Error(`No puedes tener más de ${CANTIDAD_MAXIMA_POR_PRODUCTO} unidades de este producto`)
      }

      // Buscar el item en el carrito
      const item = estado.items.find(i => i.id === itemId)
      if (!item) {
        throw new Error('Producto no encontrado en el carrito')
      }

      // Verificar stock disponible
      if (item.productos && item.productos.stock < nuevaCantidad) {
        throw new Error(`Stock insuficiente. Solo quedan ${item.productos.stock} unidades disponibles`)
      }

      // Verificar límite total del carrito
      const CANTIDAD_MAXIMA_CARRITO = 50
      const cantidadTotalSinEsteItem = estado.items
        .filter(i => i.id !== itemId)
        .reduce((total, i) => total + i.cantidad, 0)
      
      if (cantidadTotalSinEsteItem + nuevaCantidad > CANTIDAD_MAXIMA_CARRITO) {
        throw new Error(`No puedes tener más de ${CANTIDAD_MAXIMA_CARRITO} productos en tu carrito`)
      }

      const { error } = await clienteSupabase
        .from('carrito')
        .update({ cantidad: nuevaCantidad })
        .eq('id', itemId)

      if (error) throw error

      dispatch({ 
        type: TIPOS_ACCION.ACTUALIZAR_CANTIDAD, 
        payload: { id: itemId, cantidad: nuevaCantidad } 
      })

      return { success: true }

    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
      return { success: false, message: error.message }
    }
  }

  // Función para eliminar del carrito
  const eliminarDelCarrito = async (itemId) => {
    try {
      const { error } = await clienteSupabase
        .from('carrito')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      dispatch({ 
        type: TIPOS_ACCION.ELIMINAR_ITEM, 
        payload: itemId 
      })

      return { success: true }

    } catch (error) {
      console.error('Error al eliminar del carrito:', error)
      return { success: false, message: error.message }
    }
  }

  // Función para limpiar carrito
  const limpiarCarrito = async () => {
    try {
      let query = clienteSupabase.from('carrito').delete()

      if (sesionIniciada && usuario) {
        query = query.eq('usuario_id', usuario.id)
      } else {
        query = query.eq('session_id', estado.sessionId)
      }

      const { error } = await query

      if (error) throw error

      dispatch({ type: TIPOS_ACCION.LIMPIAR_CARRITO })

      return { success: true }

    } catch (error) {
      console.error('Error al limpiar carrito:', error)
      return { success: false, message: error.message }
    }
  }

  // Función para migrar carrito de sesión a usuario
  const migrarCarritoAUsuario = async (usuarioId) => {
    try {
      console.log('🔄 migrarCarritoAUsuario llamada con:', {
        usuarioId,
        hasUsuarioId: !!usuarioId,
        sessionId: estado.sessionId
      })
      
      const { error } = await clienteSupabase
        .from('carrito')
        .update({ 
          usuario_id: usuarioId,
          session_id: null 
        })
        .eq('session_id', estado.sessionId)

      if (error) throw error

      console.log('✅ Carrito migrado exitosamente, recargando...')
      // Recargar carrito
      await cargarCarrito()

    } catch (error) {
      console.error('❌ Error al migrar carrito:', error)
    }
  }

  // Función para toggle modal
  const toggleModal = () => {
    dispatch({ type: TIPOS_ACCION.TOGGLE_MODAL })
  }

  // Función para obtener productos relacionados
  const obtenerProductosRelacionados = async (categoriaId) => {
    try {
      const { data, error } = await clienteSupabase
        .from('productos')
        .select('*')
        .eq('categoria_id', categoriaId)
        .eq('activo', true)
        .eq('disponible', true)
        .limit(4)

      if (error) throw error
      return data || []

    } catch (error) {
      console.error('Error al obtener productos relacionados:', error)
      return []
    }
  }

  // Migrar carrito cuando el usuario inicie sesión
  useEffect(() => {
    console.log('🔄 useEffect migrarCarrito:', {
      sesionIniciada,
      usuario,
      hasUsuario: !!usuario,
      usuarioId: usuario?.id,
      sessionId: estado.sessionId
    })
    
    if (sesionIniciada && usuario && estado.sessionId) {
      console.log('🔄 Llamando migrarCarritoAUsuario con usuario.id:', usuario.id)
      migrarCarritoAUsuario(usuario.id)
    }
  }, [sesionIniciada, usuario])

  // Función para mostrar notificación
  const mostrarNotificacion = (tipo, titulo, mensaje) => {
    dispatch({
      type: TIPOS_ACCION.MOSTRAR_NOTIFICACION,
      payload: { tipo, titulo, mensaje }
    })
  }

  // Función para ocultar notificación
  const ocultarNotificacion = () => {
    dispatch({ type: TIPOS_ACCION.OCULTAR_NOTIFICACION })
  }

  // Función alias para compatibilidad
  const agregarItem = agregarAlCarrito
  const alternarModal = () => dispatch({ type: TIPOS_ACCION.TOGGLE_MODAL })

  const valor = {
    // Estado
    ...estado,
    
    // Funciones
    agregarAlCarrito,
    agregarItem, // Alias para compatibilidad
    actualizarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,
    cargarCarrito,
    toggleModal,
    alternarModal, // Alias para toggleModal
    obtenerProductosRelacionados,
    mostrarNotificacion,
    ocultarNotificacion,
    
    // Utilidades
    formatearPrecio: (precio) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(precio)
    }
  }

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  )
}