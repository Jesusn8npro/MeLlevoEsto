/**
 * Utilidad alternativa para manejar imágenes cuando Google Drive falla
 */

// Función para detectar si una URL es de Google Drive
export const esUrlGoogleDrive = (url) => {
  return url && typeof url === 'string' && url.includes('drive.google.com')
}

// Función para extraer ID de archivo de Google Drive
export const extraerIdGoogleDrive = (url) => {
  if (!url || typeof url !== 'string') return null
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

// Múltiples formatos de Google Drive para probar
export const obtenerFormatosGoogleDrive = (fileId) => {
  // Orden priorizado: formatos uc (más estables), luego thumbnail y lh3
  return [
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://docs.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?id=${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h200`,
    `https://lh3.googleusercontent.com/d/${fileId}=w400-h400`,
    `https://lh3.googleusercontent.com/d/${fileId}`
  ]
}

// Función principal que intenta múltiples formatos
export const convertirImagenConFallback = async (url) => {
  // Si no es Google Drive, devolver tal como está
  if (!esUrlGoogleDrive(url)) {
    return url
  }
  
  const fileId = extraerIdGoogleDrive(url)
  if (!fileId) {
    console.warn('No se pudo extraer ID de:', url)
    return url
  }
  
  const formatos = obtenerFormatosGoogleDrive(fileId)
  
  // Probar cada formato hasta encontrar uno que funcione
  for (const formato of formatos) {
    try {
      const funciona = await probarImagen(formato)
      if (funciona) {
        console.log('✅ Formato que funciona:', formato)
        return formato
      }
    } catch (error) {
      console.log('❌ Formato falló:', formato)
    }
  }
  
  // Si ningún formato funciona, devolver el primero como fallback
  console.warn('⚠️ Ningún formato funcionó, usando fallback')
  return formatos[0]
}

// Función para probar si una imagen carga correctamente
const probarImagen = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    const timeout = setTimeout(() => resolve(false), 5000)
    
    img.onload = () => {
      clearTimeout(timeout)
      resolve(true)
    }
    
    img.onerror = () => {
      clearTimeout(timeout)
      resolve(false)
    }
    
    img.src = url
  })
}

// Función síncrona que devuelve el mejor formato conocido
export const convertirImagenRapido = (url) => {
  if (!esUrlGoogleDrive(url)) {
    return url
  }
  
  const fileId = extraerIdGoogleDrive(url)
  if (!fileId) {
    return url
  }
  
  // Devolver el formato que más probabilidades tiene de funcionar
  // Priorizamos uc?export=view por estabilidad
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

// Función para imagen placeholder cuando falla todo
export const obtenerImagenPlaceholder = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zNDMgMTAwIDEzMCAxMzEuMzQzIDEzMCAxNzBDMTMwIDIwOC42NTcgMTYxLjM0MyAyNDAgMjAwIDI0MEM2MzguNjU3IDI0MCAyNzAgMjA4LjY1NyAyNzAgMTcwQzI3MCAxMzEuMzQzIDIzOC42NTcgMTAwIDIwMCAxMDBaIiBmaWxsPSIjRERERERGIi8+CjxwYXRoIGQ9Ik0yMDAgMTMwQzE3Ny45MDkgMTMwIDE2MCAzNDcuOTA5IDE2MCAzNzBDMTYwIDM5Mi4wOTEgMTc3LjkwOSA0MTAgMjAwIDQxMEMyMjIuMDkxIDQxMCAyNDAgMzkyLjA5MSAyNDAgMzcwQzI0MCAzNDcuOTA5IDIyMi4wOTEgMzMwIDIwMCAzMzBaIiBmaWxsPSIjQkJCQkJCIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K'
}

export default {
  convertirImagenConFallback,
  convertirImagenRapido,
  obtenerImagenPlaceholder,
  esUrlGoogleDrive,
  extraerIdGoogleDrive
}