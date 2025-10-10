import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { clienteSupabase } from '../configuracion/supabase'
import { useAuth } from './ContextoAutenticacion'

// Estado inicial
const estadoInicial = {
  favoritos: [],
  cargando: false,
  error: null,
  contadorFavoritos: 0
}

// Tipos de acciones
const TIPOS_ACCION = {
  CARGAR_FAVORITOS_INICIO: 'CARGAR_FAVORITOS_INICIO',
  CARGAR_FAVORITOS_EXITO: 'CARGAR_FAVORITOS_EXITO',
  CARGAR_FAVORITOS_ERROR: 'CARGAR_FAVORITOS_ERROR',
  AGREGAR_FAVORITO: 'AGREGAR_FAVORITO',
  QUITAR_FAVORITO: 'QUITAR_FAVORITO',
  LIMPIAR_FAVORITOS: 'LIMPIAR_FAVORITOS',
  ACTUALIZAR_CONTADOR: 'ACTUALIZAR_CONTADOR',
  SINCRONIZAR_INICIO: 'SINCRONIZAR_INICIO',
  SINCRONIZAR_EXITO: 'SINCRONIZAR_EXITO',
  SINCRONIZAR_ERROR: 'SINCRONIZAR_ERROR'
}

// Reducer para manejar el estado de favoritos
const favoritosReducer = (estado, accion) => {
  console.log('🔄 FavoritosReducer - Acción recibida:', accion.type)
  console.log('📦 Payload:', accion.payload)
  console.log('📊 Estado actual:', estado)
  
  switch (accion.type) {
    case TIPOS_ACCION.CARGAR_FAVORITOS_INICIO:
      console.log('⏳ Iniciando carga de favoritos...')
      return {
        ...estado,
        cargando: true,
        error: null
      }

    case TIPOS_ACCION.CARGAR_FAVORITOS_EXITO:
      console.log('✅ Carga de favoritos exitosa. Cantidad:', accion.payload?.length || 0)
      return {
        ...estado,
        favoritos: accion.payload,
        contadorFavoritos: accion.payload.length,
        cargando: false,
        error: null
      }

    case TIPOS_ACCION.CARGAR_FAVORITOS_ERROR:
      return {
        ...estado,
        cargando: false,
        error: accion.payload
      }

    case TIPOS_ACCION.AGREGAR_FAVORITO:
      const nuevosFavoritos = [...estado.favoritos, accion.payload]
      return {
        ...estado,
        favoritos: nuevosFavoritos,
        contadorFavoritos: nuevosFavoritos.length
      }

    case TIPOS_ACCION.QUITAR_FAVORITO:
      const favoritosFiltrados = estado.favoritos.filter(
        favorito => favorito.producto_id !== accion.payload
      )
      return {
        ...estado,
        favoritos: favoritosFiltrados,
        contadorFavoritos: favoritosFiltrados.length
      }

    case TIPOS_ACCION.LIMPIAR_FAVORITOS:
      return {
        ...estado,
        favoritos: [],
        contadorFavoritos: 0
      }

    case TIPOS_ACCION.ACTUALIZAR_CONTADOR:
      return {
        ...estado,
        contadorFavoritos: accion.payload
      }

    case TIPOS_ACCION.SINCRONIZAR_INICIO:
      console.log('🔄 Iniciando sincronización de favoritos...')
      return {
        ...estado,
        cargando: true
      }

    case TIPOS_ACCION.SINCRONIZAR_EXITO:
      console.log('✅ Sincronización exitosa. Favoritos recibidos:', accion.payload?.length || 0)
      console.log('📋 Favoritos sincronizados:', accion.payload)
      return {
        ...estado,
        favoritos: accion.payload,
        contadorFavoritos: accion.payload.length,
        cargando: false,
        error: null
      }

    case TIPOS_ACCION.SINCRONIZAR_ERROR:
      console.log('❌ Error en sincronización:', accion.payload)
      return {
        ...estado,
        cargando: false,
        error: accion.payload
      }

    default:
      return estado
  }
}

// Crear contexto
const FavoritosContext = createContext()

