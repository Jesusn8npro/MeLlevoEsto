-- Script para eliminar las columnas de imágenes duplicadas de la tabla productos
-- Estas columnas ya no son necesarias porque ahora usamos la tabla productos_imagenes

-- IMPORTANTE: Ejecutar este script en Supabase para limpiar la base de datos

-- 1. Eliminar columna fotos_principales
ALTER TABLE productos DROP COLUMN IF EXISTS fotos_principales;

-- 2. Eliminar columna fotos_secundarias  
ALTER TABLE productos DROP COLUMN IF EXISTS fotos_secundarias;

-- 3. Eliminar columna videos (opcional, si no la necesitas)
ALTER TABLE productos DROP COLUMN IF EXISTS videos;

-- Verificar que las columnas se eliminaron correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'productos' 
AND column_name IN ('fotos_principales', 'fotos_secundarias', 'videos');

-- El resultado debe estar vacío si las columnas se eliminaron correctamente
