-- =============================================
-- Definir valores por defecto para ventajas/beneficios
-- Tabla: productos
-- Campos nuevos (JSONB): ventajas_jsonb, beneficios_jsonb
-- Campos antiguos (ARRAY): ventajas, beneficios
-- =============================================

-- 1) Verificar tipos actuales
SELECT column_name, data_type, udt_name, column_default
FROM information_schema.columns
WHERE table_name = 'productos'
  AND column_name IN ('ventajas', 'beneficios', 'ventajas_jsonb', 'beneficios_jsonb');

-- 2) Defaults en columnas JSONB (estructura segura y válida)
ALTER TABLE productos
  ALTER COLUMN ventajas_jsonb SET DEFAULT '{
    "titulo": "¿Por qué elegir este producto?",
    "subtitulo": "Ventajas clave",
    "items": [
      {"id": 1, "icono": "✅", "titulo": "Excelente relación calidad/precio", "descripcion": "Equilibrio ideal entre costo y prestaciones"},
      {"id": 2, "icono": "⚡", "titulo": "Rendimiento confiable", "descripcion": "Funciona como se espera en uso diario"},
      {"id": 3, "icono": "📈", "titulo": "Mejora inmediata", "descripcion": "Resultados visibles desde el primer uso"}
    ]
  }'::jsonb,
  ALTER COLUMN beneficios_jsonb SET DEFAULT '{
    "titulo": "Beneficios Exclusivos",
    "subtitulo": "Todo lo que obtienes al elegirnos",
    "items": [
      {"id": 1, "icono": "🛡️", "titulo": "Garantía básica", "descripcion": "Cobertura estándar de satisfacción"},
      {"id": 2, "icono": "🔧", "titulo": "Soporte inicial", "descripcion": "Asesoría y guía de uso"},
      {"id": 3, "icono": "📦", "titulo": "Entrega segura", "descripcion": "Seguimiento y soporte post-compra"}
    ]
  }'::jsonb;

-- 3) Rellenar nulos en JSONB con defaults configurados
UPDATE productos SET ventajas_jsonb   = COALESCE(ventajas_jsonb,   DEFAULT);
UPDATE productos SET beneficios_jsonb = COALESCE(beneficios_jsonb, DEFAULT);

-- 4) Definir defaults seguros para columnas ARRAY según su tipo real
DO $$
DECLARE tipo_beneficios text;
DECLARE tipo_ventajas   text;
BEGIN
  SELECT udt_name INTO tipo_beneficios
  FROM information_schema.columns
  WHERE table_name='productos' AND column_name='beneficios';

  SELECT udt_name INTO tipo_ventajas
  FROM information_schema.columns
  WHERE table_name='productos' AND column_name='ventajas';

  -- Establecer default a arreglo vacío del tipo correcto
  IF tipo_beneficios IN ('text[]', 'varchar[]') THEN
    EXECUTE 'ALTER TABLE productos ALTER COLUMN beneficios SET DEFAULT ''{}''::' || tipo_beneficios;
    EXECUTE 'UPDATE productos SET beneficios = COALESCE(beneficios, ''{}''::' || tipo_beneficios || ')';
  END IF;

  IF tipo_ventajas IN ('text[]', 'varchar[]') THEN
    EXECUTE 'ALTER TABLE productos ALTER COLUMN ventajas SET DEFAULT ''{}''::' || tipo_ventajas;
    EXECUTE 'UPDATE productos SET ventajas = COALESCE(ventajas, ''{}''::' || tipo_ventajas || ')';
  END IF;
END $$;

-- 5) Recomendación: si ya migraste a JSONB, puedes ignorar las columnas ARRAY
-- y solo utilizar ventajas_jsonb y beneficios_jsonb en tu app/N8N.

-- 6) Opcional: Forzar estado por defecto a 'nuevo' para evitar el check constraint
-- (Solo si tu flujo está enviando estados inválidos)
ALTER TABLE productos ALTER COLUMN estado SET DEFAULT 'nuevo';

-- 7) Verificación final
SELECT id, nombre, estado, ventajas, beneficios, ventajas_jsonb, beneficios_jsonb
FROM productos
ORDER BY actualizado_el DESC NULLS LAST
LIMIT 5;