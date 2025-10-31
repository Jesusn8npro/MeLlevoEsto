-- Script para corregir políticas RLS en transacciones_epayco_logs
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar el estado actual de RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'transacciones_epayco_logs';

-- 2. Verificar políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'transacciones_epayco_logs';

-- 3. Deshabilitar RLS temporalmente para permitir inserciones desde la aplicación
ALTER TABLE public.transacciones_epayco_logs DISABLE ROW LEVEL SECURITY;

-- 4. O alternativamente, crear una política que permita inserciones públicas
-- (Descomenta las siguientes líneas si prefieres mantener RLS habilitado)

/*
-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Permitir inserción pública" ON public.transacciones_epayco_logs;
DROP POLICY IF EXISTS "Permitir lectura pública" ON public.transacciones_epayco_logs;

-- Crear política para permitir inserciones desde la aplicación
CREATE POLICY "Permitir inserción pública" 
ON public.transacciones_epayco_logs 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Crear política para permitir lectura (opcional, para debugging)
CREATE POLICY "Permitir lectura pública" 
ON public.transacciones_epayco_logs 
FOR SELECT 
TO public 
USING (true);

-- Habilitar RLS
ALTER TABLE public.transacciones_epayco_logs ENABLE ROW LEVEL SECURITY;
*/

-- 5. Verificar que la tabla existe y tiene la estructura correcta
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'transacciones_epayco_logs' 
ORDER BY ordinal_position;

-- 6. Probar inserción manual para verificar que funciona
INSERT INTO public.transacciones_epayco_logs (
    epayco_ref_payco,
    tipo_evento,
    estado_nuevo,
    datos_completos
) VALUES (
    'TEST_REF_' || extract(epoch from now()),
    'test',
    'aceptada',
    jsonb_build_object('test', true, 'timestamp', now()::text)
);

-- 7. Verificar que la inserción funcionó
SELECT COUNT(*) as total_registros 
FROM public.transacciones_epayco_logs 
WHERE tipo_evento = 'test';

-- 8. Limpiar datos de prueba
DELETE FROM public.transacciones_epayco_logs 
WHERE tipo_evento = 'test';

-- INSTRUCCIONES:
-- 1. Ejecuta este script completo en Supabase SQL Editor
-- 2. Si hay errores, revisa los mensajes y ajusta según sea necesario
-- 3. Una vez que funcione, prueba la transacción desde tu aplicación
-- 4. Si todo funciona correctamente, considera re-habilitar RLS con políticas apropiadas