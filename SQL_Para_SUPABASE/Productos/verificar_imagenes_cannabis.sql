-- Verificar las imágenes del producto Cannabis
SELECT 
  p.id,
  p.nombre,
  p.slug,
  pi.imagen_principal,
  pi.imagen_secundaria_1,
  pi.imagen_secundaria_2,
  pi.imagen_secundaria_3,
  pi.imagen_secundaria_4
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.slug = 'cannabis-recreativo-jg-pro-max';

-- También verificar PlayStation para comparar
SELECT 
  p.id,
  p.nombre,
  p.slug,
  pi.imagen_principal,
  pi.imagen_secundaria_1,
  pi.imagen_secundaria_2,
  pi.imagen_secundaria_3,
  pi.imagen_secundaria_4
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.slug = 'playstation-5-edicion-lujo-vr-elite';

