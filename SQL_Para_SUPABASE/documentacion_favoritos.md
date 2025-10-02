# 📋 Documentación de Funciones de Favoritos - Supabase

## 🎯 Resumen General

Este documento describe todas las funciones, vistas y características del sistema de favoritos optimizado para tu ecommerce. El sistema incluye funcionalidades avanzadas como notificaciones de precio, sistema de prioridades, estadísticas y más.

## 📊 Estructura de la Tabla

### Tabla `favoritos`

```sql
favoritos (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL,
    producto_id UUID NOT NULL,
    fecha_agregado TIMESTAMP WITH TIME ZONE,
    notas TEXT,
    prioridad INTEGER (1-5),
    notificaciones_precio BOOLEAN,
    precio_deseado DECIMAL(10,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

## 🔧 Funciones Disponibles

### 1. `agregar_favorito()` - Agregar/Actualizar Favorito

**Descripción:** Agrega un producto a favoritos o actualiza uno existente.

**Parámetros:**
- `p_usuario_id` (UUID) - ID del usuario
- `p_producto_id` (UUID) - ID del producto
- `p_notas` (TEXT, opcional) - Notas personales
- `p_prioridad` (INTEGER, opcional, default: 1) - Prioridad 1-5
- `p_notificaciones_precio` (BOOLEAN, opcional, default: false) - Activar notificaciones
- `p_precio_deseado` (DECIMAL, opcional) - Precio objetivo

**Ejemplo de uso en JavaScript:**
```javascript
// Agregar favorito básico
const { data, error } = await supabase.rpc('agregar_favorito', {
  p_usuario_id: user.id,
  p_producto_id: 'uuid-del-producto'
});

// Agregar favorito con opciones avanzadas
const { data, error } = await supabase.rpc('agregar_favorito', {
  p_usuario_id: user.id,
  p_producto_id: 'uuid-del-producto',
  p_notas: 'Me gusta este producto para regalo',
  p_prioridad: 4,
  p_notificaciones_precio: true,
  p_precio_deseado: 150.00
});
```

**Respuesta JSON:**
```json
{
  "success": true,
  "message": "Producto agregado a favoritos",
  "favorito_id": "uuid-del-favorito",
  "action": "created" // o "updated"
}
```

### 2. `quitar_favorito()` - Eliminar Favorito

**Descripción:** Elimina un producto de favoritos.

**Parámetros:**
- `p_usuario_id` (UUID) - ID del usuario
- `p_producto_id` (UUID) - ID del producto

**Ejemplo de uso:**
```javascript
const { data, error } = await supabase.rpc('quitar_favorito', {
  p_usuario_id: user.id,
  p_producto_id: 'uuid-del-producto'
});
```

### 3. `es_favorito()` - Verificar si es Favorito

**Descripción:** Verifica si un producto está en favoritos del usuario.

**Parámetros:**
- `p_usuario_id` (UUID) - ID del usuario
- `p_producto_id` (UUID) - ID del producto

**Ejemplo de uso:**
```javascript
const { data, error } = await supabase.rpc('es_favorito', {
  p_usuario_id: user.id,
  p_producto_id: 'uuid-del-producto'
});

