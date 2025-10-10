-- RLS y defaults para tabla `usuarios`
-- Idempotente: habilita RLS y crea políticas de propietario y admin

-- 1) Asegurar RLS habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 2) Limpiar políticas previas si existen
DROP POLICY IF EXISTS usuarios_select_propietario ON public.usuarios;
DROP POLICY IF EXISTS usuarios_insert_propietario ON public.usuarios;
DROP POLICY IF EXISTS usuarios_update_propietario ON public.usuarios;
DROP POLICY IF EXISTS usuarios_admin_completo ON public.usuarios;

-- 3) Políticas por propietario (usuario puede ver/crear/editar su fila)
CREATE POLICY usuarios_select_propietario ON public.usuarios
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY usuarios_insert_propietario ON public.usuarios
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY usuarios_update_propietario ON public.usuarios
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4) Política para admins (acceso completo)
CREATE POLICY usuarios_admin_completo ON public.usuarios
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid() AND u.rol = 'admin'
    )
  );

-- 5) Defaults útiles (opcionales)
ALTER TABLE public.usuarios ALTER COLUMN rol SET DEFAULT 'cliente';
ALTER TABLE public.usuarios ALTER COLUMN creado_el SET DEFAULT now();
ALTER TABLE public.usuarios ALTER COLUMN actualizado_el SET DEFAULT now();

-- Si quieres mantener actualizado `actualizado_el` en cada UPDATE, puedes crear un trigger:
-- CREATE OR REPLACE FUNCTION public.set_usuarios_actualizado_el()
-- RETURNS trigger LANGUAGE plpgsql AS $$
-- BEGIN
--   NEW.actualizado_el := now();
--   RETURN NEW;
-- END;$$;
-- DROP TRIGGER IF EXISTS set_usuarios_actualizado_el ON public.usuarios;
-- CREATE TRIGGER set_usuarios_actualizado_el
-- BEFORE UPDATE ON public.usuarios
-- FOR EACH ROW EXECUTE FUNCTION public.set_usuarios_actualizado_el();