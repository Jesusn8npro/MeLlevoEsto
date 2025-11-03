import React from 'react'
import HeroInicio from '../../../componentes/inicio/HeroInicio'
import SeccionBeneficios from '../../../componentes/inicio/SeccionBeneficios/SeccionBeneficios'
import SeccionCategorias from '../../../componentes/inicio/SeccionCategorias/SeccionCategorias'
import SeccionProductosVendidos from '../../../componentes/inicio/SeccionProductosVendidos/SeccionProductosVendidos'
import SeccionCredibilidad from '../../../componentes/inicio/SeccionCredibilidad/SeccionCredibilidad'
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

      {/* Sección de Productos Más Vendidos - Últimos productos publicados */}
      <SeccionProductosVendidos />

      {/* Sección de Credibilidad - Ultra vendedora con testimonios y garantías */}
      <SeccionCredibilidad />
    </div>
  )
}
