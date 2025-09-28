import { ProveedorBarraLateral, useBarraLateral } from '../../contextos/ContextoBarraLateral'
import EncabezadoAdmin from './EncabezadoAdmin'
import FondoAdmin from './FondoAdmin'
import BarraLateralAdmin from './BarraLateralAdmin'

const ContenidoDisposicion = ({ children }) => {
  const { estaExpandida, estaEnHover, movilAbierto } = useBarraLateral()

  return (
    <div className="disposicion-admin">
      <div>
        <BarraLateralAdmin />
        <FondoAdmin />
      </div>
      <div
        className={`disposicion-admin-contenido ${
          estaExpandida || estaEnHover ? 'disposicion-contenido-expandido' : 'disposicion-contenido-colapsado'
        } ${movilAbierto ? 'disposicion-contenido-movil' : ''}`}
      >
        <EncabezadoAdmin />
        <div className="disposicion-admin-principal">
          {children}
        </div>
      </div>
    </div>
  )
}

const DisposicionAdmin = ({ children }) => {
  return (
    <ProveedorBarraLateral>
      <ContenidoDisposicion>{children}</ContenidoDisposicion>
    </ProveedorBarraLateral>
  )
}

export default DisposicionAdmin
