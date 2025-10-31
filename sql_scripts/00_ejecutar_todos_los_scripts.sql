-- Script maestro para ejecutar toda la configuración de ePayco
-- Ejecutar en Supabase SQL Editor en el siguiente orden:

-- PASO 1: Agregar campos de ePayco a tabla pedidos
-- =====================================================

-- Agregar campos específicos de ePayco a la tabla pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS epayco_ref_payco VARCHAR(255),
ADD COLUMN IF NOT EXISTS epayco_transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS epayco_cod_response VARCHAR(10),
ADD COLUMN IF NOT EXISTS epayco_signature VARCHAR(255),
ADD COLUMN IF NOT EXISTS epayco_approval_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS epayco_fecha_transaccion TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS epayco_franchise VARCHAR(50),
ADD COLUMN IF NOT EXISTS epayco_bank_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS epayco_test_request BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS epayco_extra_data JSONB,
ADD COLUMN IF NOT EXISTS epayco_response_raw JSONB;

-- Crear índices para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_pedidos_epayco_ref_payco ON pedidos(epayco_ref_payco);
CREATE INDEX IF NOT EXISTS idx_pedidos_epayco_transaction_id ON pedidos(epayco_transaction_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_epayco_cod_response ON pedidos(epayco_cod_response);

-- PASO 2: Crear tabla de logs de transacciones ePayco
-- ===================================================

-- Crear tabla para logs de transacciones de ePayco
CREATE TABLE IF NOT EXISTS transacciones_epayco_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    epayco_ref_payco VARCHAR(255) NOT NULL,
    epayco_transaction_id VARCHAR(255),
    tipo_evento VARCHAR(50) NOT NULL, -- 'webhook', 'confirmation', 'response', 'error'
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    cod_response VARCHAR(10),
    mensaje_response TEXT,
    signature_valida BOOLEAN,
    ip_origen INET,
    user_agent TEXT,
    datos_completos JSONB NOT NULL, -- Toda la respuesta de ePayco
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    procesado_el TIMESTAMP WITH TIME ZONE,
    intentos_procesamiento INTEGER DEFAULT 0,
    ultimo_error TEXT
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_epayco_logs_pedido_id ON transacciones_epayco_logs(pedido_id);
CREATE INDEX IF NOT EXISTS idx_epayco_logs_ref_payco ON transacciones_epayco_logs(epayco_ref_payco);
CREATE INDEX IF NOT EXISTS idx_epayco_logs_transaction_id ON transacciones_epayco_logs(epayco_transaction_id);
CREATE INDEX IF NOT EXISTS idx_epayco_logs_tipo_evento ON transacciones_epayco_logs(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_epayco_logs_creado_el ON transacciones_epayco_logs(creado_el);
CREATE INDEX IF NOT EXISTS idx_epayco_logs_cod_response ON transacciones_epayco_logs(cod_response);

-- PASO 3: Configurar seguridad y políticas RLS
-- ============================================

-- Habilitar RLS en la tabla de logs
ALTER TABLE transacciones_epayco_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de seguridad
CREATE POLICY "Permitir lectura de logs a usuarios autenticados" ON transacciones_epayco_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserción de logs al sistema" ON transacciones_epayco_logs
    FOR INSERT WITH CHECK (true);

-- PASO 4: Agregar comentarios de documentación
-- ============================================

-- Comentarios para tabla pedidos
COMMENT ON COLUMN pedidos.epayco_ref_payco IS 'Referencia única de ePayco para la transacción';
COMMENT ON COLUMN pedidos.epayco_transaction_id IS 'ID de transacción interno de ePayco';
COMMENT ON COLUMN pedidos.epayco_cod_response IS 'Código de respuesta de ePayco (1=Aceptada, 2=Rechazada, 3=Pendiente, etc.)';
COMMENT ON COLUMN pedidos.epayco_signature IS 'Firma de seguridad de ePayco para validar la transacción';
COMMENT ON COLUMN pedidos.epayco_approval_code IS 'Código de aprobación del banco';
COMMENT ON COLUMN pedidos.epayco_fecha_transaccion IS 'Fecha y hora de la transacción en ePayco';
COMMENT ON COLUMN pedidos.epayco_franchise IS 'Franquicia de la tarjeta (Visa, Mastercard, etc.)';
COMMENT ON COLUMN pedidos.epayco_bank_name IS 'Nombre del banco emisor';
COMMENT ON COLUMN pedidos.epayco_test_request IS 'Indica si es una transacción de prueba';
COMMENT ON COLUMN pedidos.epayco_extra_data IS 'Datos adicionales de ePayco en formato JSON';
COMMENT ON COLUMN pedidos.epayco_response_raw IS 'Respuesta completa de ePayco para auditoría';

-- Comentarios para tabla de logs
COMMENT ON TABLE transacciones_epayco_logs IS 'Tabla de auditoría y logs para todas las transacciones de ePayco';
COMMENT ON COLUMN transacciones_epayco_logs.pedido_id IS 'Referencia al pedido asociado';
COMMENT ON COLUMN transacciones_epayco_logs.epayco_ref_payco IS 'Referencia única de ePayco';
COMMENT ON COLUMN transacciones_epayco_logs.tipo_evento IS 'Tipo de evento: webhook, confirmation, response, error';
COMMENT ON COLUMN transacciones_epayco_logs.estado_anterior IS 'Estado del pedido antes del evento';
COMMENT ON COLUMN transacciones_epayco_logs.estado_nuevo IS 'Estado del pedido después del evento';
COMMENT ON COLUMN transacciones_epayco_logs.signature_valida IS 'Indica si la firma de ePayco es válida';
COMMENT ON COLUMN transacciones_epayco_logs.datos_completos IS 'Respuesta completa de ePayco en formato JSON';
COMMENT ON COLUMN transacciones_epayco_logs.intentos_procesamiento IS 'Número de intentos de procesamiento del webhook';

-- ¡CONFIGURACIÓN COMPLETADA!
-- Ahora puedes proceder con la implementación del código React y los webhooks.