-- Diagnosticar el constraint que está fallando
-- Primero ver qué constraints tiene la tabla
SELECT 
    conname as constraint_name,
    contype,
    CASE 
        WHEN contype = 'c' THEN 'CHECK'
        WHEN contype = 'f' THEN 'FOREIGN KEY'
        WHEN contype = 'p' THEN 'PRIMARY KEY'
        WHEN contype = 'u' THEN 'UNIQUE'
        ELSE 'OTHER'
    END as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'productos'::regclass;

-- Ver el detalle del constraint específico que menciona el error
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conname = 'productos_estado_check';

-- Si no existe ese nombre exacto, buscar constraints que contengan 'estado'
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'productos'::regclass 
AND (conname LIKE '%estado%' OR pg_get_constraintdef(oid) LIKE '%estado%');