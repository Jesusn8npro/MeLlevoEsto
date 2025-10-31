-- Script simplificado para corregir RLS en transacciones_epayco_logs
-- Ejecutar línea por línea en Supabase SQL Editor

-- PASO 1: Verificar que la tabla existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'transacciones_epayco_logs';

-- PASO 2: Verificar el estado actual de RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'transacciones_epayco_logs';

-- PASO 3: Deshabilitar RLS temporalmente (EJECUTAR SOLO ESTA LÍNEA)
ALTER TABLE public.transacciones_epayco_logs DISABLE ROW LEVEL SECURITY;

-- PASO 4: Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'transacciones_epayco_logs';

-- PASO 5: Probar inserción simple
INSERT INTO public.transacciones_epayco_logs (
    epayco_ref_payco,
    tipo_evento,
    estado_nuevo,
    datos_completos
) VALUES (
    'TEST_REF_123',
    'test',
    'aceptada',
    '{"test": true}'::jsonb
);

-- PASO 6: Verificar que la inserción funcionó
SELECT * FROM public.transacciones_epayco_logs 
WHERE tipo_evento = 'test' 
ORDER BY creado_el DESC 
LIMIT 1;

-- PASO 7: Limpiar datos de prueba
DELETE FROM public.transacciones_epayco_logs 
WHERE tipo_evento = 'test';