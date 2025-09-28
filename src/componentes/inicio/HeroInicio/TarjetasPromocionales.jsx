import React from 'react'

/**
 * TarjetasPromocionales - Tarjetas del lado derecho del hero
 * 
 * Replica exactamente las dos tarjetas de la imagen:
 * - Tarjeta superior: Unio Leather Bags (20% OFF)
 * - Tarjeta inferior: iPhone 6+ 32Gb (40% OFF)
 */

const TarjetasPromocionales = () => {
  // Datos de las tarjetas promocionales
  const tarjetas = [
    {
      id: 1,
      titulo: "Unio Leather Bags",
      descuento: "20% OFF",
      descripcion: "100% leather handmade",
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop",
      colorDescuento: "#ff6b35",
      colorFondo: "#f8f9fa"
    },
    {
      id: 2,
      titulo: "iPhone 6+ 32Gb",
      descuento: "40% OFF",
      descripcion: "Experience with best smartphone on the world",
      imagen: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=400&auto=format&fit=crop",
      colorDescuento: "#ff6b35",
      colorFondo: "#fff"
    }
  ]

  return (
    <div className="tarjetas-promocionales">
      {tarjetas.map((tarjeta) => (
        <div 
          key={tarjeta.id}
          className="tarjeta-promocional"
          style={{ backgroundColor: tarjeta.colorFondo }}
        >
          {/* Contenido de texto */}
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

          {/* Imagen del producto */}
          <div className="tarjeta-imagen">
            <img 
              src={tarjeta.imagen} 
              alt={tarjeta.titulo}
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default TarjetasPromocionales
