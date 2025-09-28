import { Routes, Route } from 'react-router-dom'
import HeaderPrincipal from './componentes/layout/HeaderPrincipal'
// import ProteccionAvanzada from './componentes/ProteccionAvanzada' // Comentado temporalmente
import PaginaInicio from './paginas/ecommerce/PaginaInicio/PaginaInicio'
import PaginaProducto from './paginas/ecommerce/PaginaProducto/PaginaProducto'
import PaginaCategoria from './paginas/ecommerce/PaginaCategoria/PaginaCategoria'
import PaginaCarrito from './paginas/ecommerce/PaginaCarrito/PaginaCarrito'
import PaginaCheckout from './paginas/ecommerce/PaginaCheckout/PaginaCheckout'
import PaginaLogin from './paginas/autenticacion/PaginaLogin/PaginaLogin'
import PaginaRegistro from './paginas/autenticacion/PaginaRegistro/PaginaRegistro'
import PaginaPerfil from './paginas/autenticacion/PaginaPerfil/PaginaPerfil'
import PaginaNoEncontrada from './paginas/sistema/PaginaNoEncontrada/PaginaNoEncontrada'
import Contacto from './paginas/empresa/Contacto/Contacto'
import QuienesSomos from './paginas/empresa/QuienesSomos/QuienesSomos'
import TerminosCondiciones from './paginas/legal/TerminosCondiciones/TerminosCondiciones'
import PoliticaPrivacidad from './paginas/legal/PoliticaPrivacidad/PoliticaPrivacidad'
import PreguntasFrecuentes from './paginas/legal/PreguntasFrecuentes/PreguntasFrecuentes'
import TrabajaConNosotros from './paginas/empresa/TrabajaConNosotros/TrabajaConNosotros'
import DashboardAdmin from './paginas/admin/DashboardAdmin/DashboardAdmin'
import AdminTest from './paginas/admin/AdminTest/AdminTest'
import DisposicionAdmin from './componentes/admin/DisposicionAdmin'
import ListaProductos from './paginas/admin/ecommerce/ListaProductos'
import AgregarProducto from './paginas/admin/ecommerce/AgregarProducto'
import EditarProducto from './paginas/admin/ecommerce/EditarProducto'
import Categorias from './paginas/admin/ecommerce/Categorias'
import Pedidos from './paginas/admin/ecommerce/Pedidos'
import Inventario from './paginas/admin/ecommerce/Inventario'
import LandingProducto from './paginas/LandingProducto'
import PlantillaTemu from './componentes/landing/plantillas/PlantillaTemu/PlantillaTemu'
import TestImagenes from './paginas/TestImagenes'
// import MigrarImagenes from './paginas/MigrarImagenes' // Eliminado

function App() {
  return (
    <div className="app">
      {/* <ProteccionAvanzada /> */}
      <Routes>
        {/* Admin Dashboard Real - Con autenticación */}
        <Route path="/admin" element={<DashboardAdmin />} />
        
        {/* Rutas de E-commerce Admin - Con layout de admin y autenticación */}
        <Route path="/admin/productos" element={
          <DisposicionAdmin>
            <ListaProductos />
          </DisposicionAdmin>
        } />
        <Route path="/admin/productos/agregar" element={
          <DisposicionAdmin>
            <AgregarProducto />
          </DisposicionAdmin>
        } />
        <Route path="/admin/productos/editar/:slug" element={
          <DisposicionAdmin>
            <EditarProducto />
          </DisposicionAdmin>
        } />
        <Route path="/admin/categorias" element={
          <DisposicionAdmin>
            <Categorias />
          </DisposicionAdmin>
        } />
        <Route path="/admin/pedidos" element={
          <DisposicionAdmin>
            <Pedidos />
          </DisposicionAdmin>
        } />
        <Route path="/admin/inventario" element={
          <DisposicionAdmin>
            <Inventario />
          </DisposicionAdmin>
        } />
        
        {/* Admin Test - Solo para desarrollo */}
        <Route path="/admin-test" element={<AdminTest />} />
        
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
        
        {/* Test de Imágenes */}
        <Route path="/test-imagenes" element={<TestImagenes />} />
        
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
        
        <Route path="/checkout" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaCheckout />
            </main>
          </>
        } />
        
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
        
        <Route path="/perfil" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <PaginaPerfil />
            </main>
          </>
        } />
        
        {/* Admin */}
        <Route path="/admin" element={<DashboardAdmin />} />
        
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
        <Route path="/favoritos" element={
          <>
            <HeaderPrincipal />
            <main className="contenido-principal">
              <div>Favoritos (próximamente)</div>
            </main>
          </>
        } />
        
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
    </div>
  )
}

export default App
