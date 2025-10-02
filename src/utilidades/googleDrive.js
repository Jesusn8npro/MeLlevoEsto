/**
 * Utilidades para manejar URLs de Google Drive
 */

/**
 * Función auxiliar para extraer el ID del archivo de diferentes formatos de URL de Google Drive
 * @param {string} url - URL de Google Drive
 * @returns {string|null} - ID del archivo o null si no se encuentra
 */
const extraerIdArchivo = (url) => {
  let fileId = null

  // Extraer el ID del archivo de diferentes formatos de URL
  if (url.includes('/file/d/')) {
    // Formato: https://drive.google.com/file/d/FILE_ID/view
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  } else if (url.includes('id=')) {
    // Formato: https://drive.google.com/thumbnail?id=FILE_ID
    const match = url.match(/id=([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  } else if (url.includes('/d/')) {
    // Formato alternativo: https://drive.google.com/open?id=FILE_ID
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  }

  return fileId
}

/**
 * Convierte una URL de Google Drive a una URL directa de imagen
 * @param {string} url - URL original de Google Drive
 * @returns {string} - URL directa para mostrar la imagen
 */
export const convertirUrlGoogleDrive = (url) => {
  if (!url || typeof url !== 'string') {
    console.warn('⚠️ URL inválida para convertir:', url)
    return url
  }

  // Si no es una URL de Google Drive, devolver tal como está
  if (!url.includes('drive.google.com')) {
    return url
  }

  try {
    const fileId = extraerIdArchivo(url)
    if (!fileId) {
      console.warn('⚠️ No se pudo extraer el ID del archivo de:', url)
      return url
    }

    // Usar el formato directo de Google Drive que funciona mejor
    const urlConvertida = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`
    console.log('🔄 URL convertida:', url, '->', urlConvertida)
    return urlConvertida
  } catch (error) {
    console.error('❌ Error convirtiendo URL de Google Drive:', error)
    return url
  }
}

/**
 * Convierte una URL de Google Drive con formato alternativo para casos problemáticos
 * @param {string} url - URL original de Google Drive
 * @returns {string} - URL directa alternativa
 */
export const convertirUrlGoogleDriveAlternativo = (url) => {
  if (!url || typeof url !== 'string') {
    return url
  }

  if (!url.includes('drive.google.com')) {
    return url
  }

  let fileId = null

  if (url.includes('/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  } else if (url.includes('id=')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  }

  if (fileId) {
    // Formato alternativo usando lh3.googleusercontent.com
    return `https://lh3.googleusercontent.com/d/${fileId}=w1200-h800-no`
  }

  return url
}

/**
 * Convierte un array de URLs de Google Drive
 * @param {string[]} urls - Array de URLs
 * @returns {string[]} - Array de URLs convertidas
 */
export const convertirArrayUrlsGoogleDrive = (urls) => {
  if (!Array.isArray(urls)) {
    return []
  }

  return urls
    .filter(url => url && url.trim() !== '')
    .map(url => convertirUrlGoogleDrive(url.trim()))
}

/**
 * Procesa un objeto de imágenes de producto convirtiendo las URLs de Google Drive
 * @param {Object} imagenes - Objeto con las imágenes del producto
 * @returns {Object} - Objeto con URLs convertidas
 */
export const procesarImagenesProducto = (imagenes) => {
  if (!imagenes || typeof imagenes !== 'object') {
    return {}
  }

  const imagenesConvertidas = {}

  // Procesar cada campo de imagen
  Object.keys(imagenes).forEach(campo => {
    const url = imagenes[campo]
    if (url && typeof url === 'string' && url.trim() !== '') {
      imagenesConvertidas[campo] = convertirUrlGoogleDrive(url.trim())
    } else {
      imagenesConvertidas[campo] = url
    }
  })

  return imagenesConvertidas
}

/**
 * Obtiene múltiples formatos de URL para una imagen de Google Drive
 * Útil para debugging y encontrar el formato que funciona
 * @param {string} url - URL original de Google Drive
 * @returns {Object} - Objeto con diferentes formatos
 */
export const obtenerFormatosGoogleDrive = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('drive.google.com')) {
    return { original: url }
  }

  let fileId = null

  if (url.includes('/file/d/')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  } else if (url.includes('id=')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/)
    fileId = match?.[1]
  }

  if (!fileId) {
    return { original: url }
  }

  return {
    original: url,
    fileId: fileId,
    ucExportView: `https://drive.google.com/uc?export=view&id=${fileId}`,
    ucId: `https://drive.google.com/uc?id=${fileId}`,
    lh3Basic: `https://lh3.googleusercontent.com/d/${fileId}`,
    lh3WithSize: `https://lh3.googleusercontent.com/d/${fileId}=w1200-h800-no`,
    thumbnail: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
    docsUc: `https://docs.google.com/uc?export=view&id=${fileId}`
  }
}
