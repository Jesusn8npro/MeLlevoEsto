-- Comparar URLs de diferentes productos para ver las diferencias

-- PlayStation (que SÍ funciona)
SELECT 
  'PlayStation' as producto,
  pi.imagen_principal,
  pi.imagen_secundaria_1,
  pi.imagen_secundaria_2
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.slug = 'playstation-5-edicion-lujo-vr-elite'
LIMIT 1;

-- Cannabis (que NO funciona)
SELECT 
  'Cannabis' as producto,
  pi.imagen_principal,
  pi.imagen_secundaria_1,
  pi.imagen_secundaria_2
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE p.slug = 'cannabis-recreativo-jg-pro-max'
LIMIT 1;

-- Otros productos para comparar
SELECT 
  p.nombre as producto,
  p.slug,
  pi.imagen_principal,
  CASE 
    WHEN pi.imagen_principal LIKE '%thumbnail%' THEN 'thumbnail'
    WHEN pi.imagen_principal LIKE '%file/d/%' THEN 'file/d'
    WHEN pi.imagen_principal LIKE '%drive.google.com%' THEN 'otro_drive'
    ELSE 'no_drive'
  END as tipo_url
FROM productos p
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
WHERE pi.imagen_principal IS NOT NULL
LIMIT 10;