// Provider del contexto
const FavoritosProvider = ({ children }) => {
  const [estado, dispatch] = useReducer(favoritosReducer, estadoInicial)
  const { usuario, sesionInicializada } = useAuth()

  // =====================================================
  // FUNCIONES PARA BASE DE DATOS
  // =====================================================

  // Función para cargar favoritos desde la base de datos
  const cargarFavoritosDesdeDB = async () => {
    console.log('🔍 FavoritosContext - cargarFavoritosDesdeDB iniciado')
    console.log('👤 Usuario ID:', usuario?.id)
    
    if (!usuario?.id) {
      console.log('❌ No hay usuario logueado, retornando array vacío')
      return []
    }

    try {
      console.log('📡 Consultando vista_favoritos en Supabase...')
      const { data, error } = await clienteSupabase
        .from('vista_favoritos')
        .select('*')
        .eq('usuario_id', usuario.id)

      if (error) {
        console.error('❌ Error al cargar favoritos desde DB:', error)
        return []
      }

      console.log('✅ Datos recibidos de vista_favoritos:', data)
      console.log('📊 Cantidad de favoritos encontrados (crudos):', data?.length || 0)
      
      // Eliminar duplicados por producto_id, conservando el más reciente
      const ordenados = [...(data || [])].sort((a, b) => {
        const fa = new Date(a?.created_at || a?.fecha_agregado || 0)
        const fb = new Date(b?.created_at || b?.fecha_agregado || 0)
        return fb - fa
      })
      const mapa = new Map()
      for (const item of ordenados) {
        const key = item.producto_id || item.id
        if (!mapa.has(key)) {
          mapa.set(key, item)
        }
      }
      const sinDuplicados = Array.from(mapa.values())
      
      console.log('📊 Cantidad de favoritos tras dedupe:', sinDuplicados.length)
      if (sinDuplicados.length > 0) {
        console.log('📋 Favorito ejemplo tras dedupe:', sinDuplicados[0])
      }

      return sinDuplicados
    } catch (error) {
      console.error('❌ Error al cargar favoritos desde DB:', error)
      return []
    }
  }

  // Función para agregar favorito a la base de datos
  const agregarFavoritoDB = async (productoId) => {
    if (!usuario?.id) return false

    try {
      const { data, error } = await clienteSupabase.rpc('agregar_favorito', {
        p_usuario_id: usuario.id,
        p_producto_id: productoId
      })

      if (error) {
        console.error('Error al agregar favorito a DB:', error)
        return false
      }

      return data
    } catch (error) {
      console.error('Error al agregar favorito a DB:', error)
      return false
    }
  }

  // Función para quitar favorito de la base de datos
  const quitarFavoritoDB = async (productoId) => {
    if (!usuario?.id) return false

    try {
      const { data, error } = await clienteSupabase.rpc('quitar_favorito', {
        p_usuario_id: usuario.id,
        p_producto_id: productoId
      })

      if (error) {
        console.error('Error al quitar favorito de DB:', error)
        return false
      }

      return data
    } catch (error) {
      console.error('Error al quitar favorito de DB:', error)
      return false
    }
  }

  // Función para migrar favoritos de localStorage a la base de datos
  const migrarFavoritosADB = async () => {
    if (!usuario?.id) return

    try {
      const favoritosLocal = JSON.parse(localStorage.getItem('favoritos') || '[]')
      
      if (favoritosLocal.length === 0) return

      console.log(`🔄 Migrando ${favoritosLocal.length} favoritos a la base de datos...`)

      // Agregar cada favorito a la base de datos
      for (const favorito of favoritosLocal) {
        await agregarFavoritoDB(favorito.producto_id)
      }

      // Limpiar localStorage después de migrar
      localStorage.removeItem('favoritos')
      console.log('✅ Favoritos migrados exitosamente')

      // Recargar favoritos desde la base de datos
      await cargarFavoritos()
    } catch (error) {
      console.error('Error al migrar favoritos:', error)
    }
  }

  // Función para sincronizar favoritos (cargar desde DB o localStorage)
  const sincronizarFavoritos = async () => {
    console.log('🔄 FavoritosContext - sincronizarFavoritos iniciado')
    console.log('🔐 Sesión iniciada:', sesionInicializada)
    console.log('👤 Usuario:', usuario?.id)
    
    dispatch({ type: TIPOS_ACCION.SINCRONIZAR_INICIO })

    try {
      if (sesionInicializada && usuario?.id) {
        console.log('📡 Usuario logueado: cargando desde base de datos')
        // Usuario logueado: cargar desde base de datos
        const favoritosDB = await cargarFavoritosDesdeDB()
        console.log('✅ Favoritos cargados desde DB:', favoritosDB)
        console.log('📊 Cantidad de favoritos DB:', favoritosDB?.length || 0)
        
        dispatch({ 
          type: TIPOS_ACCION.SINCRONIZAR_EXITO, 
          payload: favoritosDB 
        })
        console.log('✅ Dispatch SINCRONIZAR_EXITO ejecutado con:', favoritosDB?.length || 0, 'favoritos')
      } else {
        console.log('💾 Usuario no logueado: cargando desde localStorage')
        // Usuario no logueado: cargar desde localStorage
        cargarFavoritosDesdeStorage()
      }
    } catch (error) {
      console.error('❌ Error al sincronizar favoritos:', error)
      dispatch({ 
        type: TIPOS_ACCION.SINCRONIZAR_ERROR, 
        payload: 'Error al sincronizar favoritos' 
      })
    }
  }

  // =====================================================
  // FUNCIONES PARA LOCALSTORAGE (EXISTENTES)
  // =====================================================

  // Función para cargar favoritos desde localStorage
  const cargarFavoritosDesdeStorage = () => {
    try {
      dispatch({ type: TIPOS_ACCION.CARGAR_FAVORITOS_INICIO })
      
      const favoritosGuardados = localStorage.getItem('favoritos')
      
      if (favoritosGuardados) {
        const favoritos = JSON.parse(favoritosGuardados)
        dispatch({ 
          type: TIPOS_ACCION.CARGAR_FAVORITOS_EXITO, 
          payload: favoritos 
        })
      } else {
        dispatch({ 
          type: TIPOS_ACCION.CARGAR_FAVORITOS_EXITO, 
          payload: [] 
        })
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error)
      dispatch({ 
        type: TIPOS_ACCION.CARGAR_FAVORITOS_ERROR, 
        payload: 'Error al cargar favoritos' 
      })
    }
  }

  // Función para verificar si un producto está en favoritos
  const esFavorito = (productoId) => {
    return estado.favoritos.some(favorito => favorito.producto_id === productoId)
  }

  // Función para agregar un producto a favoritos (HÍBRIDA)
  const agregarFavorito = async (producto) => {
    try {
      // Verificar si ya está en favoritos
      if (esFavorito(producto.id)) {
        console.log('El producto ya está en favoritos')
        return false
      }

      if (sesionInicializada && usuario?.id) {
        // Usuario logueado: agregar a la base de datos
        const exito = await agregarFavoritoDB(producto.id)
        if (exito) {
          // Recargar favoritos desde la base de datos
          await sincronizarFavoritos()
          return true
        }
        return false
      } else {
        // Usuario no logueado: agregar a localStorage
        const nuevoFavorito = {
          id: Date.now().toString(),
          producto_id: producto.id,
          usuario_id: 'temp-user',
          fecha_agregado: new Date().toISOString(),
          producto_nombre: producto.nombre,
          precio: producto.precio,
          precio_original: producto.precio_original,
          imagen_principal: producto.imagen_principal || producto.imagen,
          slug: producto.slug,
          producto_imagenes: producto.producto_imagenes || null,
          disponible: producto.activo
        }

        dispatch({ 
          type: TIPOS_ACCION.AGREGAR_FAVORITO, 
          payload: nuevoFavorito 
        })

        return true
      }
    } catch (error) {
      console.error('Error al agregar favorito:', error)
      return false
    }
  }

  // Función para quitar un producto de favoritos (HÍBRIDA)
  const quitarFavorito = async (productoId) => {
    try {
      if (sesionInicializada && usuario?.id) {
        // Usuario logueado: quitar de la base de datos
        const exito = await quitarFavoritoDB(productoId)
        if (exito) {
          // Recargar favoritos desde la base de datos
          await sincronizarFavoritos()
          return true
        }
        return false
      } else {
        // Usuario no logueado: quitar de localStorage
        dispatch({ 
          type: TIPOS_ACCION.QUITAR_FAVORITO, 
          payload: productoId 
        })

        // Actualizar localStorage
        const favoritosActualizados = estado.favoritos.filter(
          favorito => favorito.producto_id !== productoId
        )
        
        if (favoritosActualizados.length === 0) {
          localStorage.removeItem('favoritos')
        } else {
          localStorage.setItem('favoritos', JSON.stringify(favoritosActualizados))
        }

        return true
      }
    } catch (error) {
      console.error('Error al quitar favorito:', error)
      return false
    }
  }

  // Función unificada para cargar favoritos
  const cargarFavoritos = async () => {
    if (sesionInicializada && usuario?.id) {
      await sincronizarFavoritos()
    } else {
      cargarFavoritosDesdeStorage()
    }
  }

  // Función para alternar favorito (agregar/quitar)
  const alternarFavorito = async (producto) => {
    if (esFavorito(producto.id)) {
      return await quitarFavorito(producto.id)
    } else {
      return await agregarFavorito(producto)
    }
  }

  // Función para limpiar todos los favoritos
  const limpiarFavoritos = () => {
    dispatch({ type: TIPOS_ACCION.LIMPIAR_FAVORITOS })
    localStorage.removeItem('favoritos')
  }

  // Función para manejar el cierre de sesión
  const manejarCierreSesion = () => {
    // Limpiar favoritos del estado
    dispatch({ type: TIPOS_ACCION.LIMPIAR_FAVORITOS })
    // No limpiar localStorage para mantener favoritos locales
  }

  // Función para obtener favoritos por página (para paginación)
  const obtenerFavoritosPaginados = (pagina = 1, limite = 12) => {
    const inicio = (pagina - 1) * limite
    const fin = inicio + limite
    return estado.favoritos.slice(inicio, fin)
  }

  // Cargar favoritos al inicializar o cuando cambie el estado de sesión
  useEffect(() => {
    cargarFavoritos()
  }, [sesionInicializada, usuario?.id])

  // Migrar favoritos cuando el usuario se loguee
  useEffect(() => {
    if (sesionInicializada && usuario?.id) {
      // Verificar si hay favoritos en localStorage para migrar
      const favoritosLocal = localStorage.getItem('favoritos')
      if (favoritosLocal) {
        migrarFavoritosADB()
      }
    }
  }, [sesionInicializada, usuario?.id])

  // Guardar favoritos en localStorage cuando cambien (solo para usuarios no logueados)
  useEffect(() => {
    if (!sesionInicializada && estado.favoritos.length > 0) {
      localStorage.setItem('favoritos', JSON.stringify(estado.favoritos))
    }
  }, [estado.favoritos, sesionInicializada])

  // Valor del contexto
  const valor = {
    // Estado
    favoritos: estado.favoritos,
    cargando: estado.cargando,
    error: estado.error,
    contadorFavoritos: estado.contadorFavoritos,
    
    // Funciones
    esFavorito,
    agregarFavorito,
    quitarFavorito,
    alternarFavorito,
    limpiarFavoritos,
    obtenerFavoritosPaginados,
    cargarFavoritosDesdeStorage,
    cargarFavoritos,
    manejarCierreSesion,
    sincronizarFavoritos
  }

  return (
    <FavoritosContext.Provider value={valor}>
      {children}
    </FavoritosContext.Provider>
  )
}

// Hook personalizado para usar el contexto
const useFavoritos = () => {
  const contexto = useContext(FavoritosContext)
  if (!contexto) {
    throw new Error('useFavoritos debe ser usado dentro de un FavoritosProvider')
  }
  return contexto
}

// Exportaciones
export { useFavoritos }
export default FavoritosProvider