-- Migración segura de carrito de session_id a usuario_id
-- Ejecutar este script en Supabase para crear la función RPC

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
  registros_afectados integer := 0;
BEGIN
  -- Validar que el usuario autenticado coincide con el usuario destino
  IF auth.uid() IS DISTINCT FROM p_usuario_id THEN
    RAISE EXCEPTION 'No autorizado: el usuario autenticado no coincide con el destino';
  END IF;

  -- Actualizar los registros del carrito de la sesión dada
  UPDATE public.carrito
  SET usuario_id = p_usuario_id,
      session_id = NULL,
      actualizado_el = now()
  WHERE session_id = p_session_id;

  GET DIAGNOSTICS registros_afectados = ROW_COUNT;
  RETURN registros_afectados;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 0;
END;
$$;

-- Nota: Esta función requiere que existan políticas RLS para permitir SELECT/UPDATE
-- bajo SECURITY DEFINER y que el rol tenga permisos adecuados.
-- Uso desde el frontend:
-- supabase.rpc('migrar_carrito_a_usuario', { p_session_id: sessionId, p_usuario_id: userId })