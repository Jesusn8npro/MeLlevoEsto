-- SCRIPT SIMPLE PARA VER EL PRODUCTO CARRO EXPRESS VIP
-- Copia y pega esto en Supabase SQL Editor

-- Ver toda la info del producto
SELECT * FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%'
LIMIT 5;

-- Ver solo los campos importantes
SELECT 
    id,
    nombre,
    slug,
    precio,
    stock,
    activo,
    banner_animado,
    puntos_dolor,
    caracteristicas
FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%';

-- Ver solo si existe el producto
SELECT COUNT(*) as total_productos
FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%';