-- 🎯 MIGRAR UN PRODUCTO ESPECÍFICO A LA NUEVA ESTRUCTURA
-- Usa este script para migrar un producto a la vez y verificar que funciona

-- PASO 1: Ver los datos actuales del producto
SELECT 
    id,
    nombre,
    caracteristicas,
    ventajas,
    beneficios,
    pg_typeof(caracteristicas) as tipo_caracteristicas,
    pg_typeof(ventajas) as tipo_ventajas,
    pg_typeof(beneficios) as tipo_beneficios
FROM productos 
WHERE id = 1; -- Cambia este ID por el del producto que quieres migrar

-- PASO 2: Crear función para convertir texto a JSON estructurado
create or replace function texto_a_jsonb_estructurado(texto_original text, titulo_seccion text, max_items int)
returns jsonb as $$
declare
    resultado jsonb;
    items_array jsonb[];
    lineas text[];
    linea_limpia text;
    contador int := 0;
begin
    -- Inicializar array vacío
    items_array := array[]::jsonb[];
    
    -- Si hay texto, procesarlo
    if texto_original is not null and trim(texto_original) != '' then
        -- Dividir por saltos de línea o comas
        lineas := string_to_array(texto_original, E'\n');
        
        -- Procesar cada línea
        foreach linea_limpia in array lineas
        loop
            linea_limpia := trim(linea_limpia);
            if linea_limpia != '' and contador < max_items then
                items_array := array_append(items_array, jsonb_build_object(
                    'titulo', linea_limpia,
                    'descripcion', 'Detalle: ' || linea_limpia
                ));
                contador := contador + 1;
            end if;
        end loop;
    end if;
    
    -- Si no hay items, crear algunos por defecto
    if array_length(items_array, 1) = 0 then
        items_array := array[
            jsonb_build_object('titulo', 'Característica principal', 'descripcion', 'Descripción de la característica'),
            jsonb_build_object('titulo', 'Otra característica', 'descripcion', 'Descripción adicional')
        ];
    end if;
    
    -- Construir el resultado final
    resultado := jsonb_build_object(
        'titulo', titulo_seccion,
        'items', to_jsonb(items_array),
        'cta_texto', 'Ver más',
        'cta_url', '#' || lower(replace(titulo_seccion, ' ', '_'))
    );
    
    return resultado;
end;
$$ language plpgsql;

-- PASO 3: Migrar el producto específico
UPDATE productos 
SET 
    caracteristicas_jsonb = texto_a_jsonb_estructurado(
        CASE 
            WHEN pg_typeof(caracteristicas) = 'text[]'::regtype THEN array_to_string(caracteristicas::text[], ', ')
            ELSE caracteristicas::text 
        END,
        'Características Principales',
        4
    ),
    ventajas_jsonb = texto_a_jsonb_estructurado(
        CASE 
            WHEN pg_typeof(ventajas) = 'text[]'::regtype THEN array_to_string(ventajas::text[], ', ')
            ELSE ventajas::text 
        END,
        'Ventajas del Producto',
        3
    ),
    beneficios_jsonb = texto_a_jsonb_estructurado(
        CASE 
            WHEN pg_typeof(beneficios) = 'text[]'::regtype THEN array_to_string(beneficios::text[], ', ')
            ELSE beneficios::text 
        END,
        'Beneficios para Ti',
        3
    )
WHERE id = 1; -- Cambia este ID

-- PASO 4: Verificar el resultado
SELECT 
    nombre,
    caracteristicas_jsonb->>'titulo' as titulo_caracteristicas,
    jsonb_array_length(caracteristicas_jsonb->'items') as num_caracteristicas,
    ventajas_jsonb->>'titulo' as titulo_ventajas,
    jsonb_array_length(ventajas_jsonb->'items') as num_ventajas,
    beneficios_jsonb->>'titulo' as titulo_beneficios,
    jsonb_array_length(beneficios_jsonb->'items') as num_beneficios
FROM productos 
WHERE id = 1;

-- PASO 5: Ver el contenido completo
SELECT 
    nombre,
    caracteristicas_jsonb,
    ventajas_jsonb,
    beneficios_jsonb
FROM productos 
WHERE id = 1;