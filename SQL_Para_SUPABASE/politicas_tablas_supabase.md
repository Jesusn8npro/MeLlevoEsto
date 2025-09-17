[
  {
    "schemaname": "public",
    "tablename": "resenas",
    "policyname": "todos_pueden_ver_resenas_activas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activo = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "resenas",
    "policyname": "usuarios_pueden_crear_resenas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": null,
    "with_check": "(auth.uid() IS NOT NULL)"
  },
  {
    "schemaname": "public",
    "tablename": "resenas",
    "policyname": "usuarios_pueden_gestionar_sus_resenas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(auth.uid() = usuario_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "resenas",
    "policyname": "admins_gestionan_todas_resenas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "usuarios_pueden_ver_sus_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(auth.uid() = usuario_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "usuarios_pueden_crear_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": null,
    "with_check": "((auth.uid() = usuario_id) OR (auth.uid() IS NULL))"
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "admins_gestionan_todos_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "carrito",
    "policyname": "usuarios_gestionan_su_carrito",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(auth.uid() = usuario_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "carrito",
    "policyname": "carrito_por_session",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "((auth.uid() IS NULL) AND (session_id IS NOT NULL))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "promociones",
    "policyname": "todos_pueden_ver_promociones_activas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "((activo = true) AND ((fecha_fin IS NULL) OR (fecha_fin > now())))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "promociones",
    "policyname": "admins_gestionan_promociones",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "configuracion_tienda",
    "policyname": "todos_pueden_ver_config_publica",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(((clave)::text !~~ 'admin_%'::text) AND ((clave)::text !~~ 'secret_%'::text))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "usuarios_ver_sus_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "((auth.uid())::text IN ( SELECT (usuarios.id)::text AS id\n   FROM usuarios\n  WHERE (usuarios.id = pedidos.usuario_id)))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "configuracion_tienda",
    "policyname": "admins_gestionan_toda_config",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_articulos",
    "policyname": "Artículos públicos para lectura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "((estado)::text = 'publicado'::text)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_categorias",
    "policyname": "Categorías públicas para lectura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activa = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_comentarios",
    "policyname": "Comentarios aprobados para lectura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(aprobado = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_articulos",
    "policyname": "Solo admins pueden gestionar blog",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "blog_comentarios",
    "policyname": "Usuarios pueden comentar",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": null,
    "with_check": "((auth.uid() IS NOT NULL) AND (usuario_id = auth.uid()))"
  },
  {
    "schemaname": "public",
    "tablename": "productos",
    "policyname": "Productos públicos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activo = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categorias",
    "policyname": "Categorías públicas",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activo = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "usuarios_crear_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": null,
    "with_check": "(((auth.uid())::text IN ( SELECT (usuarios.id)::text AS id\n   FROM usuarios\n  WHERE (usuarios.id = pedidos.usuario_id))) OR (usuario_id IS NULL))"
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "admins_ver_todos_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "((auth.uid())::text IN ( SELECT (usuarios.id)::text AS id\n   FROM usuarios\n  WHERE ((usuarios.rol)::text = 'admin'::text)))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "pedidos",
    "policyname": "admins_actualizar_pedidos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "((auth.uid())::text IN ( SELECT (usuarios.id)::text AS id\n   FROM usuarios\n  WHERE ((usuarios.rol)::text = 'admin'::text)))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categorias_completas",
    "policyname": "Categorías públicas para lectura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activa = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categoria_atributos",
    "policyname": "Atributos públicos para lectura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activo = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "producto_atributos",
    "policyname": "Valores de atributos públicos",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categoria_secciones",
    "policyname": "Secciones públicas para lectura",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(activa = true)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "categorias_completas",
    "policyname": "Solo admins pueden modificar categorías",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))",
    "with_check": null
  }
]