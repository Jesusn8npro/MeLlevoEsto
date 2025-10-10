-- Re-create RPC segura para migrar carrito de sesión a usuario
-- Esta función corre como SECURITY DEFINER y evita bloqueos por RLS
-- Uso: rpc('migrar_carrito_a_usuario', { p_session_id: <text>, p_usuario_id: <uuid> })

BEGIN;

-- Crear/reemplazar función
CREATE OR REPLACE FUNCTION public.migrar_carrito_a_usuario(
  p_session_id text,
  p_usuario_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_afectados integer := 0;
BEGIN
  -- Migrar filas del carrito de invitado (session_id) al usuario autenticado
  UPDATE public.carrito c
  SET usuario_id = p_usuario_id,
      session_id = NULL
  WHERE c.session_id = p_session_id
    AND c.usuario_id IS NULL;

  GET DIAGNOSTICS v_afectados = ROW_COUNT;
  RETURN v_afectados;
END;
$$;

-- Asegurar permisos de ejecución para clientes autenticados
GRANT EXECUTE ON FUNCTION public.migrar_carrito_a_usuario(text, uuid) TO authenticated;

COMMIT;

-- Notas:
-- - Esta función no requiere que el cliente tenga permisos de UPDATE sobre filas de invitado.
-- - Devuelve la cantidad de filas migradas.
-- - Mantiene el esquema simple: las filas migradas quedan con usuario_id y sin session_id.