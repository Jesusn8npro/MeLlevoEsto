-- Script para corregir las políticas RLS de la tabla transacciones_epayco_logs
-- Este script soluciona el problema de inserción de datos desde React

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura de logs a usuarios autenticados" ON transacciones_epayco_logs;
DROP POLICY IF EXISTS "Permitir inserción de logs al sistema" ON transacciones_epayco_logs;

-- Crear políticas más permisivas para logs (necesario para el funcionamiento del sistema)
-- Política para SELECT: Permitir lectura tanto a usuarios autenticados como anónimos
CREATE POLICY "Permitir lectura de logs" ON transacciones_epayco_logs
    FOR SELECT USING (true);

-- Política para INSERT: Permitir inserción tanto a usuarios autenticados como anónimos
CREATE POLICY "Permitir inserción de logs" ON transacciones_epayco_logs
    FOR INSERT WITH CHECK (true);

-- Verificar que RLS esté habilitado
ALTER TABLE transacciones_epayco_logs ENABLE ROW LEVEL SECURITY;

-- Mostrar las políticas creadas
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