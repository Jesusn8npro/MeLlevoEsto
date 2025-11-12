Commit: Merge branch 'main' of https://github.com/Jesusn8npro/MeLlevoEsto
# Please enter a commit message to explain why this merge is necessary,
# especially if it merges an updated upstream into a topic branch.
#
# Lines starting with '#' will be ignored, and an empty message aborts
# the commit. 
##########################################
### Download Github Archive Started...
### Fri, 17 Oct 2025 05:22:25 GMT
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
#1 transferring dockerfile: 1.73kB done
#1 DONE 0.0s

#2 [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1741046653
#2 DONE 0.2s

#3 [internal] load .dockerignore
#3 transferring context: 251B done
#3 DONE 0.0s

#4 [stage-0  1/15] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1741046653@sha256:ed406b77fb751927991b8655e76c33a4521c4957c2afeab293be7c63c2a373d2
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 14.68MB 0.3s done
#5 DONE 0.3s

#6 [stage-0  3/15] COPY .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix
#6 CACHED

#7 [stage-0  4/15] RUN nix-env -if .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix && nix-collect-garbage -d
#7 CACHED

#8 [stage-0  5/15] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
#8 CACHED

#9 [stage-0  6/15] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
#9 CACHED

#10 [stage-0  2/15] WORKDIR /app/
#10 CACHED

#11 [stage-0  7/15] COPY .nixpacks/assets /assets/
#11 CACHED

#12 [stage-0  8/15] COPY . /app/.
#12 DONE 0.2s

#13 [stage-0  9/15] RUN  caddy fmt --overwrite /assets/Caddyfile
#13 DONE 0.6s

#14 [stage-0 10/15] COPY . /app/.
#14 DONE 0.4s

#15 [stage-0 11/15] RUN --mount=type=cache,id=RYu5ajzqtA-/root/npm,target=/root/.npm npm install
#15 3.136 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#15 3.315 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
#15 3.328 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#15 3.449 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#15 3.460 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#15 3.611 npm warn deprecated @supabase/auth-helpers-react@0.4.2: This package is now deprecated - please use the @supabase/ssr package instead.
#15 5.303 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
#15 6.609 
#15 6.609 added 462 packages, and audited 463 packages in 6s
#15 6.610 
#15 6.610 163 packages are looking for funding
#15 6.610   run `npm fund` for details
#15 6.619 
#15 6.619 2 moderate severity vulnerabilities
#15 6.619 
#15 6.619 To address all issues (including breaking changes), run:
#15 6.619   npm audit fix --force
#15 6.619 
#15 6.619 Run `npm audit` for details.
#15 DONE 6.9s

#16 [stage-0 12/15] COPY . /app/.
#16 DONE 0.4s

#17 [stage-0 13/15] RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build
#17 1.064 
#17 1.064 > me-llevo-esto@0.0.0 build
#17 1.064 > vite build
#17 1.064 
#17 1.363 vite v4.5.14 building for production...
#17 1.407 transforming...
#17 4.280 ✓ 144 modules transformed.
#17 4.280 ✓ built in 2.92s
#17 4.281 Could not resolve "./formularioproducto.css" from "src/componentes/admin/ecommerce/PaginaCrearProductosComponentes/FormularioProducto.jsx"
#17 4.281 file: /app/src/componentes/admin/ecommerce/PaginaCrearProductosComponentes/FormularioProducto.jsx
#17 4.283 error during build:
#17 4.283 RollupError: Could not resolve "./formularioproducto.css" from "src/componentes/admin/ecommerce/PaginaCrearProductosComponentes/FormularioProducto.jsx"
#17 4.283     at error (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:2287:30)
#17 4.283     at ModuleLoader.handleInvalidResolvedId (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24860:24)
#17 4.283     at file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24822:26
#17 4.316 npm notice
#17 4.316 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#17 4.316 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#17 4.316 npm notice To update run: npm install -g npm@11.6.2
#17 4.316 npm notice
#17 ERROR: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
------
 > [stage-0 13/15] RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build:
4.283 error during build:
4.283 RollupError: Could not resolve "./formularioproducto.css" from "src/componentes/admin/ecommerce/PaginaCrearProductosComponentes/FormularioProducto.jsx"
4.283     at error (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:2287:30)
4.283     at ModuleLoader.handleInvalidResolvedId (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24860:24)
4.283     at file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24822:26
4.316 npm notice
4.316 npm notice New major version of npm available! 10.8.2 -> 11.6.2
4.316 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
4.316 npm notice To update run: npm install -g npm@11.6.2
4.316 npm notice
------

 3 warnings found (use docker --debug to expand):
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ENV "VITE_SUPABASE_ANON_KEY") (line 14)
 - UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH' (line 27)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "VITE_SUPABASE_ANON_KEY") (line 13)
Dockerfile:33
--------------------
  31 |     # build phase
  32 |     COPY . /app/.
  33 | >>> RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build
  34 |     
  35 |     
--------------------
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
##########################################
### Error
### Fri, 17 Oct 2025 05:22:41 GMT
##########################################

Command failed with exit code 1: docker buildx build --network host -f /etc/easypanel/projects/mellevoesto/me_llevo_esto/code/.nixpacks/Dockerfile -t easypanel/mellevoesto/me_llevo_esto --label 'keep=true' --build-arg 'VITE_SUPABASE_URL=https://rrmafdbxvimmvcerwguy.supabase.co' --build-arg 'VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybWFmZGJ4dmltbXZjZXJ3Z3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzYwNDcsImV4cCI6MjA3MjAxMjA0N30.DXx7sOXstXJ_Q9PMrTNQL0ox_LjQGF6i2lU1HrGSVXk' --build-arg 'VITE_URL_BASE=https://mellevoesto-me-llevo-esto.lnrubg.easypanel.host/' --build-arg 'VITE_MODO_DESARROLLO=false' --build-arg 'VITE_DEBUG=false' --build-arg 'GIT_SHA=e59ffb398891fea013a4b08c38756b6ceb5f16c0' /etc/easypanel/projects/mellevoesto/me_llevo_esto/code/