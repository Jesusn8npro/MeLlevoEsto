import React, { useState, useEffect } from 'react'
import { clienteSupabase } from '../../../configuracion/supabase'
import { useAuth } from '../../../contextos/ContextoAutenticacion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Tag, 
  Eye,
  EyeOff,
<<<<<<< HEAD
  Save,
  X,
  AlertCircle,
  FolderOpen,
  Hash,
  Package
} from 'lucide-react'

import './Categorias.css'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [dragOverCategoriaId, setDragOverCategoriaId] = useState(null)
  const [asignando, setAsignando] = useState(false)
  // Selector de categorías por clic
  const [selectorCategoriasVisibleId, setSelectorCategoriasVisibleId] = useState(null)
  const [busquedaSelector, setBusquedaSelector] = useState('')

  // Productos para drag & drop
  const [productos, setProductos] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(false)
  const [busquedaProductos, setBusquedaProductos] = useState('')
  const [soloSinCategoria, setSoloSinCategoria] = useState(false)

=======
  AlertCircle,
  FolderOpen,
  Hash,
  Package,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import ModalCategoria from './ModalCategoria'
import './Categorias.css'

const Categorias = () => {
  // Estados principales
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [busquedaProductos, setBusquedaProductos] = useState('')
  const [soloSinCategoria, setSoloSinCategoria] = useState(false)

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    slug: '',
    imagen_url: '',
    icono: '',
    activo: true,
    destacado: false,
    orden: 0,
<<<<<<< HEAD
    
  })

=======
  })

  // Estados para imágenes
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [archivoImagen, setArchivoImagen] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)

  // Estados para drag & drop
  const [dragOverCategoriaId, setDragOverCategoriaId] = useState(null)
  const [asignando, setAsignando] = useState(false)

  // Estadísticas
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  const [estadisticas, setEstadisticas] = useState({
    totalCategorias: 0,
    categoriasActivas: 0,
    categoriasConProductos: 0,
    categoriasSinProductos: 0
  })

<<<<<<< HEAD
  // Estado de autenticación/rol
  const { usuario, esAdmin } = useAuth()

  useEffect(() => {
    cargarCategorias()
    cargarEstadisticas()
    cargarProductos()
  }, [])

  const cargarCategorias = async () => {
    try {
      setCargando(true)
      
=======
  const { esAdmin } = useAuth()

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    await Promise.all([
      cargarCategorias(),
      cargarEstadisticas(),
      cargarProductos()
    ])
  }

  const cargarCategorias = async () => {
    try {
      setCargando(true)
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      const { data, error } = await clienteSupabase
        .from('categorias')
        .select('id,nombre,slug,descripcion,icono,imagen_url,destacado,orden,activo,total_productos')
        .order('orden', { ascending: true })

      if (error) throw error
<<<<<<< HEAD

=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      setCategorias(data || [])
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      setError('Error al cargar las categorías')
    } finally {
      setCargando(false)
    }
  }

  const cargarEstadisticas = async () => {
    try {
<<<<<<< HEAD
      // Total de categorías
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      const { count: total } = await clienteSupabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })

<<<<<<< HEAD
      // Categorías activas
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      const { count: activas } = await clienteSupabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })
        .eq('activo', true)

