-- Verificar qué valores de estado están permitidos
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'productos'::regclass 
AND conname LIKE '%estado%';

-- Ver todos los check constraints de la tabla productos
SELECT 
    conname,
    contype,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'productos'::regclass 
AND contype = 'c';  -- 'c' es para check constraints

-- Verificar si hay un constraint tipo ENUM o CHECK específico
SELECT 
    table_name,
    column_name,
    udt_name,
    domain_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'productos' 
AND column_name = 'estado';

-- Ver valores actuales en la tabla
SELECT DISTINCT estado, COUNT(*) 
FROM productos 
GROUP BY estado 
ORDER BY estado;