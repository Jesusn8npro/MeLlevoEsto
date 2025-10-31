-- Script para corregir el error de políticas RLS duplicadas
-- Ejecutar este script en Supabase SQL Editor

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura de logs a usuarios autenticados" ON transacciones_epayco_logs;
DROP POLICY IF EXISTS "Permitir inserción de logs al sistema" ON transacciones_epayco_logs;

-- Crear nuevas políticas
CREATE POLICY "Permitir lectura de logs a usuarios autenticados" ON transacciones_epayco_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserción de logs al sistema" ON transacciones_epayco_logs
    FOR INSERT WITH CHECK (true);

-- Verificar que todo esté correcto
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