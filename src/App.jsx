import { Routes, Route } from 'react-router-dom'
import LayoutPrincipal from './componentes/layout/LayoutPrincipal'
import PaginaInicio from './paginas/PaginaInicio'
import PaginaProducto from './paginas/PaginaProducto'
import PaginaCategoria from './paginas/PaginaCategoria'
import PaginaCarrito from './paginas/PaginaCarrito'
import PaginaCheckout from './paginas/PaginaCheckout'
import PaginaLogin from './paginas/PaginaLogin'
import PaginaRegistro from './paginas/PaginaRegistro'
import PaginaPerfil from './paginas/PaginaPerfil'
import DashboardAdmin from './paginas/admin/DashboardAdmin'
import PaginaNoEncontrada from './paginas/PaginaNoEncontrada'
import QuienesSomos from './paginas/QuienesSomos'
import Contacto from './paginas/Contacto'
import TerminosCondiciones from './paginas/TerminosCondiciones'
import PoliticaPrivacidad from './paginas/PoliticaPrivacidad'
import PreguntasFrecuentes from './paginas/PreguntasFrecuentes'
import TrabajaConNosotros from './paginas/TrabajaConNosotros'

function App() {
  return (
    <LayoutPrincipal>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/producto/:slug" element={<PaginaProducto />} />
        <Route path="/categoria/:slug" element={<PaginaCategoria />} />
        <Route path="/carrito" element={<PaginaCarrito />} />
        <Route path="/checkout" element={<PaginaCheckout />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        
        {/* Páginas de empresa */}
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotros />} />
        
        {/* Rutas protegidas */}
        <Route path="/perfil" element={<PaginaPerfil />} />
        
        {/* Rutas de administración */}
        <Route path="/admin/*" element={<DashboardAdmin />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </LayoutPrincipal>
  )
}

export default App
