[
  {
    "policyname": "Comentarios aprobados para lectura",
    "tablename": "blog_comentarios",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "roles": "{public}",
    "qual": "(aprobado = true)"
  },
  {
    "policyname": "Usuarios pueden comentar",
    "tablename": "blog_comentarios",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "roles": "{public}",
    "qual": null
  },
  {
    "policyname": "carrito_sesion_gestion",
    "tablename": "carrito",
    "permissive": "PERMISSIVE",
    "cmd": "ALL",
    "roles": "{public}",
    "qual": "((auth.uid() IS NULL) AND (session_id IS NOT NULL))"
  },
  {
    "policyname": "carrito_usuario_gestion",
    "tablename": "carrito",
    "permissive": "PERMISSIVE",
    "cmd": "ALL",
    "roles": "{public}",
    "qual": "(auth.uid() = usuario_id)"
  },
  {
    "policyname": "Atributos públicos para lectura",
    "tablename": "categoria_atributos",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "roles": "{public}",
    "qual": "(activo = true)"
  },
  {
    "policyname": "admins_gestionan_toda_config",
    "tablename": "configuracion_tienda",
    "permissive": "PERMISSIVE",
    "cmd": "ALL",
    "roles": "{public}",
    "qual": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))"
  },
  {
    "policyname": "todos_pueden_ver_config_publica",
    "tablename": "configuracion_tienda",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "roles": "{public}",
    "qual": "(((clave)::text !~~ 'admin_%'::text) AND ((clave)::text !~~ 'secret_%'::text))"
  },
  {
    "policyname": "pedidos_admin_completo",
    "tablename": "pedidos",
    "permissive": "PERMISSIVE",
    "cmd": "ALL",
    "roles": "{public}",
    "qual": "(EXISTS ( SELECT 1\n   FROM usuarios\n  WHERE ((usuarios.id = auth.uid()) AND ((usuarios.rol)::text = 'admin'::text))))"
  },
  {
    "policyname": "pedidos_usuario_crear",
    "tablename": "pedidos",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "roles": "{public}",
    "qual": null
  },
  {
    "policyname": "pedidos_usuario_lectura",
    "tablename": "pedidos",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "roles": "{public}",
    "qual": "(auth.uid() = usuario_id)"
  },
  {
    "policyname": "Valores de atributos públicos",
    "tablename": "producto_atributos",
    "permissive": "PERMISSIVE",
    "cmd": "SELECT",
    "roles": "{public}",
    "qual": "true"
  },
  {
    "policyname": "insercion_triggers",
    "tablename": "usuarios",
    "permissive": "PERMISSIVE",
    "cmd": "INSERT",
    "roles": "{public}",
    "qual": null
  }
]