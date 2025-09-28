# 🤖 Crear Producto con IA

## Descripción
Componente que permite crear productos utilizando Inteligencia Artificial a través de un webhook de N8N. El usuario proporciona información básica y la IA genera contenido persuasivo y optimizado para ventas.

## Características Principales

### ✨ Formulario Simplificado
- **Nombre del producto**: Campo obligatorio
- **Precio**: Campo obligatorio numérico
- **Categoría**: Selector opcional de categorías existentes
- **¿De qué trata?**: Descripción básica del producto
- **¿Cómo funciona?**: Explicación del funcionamiento
- **Características**: Lista de características principales
- **Imágenes**: URLs opcionales separadas por comas

### 🔄 Proceso de 3 Pasos
1. **Información**: Usuario completa formulario simple
2. **Generando**: IA procesa la información (con indicadores visuales)
3. **Vista Previa**: Usuario revisa y aprueba el contenido generado

### 🎯 Contenido Generado por IA
- **Descripción persuasiva**: Texto optimizado para ventas
- **Ganchos de venta**: Frases llamativas para atraer clientes
- **Beneficios**: Lista de beneficios del producto
- **Ventajas competitivas**: Puntos diferenciadores
- **SEO optimizado**: Slug, meta title, meta description
- **Palabras clave**: Keywords relevantes para SEO

## Sistema de ID de Conversación

### 🆔 Generación de ID Único
Cada sesión de creación de producto genera un ID único para mantener contexto:
- **Formato**: `producto_{timestamp}_{randomId}`
- **Ejemplo**: `producto_1703123456789_abc123def456`
- **Persistencia**: Se mantiene durante toda la sesión hasta cerrar el modal
- **Regeneración**: Usa el mismo ID para mantener contexto en regeneraciones

### 🧠 Contexto del Agente
El ID permite al agente de N8N:
- **Mantener historial** de la conversación
- **Recordar información** previa del producto
- **Mejorar respuestas** basadas en interacciones anteriores
- **Almacenar datos** de la sesión para análisis

### 📊 Metadatos Incluidos
- `conversacion_id`: ID principal para el agente
- `session_id`: ID de compatibilidad (mismo valor)
- `timestamp`: Marca temporal ISO 8601
- `usuario_tipo`: Tipo de usuario (admin/cliente)
- `accion`: Acción específica (crear_producto_ia)

## Integración con Webhook

### Endpoint
```
https://velostrategix-n8n.lnrubg.easypanel.host/webhook-test/crear_productos
```

### Datos Enviados
```json
{
  "conversacion_id": "producto_1703123456789_abc123def456",
  "session_id": "producto_1703123456789_abc123def456",
  "nombre_producto": "string",
  "precio": "number",
  "categoria_id": "string|null",
  "de_que_trata": "string",
  "como_funciona": "string",
  "caracteristicas_principales": "string",
  "imagenes_referencia": "string|null",
  "idioma": "español",
  "estilo": "ultra_vendedor",
  "plataforma": "me_llevo_esto",
  "contexto_tienda": {
    "nombre": "ME LLEVO ESTO",
    "tipo": "ecommerce_ultra_vendedor",
    "inspiracion": ["Temu", "Shein", "OLX", "Shopify"],
    "objetivo": "generar_contenido_persuasivo_ventas",
    "publico_objetivo": "compradores_online_hispanohablantes"
  },
  "timestamp": "2023-12-21T10:30:45.123Z",
  "usuario_tipo": "admin",
  "accion": "crear_producto_ia",
  "instrucciones_agente": {
    "generar": ["descripcion_persuasiva", "ganchos_venta", "beneficios", "ventajas_competitivas", "seo_optimizado"],
    "tono": "convincente_urgente_escasez",
    "longitud_descripcion": "media_150_300_palabras",
    "incluir_emojis": true,
    "enfoque_ventas": true
  }
}
```

### Respuesta Esperada
```json
{
  "descripcion": "string",
  "ganchos": ["string"],
  "beneficios": ["string"],
  "ventajas": ["string"],
  "slug": "string",
  "meta_title": "string",
  "meta_description": "string",
  "palabras_clave": ["string"]
}
```

## Uso del Componente

### Importación
```jsx
import CrearProductoIA from '../../../componentes/admin/CrearProductoIA'
```

### Implementación
```jsx
<CrearProductoIA
  mostrar={mostrarModalIA}
  onCerrar={() => setMostrarModalIA(false)}
  onProductoCreado={manejarProductoIA}
  categorias={categorias}
/>
```

### Props
- `mostrar`: Boolean - Controla la visibilidad del modal
- `onCerrar`: Function - Callback para cerrar el modal
- `onProductoCreado`: Function - Callback con el producto generado
- `categorias`: Array - Lista de categorías disponibles

## Estilos
Los estilos están definidos en `EstilosCrearProductoIA.css` con:
- **Diseño responsive**: Adaptable a móvil y escritorio
- **Animaciones suaves**: Transiciones y efectos visuales
- **Indicadores de progreso**: Pasos visuales del proceso
- **Estados de carga**: Spinner y mensajes informativos
- **Tema coherente**: Colores y tipografía de la aplicación

## Funcionalidades Adicionales

### Validación
- Campos obligatorios marcados con *
- Validación en tiempo real
- Mensajes de error claros

### Experiencia de Usuario
- Indicador de pasos (1, 2, 3)
- Animaciones de carga
- Vista previa completa
- Opciones de editar/regenerar/aprobar

### Integración con Formulario Principal
- Mapeo automático de datos generados
- Preservación de configuración existente
- Mensaje de confirmación
- Cierre automático del modal

## Mantenimiento

### Actualizar Webhook
Para cambiar el endpoint, modificar la URL en:
```jsx
const respuesta = await fetch('NUEVA_URL_WEBHOOK', {
  // ...configuración
})
```

### Personalizar Campos
Para añadir nuevos campos al formulario:
1. Actualizar estado `formularioIA`
2. Añadir campo en JSX
3. Incluir en `datosParaIA`
4. Actualizar validación si es necesario

### Modificar Estilos
Los estilos están organizados por secciones:
- Modal y overlay
- Header y navegación
- Formulario y campos
- Estados de carga
- Vista previa
- Responsive design
