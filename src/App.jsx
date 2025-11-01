import { Routes, Route, useLocation } from 'react-router-dom'
import HeaderPrincipal from './componentes/layout/HeaderPrincipal'
import RutaAdmin from './componentes/autenticacion/RutaAdmin'
import FavoritosProvider from './contextos/FavoritosContext'
import { CarritoProvider } from './contextos/CarritoContext'
import { ChatProvider } from './contextos/ChatContext'
// import ProteccionAvanzada from './componentes/ProteccionAvanzada' // Comentado temporalmente
import PaginaInicio from './paginas/ecommerce/PaginaInicio/PaginaInicio'
import PaginaProducto from './paginas/ecommerce/PaginaProducto/PaginaProducto'
import PaginaCategoria from './paginas/ecommerce/PaginaCategoria/PaginaCategoria'
import PaginaCarrito from './paginas/ecommerce/PaginaCarrito/PaginaCarrito'
import PaginaFavoritos from './paginas/ecommerce/PaginaFavoritos/PaginaFavoritos'
import PaginaCheckout from './paginas/ecommerce/PaginaCheckout/PaginaCheckout'
import PaginaLogin from './paginas/autenticacion/PaginaLogin/PaginaLogin'
import PaginaRegistro from './paginas/autenticacion/PaginaRegistro/PaginaRegistro'
import PaginaPerfil from './paginas/autenticacion/PaginaPerfil/PaginaPerfil'
import PaginaRestablecerContrasena from './paginas/autenticacion/PaginaResetPassword/PaginaResetPassword'
import PaginaSesionCerrada from './paginas/autenticacion/PaginaSesionCerrada/PaginaSesionCerrada'
import PaginaNoEncontrada from './paginas/sistema/PaginaNoEncontrada/PaginaNoEncontrada'
import PaginaRespuestaEpayco from './paginas/ecommerce/PaginaRespuestaEpayco/PaginaRespuestaEpayco'
import ConfirmacionEpayco from './paginas/ecommerce/ConfirmacionEpayco'
import Contacto from './paginas/empresa/Contacto/Contacto'
import QuienesSomos from './paginas/empresa/QuienesSomos/QuienesSomos'
import TerminosCondiciones from './paginas/legal/TerminosCondiciones/TerminosCondiciones'
import PoliticaPrivacidad from './paginas/legal/PoliticaPrivacidad/PoliticaPrivacidad'
import PruebaDeProducto from './paginas/ecommerce/PruebaDeProducto/PruebaDeProducto'
import PreguntasFrecuentes from './paginas/legal/PreguntasFrecuentes/PreguntasFrecuentes'
import TrabajaConNosotros from './paginas/empresa/TrabajaConNosotros/TrabajaConNosotros'
import DashboardAdmin from './paginas/admin/DashboardAdmin/DashboardAdmin'
import DisposicionAdmin from './componentes/admin/DisposicionAdmin/DisposicionAdmin'
import ListaProductos from './paginas/admin/productos/ListaProductos'
import GestionProductos from './paginas/admin/GestionProductos/GestionProductos'

import CreadorProductosPR from './paginas/admin/CreadorDeProductosPR/CreadorProductosPR'
import EditarProducto from './paginas/admin/PaginaEditarProducto/EditarProducto'
import Categorias from './paginas/admin/Categorias/Categorias'
import Pedidos from './paginas/admin/Pedidos/Pedidos'
import Inventario from './paginas/admin/Inventario/Inventario'
import Usuarios from './paginas/admin/Usuarios/Usuarios'
import AdminChats from './paginas/admin/ManejoDeChats/AdminChats'
import GenericaAdmin from './paginas/admin/GenericaAdmin'
import CalendarioTareas from './paginas/admin/calendario_tareas/CalendarioTareas'
import TableroTareas from './paginas/admin/calendario_tareas/TableroTareas'
import ManejoCupones from './paginas/admin/ManejoCupones/ManejoCupones'
import LandingProducto from './paginas/LandingProducto'
import PlantillaTemu from './componentes/landing/plantillas/PlantillaTemu/PlantillaTemu'
import PaginaTienda from './paginas/ecommerce/PaginaTienda/PaginaTienda'
import NotificacionCarritoWrapper from './componentes/ui/NotificacionCarritoWrapper'
import ChatEnVivo from './componentes/chat/ChatEnVivo'
import BotonWhatsapp from './componentes/BotonWhatsapp/BotonWhatsapp'
// import MigrarImagenes from './paginas/MigrarImagenes' // Eliminado

