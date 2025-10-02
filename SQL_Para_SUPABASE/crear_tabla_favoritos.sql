-- =====================================================
-- SCRIPT PARA TABLA DE FAVORITOS - VERSIÓN COMPATIBLE
-- Basado en la estructura existente de la base de datos
-- =====================================================

-- =====================================================
-- CREAR TABLA FAVORITOS
-- =====================================================

CREATE TABLE IF NOT EXISTS favoritos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    producto_id UUID NOT NULL,
    fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricciones de clave foránea (corregidas para usar tablas existentes)
    CONSTRAINT fk_favoritos_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_favoritos_producto 
        FOREIGN KEY (producto_id) 
        REFERENCES productos(id) 
        ON DELETE CASCADE,
    
    -- Restricción única para evitar duplicados
    CONSTRAINT unique_usuario_producto 
        UNIQUE (usuario_id, producto_id)
);

-- =====================================================
-- CREAR ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_producto_id ON favoritos(producto_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_fecha_agregado ON favoritos(fecha_agregado DESC);

-- =====================================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_favoritos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER trigger_update_favoritos_updated_at
    BEFORE UPDATE ON favoritos
    FOR EACH ROW
    EXECUTE FUNCTION update_favoritos_updated_at();

-- =====================================================
-- HABILITAR RLS (Row Level Security)
-- =====================================================

ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD RLS
-- =====================================================

-- Política para ver favoritos (solo el usuario propietario)
CREATE POLICY "Los usuarios pueden ver sus propios favoritos" ON favoritos
    FOR SELECT USING (auth.uid() = usuario_id);

-- Política para agregar favoritos (solo usuarios autenticados)
CREATE POLICY "Los usuarios pueden agregar favoritos" ON favoritos
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Política para eliminar favoritos (solo el usuario propietario)
CREATE POLICY "Los usuarios pueden eliminar sus propios favoritos" ON favoritos
    FOR DELETE USING (auth.uid() = usuario_id);

-- Política para actualizar favoritos (solo el usuario propietario)
CREATE POLICY "Los usuarios pueden actualizar sus propios favoritos" ON favoritos
    FOR UPDATE USING (auth.uid() = usuario_id);

-- =====================================================
-- FUNCIONES ÚTILES PARA FAVORITOS
-- =====================================================

-- Función para agregar un favorito
CREATE OR REPLACE FUNCTION agregar_favorito(p_usuario_id UUID, p_producto_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO favoritos (usuario_id, producto_id)
    VALUES (p_usuario_id, p_producto_id)
    ON CONFLICT (usuario_id, producto_id) DO NOTHING;
    
    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para quitar un favorito
CREATE OR REPLACE FUNCTION quitar_favorito(p_usuario_id UUID, p_producto_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM favoritos 
    WHERE usuario_id = p_usuario_id AND producto_id = p_producto_id;
    
    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un producto es favorito
CREATE OR REPLACE FUNCTION es_favorito(p_usuario_id UUID, p_producto_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM favoritos 
        WHERE usuario_id = p_usuario_id AND producto_id = p_producto_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para contar favoritos de un usuario
CREATE OR REPLACE FUNCTION contar_favoritos(p_usuario_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM favoritos 
        WHERE usuario_id = p_usuario_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VISTA PARA FAVORITOS CON INFORMACIÓN DE PRODUCTOS
-- =====================================================

CREATE OR REPLACE VIEW vista_favoritos AS
SELECT 
    f.id,
    f.usuario_id,
    f.producto_id,
    f.fecha_agregado,
    f.created_at,
    f.updated_at,
    p.nombre as producto_nombre,
    p.slug as producto_slug,
    p.precio,
    p.precio_original,
    p.descuento,
    p.stock,
    p.activo as producto_activo,
    c.nombre as categoria_nombre,
    pi.imagen_principal,
    pi.imagen_secundaria_1,
    pi.imagen_secundaria_2,
    pi.imagen_secundaria_3,
    pi.imagen_secundaria_4
FROM favoritos f
JOIN productos p ON f.producto_id = p.id
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id
ORDER BY f.fecha_agregado DESC;

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE favoritos IS 'Tabla para almacenar los productos favoritos de los usuarios';
COMMENT ON COLUMN favoritos.usuario_id IS 'ID del usuario que agregó el favorito';
COMMENT ON COLUMN favoritos.producto_id IS 'ID del producto marcado como favorito';
COMMENT ON COLUMN favoritos.fecha_agregado IS 'Fecha y hora cuando se agregó el favorito';

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

-- Para usar las funciones desde el frontend:
-- SELECT agregar_favorito('usuario_id', 'producto_id');
-- SELECT quitar_favorito('usuario_id', 'producto_id');
-- SELECT es_favorito('usuario_id', 'producto_id');
-- SELECT contar_favoritos('usuario_id');
-- SELECT * FROM vista_favoritos WHERE usuario_id = 'usuario_id';