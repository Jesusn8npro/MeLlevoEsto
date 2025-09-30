Commit: fix: Simplificar configuración Nixpacks para resolver errores de build

- Simplificar nixpacks.toml eliminando configuraciones complejas
- Eliminar plan.json que causaba conflictos
- Agregar Procfile como alternativa más compatible
- Resolver errores de build de Nix en EasyPanel 
##########################################
### Download Github Archive Started...
### Tue, 30 Sep 2025 16:34:15 GMT
##########################################


╔═════════════════════ Nixpacks v1.34.1 ═════════════════════╗
║ setup      │ nodejs_18, npm-9_x                            ║
║────────────────────────────────────────────────────────────║
║ caddy      │ pkgs: caddy                                   ║
║            │ cmds: caddy fmt --overwrite /assets/Caddyfile ║
║────────────────────────────────────────────────────────────║
║ install    │ npm install                                   ║
║────────────────────────────────────────────────────────────║
║ build      │ npm run build                                 ║
║────────────────────────────────────────────────────────────║
║ start      │ npm run preview                               ║
╚════════════════════════════════════════════════════════════╝


Saved output to:
  /etc/easypanel/projects/mellevoesto/me_llevo_esto/code/
#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 1.71kB done
#1 DONE 0.0s

#2 [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1741046653
#2 DONE 1.4s

#3 [internal] load .dockerignore
#3 transferring context: 251B done
#3 DONE 0.0s

#4 [stage-0  1/15] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1741046653@sha256:ed406b77fb751927991b8655e76c33a4521c4957c2afeab293be7c63c2a373d2
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 12.18MB 0.4s done
#5 DONE 0.4s

#6 [stage-0  2/15] WORKDIR /app/
#6 CACHED

#7 [stage-0  3/15] COPY .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix
#7 CACHED

#8 [stage-0  4/15] RUN nix-env -if .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix && nix-collect-garbage -d
#8 CACHED

#9 [stage-0  5/15] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
#9 CACHED

#10 [stage-0  6/15] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
#10 CACHED

#11 [stage-0  7/15] COPY .nixpacks/assets /assets/
#11 CACHED

#12 [stage-0  8/15] COPY . /app/.
#12 DONE 0.2s

#13 [stage-0  9/15] RUN  caddy fmt --overwrite /assets/Caddyfile
#13 DONE 0.5s

#14 [stage-0 10/15] COPY . /app/.
#14 DONE 0.3s

#15 [stage-0 11/15] RUN --mount=type=cache,id=RYu5ajzqtA-/root/npm,target=/root/.npm npm install
#15 3.230 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#15 3.366 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
#15 3.387 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#15 3.487 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#15 3.496 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#15 3.632 npm warn deprecated @supabase/auth-helpers-react@0.4.2: This package is now deprecated - please use the @supabase/ssr package instead.
#15 5.682 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
#15 7.868 
#15 7.868 added 394 packages, and audited 395 packages in 8s
#15 7.868 
#15 7.868 139 packages are looking for funding
#15 7.868   run `npm fund` for details
#15 7.885 
#15 7.885 2 moderate severity vulnerabilities
#15 7.885 
#15 7.885 To address all issues (including breaking changes), run:
#15 7.885   npm audit fix --force
#15 7.885 
#15 7.885 Run `npm audit` for details.
#15 DONE 7.9s

#16 [stage-0 12/15] COPY . /app/.
#16 DONE 0.8s

#17 [stage-0 13/15] RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build
#17 1.050 
#17 1.050 > me-llevo-esto@0.0.0 build
#17 1.050 > vite build
#17 1.050 
#17 1.354 vite v4.5.14 building for production...
#17 1.400 transforming...
#17 7.726 ✓ 1432 modules transformed.
#17 8.453 [plugin:vite:reporter] 
#17 8.453 (!) /app/src/configuracion/supabase.js is dynamically imported by /app/src/componentes/admin/ChatImagenesIA.jsx, /app/src/componentes/admin/CrearProductoIA.jsx, /app/src/componentes/autenticacion/ModalAutenticacion.jsx, /app/src/componentes/autenticacion/ModalAutenticacion.jsx but also statically imported by /app/src/componentes/admin/FormularioProducto.jsx, /app/src/componentes/admin/ecommerce/MetricasEcommerce.jsx, /app/src/componentes/admin/ecommerce/PedidosRecientes.jsx, /app/src/componentes/producto/GridProductosVendedor.jsx, /app/src/componentes/producto/ProductosDemo.jsx, /app/src/componentes/tienda/SidebarFiltros.jsx, /app/src/contextos/ContextoAutenticacion.jsx, /app/src/hooks/usarLandingData.js, /app/src/hooks/usarProducto.js, /app/src/paginas/admin/ecommerce/Categorias.jsx, /app/src/paginas/admin/ecommerce/Inventario.jsx, /app/src/paginas/admin/ec