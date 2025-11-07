Commit: fix: Corrige conflicto de mayúsculas en importación de AdminBlog 
##########################################
### Download Github Archive Started...
### Fri, 07 Nov 2025 03:39:36 GMT
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
#1 transferring dockerfile: 2.37kB done
#1 DONE 0.0s

#2 [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1741046653
#2 DONE 0.1s

#3 [internal] load .dockerignore
#3 transferring context: 251B done
#3 DONE 0.0s

#4 [stage-0  1/15] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1741046653@sha256:ed406b77fb751927991b8655e76c33a4521c4957c2afeab293be7c63c2a373d2
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 17.32MB 0.2s done
#5 DONE 0.2s

#6 [stage-0  5/15] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
#6 CACHED

#7 [stage-0  6/15] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
#7 CACHED

#8 [stage-0  2/15] WORKDIR /app/
#8 CACHED

#9 [stage-0  3/15] COPY .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix
#9 CACHED

#10 [stage-0  4/15] RUN nix-env -if .nixpacks/nixpkgs-ba913eda2df8eb72147259189d55932012df6301.nix && nix-collect-garbage -d
#10 CACHED

#11 [stage-0  7/15] COPY .nixpacks/assets /assets/
#11 CACHED

#12 [stage-0  8/15] COPY . /app/.
#12 DONE 0.2s

#13 [stage-0  9/15] RUN  caddy fmt --overwrite /assets/Caddyfile
#13 DONE 0.2s

#14 [stage-0 10/15] COPY . /app/.
#14 DONE 0.5s

#15 [stage-0 11/15] RUN --mount=type=cache,id=RYu5ajzqtA-/root/npm,target=/root/.npm npm install
#15 3.592 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#15 3.766 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
#15 3.780 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#15 3.916 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#15 3.934 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#15 4.015 npm warn deprecated formidable@1.2.6: Please upgrade to latest, formidable@v2 or formidable@v3! Check these notes: https://bit.ly/2ZEqIau
#15 4.236 npm warn deprecated @supabase/auth-helpers-react@0.4.2: This package is now deprecated - please use the @supabase/ssr package instead.
#15 4.691 npm warn deprecated superagent@3.8.3: Please upgrade to superagent v10.2.2+, see release notes at https://github.com/forwardemail/superagent/releases/tag/v10.2.2 - maintenance is supported by Forward Email @ https://forwardemail.net
#15 5.912 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
#15 7.491 
#15 7.491 added 592 packages, and audited 593 packages in 7s
#15 7.491 
#15 7.491 176 packages are looking for funding
#15 7.491   run `npm fund` for details
#15 7.507 
#15 7.507 2 moderate severity vulnerabilities
#15 7.507 
#15 7.507 To address all issues (including breaking changes), run:
#15 7.507   npm audit fix --force
#15 7.507 
#15 7.507 Run `npm audit` for details.
#15 DONE 7.9s

#16 [stage-0 12/15] COPY . /app/.
#16 DONE 0.5s

#17 [stage-0 13/15] RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build
#17 0.572 
#17 0.572 > me-llevo-esto@0.0.0 build
#17 0.572 > vite build
#17 0.572 
#17 0.866 vite v4.5.14 building for production...
#17 0.917 transforming...
#17 1.525 ✓ 17 modules transformed.
#17 1.526 ✓ built in 659ms
#17 1.527 Could not resolve "./paginas/admin/Blog/AdminBlog" from "src/App.jsx"
#17 1.527 file: /app/src/App.jsx
#17 1.530 error during build:
#17 1.530 RollupError: Could not resolve "./paginas/admin/Blog/AdminBlog" from "src/App.jsx"
#17 1.530     at error (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:2287:30)
#17 1.530     at ModuleLoader.handleInvalidResolvedId (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24860:24)
#17 1.530     at file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24822:26
#17 1.554 npm notice
#17 1.554 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#17 1.554 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#17 1.554 npm notice To update run: npm install -g npm@11.6.2
#17 1.554 npm notice
#17 ERROR: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
------
 > [stage-0 13/15] RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build:
1.530 error during build:
1.530 RollupError: Could not resolve "./paginas/admin/Blog/AdminBlog" from "src/App.jsx"
1.530     at error (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:2287:30)
1.530     at ModuleLoader.handleInvalidResolvedId (file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24860:24)
1.530     at file:///app/node_modules/rollup/dist/es/shared/node-entry.js:24822:26
1.554 npm notice
1.554 npm notice New major version of npm available! 10.8.2 -> 11.6.2
1.554 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
1.554 npm notice To update run: npm install -g npm@11.6.2
1.554 npm notice
------

 7 warnings found (use docker --debug to expand):
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "VITE_EPAYCO_P_KEY") (line 13)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "VITE_SUPABASE_ANON_KEY") (line 13)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ENV "VITE_EPAYCO_PRIVATE_KEY") (line 14)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ENV "VITE_EPAYCO_P_KEY") (line 14)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ENV "VITE_SUPABASE_ANON_KEY") (line 14)
 - UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH' (line 27)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "VITE_EPAYCO_PRIVATE_KEY") (line 13)
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
### Fri, 07 Nov 2025 03:39:51 GMT
##########################################

Command failed with exit code 1: docker buildx build --network host -f /etc/easypanel/projects/mellevoesto/me_llevo_esto/code/.nixpacks/Dockerfile -t easypanel/mellevoesto/me_llevo_esto --label 'keep=true' --build-arg 'VITE_SUPABASE_URL=https://rrmafdbxvimmvcerwguy.supabase.co' --build-arg 'VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybWFmZGJ4dmltbXZjZXJ3Z3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MzYwNDcsImV4cCI6MjA3MjAxMjA0N30.DXx7sOXstXJ_Q9PMrTNQL0ox_LjQGF6i2lU1HrGSVXk' --build-arg 'VITE_EPAYCO_P_CUST_ID_CLIENTE=1566446' --build-arg 'VITE_EPAYCO_P_KEY=186c5f30d26856adac71cc09eb206f4974c3c2f0' --build-arg 'VITE_EPAYCO_PUBLIC_KEY=e501df1e6a575f6994324e0e2281e452' --build-arg 'VITE_EPAYCO_PRIVATE_KEY=77b0fc1eca062414274007100f923477' --build-arg 'VITE_EPAYCO_BASE_URL=https://secure.epayco.co' --build-arg 'VITE_EPAYCO_API_URL=https://api.secure.epayco.co' --build-arg 'VITE_EPAYCO_TEST_MODE=true' --build-arg 'VITE_EPAYCO_LENGUAJE=ES' --build-arg 'VITE_EPAYCO_ENVIRONMENT=test' --build-arg 'VITE_EPAYCO_URL_RESPONSE=https://mellevoesto.com/respuesta-epayco' --build-arg 'VITE_EPAYCO_URL_CONFIRMATION=https://mellevoesto.com/confirmacion-epayco' --build-arg 'GIT_SHA=851baf2f37c0c32f49533325de1cb232da161a1c' /etc/easypanel/projects/mellevoesto/me_llevo_esto/code/