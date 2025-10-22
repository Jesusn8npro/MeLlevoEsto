-- ===== SCRIPT PARA CREAR BUCKET DE IMÁGENES DE TIENDA =====
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Crear el bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imagenes_tienda',
  'imagenes_tienda', 
  true,
  52428800, -- 50MB límite por archivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- 2. Crear política para permitir SELECT (ver imágenes) a todos
CREATE POLICY "Permitir ver imágenes públicas" ON storage.objects
FOR SELECT USING (bucket_id = 'imagenes_tienda');

-- 3. Crear política para permitir INSERT (subir imágenes) a usuarios autenticados
CREATE POLICY "Permitir subir imágenes a usuarios autenticados" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'imagenes_tienda' 
  AND auth.role() = 'authenticated'
);

-- 4. Crear política para permitir UPDATE (actualizar imágenes) a usuarios autenticados
CREATE POLICY "Permitir actualizar imágenes a usuarios autenticados" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'imagenes_tienda' 
  AND auth.role() = 'authenticated'
) WITH CHECK (
  bucket_id = 'imagenes_tienda' 
  AND auth.role() = 'authenticated'
);

-- 5. Crear política para permitir DELETE (eliminar imágenes) a usuarios autenticados
CREATE POLICY "Permitir eliminar imágenes a usuarios autenticados" ON storage.objects
FOR DELETE USING (
  bucket_id = 'imagenes_tienda' 
  AND auth.role() = 'authenticated'
);

-- ===== VERIFICACIÓN =====
-- Ejecutar esta consulta para verificar que el bucket se creó correctamente
SELECT * FROM storage.buckets WHERE id = 'imagenes_tienda';

-- ===== NOTAS IMPORTANTES =====
-- 1. Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- 2. El bucket será público para ver imágenes pero requiere autenticación para subir/editar
-- 3. Límite de 50MB por archivo
-- 4. Solo acepta formatos de imagen comunes
-- 5. Después de ejecutar, actualiza el código para usar 'imagenes_tienda'