<<<<<<< HEAD
      // Categorías con productos (usando total_productos)
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      const { data: categoriasConProductos } = await clienteSupabase
        .from('categorias')
        .select('id,total_productos')

      const conProductos = categoriasConProductos?.filter(cat => 
        (cat.total_productos || 0) > 0
      ).length || 0

      setEstadisticas({
        totalCategorias: total || 0,
        categoriasActivas: activas || 0,
        categoriasConProductos: conProductos,
        categoriasSinProductos: (total || 0) - conProductos
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

<<<<<<< HEAD
=======
  const cargarProductos = async () => {
    try {
      const { data, error } = await clienteSupabase
        .from('productos')
        .select('id,nombre,precio,categoria_id,activo,stock,creado_el')
        .order('creado_el', { ascending: false })
        .limit(200)

      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  // Funciones del modal
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  const abrirModal = (categoria = null) => {
    if (categoria) {
      setCategoriaEditando(categoria)
      setFormulario({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        slug: categoria.slug,
<<<<<<< HEAD
        imagen_url: categoria.imagen_url || categoria.imagen || '',
=======
        imagen_url: categoria.imagen_url || '',
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
        icono: categoria.icono || '',
        activo: categoria.activo,
        destacado: categoria.destacado || false,
        orden: categoria.orden || 0,
<<<<<<< HEAD
        
      })
=======
      })
      if (categoria.imagen_url) {
        setPreviewImagen(categoria.imagen_url)
      }
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
    } else {
      setCategoriaEditando(null)
      setFormulario({
        nombre: '',
        descripcion: '',
        slug: '',
        imagen_url: '',
        icono: '',
        activo: true,
        destacado: false,
        orden: categorias.length
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setCategoriaEditando(null)
    setError(null)
<<<<<<< HEAD
=======
    setArchivoImagen(null)
    setPreviewImagen(null)
    setSubiendoImagen(false)
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  }

  const manejarCambio = (campo, valor) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }))

<<<<<<< HEAD
    // Auto-generar slug cuando cambia el nombre
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
    if (campo === 'nombre') {
      const slug = valor
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setFormulario(prev => ({ ...prev, slug }))
    }
<<<<<<< HEAD
  }

  const validarFormulario = () => {
    const errores = []

    if (!formulario.nombre.trim()) errores.push('El nombre es requerido')
    if (!formulario.slug.trim()) errores.push('El slug es requerido')
    if (formulario.orden < 0) errores.push('El orden debe ser mayor o igual a 0')

    return errores
=======

    if (campo === 'imagen_url' && valor && !archivoImagen) {
      setPreviewImagen(valor)
    }
  }

  // Funciones para manejo de imágenes
  const manejarSeleccionArchivo = (e) => {
    const archivo = e.target.files[0]
    if (archivo) {
      procesarArchivo(archivo)
    }
  }

  const procesarArchivo = (archivo) => {
    if (!archivo.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido')
      return
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB')
      return
    }

    setArchivoImagen(archivo)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImagen(e.target.result)
    }
    reader.readAsDataURL(archivo)
  }

  const manejarDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const manejarDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const archivo = e.dataTransfer.files[0]
    if (archivo) {
      procesarArchivo(archivo)
    }
  }

  const subirImagen = async () => {
    if (!archivoImagen) return null

    try {
      setSubiendoImagen(true)
      
      const extension = archivoImagen.name.split('.').pop()
      const nombreArchivo = `categoria_${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`
      
      const { data, error } = await clienteSupabase.storage
        .from('imagenes_categorias')
        .upload(nombreArchivo, archivoImagen, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = clienteSupabase.storage
        .from('imagenes_categorias')
        .getPublicUrl(nombreArchivo)

      return publicUrl
    } catch (error) {
      console.error('Error al subir imagen:', error)
      throw new Error('Error al subir la imagen: ' + error.message)
    } finally {
      setSubiendoImagen(false)
    }
  }

  const eliminarImagen = () => {
    setArchivoImagen(null)
    setPreviewImagen(null)
    setFormulario(prev => ({ ...prev, imagen_url: '' }))
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  }

  const guardarCategoria = async (event) => {
    event.preventDefault()
    
<<<<<<< HEAD
    const errores = validarFormulario()
    if (errores.length > 0) {
      setError(errores.join(', '))
=======
    if (!formulario.nombre.trim()) {
      setError('El nombre es requerido')
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      return
    }

    setGuardando(true)
    setError(null)

    try {
<<<<<<< HEAD
      // Verificaciones de sesión y rol antes de intentar escribir (evita errores RLS)
      const { data: { session } } = await clienteSupabase.auth.getSession()
      if (!session?.user) {
        setError('Debes iniciar sesión para crear o actualizar categorías.')
        setGuardando(false)
        return
      }
      if (!esAdmin()) {
        setError('Tu usuario no tiene permisos para gestionar categorías.')
        setGuardando(false)
        return
=======
      const { data: { session } } = await clienteSupabase.auth.getSession()
      if (!session?.user || !esAdmin()) {
        setError('No tienes permisos para realizar esta acción')
        return
      }

      let imagenUrl = formulario.imagen_url

      if (archivoImagen) {
        try {
          imagenUrl = await subirImagen()
        } catch (error) {
          setError(error.message)
          return
        }
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      }

      const datosCategoria = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        slug: formulario.slug.trim(),
<<<<<<< HEAD
        imagen_url: formulario.imagen_url.trim(),
=======
        imagen_url: imagenUrl || '',
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
        icono: formulario.icono.trim(),
        activo: formulario.activo,
        destacado: formulario.destacado,
        orden: parseInt(formulario.orden)
      }

      if (categoriaEditando) {
<<<<<<< HEAD
        // Actualizar categoría existente
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
        const { error } = await clienteSupabase
          .from('categorias')
          .update(datosCategoria)
          .eq('id', categoriaEditando.id)

        if (error) throw error
      } else {
<<<<<<< HEAD
        // Crear nueva categoría
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
        const { error } = await clienteSupabase
          .from('categorias')
          .insert(datosCategoria)

        if (error) throw error
      }

<<<<<<< HEAD
      await cargarCategorias()
      await cargarEstadisticas()
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      const mensaje = (error?.message || '').includes('row-level security')
        ? 'Tu usuario no tiene permisos (RLS) para escribir en la tabla "categorias". Inicia sesión con un usuario administrador o ajusta las políticas en Supabase.'
        : 'Error al guardar la categoría: ' + error.message
      setError(mensaje)
=======
      await cargarDatos()
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      setError('Error al guardar la categoría: ' + error.message)
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
    } finally {
      setGuardando(false)
    }
  }

<<<<<<< HEAD
  // Cargar productos para asignación por drag & drop
  const cargarProductos = async () => {
    try {
      setCargandoProductos(true)
      const { data, error } = await clienteSupabase
        .from('productos')
        .select('id,nombre,precio,categoria_id,activo,stock,creado_el')
        .order('creado_el', { ascending: false })
        .limit(200)

      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setCargandoProductos(false)
    }
  }

  const manejarDragInicio = (e, producto) => {
    e.dataTransfer.setData('text/productoId', String(producto.id))
    // Fallback para compatibilidad amplia
    e.dataTransfer.setData('text/plain', String(producto.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  // Asignar producto a categoría (reutilizable por drag y por clic)
  const asignarProductoACategoria = async (productoId, categoriaId) => {
    if (!productoId) return
    if (asignando) return
    setAsignando(true)
    try {
      // Verificar sesión mínima para evitar fallos de RLS silenciosos
=======
  // Funciones para drag & drop
  const manejarDragInicio = (e, producto) => {
    e.dataTransfer.setData('text/productoId', String(producto.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  const asignarProductoACategoria = async (productoId, categoriaId) => {
    if (!productoId || asignando) return
    
    setAsignando(true)
    try {
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      const { data: { session } } = await clienteSupabase.auth.getSession()
      if (!session?.user) {
        alert('Debes iniciar sesión para actualizar productos.')
        return
      }

<<<<<<< HEAD
      // Ejecutar update y recuperar la fila actualizada para validar que se afectó
      const { data: filaActualizada, error } = await clienteSupabase
        .from('productos')
        .update({ categoria_id: categoriaId })
        .eq('id', productoId)
        .select('id,categoria_id')
        .maybeSingle()

      if (error) throw error
      if (!filaActualizada) {
        throw new Error('La actualización no afectó ninguna fila. Verifica tus permisos (RLS) y el ID del producto.')
      }

      // Actualizar en memoria
      setProductos(prev => prev.map(p => 
        String(p.id) === String(productoId) ? { ...p, categoria_id: categoriaId } : p
      ))
      await cargarCategorias()
      await cargarProductos()
    } catch (error) {
      console.error('Error al asignar producto a categoría:', error)
      const msg = (error?.message || '').toLowerCase().includes('row level')
        ? 'Tu usuario no tiene permisos (RLS) para modificar la tabla "productos". Inicia sesión como admin o ajusta las políticas en Supabase.'
        : 'No se pudo asignar el producto a la categoría. ' + (error?.message || '')
      alert(msg)
=======
      const { error } = await clienteSupabase
        .from('productos')
        .update({ categoria_id: categoriaId })
        .eq('id', productoId)

      if (error) throw error

      setProductos(prev => prev.map(p => 
        String(p.id) === String(productoId) ? { ...p, categoria_id: categoriaId } : p
      ))
      
      await cargarDatos()
    } catch (error) {
      console.error('Error al asignar producto:', error)
      alert('Error al asignar el producto a la categoría')
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
    } finally {
      setAsignando(false)
      setDragOverCategoriaId(null)
    }
  }

<<<<<<< HEAD
  // Obtener nombre de categoría por id para mostrarlo en la etiqueta azul
  const obtenerNombreCategoria = (id) => {
    if (!id) return null
    const cat = categorias.find(c => String(c.id) === String(id))
    return cat?.nombre || null
  }

  const manejarDropEnCategoria = async (e, categoria) => {
    e.preventDefault()
    let productoId = e.dataTransfer.getData('text/productoId')
    if (!productoId) {
      // Fallback
      productoId = e.dataTransfer.getData('text/plain')
    }
    if (!productoId || !categoria?.id) return
    await asignarProductoACategoria(productoId, categoria.id)
=======
  const manejarDropEnCategoria = async (e, categoria) => {
    e.preventDefault()
    const productoId = e.dataTransfer.getData('text/productoId')
    if (productoId && categoria?.id) {
      await asignarProductoACategoria(productoId, categoria.id)
    }
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  }

  const manejarDropSinCategoria = async (e) => {
    e.preventDefault()
<<<<<<< HEAD
    let productoId = e.dataTransfer.getData('text/productoId')
    if (!productoId) {
      productoId = e.dataTransfer.getData('text/plain')
    }
    if (!productoId) return
    await asignarProductoACategoria(productoId, null)
=======
    const productoId = e.dataTransfer.getData('text/productoId')
    if (productoId) {
      await asignarProductoACategoria(productoId, null)
    }
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  }

  const eliminarCategoria = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

    try {
<<<<<<< HEAD
      // Verificar si tiene productos
=======
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      const { count } = await clienteSupabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', id)

      if (count > 0) {
        alert('No se puede eliminar una categoría que tiene productos asociados')
        return
      }

      const { error } = await clienteSupabase
        .from('categorias')
        .delete()
        .eq('id', id)

      if (error) throw error

<<<<<<< HEAD
      setCategorias(categorias.filter(c => c.id !== id))
      cargarEstadisticas()
=======
      await cargarDatos()
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      alert('Error al eliminar la categoría')
    }
  }

  const alternarEstadoCategoria = async (id, estadoActual) => {
    try {
      const { error } = await clienteSupabase
        .from('categorias')
        .update({ activo: !estadoActual })
        .eq('id', id)

      if (error) throw error
<<<<<<< HEAD

      setCategorias(categorias.map(c => 
        c.id === id ? { ...c, activo: !estadoActual } : c
      ))
      cargarEstadisticas()
    } catch (error) {
      console.error('Error al cambiar estado de la categoría:', error)
=======
      await cargarDatos()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
      alert('Error al cambiar el estado de la categoría')
    }
  }

<<<<<<< HEAD
=======
  const obtenerNombreCategoria = (id) => {
    if (!id) return null
    const cat = categorias.find(c => String(c.id) === String(id))
    return cat?.nombre || null
  }

  // Filtros
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

<<<<<<< HEAD
  // Jerarquía padre-hijo deshabilitada por esquema actual
  // const categoriasRaiz = categorias
=======
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busquedaProductos.toLowerCase())
    const coincideFiltro = soloSinCategoria ? !producto.categoria_id : true
    return coincideBusqueda && coincideFiltro
  })
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)

  if (error && !modalAbierto) {
    return (
      <div className="categorias-error">
        <AlertCircle className="error-icono" />
        <h3>Error al cargar categorías</h3>
        <p>{error}</p>
<<<<<<< HEAD
        <button onClick={cargarCategorias} className="boton-reintentar">
=======
        <button onClick={cargarDatos} className="boton-reintentar">
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="categorias">
      {/* Header */}
      <div className="categorias-header">
        <div className="header-info">
          <h1 className="titulo-pagina">Gestión de Categorías</h1>
          <p className="subtitulo-pagina">
            Organiza tus productos en categorías para facilitar la navegación
          </p>
        </div>
        <div className="header-acciones">
<<<<<<< HEAD
          <button 
            onClick={() => abrirModal()}
            className="boton-primario"
          >
            <Plus className="boton-icono" />
=======
          <button onClick={() => abrirModal()} className="boton-primario">
            <Plus size={16} />
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <div className="estadistica-icono">
            <FolderOpen />
          </div>
          <div className="estadistica-contenido">
            <h3>Total Categorías</h3>
            <p className="estadistica-numero">{estadisticas.totalCategorias}</p>
            <span className="estadistica-cambio">
              {estadisticas.categoriasActivas} activas
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Tag />
          </div>
          <div className="estadistica-contenido">
            <h3>Con Productos</h3>
            <p className="estadistica-numero">{estadisticas.categoriasConProductos}</p>
            <span className="estadistica-cambio positivo">
<<<<<<< HEAD
              {((estadisticas.categoriasConProductos / estadisticas.totalCategorias) * 100).toFixed(1)}%
=======
              {estadisticas.totalCategorias > 0 ? 
                ((estadisticas.categoriasConProductos / estadisticas.totalCategorias) * 100).toFixed(1) : 0}%
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Hash />
          </div>
          <div className="estadistica-contenido">
            <h3>Sin Productos</h3>
            <p className="estadistica-numero">{estadisticas.categoriasSinProductos}</p>
            <span className="estadistica-cambio">
              Necesitan contenido
            </span>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icono">
            <Eye />
          </div>
          <div className="estadistica-contenido">
            <h3>Activas</h3>
            <p className="estadistica-numero">{estadisticas.categoriasActivas}</p>
            <span className="estadistica-cambio positivo">
              Visibles al público
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="categorias-filtros">
        <div className="filtro-busqueda">
<<<<<<< HEAD
          <Search className="filtro-icono" />
=======
          <Search size={16} />
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="categorias-contenedor">
        {cargando ? (
          <div className="cargando-categorias">
            <div className="spinner"></div>
            <p>Cargando categorías...</p>
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="categorias-vacio">
            <FolderOpen className="vacio-icono" />
            <h3>No hay categorías</h3>
            <p>Comienza creando tu primera categoría</p>
<<<<<<< HEAD
            <button 
              onClick={() => abrirModal()}
              className="boton-primario"
            >
              <Plus className="boton-icono" />
=======
            <button onClick={() => abrirModal()} className="boton-primario">
              <Plus size={16} />
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
              Nueva Categoría
            </button>
          </div>
        ) : (
          <div className="categorias-grid-lista">
            {categoriasFiltradas.map(categoria => (
              <div
                key={categoria.id}
                className={`categoria-card ${dragOverCategoriaId === categoria.id ? 'dropzone-activa' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragOverCategoriaId(categoria.id)}
                onDragLeave={() => setDragOverCategoriaId(null)}
                onDrop={(e) => manejarDropEnCategoria(e, categoria)}
              >
                <div className="categoria-imagen">
                  {categoria.imagen_url ? (
                    <img 
                      src={categoria.imagen_url} 
                      alt={categoria.nombre} 
                      className="categoria-imagen-img"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Sin+Imagen' }}
                    />
                  ) : (
                    <div className="categoria-imagen-placeholder">
                      <Tag size={24} />
                    </div>
                  )}
                  <div className="categoria-estado-overlay">
                    <button
                      onClick={() => alternarEstadoCategoria(categoria.id, categoria.activo)}
<<<<<<< HEAD
                      className={`estado-toggle ${categoria.activo ? 'activo' : 'inactivo'}`}
                      title={categoria.activo ? 'Desactivar categoría' : 'Activar categoría'}
                    >
                      {categoria.activo ? <Eye size={16} /> : <EyeOff size={16} />}
=======
                      className={`estado-boton ${categoria.activo ? 'activo' : 'inactivo'}`}
                      title={categoria.activo ? 'Desactivar categoría' : 'Activar categoría'}
                    >
                      {categoria.activo ? <Eye size={14} /> : <EyeOff size={14} />}
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
                    </button>
                  </div>
                </div>

                <div className="categoria-contenido">
<<<<<<< HEAD
                  <h4 className="categoria-nombre">{categoria.nombre}</h4>
                  <p className="categoria-slug">/{categoria.slug}</p>
                  {categoria.descripcion && (
                    <p className="categoria-descripcion">
                      {categoria.descripcion}
                    </p>
                  )}
                  
                  <div className="categoria-stats">
                    <div className="stat-item">
                      <Package size={14} />
                      <span className="stat-valor">
                        {categoria.total_productos || 0} productos
                      </span>
                    </div>
                    <div className="stat-item">
                      <Hash size={14} />
                      <span className="stat-valor">Orden {categoria.orden}</span>
                    </div>
                  </div>

                  {categoria.destacado && (
                    <div className="categoria-destacado-badge">
                      ⭐ Destacada
                    </div>
                  )}
                </div>

                <div className="categoria-card-acciones">
                  <button 
                    onClick={() => abrirModal(categoria)}
                    className="accion-boton editar"
                    title="Editar categoría"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarCategoria(categoria.id)}
                    className="accion-boton eliminar"
                    title="Eliminar categoría"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
=======
                  <div className="categoria-info">
                    <h3 className="categoria-nombre">
                      {categoria.icono && <span className="categoria-icono">{categoria.icono}</span>}
                      {categoria.nombre}
                    </h3>
                    <p className="categoria-descripcion">{categoria.descripcion}</p>
                    <div className="categoria-meta">
                      <span className="categoria-productos">
                        <Package size={12} />
                        {categoria.total_productos || 0} productos
                      </span>
                      <span className="categoria-orden">Orden: {categoria.orden}</span>
                    </div>
                  </div>

                  <div className="categoria-acciones">
                    <button 
                      onClick={() => abrirModal(categoria)}
                      className="accion-boton editar"
                      title="Editar categoría"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarCategoria(categoria.id)}
                      className="accion-boton eliminar"
                      title="Eliminar categoría"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Asignación de productos por Drag & Drop */}
      <div className="asignacion-panel">
        <div className="asignacion-col izquierda">
          <div className="asignacion-header">
            <h3>Productos</h3>
            <div className="asignacion-filtros">
              <div className="filtro-busqueda">
<<<<<<< HEAD
                <Search className="filtro-icono" />
=======
                <Search size={16} />
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busquedaProductos}
                  onChange={(e) => setBusquedaProductos(e.target.value)}
<<<<<<< HEAD
                  className="input-busqueda"
                />
              </div>
              <label className="checkbox-label">
=======
                  className="input-busqueda-pequeno"
                />
              </div>
              <label className="filtro-checkbox">
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
                <input
                  type="checkbox"
                  checked={soloSinCategoria}
                  onChange={(e) => setSoloSinCategoria(e.target.checked)}
<<<<<<< HEAD
                  className="checkbox-input"
                />
                <span className="checkbox-texto">Solo sin categoría</span>
              </label>
            </div>
          </div>

          <div className="productos-lista">
            {cargandoProductos ? (
              <div className="cargando-categorias">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
              </div>
            ) : (
              productos
                .filter(p => 
                  p.nombre.toLowerCase().includes(busquedaProductos.toLowerCase()) &&
                  (!soloSinCategoria || !p.categoria_id)
                )
                .map(producto => (
                  <div
                    key={producto.id}
                    className="producto-item"
                    draggable
                    onDragStart={(e) => manejarDragInicio(e, producto)}
                    onDragEnd={() => setDragOverCategoriaId(null)}
                    title="Arrastra este producto a una categoría"
                  >
                    <div className="producto-miniatura">
                      {producto.fotos_principales?.[0] ? (
                        <img
                          src={producto.fotos_principales[0]}
                          alt={producto.nombre}
                          className="producto-miniatura-img"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Sin+Imagen' }}
                        />
                      ) : (
                        <div className="producto-miniatura-placeholder">
                          <Package />
                        </div>
                      )}
                    </div>
                    <div className="producto-detalles">
                      <div className="producto-nombre">{producto.nombre}</div>
                      <div className="producto-extra">
                        {producto.categoria_id ? (
                          <span className="categoria-texto" title={`Categoría: ${obtenerNombreCategoria(producto.categoria_id) || ''}`}>
                            <Tag className="categoria-icono-pequeno" />
                            {obtenerNombreCategoria(producto.categoria_id) || 'Asignado'}
                          </span>
                        ) : (
                          <span className="categoria-texto categoria-texto-sin">Sin categoría</span>
                        )}
                      </div>
                      <div className="producto-acciones">
                        <button
                          type="button"
                          className="btn-cambiar-categoria"
                          onClick={() => setSelectorCategoriasVisibleId(prev => prev === producto.id ? null : producto.id)}
                          title="Cambiar categoría por clic"
                        >
                          Cambiar
                        </button>
                      </div>
                      {selectorCategoriasVisibleId === producto.id && (
                        <div className="selector-categorias-popover" role="dialog" aria-label="Selector de categorías">
                          <div className="selector-header">
                            <input
                              type="text"
                              value={busquedaSelector}
                              onChange={(e) => setBusquedaSelector(e.target.value)}
                              placeholder="Buscar categoría..."
                              className="selector-busqueda"
                            />
                            <button
                              type="button"
                              className="selector-cerrar"
                              onClick={() => { setSelectorCategoriasVisibleId(null); setBusquedaSelector('') }}
                              title="Cerrar"
                            >
                              <X />
                            </button>
                          </div>
                          <div className="selector-lista">
                            <button
                              type="button"
                              className="selector-item selector-item-sin"
                              onClick={() => { asignarProductoACategoria(producto.id, null); setSelectorCategoriasVisibleId(null) }}
                            >
                              Sin categoría
                            </button>
                            {(
                              (busquedaSelector
                                ? categorias.filter(c => c.nombre.toLowerCase().includes(busquedaSelector.toLowerCase()))
                                : categoriasFiltradas
                              )
                            ).map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                className="selector-item"
                                onClick={() => { asignarProductoACategoria(producto.id, cat.id); setSelectorCategoriasVisibleId(null) }}
                              >
                                <Tag className="categoria-icono" />
                                {cat.nombre}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
=======
                />
                Solo sin categoría
              </label>
            </div>
          </div>
          
          <div className="productos-lista">
            {productosFiltrados.map(producto => (
              <div
                key={producto.id}
                className="producto-item"
                draggable
                onDragStart={(e) => manejarDragInicio(e, producto)}
              >
                <div className="producto-info">
                  <h4>{producto.nombre}</h4>
                  <p>${producto.precio?.toLocaleString()}</p>
                </div>
                {producto.categoria_id && (
                  <span className="producto-categoria-actual">
                    {obtenerNombreCategoria(producto.categoria_id)}
                  </span>
                )}
              </div>
            ))}
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
          </div>
        </div>

        <div className="asignacion-col derecha">
          <div className="asignacion-header">
<<<<<<< HEAD
            <h3>Soltar en una Categoría</h3>
          </div>
          {/* Lista de categorías como destinos de drop */}
          <div className="dropzones-categorias-lista">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((cat) => (
                <div
                  key={cat.id}
                  className={`dropzone-categoria ${dragOverCategoriaId === cat.id ? 'dropzone-activa' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDragOverCategoriaId(cat.id)}
                  onDragLeave={() => setDragOverCategoriaId(null)}
                  onDrop={(e) => manejarDropEnCategoria(e, cat)}
                  title={`Soltar para asignar a "${cat.nombre}"`}
                >
                  <span className="dropzone-categoria-nombre">
                    <Tag className="categoria-icono" />
                    {cat.nombre}
                  </span>
                  <span className="dropzone-categoria-count">{cat.total_productos || 0} prod.</span>
                </div>
              ))
            ) : (
              <div className="categorias-vacio">
                <p>No hay categorías para mostrar</p>
              </div>
            )}
          </div>
          <div
            className="dropzone-sin-categoria"
            onDragOver={(e) => e.preventDefault()}
            onDrop={manejarDropSinCategoria}
          >
            Soltar aquí para dejar sin categoría
=======
            <h3>Zonas de Asignación</h3>
          </div>
          
          <div
            className="dropzone sin-categoria"
            onDragOver={(e) => e.preventDefault()}
            onDrop={manejarDropSinCategoria}
          >
            <Package size={24} />
            <h4>Sin Categoría</h4>
            <p>Arrastra productos aquí para quitar su categoría</p>
          </div>

          <div className="categorias-dropzones">
            {categorias.map(categoria => (
              <div
                key={categoria.id}
                className={`dropzone categoria-dropzone ${dragOverCategoriaId === categoria.id ? 'activa' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragOverCategoriaId(categoria.id)}
                onDragLeave={() => setDragOverCategoriaId(null)}
                onDrop={(e) => manejarDropEnCategoria(e, categoria)}
              >
                <Tag size={20} />
                <h4>{categoria.nombre}</h4>
                <p>{categoria.total_productos || 0} productos</p>
              </div>
            ))}
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Modal para crear/editar categoría */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <div className="modal-header">
              <h3>
                {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button 
                onClick={cerrarModal}
                className="modal-cerrar"
              >
                <X />
              </button>
            </div>

            <form onSubmit={guardarCategoria} className="modal-formulario">
              {error && (
                <div className="alerta-error">
                  <AlertCircle className="alerta-icono" />
                  <span>{error}</span>
                </div>
              )}

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">Nombre *</label>
                  <input
                    type="text"
                    value={formulario.nombre}
                    onChange={(e) => manejarCambio('nombre', e.target.value)}
                    className="campo-input"
                    placeholder="Nombre de la categoría"
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Slug *</label>
                  <input
                    type="text"
                    value={formulario.slug}
                    onChange={(e) => manejarCambio('slug', e.target.value)}
                    className="campo-input"
                    placeholder="url-amigable"
                    required
                  />
                </div>
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Descripción</label>
                <textarea
                  value={formulario.descripcion}
                  onChange={(e) => manejarCambio('descripcion', e.target.value)}
                  className="campo-textarea"
                  placeholder="Descripción de la categoría"
                  rows={3}
                />
              </div>

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">Orden</label>
                  <input
                    type="number"
                    min="0"
                    value={formulario.orden}
                    onChange={(e) => manejarCambio('orden', e.target.value)}
                    className="campo-input"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Jerarquía padre-hijo deshabilitada por esquema actual */}

              <div className="campos-fila">
                <div className="campo-grupo">
                  <label className="campo-label">URL de Imagen</label>
                  <input
                    type="url"
                    value={formulario.imagen_url}
                    onChange={(e) => manejarCambio('imagen_url', e.target.value)}
                    className="campo-input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="campo-grupo">
                  <label className="campo-label">Icono (emoji o clase CSS)</label>
                  <input
                    type="text"
                    value={formulario.icono}
                    onChange={(e) => manejarCambio('icono', e.target.value)}
                    className="campo-input"
                    placeholder="📱 o fa-mobile"
                  />
                </div>
              </div>

              {/* Campos SEO eliminados por no existir en el esquema actual */}

              <div className="campo-grupo">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formulario.activo}
                    onChange={(e) => manejarCambio('activo', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-texto">Categoría activa</span>
                </label>
              </div>

              <div className="campo-grupo">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formulario.destacado}
                    onChange={(e) => manejarCambio('destacado', e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-texto">Mostrar como destacada</span>
                </label>
              </div>

              <div className="modal-acciones">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="boton-cancelar"
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="boton-guardar"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <div className="spinner-pequeno"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="boton-icono" />
                      {categoriaEditando ? 'Actualizar' : 'Crear'} Categoría
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
=======
      {/* Modal */}
      <ModalCategoria
        modalAbierto={modalAbierto}
        categoriaEditando={categoriaEditando}
        formulario={formulario}
        guardando={guardando}
        subiendoImagen={subiendoImagen}
        archivoImagen={archivoImagen}
        previewImagen={previewImagen}
        error={error}
        onCerrar={cerrarModal}
        onGuardar={guardarCategoria}
        onCambio={manejarCambio}
        onSeleccionArchivo={manejarSeleccionArchivo}
        onDragOver={manejarDragOver}
        onDrop={manejarDrop}
        onEliminarImagen={eliminarImagen}
      />
>>>>>>> 189475c (feat: actualización de prompt y soporte de descripción JSON en UI (HeroTemu y TarjetaProductoVendedora); FAQ mínimo 5; características con 4 ítems; títulos específicos en soluciones; banner animado dinámico)
    </div>
  )
}

export default Categorias
