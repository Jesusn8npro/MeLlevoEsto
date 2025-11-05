-- 🔍 ANALIZAR LOS DATOS ACTUALES ANTES DE MIGRAR
-- Ejecuta este script para ver qué tipo de datos tienes

-- 1. Ver el contenido actual de beneficios
SELECT 
    id,
    nombre,
    LEFT(beneficios::text, 100) as beneficios_preview,
    LENGTH(beneficios::text) as beneficios_longitud
FROM productos
WHERE beneficios IS NOT NULL
LIMIT 10;

-- 2. Ver el contenido actual de ventajas
SELECT 
    id,
    nombre,
    LEFT(ventajas::text, 100) as ventajas_preview,
    LENGTH(ventajas::text) as ventajas_longitud
FROM productos
WHERE ventajas IS NOT NULL
LIMIT 10;

-- 3. Ver el contenido actual de caracteristicas
SELECT 
    id,
    nombre,
    LEFT(caracteristicas::text, 100) as caracteristicas_preview,
    LENGTH(caracteristicas::text) as caracteristicas_longitud
FROM productos
WHERE caracteristicas IS NOT NULL
LIMIT 10;

-- 4. Ver ejemplos completos de cada tipo
SELECT 
    'beneficios' as tipo,
    beneficios::text as contenido_completo
FROM productos
WHERE beneficios IS NOT NULL
LIMIT 3
UNION ALL
SELECT 
    'ventajas' as tipo,
    ventajas::text as contenido_completo
FROM productos
WHERE ventajas IS NOT NULL
LIMIT 3
UNION ALL
SELECT 
    'caracteristicas' as tipo,
    caracteristicas::text as contenido_completo
FROM productos
WHERE caracteristicas IS NOT NULL
LIMIT 3;