-- =====================================================
-- SCRIPT PARA REVISAR ESTRUCTURA Y DATOS DE PEDIDOS
-- =====================================================

-- 1. CONSULTAR ESTRUCTURA DE LA TABLA PEDIDOS
-- =====================================================
SELECT 
    column_name AS nombre_columna, 
    data_type AS tipo_dato, 
    is_nullable AS acepta_nulos, 
    column_default AS valor_por_defecto,
    ordinal_position AS posicion
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'pedidos' 
ORDER BY ordinal_position;

-- =====================================================
-- 2. CONSULTAR DATOS ESPECÍFICOS DEL PEDIDO
-- =====================================================
-- ID del pedido: f0487b95-8881-46d1-a81a-a4cb3d55f98a

SELECT 
    -- Información básica del pedido
    id,
    numero_pedido,
    usuario_id,
    nombre_cliente,
    email_cliente,
    telefono_cliente,
    
    -- Información de productos y montos
    productos,
    subtotal,
    descuento_aplicado,
    costo_envio,
    total,
    
    -- Estado y método de pago
    estado,
    metodo_pago,
    referencia_pago,
    
    -- Campos específicos de ePayco
    epayco_ref_payco,
    epayco_transaction_id,
    epayco_cod_response,
    epayco_signature,
    epayco_approval_code,
    epayco_fecha_transaccion,
    epayco_franchise,
    epayco_bank_name,
    epayco_test_request,
    epayco_extra_data,
    epayco_response_raw,
    
    -- Fechas
    creado_el,
    actualizado_el,
    fecha_envio,
    fecha_entrega,
    
    -- Notas
    notas_cliente,
    notas_admin,
    
    -- Dirección de envío
    direccion_envio
    
FROM pedidos 
WHERE id = 'f0487b95-8881-46d1-a81a-a4cb3d55f98a';

-- =====================================================
-- 3. CONSULTAR TRANSACCIONES RELACIONADAS EN LOGS
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
    datos_completos,
    creado_el
FROM transacciones_epayco_logs 
WHERE pedido_id = 'f0487b95-8881-46d1-a81a-a4cb3d55f98a'
ORDER BY creado_el DESC;

-- =====================================================
-- 4. VERIFICAR SI HAY DATOS EN AMBAS TABLAS
-- =====================================================
SELECT 
    'pedidos' as tabla,
    COUNT(*) as total_registros
FROM pedidos 
WHERE id = 'f0487b95-8881-46d1-a81a-a4cb3d55f98a'

UNION ALL

SELECT 
    'transacciones_epayco_logs' as tabla,
    COUNT(*) as total_registros
FROM transacciones_epayco_logs 
WHERE pedido_id = 'f0487b95-8881-46d1-a81a-a4cb3d55f98a';

-- =====================================================
-- 5. CONSULTA RESUMIDA PARA DIAGNÓSTICO RÁPIDO
-- =====================================================
SELECT 
    p.id,
    p.numero_pedido,
    p.estado,
    p.total,
    p.metodo_pago,
    p.epayco_ref_payco,
    p.epayco_transaction_id,
    p.epayco_cod_response,
    p.creado_el,
    p.actualizado_el,
    
    -- Contar transacciones relacionadas
    (SELECT COUNT(*) FROM transacciones_epayco_logs t WHERE t.pedido_id = p.id) as total_logs
    
FROM pedidos p
WHERE p.id = 'f0487b95-8881-46d1-a81a-a4cb3d55f98a';