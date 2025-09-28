-- 🚀 CONFIGURACIÓN DEL BUCKET PARA IMÁGENES DE PRODUCTOS
-- Ejecutar en Supabase SQL Editor

-- 1. Crear el bucket (si no existe)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imagenes-productos',
  'imagenes-productos', 
  true,  -- Público para acceso directo
  52428800,  -- 50MB límite por archivo
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurar políticas de acceso público
-- Política para LECTURA (cualquiera puede ver las imágenes)
CREATE POLICY "Imágenes públicas para lectura" ON storage.objects
FOR SELECT USING (bucket_id = 'imagenes-productos');

-- Política para SUBIDA (solo usuarios autenticados pueden subir)
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'imagenes-productos' 
  AND auth.role() = 'authenticated'
);

-- Política para ACTUALIZACIÓN (solo usuarios autenticados pueden actualizar)
CREATE POLICY "Usuarios autenticados pueden actualizar imágenes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'imagenes-productos' 
  AND auth.role() = 'authenticated'
);

-- Política para ELIMINACIÓN (solo usuarios autenticados pueden eliminar)
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'imagenes-productos' 
  AND auth.role() = 'authenticated'
);

-- 3. Verificar que el bucket se creó correctamente
SELECT * FROM storage.buckets WHERE id = 'imagenes-productos';
