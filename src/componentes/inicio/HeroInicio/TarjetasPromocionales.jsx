import React from 'react'
import { Link } from 'react-router-dom'

/**
 * TarjetasPromocionales - Tarjetas del lado derecho del hero
 * 
 * Replica exactamente las dos tarjetas de la imagen, con textos en español:
 * - Tarjeta superior: Bolsos de cuero Unio (20% de descuento)
 * - Tarjeta inferior: iPhone 6+ 32Gb (40% de descuento)
 */

const TarjetasPromocionales = ({ tarjetas: tarjetasProp }) => {
  // Datos de las tarjetas promocionales por defecto
  const defaultTarjetas = [
    {
      id: 1,
      titulo: "Bolsos de cuero Unio",
      descuento: "20% de descuento",
      descripcion: "Cuero 100% hecho a mano",
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop",
      colorDescuento: "#ff6b35",
      colorFondo: "#f8f9fa",
      link: "/colecciones/bolsos-cuero"
    },
    {
      id: 2,
      titulo: "iPhone 6+ 32Gb",
      descuento: "40% de descuento",
      descripcion: "La mejor experiencia en smartphone",
      imagen: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=400&auto=format&fit=crop",
      colorDescuento: "#ff6b35",
      colorFondo: "#fff",
      link: "/productos/iphone-6-plus"
    }
  ]
  const tarjetas = Array.isArray(tarjetasProp) && tarjetasProp.length > 0 ? tarjetasProp : defaultTarjetas

  return (
    <div className="tarjetas-promocionales">
      {tarjetas.map((tarjeta) => (
        <Link
          key={tarjeta.id}
          to={tarjeta.link || '#'}
          className="tarjeta-promocional"
          style={{ 
            backgroundColor: tarjeta.colorFondo,
            backgroundImage: `url(${tarjeta.imagen})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-label={`Ver ${tarjeta.titulo} con descuento ${tarjeta.descuento}`}
        >
          {/* Contenido de texto sobre la imagen de fondo */}
          <div className="tarjeta-contenido">
            <h3 className="tarjeta-titulo">{tarjeta.titulo}</h3>
            <p className="tarjeta-descripcion">{tarjeta.descripcion}</p>
            
            {/* Badge de descuento */}
            <div 
              className="tarjeta-descuento"
              style={{ backgroundColor: tarjeta.colorDescuento }}
            >
              {tarjeta.descuento}
            </div>
          </div>

        </Link>
      ))}
    </div>
  )
}

export default TarjetasPromocionales

