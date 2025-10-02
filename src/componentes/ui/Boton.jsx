// Componente de botón reutilizable
export default function Boton({ 
  children, 
  variante = 'primario', 
  tamaño = 'mediano',
  deshabilitado = false,
  cargando = false,
  onClick,
  className = '',
  ...props 
}) {
  const clasesBase = 'boton'
  const clasesVariante = `boton--${variante}`
  const clasesTamaño = `boton--${tamaño}`
  const clasesEstado = deshabilitado ? 'boton--deshabilitado' : ''
  const clasesCargando = cargando ? 'boton--cargando' : ''

  const clasesCompletas = `${clasesBase} ${clasesVariante} ${clasesTamaño} ${clasesEstado} ${clasesCargando} ${className}`.trim()

  return (
    <button
      className={clasesCompletas}
      onClick={onClick}
      disabled={deshabilitado || cargando}
      {...props}
    >
      {cargando ? 'Cargando...' : children}
    </button>
  )
}




























