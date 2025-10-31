-- Script para agregar campos de ePayco a la tabla pedidos
-- Ejecutar en Supabase SQL Editor

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

-- Comentarios para documentar los campos
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