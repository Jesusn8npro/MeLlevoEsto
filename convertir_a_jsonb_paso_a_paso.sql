-- 🔄 CONVERTIR DATOS A JSONB PASO A PASO
-- Este script convierte los datos existentes a la nueva estructura JSONB

-- PASO 1: Crear las columnas JSONB nuevas (si no existen)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS caracteristicas_jsonb JSONB,
ADD COLUMN IF NOT EXISTS ventajas_jsonb JSONB,
ADD COLUMN IF NOT EXISTS beneficios_jsonb JSONB;

-- PASO 2: Función para convertir texto simple a estructura JSONB
create or replace function convertir_texto_a_jsonb(texto_original text, titulo_default text)
returns jsonb as $$
declare
    lineas text[];
    items_json jsonb[];
    item_text text;
    item_limpio text;
begin
    -- Si el texto es NULL o vacío, devolver estructura vacía
    if texto_original is null or trim(texto_original) = '' then
        return jsonb_build_object(
            'titulo', titulo_default,
            'items', '[]'::jsonb,
            'cta_texto', 'Ver más',
            'cta_url', '#caracteristicas'
        );
    end if;
    
    -- Dividir el texto en líneas
    lineas := string_to_array(texto_original, E'\n');
    items_json := array[]::jsonb[];
    
    -- Procesar cada línea
    foreach item_text in array lineas
    loop
        item_limpio := trim(item_text);
        -- Solo procesar líneas que no estén vacías
        if item_limpio != '' then
            items_json := array_append(items_json, jsonb_build_object(
                'titulo', item_limpio,
                'descripcion', 'Detalle de ' || item_limpio
            ));
        end if;
    end loop;
    
    return jsonb_build_object(
        'titulo', titulo_default,
        'items', to_jsonb(items_json),
        'cta_texto', 'Ver más',
        'cta_url', '#caracteristicas'
    );
end;
$$ language plpgsql;

-- PASO 3: Función para convertir arrays a estructura JSONB
create or replace function convertir_array_a_jsonb(array_original anyarray, titulo_default text)
returns jsonb as $$
declare
    items_json jsonb[];
    item_text text;
begin
    -- Si el array es NULL o vacío, devolver estructura vacía
    if array_original is null or array_length(array_original, 1) is null then
        return jsonb_build_object(
            'titulo', titulo_default,
            'items', '[]'::jsonb,
            'cta_texto', 'Ver más',
            'cta_url', '#caracteristicas'
        );
    end if;
    
    items_json := array[]::jsonb[];
    
    -- Procesar cada elemento del array
    foreach item_text in array array_original
    loop
        if item_text is not null and trim(item_text) != '' then
            items_json := array_append(items_json, jsonb_build_object(
                'titulo', trim(item_text),
                'descripcion', 'Detalle de ' || trim(item_text)
            ));
        end if;
    end loop;
    
    return jsonb_build_object(
        'titulo', titulo_default,
        'items', to_jsonb(items_json),
        'cta_texto', 'Ver más',
        'cta_url', '#caracteristicas'
    );
end;
$$ language plpgsql;

-- PASO 4: Actualizar las columnas JSONB con los datos convertidos
-- Para caracteristicas (límite de 4 items para el Hero)
UPDATE productos 
SET caracteristicas_jsonb = jsonb_build_object(
    'titulo', 'Características Principales',
    'items', CASE 
        WHEN caracteristicas IS NULL THEN '[]'::jsonb
        WHEN pg_typeof(caracteristicas) = 'text'::regtype THEN 
            (SELECT to_jsonb(array_agg(jsonb_build_object(
                'titulo', trim(linea),
                'descripcion', 'Característica: ' || trim(linea)
            ))) 
            FROM unnest(string_to_array(trim(caracteristicas::text), E'\n')) as linea 
            WHERE trim(linea) != '' LIMIT 4)
        WHEN pg_typeof(caracteristicas) = 'text[]'::regtype THEN 
            (SELECT to_jsonb(array_agg(jsonb_build_object(
                'titulo', trim(elem::text),
                'descripcion', 'Característica: ' || trim(elem::text)
            ))) 
            FROM unnest(caracteristicas::text[]) as elem 
            WHERE trim(elem::text) != '' LIMIT 4)
        ELSE '[]'::jsonb
    END,
    'cta_texto', 'Ver todas las características',
    'cta_url', '#caracteristicas'
)
WHERE caracteristicas IS NOT NULL;

-- PASO 5: Actualizar ventajas (límite de 3 items)
UPDATE productos 
SET ventajas_jsonb = jsonb_build_object(
    'titulo', 'Ventajas del Producto',
    'items', CASE 
        WHEN ventajas IS NULL THEN '[]'::jsonb
        WHEN pg_typeof(ventajas) = 'text'::regtype THEN 
            (SELECT to_jsonb(array_agg(jsonb_build_object(
                'titulo', trim(linea),
                'descripcion', 'Ventaja: ' || trim(linea)
            ))) 
            FROM unnest(string_to_array(trim(ventajas::text), E'\n')) as linea 
            WHERE trim(linea) != '' LIMIT 3)
        WHEN pg_typeof(ventajas) = 'text[]'::regtype THEN 
            (SELECT to_jsonb(array_agg(jsonb_build_object(
                'titulo', trim(elem::text),
                'descripcion', 'Ventaja: ' || trim(elem::text)
            ))) 
            FROM unnest(ventajas::text[]) as elem 
            WHERE trim(elem::text) != '' LIMIT 3)
        ELSE '[]'::jsonb
    END,
    'cta_texto', 'Descubre más ventajas',
    'cta_url', '#ventajas'
)
WHERE ventajas IS NOT NULL;

-- PASO 6: Actualizar beneficios (límite de 3 items)
UPDATE productos 
SET beneficios_jsonb = jsonb_build_object(
    'titulo', 'Beneficios para Ti',
    'items', CASE 
        WHEN beneficios IS NULL THEN '[]'::jsonb
        WHEN pg_typeof(beneficios) = 'text'::regtype THEN 
            (SELECT to_jsonb(array_agg(jsonb_build_object(
                'titulo', trim(linea),
                'descripcion', 'Beneficio: ' || trim(linea)
            ))) 
            FROM unnest(string_to_array(trim(beneficios::text), E'\n')) as linea 
            WHERE trim(linea) != '' LIMIT 3)
        WHEN pg_typeof(beneficios) = 'text[]'::regtype THEN 
            (SELECT to_jsonb(array_agg(jsonb_build_object(
                'titulo', trim(elem::text),
                'descripcion', 'Beneficio: ' || trim(elem::text)
            ))) 
            FROM unnest(beneficios::text[]) as elem 
            WHERE trim(elem::text) != '' LIMIT 3)
        ELSE '[]'::jsonb
    END,
    'cta_texto', 'Conoce todos los beneficios',
    'cta_url', '#beneficios'
)
WHERE beneficios IS NOT NULL;

-- PASO 7: Verificar el resultado
SELECT 
    nombre,
    jsonb_array_length(caracteristicas_jsonb->'items') as num_caracteristicas,
    jsonb_array_length(ventajas_jsonb->'items') as num_ventajas,
    jsonb_array_length(beneficios_jsonb->'items') as num_beneficios
FROM productos
WHERE caracteristicas_jsonb IS NOT NULL 
   OR ventajas_jsonb IS NOT NULL 
   OR beneficios_jsonb IS NOT NULL
LIMIT 10;