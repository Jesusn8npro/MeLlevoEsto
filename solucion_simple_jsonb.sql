-- 🎯 SOLUCIÓN SIMPLE: Crear columnas JSONB con estructura básica
-- Ejecuta este script paso a paso en Supabase

-- PASO 1: Agregar las columnas JSONB nuevas
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS caracteristicas_jsonb JSONB,
ADD COLUMN IF NOT EXISTS ventajas_jsonb JSONB,
ADD COLUMN IF NOT EXISTS beneficios_jsonb JSONB;

-- PASO 2: Verificar que las columnas se crearon
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'productos' 
AND column_name IN ('caracteristicas_jsonb', 'ventajas_jsonb', 'beneficios_jsonb');

-- PASO 3: Actualizar con estructura JSON básica (SIN depender de datos anteriores)
-- Esto creará una estructura válida aunque los datos anteriores estén mal
UPDATE productos 
SET 
    caracteristicas_jsonb = jsonb_build_object(
        'titulo', 'Características Principales',
        'items', '[
            {"titulo": "Alta Calidad", "descripcion": "Producto de alta calidad y durabilidad"},
            {"titulo": "Diseño Moderno", "descripcion": "Diseño moderno y elegante"},
            {"titulo": "Fácil Uso", "descripcion": "Fácil de usar y mantener"},
            {"titulo": "Garantía Incluida", "descripcion": "Incluye garantía del fabricante"}
        ]'::jsonb,
        'cta_texto', 'Ver más características',
        'cta_url', '#caracteristicas'
    ),
    ventajas_jsonb = jsonb_build_object(
        'titulo', 'Ventajas del Producto',
        'items', '[
            {"titulo": "Precio Competitivo", "descripcion": "Mejor precio del mercado"},
            {"titulo": "Entrega Rápida", "descripcion": "Entrega en todo el país"},
            {"titulo": "Soporte Garantizado", "descripcion": "Atención al cliente personalizada"}
        ]'::jsonb,
        'cta_texto', 'Descubre más ventajas',
        'cta_url', '#ventajas'
    ),
    beneficios_jsonb = jsonb_build_object(
        'titulo', 'Beneficios para Ti',
        'items', '[
            {"titulo": "Ahorro de Tiempo", "descripcion": "Optimiza tu tiempo y esfuerzo"},
            {"titulo": "Mayor Comodidad", "descripcion": "Comodidad en cada uso"},
            {"titulo": "Resultados Garantizados", "descripcion": "Satisfacción 100% garantizada"}
        ]'::jsonb,
        'cta_texto', 'Conoce todos los beneficios',
        'cta_url', '#beneficios'
    );

-- PASO 4: Verificar que se actualizó correctamente
SELECT 
    nombre,
    jsonb_array_length(caracteristicas_jsonb->'items') as num_caracteristicas,
    jsonb_array_length(ventajas_jsonb->'items') as num_ventajas,
    jsonb_array_length(beneficios_jsonb->'items') as num_beneficios,
    caracteristicas_jsonb->>'titulo' as titulo_caracteristicas
FROM productos
LIMIT 5;

-- PASO 5: Ver un ejemplo completo
SELECT 
    nombre,
    caracteristicas_jsonb,
    ventajas_jsonb,
    beneficios_jsonb
FROM productos
LIMIT 1;