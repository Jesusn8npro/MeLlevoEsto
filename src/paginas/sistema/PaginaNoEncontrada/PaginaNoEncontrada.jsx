import { Link } from 'react-router-dom'
import { Home, ArrowLeft, MessageCircle } from 'lucide-react'
import './PaginaNoEncontrada.css'

export default function PaginaNoEncontrada() {
  return (
    <div className="error-404-minimal">
      <div className="container-404">
        {/* Número de error */}
        <div className="error-number">
          <span className="number">404</span>
        </div>
        
        {/* Mensaje principal */}
        <div className="error-content">
          <h1 className="error-title">Página no encontrada</h1>
          <p className="error-message">
            La página que buscas no existe o fue movida.
          </p>
        </div>
        
        {/* Acciones */}
        <div className="error-actions">
          <Link to="/" className="btn-primary">
            <Home size={18} />
            Volver al inicio
          </Link>
          
          <button 
            className="btn-secondary" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Página anterior
          </button>
        </div>
        
        {/* Contacto WhatsApp */}
        <div className="whatsapp-contact">
          <p className="contact-text">¿Necesitas ayuda?</p>
          <a 
            href="https://wa.me/573214892176" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            <MessageCircle size={20} />
            <span>+57 321 489 2176</span>
          </a>
        </div>
      </div>
    </div>
  )
}
