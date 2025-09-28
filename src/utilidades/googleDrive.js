/**
 * Utilidades para manejar URLs de Google Drive
 */

/**
 * Convierte una URL de Google Drive a una URL directa de imagen
 * @param {string} url - URL original de Google Drive
 * @returns {string} - URL directa para mostrar la imagen
 */
export const convertirUrlGoogleDrive = (url) => {
  if (!url || typeof url !== 'string') {
    return url
  }

  // Si no es una URL de Google Drive, devolverla tal como está
  if (!url.includes('drive.google.com')) {
    return url
  }

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

  if (fileId) {
    // MÚLTIPLES FORMATOS DE GOOGLE DRIVE PARA EVITAR CORS
    const formatosGoogleDrive = [
      `https://lh3.googleusercontent.com/d/${fileId}=w1200-h800-no`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200-h800`,
      `https://docs.google.com/uc?export=view&id=${fileId}`
    ]
    
    // Devolver el primer formato (más compatible)
    console.log('🔄 Convirtiendo Google Drive URL:', formatosGoogleDrive[0])
    return formatosGoogleDrive[0]
  }

  // Si no se pudo extraer el ID, devolver la URL original
  console.warn('No se pudo convertir la URL de Google Drive:', url)
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