// data será true o false
```

### 4. `estadisticas_favoritos()` - Estadísticas del Usuario

**Descripción:** Obtiene estadísticas completas de favoritos del usuario.

**Parámetros:**
- `p_usuario_id` (UUID) - ID del usuario

**Ejemplo de uso:**
```javascript
const { data, error } = await supabase.rpc('estadisticas_favoritos', {
  p_usuario_id: user.id
});
```

**Respuesta JSON:**
```json
{
  "total_favoritos": 15,
  "favoritos_con_notificaciones": 5,
  "favoritos_alta_prioridad": 3,
  "categoria_favorita": "Electrónicos",
  "precio_promedio_deseado": 125.50
}
```

### 5. `obtener_favoritos()` - Obtener Lista de Favoritos

**Descripción:** Obtiene la lista de favoritos con filtros y paginación.

**Parámetros:**
- `p_usuario_id` (UUID) - ID del usuario
- `p_limite` (INTEGER, opcional, default: 50) - Límite de resultados
- `p_offset` (INTEGER, opcional, default: 0) - Offset para paginación
- `p_orden` (TEXT, opcional, default: 'fecha_desc') - Orden de resultados
- `p_prioridad_minima` (INTEGER, opcional, default: 1) - Prioridad mínima
- `p_categoria_id` (UUID, opcional) - Filtrar por categoría

**Opciones de orden:**
- `'fecha_desc'` - Por fecha descendente (más recientes primero)
- `'fecha_asc'` - Por fecha ascendente
- `'prioridad_desc'` - Por prioridad descendente
- `'precio_asc'` - Por precio ascendente
- `'precio_desc'` - Por precio descendente
- `'nombre'` - Por nombre alfabético

**Ejemplo de uso:**
```javascript
// Obtener favoritos básicos
const { data, error } = await supabase.rpc('obtener_favoritos', {
  p_usuario_id: user.id
});

// Obtener favoritos con filtros
const { data, error } = await supabase.rpc('obtener_favoritos', {
  p_usuario_id: user.id,
  p_limite: 20,
  p_offset: 0,
  p_orden: 'prioridad_desc',
  p_prioridad_minima: 3,
  p_categoria_id: 'uuid-categoria-electronica'
});
```

## 📋 Vistas Disponibles

### 1. `vista_favoritos` - Vista Principal

**Descripción:** Vista completa con toda la información de favoritos y productos.

**Ejemplo de uso:**
```javascript
const { data, error } = await supabase
  .from('vista_favoritos')
  .select('*')
  .eq('usuario_id', user.id)
  .order('fecha_agregado', { ascending: false });
```

**Campos disponibles:**
- `id`, `usuario_id`, `producto_id`
- `fecha_agregado`, `prioridad`, `notas`
- `notificaciones_precio`, `precio_deseado`
- `producto_nombre`, `producto_descripcion`
- `producto_precio`, `producto_precio_oferta`
- `producto_imagen`, `categoria_nombre`
- `producto_disponible`, `producto_stock`
- `precio_objetivo_alcanzado` (boolean)

### 2. `vista_favoritos_notificaciones` - Notificaciones de Precio

**Descripción:** Vista para productos que han alcanzado el precio deseado.

**Ejemplo de uso:**
```javascript
const { data, error } = await supabase
  .from('vista_favoritos_notificaciones')
  .select('*')
  .eq('usuario_id', user.id);
```

## 🎨 Ejemplos de Implementación Frontend

### Componente de Botón Favorito

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const FavoritoButton = ({ productoId, userId }) => {
  const [esFavorito, setEsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    verificarFavorito();
  }, [productoId, userId]);

  const verificarFavorito = async () => {
    const { data } = await supabase.rpc('es_favorito', {
      p_usuario_id: userId,
      p_producto_id: productoId
    });
    setEsFavorito(data);
  };

  const toggleFavorito = async () => {
    setLoading(true);
    
    if (esFavorito) {
      await supabase.rpc('quitar_favorito', {
        p_usuario_id: userId,
        p_producto_id: productoId
      });
    } else {
      await supabase.rpc('agregar_favorito', {
        p_usuario_id: userId,
        p_producto_id: productoId
      });
    }
    
    setEsFavorito(!esFavorito);
    setLoading(false);
  };

  return (
    <button 
      onClick={toggleFavorito}
      disabled={loading}
      className={`heart-btn ${esFavorito ? 'active' : ''}`}
    >
      {esFavorito ? '❤️' : '🤍'}
    </button>
  );
};
```

