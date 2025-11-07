-- 📋 SCRIPT PARA VERIFICAR LA ESTRUCTURA ACTUAL DE LA TABLA PRODUCTOS
-- Ejecuta este script en el dashboard de Supabase: https://app.supabase.com/project/YOUR_PROJECT/sql

-- 1. Ver todas las columnas de la tabla productos con sus tipos de datos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'productos'
ORDER BY ordinal_position;

-- 2. Verificar si existen las columnas JSONB
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN column_name LIKE '%jsonb' THEN '✅ Columna JSONB encontrada'
        ELSE '❌ No es JSONB'
    END as estado
FROM information_schema.columns
WHERE table_name = 'productos' 
AND column_name IN ('caracteristicas_jsonb', 'ventajas_jsonb', 'beneficios_jsonb', 'caracteristicas', 'ventajas', 'beneficios');

-- 3. Ver el contenido de algunos productos para validar
SELECT 
    id,
    nombre,
    CASE WHEN caracteristicas_jsonb IS NOT NULL THEN '✅ SI' ELSE '❌ NO' END as tiene_caracteristicas_jsonb,
    CASE WHEN ventajas_jsonb IS NOT NULL THEN '✅ SI' ELSE '❌ NO' END as tiene_ventajas_jsonb,
    CASE WHEN beneficios_jsonb IS NOT NULL THEN '✅ SI' ELSE '❌ NO' END as tiene_beneficios_jsonb,
    CASE WHEN caracteristicas IS NOT NULL THEN '✅ SI' ELSE '❌ NO' END as tiene_caracteristicas_original,
    CASE WHEN ventajas IS NOT NULL THEN '✅ SI' ELSE '❌ NO' END as tiene_ventajas_original,
    CASE WHEN beneficios IS NOT NULL THEN '✅ SI' ELSE '❌ NO' END as tiene_beneficios_original
FROM productos
LIMIT 5;

-- 4. Ver ejemplo de estructura JSONB si existe
SELECT 
    nombre,
    caracteristicas_jsonb,
    ventajas_jsonb,
    beneficios_jsonb
FROM productos
WHERE caracteristicas_jsonb IS NOT NULL
LIMIT 1;