function App() {
  const location = useLocation()
  
  // Rutas donde NO queremos mostrar los chats (páginas de productos)
  const rutasSinChats = [
    '/landing/', // Landing de productos
    '/producto/', // Páginas individuales de productos
    '/test-sticky' // Página de prueba con PlantillaTemu
  ]
  
  // Verificar si la ruta actual es una página de producto
  const esRutaDeProducto = rutasSinChats.some(ruta => 
    location.pathname.startsWith(ruta) || location.pathname === ruta
  )
  
  return (
    <ChatProvider>
      <CarritoProvider>
        <FavoritosProvider>
        <div className="app">
        {/* Chat flotante visible en toda la aplicación EXCEPTO en páginas de productos */}
        {!esRutaDeProducto && <ChatEnVivo />}
        {/* Botón de WhatsApp flotante súper vendedor EXCEPTO en páginas de productos */}
        {!esRutaDeProducto && <BotonWhatsapp />}
        {/* <ProteccionAvanzada /> */}
        <Routes>
        {/* Admin Dashboard Real - Protegido por autenticación y rol */}
        <Route path="/admin" element={
          <RutaAdmin>
            <DashboardAdmin />
          </RutaAdmin>
        } />
        
        {/* Rutas de E-commerce Admin - Protegidas y con layout */}
        <Route path="/admin/gestion-productos" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GestionProductos />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/productos" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <ListaProductos />
            </DisposicionAdmin>
          </RutaAdmin>
        } />

        <Route path="/admin/productos/creador-pr" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <CreadorProductosPR />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/productos/editar/:slug" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <EditarProducto />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/categorias" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <Categorias />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/cupones" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <ManejoCupones />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/pedidos" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <Pedidos />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/inventario" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <Inventario />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/usuarios" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <Usuarios />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/chats" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <AdminChats />
            </DisposicionAdmin>
          </RutaAdmin>
        } />

          <Route path="/admin/calendario-tareas" element={
            <RutaAdmin>
              <DisposicionAdmin>
                <CalendarioTareas />
              </DisposicionAdmin>
            </RutaAdmin>
          } />
          <Route path="/admin/tablero-tareas" element={
            <RutaAdmin>
              <DisposicionAdmin>
                <TableroTareas />
              </DisposicionAdmin>
            </RutaAdmin>
          } />

        {/* Rutas admin adicionales para navegación completa del sidebar */}
        <Route path="/admin/calendario" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Calendario" descripcion="Vista de calendario (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/perfil" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Perfil de Usuario" descripcion="Gestión de perfil (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/elementos-formulario" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Elementos de Formulario" descripcion="Componentes de formularios (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/tablas-basicas" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Tablas Básicas" descripcion="Ejemplos de tablas (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/grafico-lineas" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Gráfico de Líneas" descripcion="Demo de gráfico de líneas (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/grafico-barras" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Gráfico de Barras" descripcion="Demo de gráfico de barras (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/alertas" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Alertas" descripcion="Componentes de alerta (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/avatares" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Avatares" descripcion="Componentes de avatar (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/insignias" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Insignias" descripcion="Componentes de insignias (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/botones" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Botones" descripcion="Componentes de botones (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/imagenes" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Imágenes" descripcion="Componentes de imágenes (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/videos" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Videos" descripcion="Componentes de video (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/iniciar-sesion" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Iniciar Sesión" descripcion="Pantalla de login demostrativa (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        <Route path="/admin/registrarse" element={
          <RutaAdmin>
            <DisposicionAdmin>
              <GenericaAdmin titulo="Registrarse" descripcion="Pantalla de registro demostrativa (pendiente)." />
            </DisposicionAdmin>
          </RutaAdmin>
        } />
        
        {/* Admin Test - Eliminado */}
        
        {/* TEST STICKY - PlantillaTemu con sticky funcional */}
        <Route path="/test-sticky" element={<PlantillaTemu producto={{
          id: 1,
          nombre: "Smartphone Galaxy Pro Max 256GB",
          precio: 2499000,
          precio_original: 3199000,
          stock: 15,
          fotos_principales: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop"
          ],
          descripcion: "El smartphone más avanzado del mercado con tecnología de última generación.",
          marca: "TechPro",
          color: "Negro",
          material: "Aluminio Premium",
          peso: 0.195,
          garantia_meses: 24,
          beneficios: ["Cámara 108MP", "Batería 5000mAh", "Pantalla AMOLED"],
          ventajas: ["Procesador rápido", "Diseño premium", "5G ultrarrápido"]
        }} />} />
        
        {/* Landing Pages - Sin header para máxima conversión */}
        <Route path="/landing/:slug" element={<LandingProducto />} />
        
        {/* Página Principal de la Tienda */}
        <Route path="/tienda" element={
          <>
            <HeaderPrincipal />
            <PaginaTienda />
          </>
        } />
        
        {/* Página de Tienda por Categoría - USA EL MISMO COMPONENTE */}
        <Route path="/tienda/categoria/:slug" element={
          <>
            <HeaderPrincipal />
            <PaginaTienda />
          </>
        } />
        
        {/* Migrar Imágenes - Eliminado */}
        
        {/* Páginas principales con HeaderPrincipal */}
        <Route path="/" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaInicio />
            </main>
          </>
        } />
        
        <Route path="/producto/:slug" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaProducto />
            </main>
          </>
        } />

        {/* Página de prueba para el nuevo componente premium */}
        <Route path="/prueba-de-producto" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PruebaDeProducto />
            </main>
          </>
        } />
        
        <Route path="/categoria/:slug" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/carrito" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCarrito />
            </main>
          </>
        } />
        
        <Route path="/favoritos" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaFavoritos />
            </main>
          </>
        } />
        
        <Route path="/checkout" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCheckout />
            </main>
          </>
        } />
        
        {/* Páginas de ePayco */}
        <Route path="/respuesta-epayco" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaRespuestaEpayco />
            </main>
          </>
        } />
        
        <Route path="/confirmacion-epayco" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <ConfirmacionEpayco />
            </main>
          </>
        } />
        
        {/* Prueba de ePayco - Solo para desarrollo */}
        {/* Autenticación */}
        <Route path="/login" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaLogin />
            </main>
          </>
        } />
        
        <Route path="/registro" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaRegistro />
            </main>
          </>
        } />
        
        <Route path="/perfil/*" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaPerfil />
            </main>
          </>
        } />

        <Route path="/restablecer-contrasena" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaRestablecerContrasena />
            </main>
          </>
        } />
        
        <Route path="/sesion-cerrada" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaSesionCerrada />
            </main>
          </>
        } />
        
        {/* Admin duplicado eliminado; ruta principal ya protegida arriba */}
        
        {/* Páginas de empresa */}
        <Route path="/contacto" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <Contacto />
            </main>
          </>
        } />
        
        <Route path="/quienes-somos" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <QuienesSomos />
            </main>
          </>
        } />
        
        <Route path="/terminos-condiciones" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <TerminosCondiciones />
            </main>
          </>
        } />
        
        <Route path="/politica-privacidad" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PoliticaPrivacidad />
            </main>
          </>
        } />
        
        <Route path="/preguntas-frecuentes" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PreguntasFrecuentes />
            </main>
          </>
        } />
        
        <Route path="/trabaja-con-nosotros" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <TrabajaConNosotros />
            </main>
          </>
        } />
        
        {/* Rutas de categorías */}
        <Route path="/ofertas" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/electronica" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/ropa" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/hogar" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/vehiculos" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/deportes" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/belleza" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        <Route path="/juguetes" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCategoria />
            </main>
          </>
        } />
        
        {/* Páginas especiales */}
        <Route path="/blog" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <div>Blog (próximamente)</div>
            </main>
          </>
        } />
        
        <Route path="/ayuda" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <div>Ayuda (próximamente)</div>
            </main>
          </>
        } />
        
        {/* 404 */}
        <Route path="*" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaNoEncontrada />
            </main>
          </>
        } />
        </Routes>
        <NotificacionCarritoWrapper />
        </div>
      </FavoritosProvider>
    </CarritoProvider>
  </ChatProvider>
  )
}

export default App
