import { useState } from 'react'
import { X, Search } from 'lucide-react'
import './ModalBusqueda.css'

export default function ModalBusqueda({ abierto, onCerrar }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  if (!abierto) return null

  const manejarBusqueda = (e) => {
    e.preventDefault()
    console.log('🔍 Buscando:', terminoBusqueda)
    onCerrar()
  }

  return (
    <div className="modal-busqueda-overlay" onClick={onCerrar}>
      <div className="modal-busqueda-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-busqueda-header">
          <h2>Buscar Productos</h2>
          <button onClick={onCerrar} className="cerrar-modal">
            <X />
          </button>
        </div>

        <form onSubmit={manejarBusqueda} className="modal-busqueda-form">
          <div className="busqueda-input-contenedor">
            <Search className="busqueda-icono" />
            <input
              type="text"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="modal-busqueda-input"
              autoFocus
            />
          </div>
          <button type="submit" className="buscar-boton">
            Buscar
          </button>
        </form>

        <div className="sugerencias-populares">
          <h3>Búsquedas populares:</h3>
          <div className="tags-populares">
            {['iPhone', 'Samsung', 'Ropa', 'Zapatos', 'Electrónicos'].map((tag, index) => (
              <button
                key={index}
                onClick={() => {
                  setTerminoBusqueda(tag)
                  manejarBusqueda({ preventDefault: () => {} })
                }}
                className="tag-popular"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}