import React from 'react'
import HeroInicio from '../../../componentes/inicio/HeroInicio'
import SeccionBeneficios from '../../../componentes/inicio/SeccionBeneficios/SeccionBeneficios'
import SeccionCategorias from '../../../componentes/inicio/SeccionCategorias/SeccionCategorias'
import GridProductosVendedor from '../../../componentes/producto/GridProductosVendedor'
import './PaginaInicio.css'

// Página de inicio - Landing ultra vendedora
export default function PaginaInicio() {
  return (
    <div className="pagina-inicio">
      {/* Hero Section - Nuevo componente estilo Martfury */}
      <HeroInicio />

      {/* Sección de Beneficios - Estilo XStore */}
      <SeccionBeneficios />

      {/* Sección de Categorías Populares - Estilo WoodMart */}
      <SeccionCategorias />
    </div>
  )
}
