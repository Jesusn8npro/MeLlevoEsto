-- Script para agregar imágenes de prueba al producto Freidora-Horno NINJA

-- 1. Primero verificar el ID del producto
SELECT id, nombre, slug FROM productos WHERE nombre ILIKE '%freidora%' OR nombre ILIKE '%ninja%';

-- 2. Actualizar las imágenes del producto (reemplaza PRODUCTO_ID con el ID real)
UPDATE producto_imagenes 
SET 
    imagen_principal = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center',
    imagen_secundaria_1 = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    imagen_secundaria_2 = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop&crop=center',
    imagen_secundaria_3 = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=400&fit=crop&crop=center',
    imagen_secundaria_4 = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&crop=center',
    imagen_punto_dolor_1 = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    imagen_punto_dolor_2 = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    imagen_punto_dolor_3 = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    imagen_punto_dolor_4 = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
    imagen_caracteristicas = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    estado = 'completado',
    total_imagenes_generadas = 10,
    actualizado_el = NOW()
WHERE producto_id = (
    SELECT id FROM productos WHERE nombre ILIKE '%freidora%' OR nombre ILIKE '%ninja%' LIMIT 1
);

-- 3. Verificar que se actualizó correctamente
SELECT 
    p.nombre,
    pi.imagen_principal,
    pi.imagen_secundaria_1,
    pi.estado,
    pi.total_imagenes_generadas
FROM productos p
JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.nombre ILIKE '%freidora%' OR p.nombre ILIKE '%ninja%';
