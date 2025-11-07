-- =============================================
-- SCRIPT PARA CREAR UN PRODUCTO DE EJEMPLO CON LA NUEVA ESTRUCTURA JSONB
-- Y VERIFICAR QUE TODO FUNCIONE CORRECTAMENTE
-- =============================================

-- INSERTAR UN PRODUCTO DE EJEMPLO CON LA ESTRUCTURA JSONB COMPLETA
INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    precio_original,
    categoria,
    marca,
    modelo,
    estado,
    stock,
    imagenes,
    caracteristicas_jsonb,
    ventajas_jsonb,
    beneficios_jsonb,
    especificaciones,
    garantia_meses,
    envio_gratis,
    destacado,
    activo
) VALUES (
    'Chevrolet Sail 2016 - Excelente Estado',
    'Chevrolet Sail 2016 en excelente estado, bajo kilometraje y perfectas condiciones. Ideal para la ciudad o viajes largos.',
    45000000,
    52000000,
    'vehiculos',
    'Chevrolet',
    'Sail',
    'excelente',
    1,
    '{
        "principal": "https://i.pinimg.com/736x/5f/5b/67/5f5b67a8b8b9c7d6e8f9a0b1c2d3e4f5.jpg",
        "galeria": [
            "https://i.pinimg.com/736x/1a/2b/3c/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6.jpg",
            "https://i.pinimg.com/736x/2b/3c/4d/2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7.jpg",
            "https://i.pinimg.com/736x/3c/4d/5e/3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8.jpg"
        ],
        "imagen_caracteristicas": "https://i.pinimg.com/736x/be/38/b2/be38b2ed0a01a5e311cfc96b692a4cf5.jpg"
    }'::jsonb,
    
    -- CARACTERÍSTICAS PARA EL HERO (máximo 4)
    '{
        "titulo": "Características Destacadas del Chevrolet Sail",
        "subtitulo": "Descubre por qué este auto es tu mejor elección",
        "detalles": [
            {
                "id": 1,
                "icono": "🚗",
                "titulo": "Excelente Estado",
                "descripcion": "Vehículo mantenido en perfectas condiciones, sin detalles"
            },
            {
                "id": 2,
                "icono": "📊",
                "titulo": "Bajo Kilometraje",
                "descripcion": "Solo 45,000 km recorridos, seminuevo"
            },
            {
                "id": 3,
                "icono": "⚙️",
                "titulo": "Transmisión Manual",
                "descripcion": "Caja de cambios manual 5 velocidades, eficiente"
            },
            {
                "id": 4,
                "icono": "🎨",
                "titulo": "Color Rojo Vibrante",
                "descripcion": "Pintura original en excelente estado"
            }
        ]
    }'::jsonb,
    
    -- VENTAJAS (columna izquierda, máximo 3)
    '{
        "titulo": "Ventajas de Elegirnos",
        "subtitulo": "Por qué somos tu mejor opción",
        "items": [
            {
                "id": 1,
                "icono": "💰",
                "titulo": "Mejor Precio del Mercado",
                "descripcion": "Te ofrecemos el precio más competitivo, garantizado"
            },
            {
                "id": 2,
                "icono": "🛡️",
                "titulo": "Garantía de Compra Segura",
                "descripcion": "Transacción 100% segura con todos los documentos en regla"
            },
            {
                "id": 3,
                "icono": "⚡",
                "titulo": "Atención Inmediata",
                "descripcion": "Respuesta rápida y proceso ágil de compraventa"
            }
        ],
        "cta": {
            "texto": "¡Quiero este auto!",
            "url": "https://wa.link/auto-ejemplo"
        }
    }'::jsonb,
    
    -- BENEFICIOS (columna derecha, máximo 3)
    '{
        "titulo": "Beneficios que Obtienes",
        "subtitulo": "Todo lo que incluye tu compra",
        "items": [
            {
                "id": 1,
                "icono": "📄",
                "titulo": "Papeles al Día",
                "descripcion": "SOAT, tecnomecánica y documentos completamente actualizados"
            },
            {
                "id": 2,
                "icono": "🔧",
                "titulo": "Revisión Mecánica Incluida",
                "descripcion": "Revisión completa antes de la entrega, sin costo adicional"
            },
            {
                "id": 3,
                "icono": "🚚",
                "titulo": "Entrega a Domicilio",
                "descripcion": "Te llevamos el auto a tu casa o trabajo, sin costo extra"
            }
        ],
        "cta": {
            "texto": "Solicitar información",
            "url": "https://wa.link/auto-info"
        }
    }'::jsonb,
    
    '{
        "año": "2016",
        "kilometraje": "45,000 km",
        "combustible": "Gasolina",
        "cilindraje": "1.4L",
        "puertas": "4",
        "pasajeros": "5",
        "aire_acondicionado": "Sí",
        "direccion": "Hidráulica",
        "radio": "AM/FM con Bluetooth",
        "airbags": "Doble airbag"
    }'::jsonb,
    
    12,  -- garantia_meses
    true, -- envio_gratis
    true, -- destacado
    true  -- activo
);

-- =============================================
-- VERIFICACIÓN DEL PRODUCTO CREADO
-- =============================================

-- Verificar que el producto se creó con la estructura correcta
SELECT 
    id,
    nombre,
    precio,
    estado,
    
    -- Verificar estructura de características
    caracteristicas_jsonb->>'titulo' as caracteristicas_titulo,
    jsonb_array_length(caracteristicas_jsonb->'detalles') as num_caracteristicas,
    
    -- Verificar estructura de ventajas
    ventajas_jsonb->>'titulo' as ventajas_titulo,
    jsonb_array_length(ventajas_jsonb->'items') as num_ventajas,
    ventajas_jsonb->'cta'->>'texto' as ventajas_cta,
    
    -- Verificar estructura de beneficios
    beneficios_jsonb->>'titulo' as beneficios_titulo,
    jsonb_array_length(beneficios_jsonb->'items') as num_beneficios,
    beneficios_jsonb->'cta'->>'texto' as beneficios_cta,
    
    created_at
FROM productos 
WHERE nombre = 'Chevrolet Sail 2016 - Excelente Estado'
ORDER BY created_at DESC
LIMIT 1;

-- Ver detalles completos del producto
SELECT 
    jsonb_pretty(caracteristicas_jsonb) as caracteristicas_completas,
    jsonb_pretty(ventajas_jsonb) as ventajas_completas,
    jsonb_pretty(beneficios_jsonb) as beneficios_completas
FROM productos 
WHERE nombre = 'Chevrolet Sail 2016 - Excelente Estado'
LIMIT 1;

-- =============================================
-- INSTRUCCIONES PARA PROBAR EN TU APLICACIÓN
-- =============================================

-- 1. Copia el ID del producto creado desde el resultado anterior
-- 2. En tu aplicación React, navega a: /producto/{id-del-producto}
-- 3. Verifica que:
--    - El Hero muestre solo 4 características
--    - La sección de características muestre:
--      * Columna izquierda: 3 ventajas con el título "Ventajas de Elegirnos"
--      * Columna derecha: 3 beneficios con el título "Beneficios que Obtienes"
--      * Imagen del producto en el centro
--    - Los botones CTA funcionen correctamente

-- Si necesitas actualizar este producto, usa:
/*
UPDATE productos SET 
    caracteristicas_jsonb = '{...}'::jsonb,
    ventajas_jsonb = '{...}'::jsonb,
    beneficios_jsonb = '{...}'::jsonb
WHERE id = 'id-del-producto';
*/