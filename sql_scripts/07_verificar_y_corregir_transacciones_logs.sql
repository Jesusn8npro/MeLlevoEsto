-- =====================================================
-- SCRIPT PARA VERIFICAR Y CORREGIR TABLA TRANSACCIONES_EPAYCO_LOGS
-- =====================================================

-- 1. VERIFICAR ESTRUCTURA ACTUAL DE LA TABLA
-- =====================================================
SELECT 
    column_name AS nombre_columna, 
    data_type AS tipo_dato, 
    is_nullable AS acepta_nulos, 
    column_default AS valor_por_defecto
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'transacciones_epayco_logs' 
ORDER BY ordinal_position;

-- =====================================================
-- 2. VERIFICAR POLÍTICAS RLS ACTUALES
-- =====================================================
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

-- =====================================================
-- 3. VERIFICAR SI RLS ESTÁ HABILITADO
-- =====================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE tablename = 'transacciones_epayco_logs';

-- =====================================================
-- 4. LIMPIAR DATOS DE PRUEBA INCORRECTOS (OPCIONAL)
-- =====================================================
-- Eliminar registros con pedido_id inválido (no UUID)
-- DESCOMENTA SOLO SI QUIERES LIMPIAR DATOS DE PRUEBA
/*
DELETE FROM transacciones_epayco_logs 
WHERE pedido_id IS NOT NULL 
AND pedido_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
*/

-- =====================================================
-- 5. CONSULTAR DATOS ACTUALES
-- =====================================================
SELECT 
    id,
    pedido_id,
    epayco_ref_payco,
    epayco_transaction_id,
    tipo_evento,
    estado_nuevo,
    cod_response,
    mensaje_response,
    creado_el
FROM transacciones_epayco_logs 
ORDER BY creado_el DESC 
LIMIT 10;

-- =====================================================
-- 6. VERIFICAR RELACIÓN CON TABLA PEDIDOS
-- =====================================================
SELECT 
    'LOGS SIN PEDIDO ASOCIADO' as tipo,
    COUNT(*) as cantidad
FROM transacciones_epayco_logs t
WHERE t.pedido_id IS NULL

UNION ALL

SELECT 
    'LOGS CON PEDIDO VÁLIDO' as tipo,
    COUNT(*) as cantidad
FROM transacciones_epayco_logs t
INNER JOIN pedidos p ON t.pedido_id = p.id

UNION ALL

SELECT 
    'TOTAL LOGS' as tipo,
    COUNT(*) as cantidad
FROM transacciones_epayco_logs;

-- =====================================================
-- 7. BUSCAR PEDIDOS POR REFERENCIA EPAYCO
-- =====================================================
SELECT 
    p.id as pedido_uuid,
    p.numero_pedido,
    p.epayco_ref_payco,
    p.estado,
    p.total,
    p.creado_el,
    COUNT(t.id) as logs_asociados
FROM pedidos p
LEFT JOIN transacciones_epayco_logs t ON p.id = t.pedido_id
WHERE p.epayco_ref_payco IS NOT NULL
GROUP BY p.id, p.numero_pedido, p.epayco_ref_payco, p.estado, p.total, p.creado_el
ORDER BY p.creado_el DESC
LIMIT 5;

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta este script en el SQL Editor de Supabase
-- 2. Revisa los resultados de cada sección
-- 3. Si hay datos incorrectos, descomenta la sección 4 para limpiarlos
-- 4. Verifica que las políticas RLS estén configuradas correctamente
-- 5. Confirma que la relación entre pedidos y logs funcione