[
  {
    "tabla_origen": "productos",
    "columna_origen": "categoria_id",
    "tabla_destino": "categorias",
    "columna_destino": "id",
    "constraint_name": "productos_categoria_id_fkey"
  },
  {
    "tabla_origen": "productos",
    "columna_origen": "creado_por",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "productos_creado_por_fkey"
  },
  {
    "tabla_origen": "resenas",
    "columna_origen": "producto_id",
    "tabla_destino": "productos",
    "columna_destino": "id",
    "constraint_name": "resenas_producto_id_fkey"
  },
  {
    "tabla_origen": "resenas",
    "columna_origen": "usuario_id",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "resenas_usuario_id_fkey"
  },
  {
    "tabla_origen": "pedidos",
    "columna_origen": "usuario_id",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "pedidos_usuario_id_fkey"
  },
  {
    "tabla_origen": "carrito",
    "columna_origen": "usuario_id",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "carrito_usuario_id_fkey"
  },
  {
    "tabla_origen": "carrito",
    "columna_origen": "producto_id",
    "tabla_destino": "productos",
    "columna_destino": "id",
    "constraint_name": "carrito_producto_id_fkey"
  },
  {
    "tabla_origen": "vehiculos",
    "columna_origen": "verificado_por",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "vehiculos_verificado_por_fkey"
  },
  {
    "tabla_origen": "vehiculos_historial_precios",
    "columna_origen": "vehiculo_id",
    "tabla_destino": "vehiculos",
    "columna_destino": "id",
    "constraint_name": "vehiculos_historial_precios_vehiculo_id_fkey"
  },
  {
    "tabla_origen": "vehiculos_historial_precios",
    "columna_origen": "cambiado_por",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "vehiculos_historial_precios_cambiado_por_fkey"
  },
  {
    "tabla_origen": "vehiculos",
    "columna_origen": "producto_id",
    "tabla_destino": "productos",
    "columna_destino": "id",
    "constraint_name": "vehiculos_producto_id_fkey"
  },
  {
    "tabla_origen": "vehiculos_inspecciones",
    "columna_origen": "vehiculo_id",
    "tabla_destino": "vehiculos",
    "columna_destino": "id",
    "constraint_name": "vehiculos_inspecciones_vehiculo_id_fkey"
  },
  {
    "tabla_origen": "categorias_completas",
    "columna_origen": "categoria_padre_id",
    "tabla_destino": "categorias_completas",
    "columna_destino": "id",
    "constraint_name": "categorias_completas_categoria_padre_id_fkey"
  },
  {
    "tabla_origen": "categoria_atributos",
    "columna_origen": "categoria_id",
    "tabla_destino": "categorias_completas",
    "columna_destino": "id",
    "constraint_name": "categoria_atributos_categoria_id_fkey"
  },
  {
    "tabla_origen": "producto_atributos",
    "columna_origen": "producto_id",
    "tabla_destino": "productos",
    "columna_destino": "id",
    "constraint_name": "producto_atributos_producto_id_fkey"
  },
  {
    "tabla_origen": "producto_atributos",
    "columna_origen": "atributo_id",
    "tabla_destino": "categoria_atributos",
    "columna_destino": "id",
    "constraint_name": "producto_atributos_atributo_id_fkey"
  },
  {
    "tabla_origen": "categoria_secciones",
    "columna_origen": "categoria_id",
    "tabla_destino": "categorias_completas",
    "columna_destino": "id",
    "constraint_name": "categoria_secciones_categoria_id_fkey"
  },
  {
    "tabla_origen": "categoria_analytics",
    "columna_origen": "categoria_id",
    "tabla_destino": "categorias_completas",
    "columna_destino": "id",
    "constraint_name": "categoria_analytics_categoria_id_fkey"
  },
  {
    "tabla_origen": "categoria_productos_destacados",
    "columna_origen": "categoria_id",
    "tabla_destino": "categorias_completas",
    "columna_destino": "id",
    "constraint_name": "categoria_productos_destacados_categoria_id_fkey"
  },
  {
    "tabla_origen": "categoria_productos_destacados",
    "columna_origen": "producto_id",
    "tabla_destino": "productos",
    "columna_destino": "id",
    "constraint_name": "categoria_productos_destacados_producto_id_fkey"
  },
  {
    "tabla_origen": "categoria_configuracion_filtros",
    "columna_origen": "categoria_id",
    "tabla_destino": "categorias_completas",
    "columna_destino": "id",
    "constraint_name": "categoria_configuracion_filtros_categoria_id_fkey"
  },
  {
    "tabla_origen": "blog_articulos",
    "columna_origen": "categoria_id",
    "tabla_destino": "blog_categorias",
    "columna_destino": "id",
    "constraint_name": "blog_articulos_categoria_id_fkey"
  },
  {
    "tabla_origen": "blog_comentarios",
    "columna_origen": "articulo_id",
    "tabla_destino": "blog_articulos",
    "columna_destino": "id",
    "constraint_name": "blog_comentarios_articulo_id_fkey"
  },
  {
    "tabla_origen": "blog_comentarios",
    "columna_origen": "usuario_id",
    "tabla_destino": "usuarios",
    "columna_destino": "id",
    "constraint_name": "blog_comentarios_usuario_id_fkey"
  },
  {
    "tabla_origen": "blog_comentarios",
    "columna_origen": "comentario_padre_id",
    "tabla_destino": "blog_comentarios",
    "columna_destino": "id",
    "constraint_name": "blog_comentarios_comentario_padre_id_fkey"
  },
  {
    "tabla_origen": "blog_analytics",
    "columna_origen": "articulo_id",
    "tabla_destino": "blog_articulos",
    "columna_destino": "id",
    "constraint_name": "blog_analytics_articulo_id_fkey"
  }
]