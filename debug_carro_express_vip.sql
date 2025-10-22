-- SCRIPT PARA DIAGNOSTICAR PRODUCTO: CARRO EXPRESS VIP
-- Ejecuta este script en Supabase SQL Editor

-- 1. Ver toda la información del producto Carro Express VIP
SELECT 
    id,
    nombre,
    slug,
    descripcion,
    precio,
    precio_original,
    descuento,
    categoria_id,
    stock,
    stock_minimo,
    activo,
    destacado,
    ganchos,
    ventajas,
    landing_tipo,
    peso,
    marca,
    modelo,
    color,
    talla,
    material,
    -- Campos JSON complejos (estos son los que pueden estar causando problemas)
    puntos_dolor,
    caracteristicas,
    testimonios,
    faq,
    garantias,
    cta_final,
    promociones,
    banner_animado,
    dimensiones,
    -- Metadatos de auditoría
    creado_el
FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%'
   OR descripcion ILIKE '%carro%express%vip%'
ORDER BY creado_el DESC;

-- 2. Buscar por ID específico si conoces el ID exacto
-- (Basándome en las imágenes, parece que hay varios productos relacionados)
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
WHERE id IN (
    SELECT id FROM productos 
    WHERE nombre ILIKE '%carro%' OR nombre ILIKE '%express%' OR nombre ILIKE '%vip%'
)
ORDER BY nombre;

-- 3. Ver las imágenes asociadas al Carro Express VIP
SELECT 
    pi.id,
    pi.producto_id,
    pi.url_imagen,
    pi.alt_text,
    pi.orden,
    pi.tipo_imagen,
    pi.activa,
    p.nombre as producto_nombre,
    pi.creado_el
FROM producto_imagenes pi
JOIN productos p ON pi.producto_id = p.id
WHERE p.nombre ILIKE '%carro%express%vip%' 
   OR p.slug ILIKE '%carro%express%vip%'
ORDER BY pi.orden ASC;

-- 4. Verificar la estructura específica de los campos JSON del Carro Express VIP
SELECT 
    id,
    nombre,
    slug,
    -- Verificar tipos de datos JSON
    CASE 
        WHEN puntos_dolor IS NULL THEN 'NULL'
        WHEN puntos_dolor::text = 'null' THEN 'STRING_NULL'
        WHEN json_typeof(puntos_dolor) = 'array' THEN 'ARRAY'
        WHEN json_typeof(puntos_dolor) = 'object' THEN 'OBJECT'
        ELSE 'OTHER: ' || json_typeof(puntos_dolor)
    END as puntos_dolor_type,
    
    CASE 
        WHEN banner_animado IS NULL THEN 'NULL'
        WHEN banner_animado::text = 'null' THEN 'STRING_NULL'
        WHEN json_typeof(banner_animado) = 'object' THEN 'OBJECT'
        ELSE 'OTHER: ' || json_typeof(banner_animado)
    END as banner_animado_type,
    
    CASE 
        WHEN caracteristicas IS NULL THEN 'NULL'
        WHEN caracteristicas::text = 'null' THEN 'STRING_NULL'
        WHEN json_typeof(caracteristicas) = 'array' THEN 'ARRAY'
        ELSE 'OTHER: ' || json_typeof(caracteristicas)
    END as caracteristicas_type,
    
    -- Mostrar contenido real de los campos JSON
    puntos_dolor,
    banner_animado,
    caracteristicas,
    testimonios,
    faq,
    garantias,
    cta_final,
    promociones
FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%';

-- 5. Ver detalles específicos del banner animado (si existe)
SELECT 
    id,
    nombre,
    slug,
    banner_animado,
    -- Extraer campos específicos del banner animado si es un objeto JSON
    banner_animado->>'mensajes' as banner_mensajes,
    banner_animado->>'backgroundColor' as banner_bg_color,
    banner_animado->>'textColor' as banner_text_color,
    banner_animado->>'velocidad' as banner_velocidad
FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%'
   AND banner_animado IS NOT NULL;

-- 6. Ver historial de creación del Carro Express VIP
SELECT 
    id,
    nombre,
    slug,
    creado_el,
    -- Campos que podrían estar causando problemas en la edición
    banner_animado,
    puntos_dolor,
    caracteristicas,
    activo,
    stock
FROM productos 
WHERE (nombre ILIKE '%carro%express%vip%' OR slug ILIKE '%carro%express%vip%')
   OR creado_el > NOW() - INTERVAL '2 hours'  -- Productos creados en las últimas 2 horas
ORDER BY creado_el DESC;

-- 7. Verificar la categoría del producto
SELECT 
    p.id,
    p.nombre,
    p.categoria_id,
    c.nombre as categoria_nombre,
    c.descripcion as categoria_descripcion
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.nombre ILIKE '%carro%express%vip%' 
   OR p.slug ILIKE '%carro%express%vip%';

-- 8. Contar elementos en arrays JSON (si existen)
SELECT 
    id,
    nombre,
    -- Contar elementos en arrays JSON
    CASE 
        WHEN puntos_dolor IS NOT NULL AND json_typeof(puntos_dolor) = 'array' 
        THEN json_array_length(puntos_dolor)
        ELSE 0
    END as cantidad_puntos_dolor,
    
    CASE 
        WHEN caracteristicas IS NOT NULL AND json_typeof(caracteristicas) = 'array' 
        THEN json_array_length(caracteristicas)
        ELSE 0
    END as cantidad_caracteristicas,
    
    CASE 
        WHEN testimonios IS NOT NULL AND json_typeof(testimonios) = 'array' 
        THEN json_array_length(testimonios)
        ELSE 0
    END as cantidad_testimonios,
    
    CASE 
        WHEN faq IS NOT NULL AND json_typeof(faq) = 'array' 
        THEN json_array_length(faq)
        ELSE 0
    END as cantidad_faq
FROM productos 
WHERE nombre ILIKE '%carro%express%vip%' 
   OR slug ILIKE '%carro%express%vip%';

-- INSTRUCCIONES DE USO:
-- 1. Copia este script completo
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Ejecuta cada consulta por separado (una por una)
-- 4. Los resultados te mostrarán exactamente cómo está organizada la información
-- 5. Presta especial atención a los campos JSON (puntos_dolor, banner_animado, etc.)
-- 6. Si algún campo aparece como NULL o mal formateado, esa puede ser la causa del problema

-- NOTAS IMPORTANTES:
-- - Este script busca el producto por nombre que contenga "carro", "express" o "vip"
-- - Si el nombre exacto es diferente, ajusta los filtros ILIKE
-- - Los campos JSON deben tener estructura válida para funcionar correctamente
-- - El banner_animado debe ser un objeto JSON con propiedades específicas