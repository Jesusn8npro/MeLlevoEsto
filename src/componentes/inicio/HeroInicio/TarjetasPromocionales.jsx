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
      titulo: "",
      descuento: "",
      descripcion: "",
      imagen: "/images/Home/Banner%20de%20oferta%201.jpg",
      colorDescuento: "#ff6b35",
      colorFondo: "#fff",
      link: "/tienda"
    },
    {
      id: 2,
      titulo: "",
      descuento: "",
      descripcion: "",
      imagen: "/images/Home/Banner%202.jpg",
      colorDescuento: "#ff6b35",
      colorFondo: "#fff",
      link: "/tienda"
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
          {(tarjeta.titulo || tarjeta.descripcion || tarjeta.descuento) && (
            <div className="tarjeta-contenido">
              {tarjeta.titulo && (
                <h3 className="tarjeta-titulo">{tarjeta.titulo}</h3>
              )}
              {tarjeta.descripcion && (
                <p className="tarjeta-descripcion">{tarjeta.descripcion}</p>
              )}
              {tarjeta.descuento && (
                <div 
                  className="tarjeta-descuento"
                  style={{ backgroundColor: tarjeta.colorDescuento }}
                >
                  {tarjeta.descuento}
                </div>
              )}
            </div>
          )}

        </Link>
      ))}
    </div>
  )
}

export default TarjetasPromocionales

