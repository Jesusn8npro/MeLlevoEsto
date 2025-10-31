-- Script para crear tabla de logs de transacciones ePayco
-- Ejecutar en Supabase SQL Editor

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

-- Comentarios para documentar la tabla y campos
COMMENT ON TABLE transacciones_epayco_logs IS 'Tabla de auditoría y logs para todas las transacciones de ePayco';
COMMENT ON COLUMN transacciones_epayco_logs.pedido_id IS 'Referencia al pedido asociado';
COMMENT ON COLUMN transacciones_epayco_logs.epayco_ref_payco IS 'Referencia única de ePayco';
COMMENT ON COLUMN transacciones_epayco_logs.tipo_evento IS 'Tipo de evento: webhook, confirmation, response, error';
COMMENT ON COLUMN transacciones_epayco_logs.estado_anterior IS 'Estado del pedido antes del evento';
COMMENT ON COLUMN transacciones_epayco_logs.estado_nuevo IS 'Estado del pedido después del evento';
COMMENT ON COLUMN transacciones_epayco_logs.signature_valida IS 'Indica si la firma de ePayco es válida';
COMMENT ON COLUMN transacciones_epayco_logs.datos_completos IS 'Respuesta completa de ePayco en formato JSON';
COMMENT ON COLUMN transacciones_epayco_logs.intentos_procesamiento IS 'Número de intentos de procesamiento del webhook';

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE transacciones_epayco_logs ENABLE ROW LEVEL SECURITY;

-- Política básica de seguridad (ajustar según necesidades)
-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura de logs a usuarios autenticados" ON transacciones_epayco_logs;
DROP POLICY IF EXISTS "Permitir inserción de logs al sistema" ON transacciones_epayco_logs;

-- Crear nuevas políticas
CREATE POLICY "Permitir lectura de logs a usuarios autenticados" ON transacciones_epayco_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserción de logs al sistema" ON transacciones_epayco_logs
    FOR INSERT WITH CHECK (true);