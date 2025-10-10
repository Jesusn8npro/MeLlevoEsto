-- Refuerzo RLS para `pedidos`: crear solo como usuario autenticado y propietario
-- Idempotente: ajusta la política de INSERT; mantiene SELECT por propietario y ALL para admin

-- 1) Asegurar RLS habilitado
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- 2) Reemplazar política de INSERT abierta por una con control de propietario
DROP POLICY IF EXISTS pedidos_usuario_crear ON public.pedidos;

-- Solo usuarios autenticados pueden crear pedidos para sí mismos
CREATE POLICY pedidos_usuario_crear ON public.pedidos
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Nota: Se mantienen sin cambios:
-- - Política de lectura del usuario: SELECT USING (auth.uid() = usuario_id)
-- - Política de administración completa para admins
-- Si no existieran, puede crearlas con:
-- CREATE POLICY pedidos_usuario_lectura ON public.pedidos FOR SELECT USING (auth.uid() = usuario_id);
-- CREATE POLICY pedidos_admin_completo ON public.pedidos FOR ALL USING (
--   EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid() AND usuarios.rol = 'admin')
-- );