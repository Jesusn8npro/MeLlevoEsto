// Constantes de la aplicación
export const CONFIGURACION = {
  nombreTienda: 'ME LLEVO ESTO',
  descripcionTienda: 'La tienda más vendedora del mercado',
  urlBase: import.meta.env.VITE_URL_BASE || 'http://localhost:3000',
  limiteProductosPorPagina: 12,
  limiteProductosCarrito: 99,
  moneda: 'COP',
  simboloMoneda: '$',
  formatoMoneda: 'es-CO'
}

// Roles de usuario
export const ROLES = {
  CLIENTE: 'cliente',
  ADMIN: 'admin',
  VENDEDOR: 'vendedor'
}

// Estados de pedidos
export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  ENVIADO: 'enviado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado'
}

// Rutas de la aplicación
export const RUTAS = {
  INICIO: '/',
  PRODUCTO: '/producto',
  CATEGORIA: '/categoria',
  CARRITO: '/carrito',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTRO: '/registro',
  PERFIL: '/perfil',
  ADMIN: '/admin'
}




























