import React from 'react'
import { useBarraLateral } from '../../contextos/ContextoBarraLateral'

const FondoAdmin = () => {
  const { movilAbierto, alternarBarraLateralMovil } = useBarraLateral()

  return (
    <div
      className={`fondo-admin ${movilAbierto ? 'fondo-admin-mostrar' : 'fondo-admin-ocultar'}`}
      onClick={alternarBarraLateralMovil}
    ></div>
  )
}

export default FondoAdmin
