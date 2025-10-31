-- Script para configurar las políticas RLS de la tabla pedidos
-- Este script permite que los usuarios puedan crear y ver sus propios pedidos

-- Habilitar RLS en la tabla pedidos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura de pedidos propios" ON pedidos;
DROP POLICY IF EXISTS "Permitir inserción de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Permitir actualización de pedidos propios" ON pedidos;
DROP POLICY IF EXISTS "Administradores acceso completo pedidos" ON pedidos;

-- Política para SELECT: Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Permitir lectura de pedidos propios" ON pedidos
    FOR SELECT USING (
        auth.uid() = usuario_id OR 
        auth.uid() IS NULL OR  -- Permitir acceso anónimo temporal
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política para INSERT: Permitir crear pedidos (tanto autenticados como anónimos)
CREATE POLICY "Permitir inserción de pedidos" ON pedidos
    FOR INSERT WITH CHECK (
        true  -- Permitir inserción libre para el proceso de pago
    );

-- Política para UPDATE: Los usuarios pueden actualizar sus propios pedidos
CREATE POLICY "Permitir actualización de pedidos propios" ON pedidos
    FOR UPDATE USING (
        auth.uid() = usuario_id OR 
        auth.uid() IS NULL OR  -- Permitir acceso anónimo temporal
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    ) WITH CHECK (
        auth.uid() = usuario_id OR 
        auth.uid() IS NULL OR  -- Permitir acceso anónimo temporal
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Política para administradores: Acceso completo
CREATE POLICY "Administradores acceso completo pedidos" ON pedidos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Verificar que las políticas se crearon correctamente
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
WHERE tablename = 'pedidos'
ORDER BY policyname;

-- Verificar que RLS esté habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'pedidos';