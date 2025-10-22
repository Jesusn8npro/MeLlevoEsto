-- Script para limpiar y reorganizar los campos de imágenes en la tabla producto_imagenes
-- Ejecutar en Supabase SQL Editor

-- 1. ELIMINAR CAMPOS INNECESARIOS

-- Eliminar campos de punto de dolor 3 y 4 (solo mantener 1 y 2)
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_punto_dolor_3;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_punto_dolor_4;

-- Eliminar campos de solución 3 y 4 (solo mantener 1 y 2)
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_solucion_3;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_solucion_4;

-- Eliminar campos de testimonio persona 4, 5 y 6 (solo mantener 1, 2 y 3)
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_testimonio_persona_4;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_testimonio_persona_5;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_testimonio_persona_6;

-- Eliminar campos de testimonio producto 4, 5 y 6 (solo mantener 1, 2 y 3)
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_testimonio_producto_4;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_testimonio_producto_5;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_testimonio_producto_6;

-- Eliminar campos de beneficio si existen
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_beneficio_1;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_beneficio_2;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_beneficio_3;
ALTER TABLE producto_imagenes DROP COLUMN IF EXISTS imagen_beneficio_4;

-- 2. VERIFICAR ESTRUCTURA FINAL
-- Los campos que deben quedar son:
-- - imagen_principal
-- - imagen_secundaria_1, imagen_secundaria_2, imagen_secundaria_3, imagen_secundaria_4
-- - imagen_punto_dolor_1, imagen_punto_dolor_2
-- - imagen_solucion_1, imagen_solucion_2
-- - imagen_testimonio_persona_1, imagen_testimonio_persona_2, imagen_testimonio_persona_3
-- - imagen_testimonio_producto_1, imagen_testimonio_producto_2, imagen_testimonio_producto_3
-- - imagen_caracteristicas
-- - imagen_garantias
-- - imagen_cta_final

-- 3. LIMPIAR DATOS EXISTENTES (opcional - solo si quieres borrar datos de campos eliminados)
-- UPDATE producto_imagenes SET 
--   imagen_punto_dolor_3 = NULL,
--   imagen_punto_dolor_4 = NULL,
--   imagen_solucion_3 = NULL,
--   imagen_solucion_4 = NULL,
--   imagen_testimonio_persona_4 = NULL,
--   imagen_testimonio_persona_5 = NULL,
--   imagen_testimonio_persona_6 = NULL,
--   imagen_testimonio_producto_4 = NULL,
--   imagen_testimonio_producto_5 = NULL,
--   imagen_testimonio_producto_6 = NULL;

-- 4. VERIFICAR LA ESTRUCTURA FINAL
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'producto_imagenes' 
  AND column_name LIKE 'imagen_%'
ORDER BY column_name;