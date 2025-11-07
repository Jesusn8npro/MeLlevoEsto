-- Verificar constraint del estado en productos (versión actualizada para PostgreSQL 12+)
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'productos'::regclass 
AND conname LIKE '%estado%';

-- Verificar valores únicos actuales en estado
SELECT 
    estado,
    COUNT(*) as cantidad
FROM productos 
WHERE estado IS NOT NULL
GROUP BY estado
ORDER BY cantidad DESC;

-- Verificar estructura completa de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'productos'
ORDER BY ordinal_position;