### Lista de Favoritos

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ListaFavoritos = ({ userId }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    orden: 'fecha_desc',
    prioridad: 1
  });

  useEffect(() => {
    cargarFavoritos();
  }, [filtros]);

  const cargarFavoritos = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('obtener_favoritos', {
      p_usuario_id: userId,
      p_orden: filtros.orden,
      p_prioridad_minima: filtros.prioridad
    });
    
    if (!error) {
      setFavoritos(data);
    }
    setLoading(false);
  };

  return (
    <div className="favoritos-container">
      <div className="filtros">
        <select 
          value={filtros.orden} 
          onChange={(e) => setFiltros({...filtros, orden: e.target.value})}
        >
          <option value="fecha_desc">Más recientes</option>
          <option value="prioridad_desc">Mayor prioridad</option>
          <option value="precio_asc">Menor precio</option>
        </select>
      </div>
      
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="favoritos-grid">
          {favoritos.map(favorito => (
            <div key={favorito.favorito_id} className="favorito-card">
              <img src={favorito.producto_imagen} alt={favorito.producto_nombre} />
              <h3>{favorito.producto_nombre}</h3>
              <p className="precio">${favorito.producto_precio}</p>
              {favorito.precio_objetivo_alcanzado && (
                <span className="precio-alcanzado">¡Precio objetivo alcanzado!</span>
              )}
              <div className="prioridad">
                Prioridad: {'⭐'.repeat(favorito.prioridad)}
              </div>
              {favorito.notas && (
                <p className="notas">{favorito.notas}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Dashboard de Estadísticas

```javascript
const EstadisticasFavoritos = ({ userId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    const { data } = await supabase.rpc('estadisticas_favoritos', {
      p_usuario_id: userId
    });
    setStats(data);
  };

  if (!stats) return <div>Cargando estadísticas...</div>;

  return (
    <div className="stats-dashboard">
      <div className="stat-card">
        <h3>Total de Favoritos</h3>
        <span className="stat-number">{stats.total_favoritos}</span>
      </div>
      <div className="stat-card">
        <h3>Con Notificaciones</h3>
        <span className="stat-number">{stats.favoritos_con_notificaciones}</span>
      </div>
      <div className="stat-card">
        <h3>Alta Prioridad</h3>
        <span className="stat-number">{stats.favoritos_alta_prioridad}</span>
      </div>
      <div className="stat-card">
        <h3>Categoría Favorita</h3>
        <span className="stat-text">{stats.categoria_favorita || 'N/A'}</span>
      </div>
    </div>
  );
};
```

## 🔒 Seguridad y Políticas RLS

El sistema incluye políticas de Row Level Security (RLS) que garantizan que:

1. **Lectura**: Los usuarios solo pueden ver sus propios favoritos
2. **Inserción**: Los usuarios solo pueden agregar favoritos a su cuenta
3. **Actualización**: Los usuarios solo pueden modificar sus propios favoritos
4. **Eliminación**: Los usuarios solo pueden eliminar sus propios favoritos

## 📈 Optimizaciones Incluidas

### Índices Creados:
- `idx_favoritos_usuario_id` - Para consultas por usuario
- `idx_favoritos_producto_id` - Para consultas por producto
- `idx_favoritos_fecha_agregado` - Para ordenamiento por fecha
- `idx_favoritos_usuario_fecha` - Índice compuesto para consultas complejas
- `idx_favoritos_usuario_prioridad` - Para filtros por prioridad
- `idx_favoritos_notificaciones` - Para notificaciones de precio

### Características de Rendimiento:
- Consultas optimizadas con LIMIT y OFFSET para paginación
- Índices compuestos para consultas frecuentes
- Funciones con SECURITY DEFINER para mejor rendimiento
- Vistas materializadas para consultas complejas

## 🚀 Próximos Pasos

1. **Ejecutar el script SQL** en tu base de datos Supabase
2. **Implementar los componentes frontend** usando los ejemplos
3. **Configurar notificaciones** para cambios de precio
4. **Agregar analytics** para tracking de favoritos
5. **Implementar cache** para mejor rendimiento

## 📞 Soporte

Si necesitas ayuda con la implementación o tienes preguntas sobre alguna función específica, revisa este documento o consulta la documentación oficial de Supabase.

---

**¡Tu sistema de favoritos está listo para ofrecer una experiencia excepcional a tus usuarios!** 🎉