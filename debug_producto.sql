-- SCRIPT PARA DIAGNOSTICAR PRODUCTO ESPECÍFICO
-- Ejecuta este script en Supabase SQL Editor

-- 1. Ver toda la información del producto específico
SELECT 
    id,
    nombre,
    slug,
    descripcion,
    precio,
    precio_original,
    descuento,
    categoria_id,
    vendedor_id,
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
    -- Campos JSON complejos
    puntos_dolor,
    caracteristicas,
    testimonios,
    faq,
    garantias,
    cta_final,
    promociones,
    banner_animado,
    dimensiones,
    -- Metadatos
    created_at,
    updated_at
FROM productos 
WHERE slug = 'combo-estudio-profesional-ia'  -- Cambia este slug por el del producto que estás editando
ORDER BY updated_at DESC;

-- 2. Ver las imágenes asociadas al producto
SELECT 
    pi.id,
    pi.producto_id,
    pi.url_imagen,
    pi.alt_text,
    pi.orden,
    pi.tipo_imagen,
    pi.activa,
    pi.created_at,
    pi.updated_at
FROM producto_imagenes pi
JOIN productos p ON pi.producto_id = p.id
WHERE p.slug = 'combo-estudio-profesional-ia'  -- Cambia este slug
ORDER BY pi.orden ASC;

-- 3. Verificar la estructura de los campos JSON
SELECT 
    slug,
    nombre,
    -- Verificar si los campos JSON están bien formateados
    CASE 
        WHEN puntos_dolor IS NULL THEN 'NULL'
        WHEN puntos_dolor::text = 'null' THEN 'STRING_NULL'
        WHEN json_typeof(puntos_dolor) = 'array' THEN 'ARRAY'
        WHEN json_typeof(puntos_dolor) = 'object' THEN 'OBJECT'
        ELSE 'OTHER'
    END as puntos_dolor_type,
    
    CASE 
        WHEN banner_animado IS NULL THEN 'NULL'
        WHEN banner_animado::text = 'null' THEN 'STRING_NULL'
        WHEN json_typeof(banner_animado) = 'object' THEN 'OBJECT'
        ELSE 'OTHER'
    END as banner_animado_type,
    
    CASE 
        WHEN caracteristicas IS NULL THEN 'NULL'
        WHEN caracteristicas::text = 'null' THEN 'STRING_NULL'
        WHEN json_typeof(caracteristicas) = 'array' THEN 'ARRAY'
        ELSE 'OTHER'
    END as caracteristicas_type,
    
    -- Mostrar contenido real de algunos campos
    puntos_dolor,
    banner_animado,
    caracteristicas
FROM productos 
WHERE slug = 'combo-estudio-profesional-ia';  -- Cambia este slug

-- 4. Ver historial de actualizaciones recientes
SELECT 
    slug,
    nombre,
    updated_at,
    -- Campos que podrían estar causando problemas
    banner_animado,
    puntos_dolor,
    caracteristicas
FROM productos 
WHERE slug = 'combo-estudio-profesional-ia'  -- Cambia este slug
   OR updated_at > NOW() - INTERVAL '1 hour'  -- Productos actualizados en la última hora
ORDER BY updated_at DESC;

-- 5. Verificar permisos RLS (Row Level Security)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'productos';

-- INSTRUCCIONES:
-- 1. Copia este script completo
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega el script y ejecuta cada consulta por separado
-- 4. Cambia 'combo-estudio-profesional-ia' por el slug real de tu producto
-- 5. Comparte los resultados para diagnosticar el problema