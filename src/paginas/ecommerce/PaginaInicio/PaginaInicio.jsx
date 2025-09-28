import React from 'react'
import HeroInicio from '../../../componentes/inicio/HeroInicio'
import SeccionBeneficios from '../../../componentes/inicio/SeccionBeneficios'
import SeccionCategorias from '../../../componentes/inicio/SeccionCategorias'
import SeccionProductos from '../../../componentes/inicio/SeccionProductos'
import './PaginaInicio.css'

// Página de inicio - Landing ultra vendedora
export default function PaginaInicio() {
  return (
    <div className="pagina-inicio">
      {/* Hero Section - Nuevo componente estilo Martfury */}
      <HeroInicio />

      {/* Sección de Beneficios - Estilo XStore */}
      <SeccionBeneficios />

      {/* Sección de Categorías - Con datos reales */}
      <SeccionCategorias />

      {/* Sección de Productos - Nuevos productos */}
      <SeccionProductos />
    </div>
  )
}
