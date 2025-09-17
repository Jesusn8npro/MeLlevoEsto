# 🛒 ME LLEVO ESTO - Tienda Ultra Vendedora

Una tienda e-commerce ultra vendedora construida con React + Supabase, inspirada en Temu, Shein, OLX y Shopify.

## 🚀 Características

- **Frontend:** React (SPA) con estructura modular
- **Backend:** Supabase con autenticación y base de datos
- **Estilos:** CSS ultra vendedor con gatillos mentales
- **Autenticación:** Login/registro con roles (cliente/admin)
- **Dashboard Admin:** Panel de gestión completo
- **Responsive:** Adaptable a móvil y escritorio
- **Todo en español:** Archivos, variables, componentes

## 📁 Estructura del Proyecto

```
src/
├── componentes/          # Componentes reutilizables
│   ├── layout/          # Layout principal
│   ├── ui/              # Componentes de UI base
│   ├── producto/        # Componentes de productos
│   ├── carrito/         # Componentes del carrito
│   └── menu/            # Componentes del menú
├── paginas/             # Páginas de la aplicación
│   └── admin/           # Páginas de administración
├── contextos/           # Contextos de React
├── hooks/               # Hooks personalizados
├── configuracion/       # Configuración y constantes
├── utilidades/          # Funciones utilitarias
└── estilos/             # Archivos CSS
    ├── index.css        # Estilos base
    ├── componentes.css  # Estilos de componentes
    └── vendedor.css     # Estilos ultra vendedores
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd me-llevo-esto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   Completa el archivo `.env` con tus credenciales de Supabase.

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_URL_BASE=http://localhost:3000
```

### Supabase

El proyecto está configurado para trabajar con Supabase. Asegúrate de tener:

- Tablas creadas (productos, categorías, usuarios, pedidos, carrito, etc.)
- Políticas RLS configuradas
- Autenticación habilitada

## 📱 Páginas Principales

- **Inicio:** Landing ultra vendedora
- **Producto:** Página individual con slug
- **Categoría:** Listado por categoría
- **Carrito:** Carrito flotante y página
- **Checkout:** Proceso de compra
- **Login/Registro:** Autenticación
- **Perfil:** Gestión de usuario
- **Admin:** Dashboard de administración

## 🎨 Estilos Ultra Vendedores

- **Urgencia:** Contadores de tiempo, ofertas limitadas
- **Escasez:** "Solo quedan X unidades"
- **Testimonios:** Reseñas y casos de éxito
- **CTAs:** Botones de acción persuasivos
- **Animaciones:** Efectos tipo casino
- **Comparativas:** Tablas de beneficios

## 🔐 Roles y Permisos

- **Cliente:** Comprar productos, gestionar perfil
- **Admin:** Gestión completa del sistema
- **Vendedor:** Gestión de productos propios (futuro)

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construcción para producción
npm run preview  # Vista previa de producción
npm run lint     # Linter de código
```

## 📦 Dependencias Principales

- **React 18:** Framework principal
- **React Router:** Navegación
- **Supabase:** Backend y autenticación
- **Lucide React:** Iconos
- **Vite:** Herramientas de desarrollo

## 🎯 Próximos Pasos

1. Configurar Supabase con datos de prueba
2. Implementar componentes base
3. Crear páginas principales
4. Añadir funcionalidades de carrito
5. Implementar dashboard admin
6. Optimizar para SEO
7. Preparar para marketplace multi-vendedor

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contacta al equipo de desarrollo.

---

**ME LLEVO ESTO** - La tienda más vendedora del mercado 🛒✨



