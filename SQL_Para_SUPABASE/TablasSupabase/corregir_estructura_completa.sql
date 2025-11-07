-- =============================================
-- SCRIPT DE CORRECCIÓN COMPLETA PARA ACTUALIZAR LA ESTRUCTURA
-- EJECUTAR PASO A PASO EN ORDEN
-- =============================================

-- PASO 1: VERIFICAR ESTADO ACTUAL (ya lo hiciste)
-- Ejecuta: verificar_estructura_actual.sql

-- PASO 2: AGREGAR LAS NUEVAS COLUMNAS JSONB
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS caracteristicas_jsonb JSONB,
ADD COLUMN IF NOT EXISTS ventajas_jsonb JSONB,
ADD COLUMN IF NOT EXISTS beneficios_jsonb JSONB;

-- PASO 3: VERIFICAR QUE LAS COLUMNAS SE CREARON
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'productos' 
AND column_name IN ('caracteristicas_jsonb', 'ventajas_jsonb', 'beneficios_jsonb');

-- PASO 4: CREAR FUNCIÓN PARA CONVERTIR ARRAY A JSONB CON ESTRUCTURA CORRECTA
CREATE OR REPLACE FUNCTION convertir_array_caracteristicas_jsonb(array_data TEXT[])
RETURNS JSONB AS $$
BEGIN
    IF array_data IS NULL OR array_length(array_data, 1) IS NULL THEN
        RETURN jsonb_build_object(
            'titulo', 'Características Destacadas',
            'subtitulo', 'Descubre por qué este producto es tu mejor elección',
            'detalles', '[]'::JSONB
        );
    END IF;
    
    RETURN jsonb_build_object(
        'titulo', 'Características Destacadas',
        'subtitulo', 'Descubre por qué este producto es tu mejor elección',
        'detalles', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', i,
                    'icono', CASE 
                        WHEN i = 1 THEN '⭐'
                        WHEN i = 2 THEN '✅'
                        WHEN i = 3 THEN '💎'
                        WHEN i = 4 THEN '🚀'
                        ELSE '🔥'
                    END,
                    'titulo', elem,
                    'descripcion', 'Característica destacada del producto'
                )
            )
            FROM unnest(array_data) WITH ORDINALITY AS t(elem, i)
            WHERE i <= 4
        )
    );
END;
$$ LANGUAGE plpgsql;

-- PASO 5: CREAR FUNCIÓN PARA CONVERTIR VENTAJAS/ARRAY A JSONB
CREATE OR REPLACE FUNCTION convertir_array_ventajas_beneficios_jsonb(
    array_data TEXT[], 
    titulo_param TEXT DEFAULT 'Ventajas',
    subtitulo_param TEXT DEFAULT 'Por qué elegirnos'
)
RETURNS JSONB AS $$
BEGIN
    IF array_data IS NULL OR array_length(array_data, 1) IS NULL THEN
        RETURN jsonb_build_object(
            'titulo', titulo_param,
            'subtitulo', subtitulo_param,
            'items', '[]'::JSONB,
            'cta', jsonb_build_object('texto', 'Ver más', 'url', '#')
        );
    END IF;
    
    RETURN jsonb_build_object(
        'titulo', titulo_param,
        'subtitulo', subtitulo_param,
        'items', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', i,
                    'icono', CASE 
                        WHEN i = 1 THEN '💰'
                        WHEN i = 2 THEN '🛡️'
                        WHEN i = 3 THEN '⚡'
                        ELSE '⭐'
                    END,
                    'titulo', elem,
                    'descripcion', 'Beneficio destacado de este producto'
                )
            )
            FROM unnest(array_data) WITH ORDINALITY AS t(elem, i)
            WHERE i <= 3
        ),
        'cta', jsonb_build_object('texto', 'Ver más ventajas', 'url', '/ventajas')
    );
END;
$$ LANGUAGE plpgsql;

-- PASO 6: MIGRAR LOS DATOS EXISTENTES A LAS NUEVAS COLUMNAS
-- Para características
UPDATE productos 
SET caracteristicas_jsonb = convertir_array_caracteristicas_jsonb(caracteristicas::text[])
WHERE caracteristicas IS NOT NULL 
AND pg_typeof(caracteristicas) = 'text[]'::regtype;

-- Para ventajas
UPDATE productos 
SET ventajas_jsonb = convertir_array_ventajas_beneficios_jsonb(
    ventajas::text[], 
    'Ventajas de Elegirnos',
    'Por qué somos tu mejor opción'
)
WHERE ventajas IS NOT NULL 
AND pg_typeof(ventajas) = 'text[]'::regtype;

-- Para beneficios
UPDATE productos 
SET beneficios_jsonb = convertir_array_ventajas_beneficios_jsonb(
    beneficios::text[],
    'Beneficios que Obtienes',
    'Lo que obtienes al comprar'
)
WHERE beneficios IS NOT NULL 
AND pg_typeof(beneficios) = 'text[]'::regtype;

-- PASO 7: VERIFICAR QUE LA MIGRACIÓN FUNCIONÓ
SELECT 
    id,
    nombre,
    
    -- Verificar nuevas columnas JSONB
    CASE 
        WHEN caracteristicas_jsonb IS NOT NULL THEN '✅ SI'
        ELSE '❌ NO'
    END as tiene_caracteristicas_jsonb,
    
    CASE 
        WHEN ventajas_jsonb IS NOT NULL THEN '✅ SI'
        ELSE '❌ NO'
    END as tiene_ventajas_jsonb,
    
    CASE 
        WHEN beneficios_jsonb IS NOT NULL THEN '✅ SI'
        ELSE '❌ NO'
    END as tiene_beneficios_jsonb,
    
    -- Contar elementos
    jsonb_array_length(caracteristicas_jsonb->'detalles') as num_caracteristicas,
    jsonb_array_length(ventajas_jsonb->'items') as num_ventajas,
    jsonb_array_length(beneficios_jsonb->'items') as num_beneficios

FROM productos 
WHERE caracteristicas_jsonb IS NOT NULL 
   OR ventajas_jsonb IS NOT NULL 
   OR beneficios_jsonb IS NOT NULL
LIMIT 5;

-- PASO 8: VERIFICAR ESTRUCTURA COMPLETA DE UN PRODUCTO
SELECT 
    id,
    nombre,
    jsonb_pretty(caracteristicas_jsonb) as caracteristicas_completas,
    jsonb_pretty(ventajas_jsonb) as ventajas_completas,
    jsonb_pretty(beneficios_jsonb) as beneficios_completas
FROM productos 
WHERE caracteristicas_jsonb IS NOT NULL 
LIMIT 1;

-- PASO 9: ACTUALIZAR LA APLICACIÓN PARA USAR LAS NUEVAS COLUMNAS
-- NOTA: Esto lo haremos en el código React, no en SQL

-- PASO 10: OPCIONAL - ELIMINAR COLUMNAS ANTIGUAS (SOLO CUANDO ESTÉS 100% SEGURO)
/*
-- DESCOMENTAR Y EJECUTAR SOLO DESPUÉS DE VERIFICAR QUE TODO FUNCIONA
ALTER TABLE productos 
DROP COLUMN IF EXISTS caracteristicas,
DROP COLUMN IF EXISTS ventajas,
DROP COLUMN IF EXISTS beneficios;

-- RENOMBRAR LAS NUEVAS COLUMNAS (OPCIONAL)
ALTER TABLE productos 
RENAME COLUMN caracteristicas_jsonb TO caracteristicas,
RENAME COLUMN ventajas_jsonb TO ventajas,
RENAME COLUMN beneficios_jsonb TO beneficios;
*/