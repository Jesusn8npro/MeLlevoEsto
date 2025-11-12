/**
 * Configuración de seguridad para la aplicación
 * Este archivo contiene medidas de seguridad y validaciones
 */

// Validación de entrada contra XSS
export const sanitizarEntrada = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Validación de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 100;
};

// Validación de contraseña
export const validarContrasena = (contrasena) => {
  return contrasena.length >= 8 && 
         /[A-Z]/.test(contrasena) && 
         /[a-z]/.test(contrasena) && 
         /[0-9]/.test(contrasena) &&
         contrasena.length <= 128;
};

// Rate limiting simple
const intentosPorIP = new Map();
const INTENTOS_MAXIMOS = 5;
const TIEMPO_BLOQUEO = 15 * 60 * 1000; // 15 minutos

export const verificarRateLimit = (identificador) => {
  const ahora = Date.now();
  const intentos = intentosPorIP.get(identificador) || { count: 0, resetTime: ahora + TIEMPO_BLOQUEO };
  
  if (ahora > intentos.resetTime) {
    intentos.count = 0;
    intentos.resetTime = ahora + TIEMPO_BLOQUEO;
  }
  
  if (intentos.count >= INTENTOS_MAXIMOS) {
    return { permitido: false, tiempoRestante: intentos.resetTime - ahora };
  }
  
  intentos.count++;
  intentosPorIP.set(identificador, intentos);
  
  return { permitido: true };
};

// Headers de seguridad para requests
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.epayco.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co https://*.epayco.co; frame-src https://*.epayco.co;"
  };
};

// Configuración de CORS segura
export const configuracionCORS = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tudominio.com'] // Reemplazar con tu dominio real
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
  maxAge: 86400 // 24 horas
};

// Función para manejo seguro de errores
export const manejarError = (error, mostrarEnConsola = false) => {
  const errorId = crypto.randomUUID();
  
  // Log del error para debugging (solo en desarrollo)
  if (import.meta.env.DEV && mostrarEnConsola) {
    console.error(`[ERROR ${errorId}]`, error);
  }
  
  // Mensaje genérico para el usuario
  return {
    error: true,
    mensaje: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
    errorId: errorId,
    timestamp: new Date().toISOString()
  };
};

// Validación de archivos subidos
export const validarArchivo = (archivo) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!archivo) return { valido: false, error: 'No se proporcionó archivo' };
  
  if (archivo.size > MAX_SIZE) {
    return { valido: false, error: 'El archivo excede el tamaño máximo permitido (5MB)' };
  }
  
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return { valido: false, error: 'Tipo de archivo no permitido' };
  }
  
  return { valido: true };
};

// Sanitización de datos para base de datos
export const sanitizarParaBD = (datos) => {
  const datosSanitizados = {};
  
  Object.keys(datos).forEach(key => {
    const valor = datos[key];
    
    if (typeof valor === 'string') {
      datosSanitizados[key] = sanitizarEntrada(valor);
    } else if (typeof valor === 'object' && valor !== null) {
      datosSanitizados[key] = sanitizarParaBD(valor);
    } else {
      datosSanitizados[key] = valor;
    }
  });
  
  return datosSanitizados;
};