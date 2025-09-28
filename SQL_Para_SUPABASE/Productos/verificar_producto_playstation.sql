-- Script para verificar los datos del producto PlayStation 5 y sus imágenes

-- 1. Verificar que el producto existe
SELECT 
    id,
    nombre,
    slug,
    activo,
    precio,
    precio_original
FROM productos 
WHERE slug = 'playstation-5-edicion-lujo-vr-elite'
   OR nombre ILIKE '%PlayStation%'
   OR nombre ILIKE '%playstation%';

-- 2. Verificar las imágenes del producto
SELECT 
    pi.producto_id,
    p.nombre as producto_nombre,
    p.slug,
    pi.imagen_principal,
    pi.imagen_secundaria_1,
    pi.imagen_secundaria_2,
    pi.imagen_secundaria_3,
    pi.imagen_secundaria_4,
    pi.estado,
    pi.total_imagenes_generadas,
    pi.creado_el
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.slug = 'playstation-5-edicion-lujo-vr-elite'
   OR p.nombre ILIKE '%PlayStation%'
   OR p.nombre ILIKE '%playstation%';

-- 3. Verificar si hay registros en producto_imagenes sin relación
SELECT 
    id,
    producto_id,
    imagen_principal,
    imagen_secundaria_1,
    estado,
    creado_el
FROM producto_imagenes
ORDER BY creado_el DESC
LIMIT 10;

-- 4. Verificar la relación entre las tablas
SELECT 
    p.nombre,
    p.slug,
    CASE 
        WHEN pi.id IS NOT NULL THEN 'SÍ'
        ELSE 'NO'
    END as tiene_imagenes
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.activo = true
ORDER BY p.creado_el DESC
LIMIT 10;
