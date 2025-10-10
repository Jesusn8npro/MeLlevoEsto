-- Refuerzo RLS para `carrito` usando header de sesión
-- Idempotente: elimina política permisiva y crea políticas específicas por operación
-- Requiere que el cliente envíe el header `x-session-id` con el mismo valor que `carrito.session_id`

-- 1) Asegurar RLS habilitado
ALTER TABLE public.carrito ENABLE ROW LEVEL SECURITY;

-- 2) Eliminar política permisiva previa si existiera
DROP POLICY IF EXISTS carrito_sesion_gestion ON public.carrito;

-- 3) Políticas por operación para SESSIÓN ANÓNIMA (sin auth.uid) vinculadas al header
-- SELECT
CREATE POLICY carrito_sesion_select ON public.carrito
  FOR SELECT
  USING (
    auth.uid() IS NULL
    AND session_id IS NOT NULL
    AND session_id = current_setting('request.header.x-session-id', true)
  );

-- INSERT
CREATE POLICY carrito_sesion_insert ON public.carrito
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL
    AND session_id IS NOT NULL
    AND session_id = current_setting('request.header.x-session-id', true)
  );

-- UPDATE
CREATE POLICY carrito_sesion_update ON public.carrito
  FOR UPDATE
  USING (
    auth.uid() IS NULL
    AND session_id IS NOT NULL
    AND session_id = current_setting('request.header.x-session-id', true)
  )
  WITH CHECK (
    auth.uid() IS NULL
    AND session_id IS NOT NULL
    AND session_id = current_setting('request.header.x-session-id', true)
  );

-- DELETE
CREATE POLICY carrito_sesion_delete ON public.carrito
  FOR DELETE
  USING (
    auth.uid() IS NULL
    AND session_id IS NOT NULL
    AND session_id = current_setting('request.header.x-session-id', true)
  );

-- 4) Mantener política de usuario autenticado (ya existente en rls_supabase.md)
-- Nota: si no existiera, puede crearse como:
-- CREATE POLICY carrito_usuario_gestion ON public.carrito
--   FOR ALL
--   USING (auth.uid() = usuario_id)
--   WITH CHECK (auth.uid() = usuario_id);

-- IMPORTANTE:
-- - Antes de aplicar estas políticas, configure el cliente Supabase para enviar el header
--   `x-session-id` en todas las operaciones relacionadas con `carrito` cuando el usuario no esté autenticado.
-- - Ejemplo (supabase-js v2): createClient(url, key, { global: { headers: { 'x-session-id': sessionId } } })
-- - Si el header no se envía, las operaciones anónimas sobre carrito fallarán, lo cual es correcto por seguridad.