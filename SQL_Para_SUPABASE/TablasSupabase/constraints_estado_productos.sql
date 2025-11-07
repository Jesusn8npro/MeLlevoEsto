-- =====================================================
-- CONSTRAINTS PARA CAMPO ESTADO EN TABLA PRODUCTOS - VERSIÓN CORREGIDA
-- =====================================================
-- Este script corrige los constraints para el campo 'estado'
-- en la tabla productos para soportar los nuevos estados implementados

-- PASO 1: Eliminar constraint existente si existe (para evitar conflictos)
DO $$ 
BEGIN
    -- Intentar eliminar el constraint si existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_estado_productos' 
        AND table_name = 'productos'
    ) THEN
        ALTER TABLE productos DROP CONSTRAINT check_estado_productos;
        RAISE NOTICE 'Constraint check_estado_productos eliminado exitosamente';
    END IF;
    
    -- También eliminar si tiene otro nombre
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'productos_estado_check' 
        AND table_name = 'productos'
    ) THEN
        ALTER TABLE productos DROP CONSTRAINT productos_estado_check;
        RAISE NOTICE 'Constraint productos_estado_check eliminado exitosamente';
    END IF;
END $$;

-- PASO 2: Crear el constraint correcto
ALTER TABLE productos 
ADD CONSTRAINT productos_estado_check 
CHECK (estado IN ('nuevo', 'usado', 'vendido', 'agotado', 'descontinuado'));

-- PASO 3: Verificar que el constraint se creó correctamente
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'productos_estado_check' 
        AND table_name = 'productos'
    ) THEN
        RAISE NOTICE 'Constraint productos_estado_check creado exitosamente';
    ELSE
        RAISE EXCEPTION 'Error: No se pudo crear el constraint productos_estado_check';
    END IF;
END $$;

-- PASO 4: Crear índices para mejorar performance (solo si no existen)
CREATE INDEX IF NOT EXISTS idx_productos_estado 
ON productos (estado);

CREATE INDEX IF NOT EXISTS idx_productos_estado_activo 
ON productos (estado, activo);

CREATE INDEX IF NOT EXISTS idx_productos_estado_stock 
ON productos (estado, stock) 
WHERE activo = true;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar información del constraint creado
SELECT 
    tc.constraint_name,
    tc.table_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'productos' 
    AND tc.constraint_type = 'CHECK'
    AND tc.constraint_name = 'productos_estado_check';

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

-- Estados permitidos:
-- - 'nuevo': Producto nuevo, disponible para venta
-- - 'usado': Producto de segunda mano, disponible para venta
-- - 'vendido': Producto ya vendido, no disponible
-- - 'agotado': Producto temporalmente sin stock
-- - 'descontinuado': Producto descontinuado, no se venderá más

-- IMPORTANTE: Los valores deben estar en minúsculas y coincidir exactamente
-- con los valores definidos en el formulario React.