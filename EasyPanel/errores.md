Commit: Force redeploy: Actualizar nixpacks.toml para forzar nuevo despliegue en EasyPanel

- Agregar comentario para forzar redespliegue
- Asegurar que EasyPanel use las correcciones del servidor (serve en lugar de vite preview)
- Resolver problema persistente 'Service not reachable' 
##########################################
### Download Github Archive Started...
### Tue, 30 Sep 2025 16:53:39 GMT
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
#5 transferring context: 12.18MB 0.2s done
#5 DONE 0.2s

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
#13 DONE 0.4s

#14 [stage-0 10/15] COPY . /app/.
#14 DONE 0.3s

#15 [stage-0 11/15] RUN --mount=type=cache,id=RYu5ajzqtA-/root/npm,target=/root/.npm npm install
#15 6.844 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#15 6.992 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
#15 6.998 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#15 7.100 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#15 7.111 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#15 7.253 npm warn deprecated @supabase/auth-helpers-react@0.4.2: This package is now deprecated - please use the @supabase/ssr package instead.
#15 9.629 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
#15 12.33 
#15 12.33 added 462 packages, and audited 463 packages in 12s
#15 12.33 
#15 12.33 163 packages are looking for funding
#15 12.33   run `npm fund` for details
#15 12.34 
#15 12.34 2 moderate severity vulnerabilities
#15 12.34 
#15 12.34 To address all issues (including breaking changes), run:
#15 12.34   npm audit fix --force
#15 12.34 
#15 12.34 Run `npm audit` for details.
#15 DONE 12.5s

#16 [stage-0 12/15] COPY . /app/.
#16 DONE 0.6s

#17 [stage-0 13/15] RUN --mount=type=cache,id=RYu5ajzqtA-node_modules/cache,target=/app/node_modules/.cache npm run build
#17 0.901 
#17 0.901 > me-llevo-esto@0.0.0 build
#17 0.901 > vite build
#17 0.901 
#17 1.240 vite v4.5.14 building for production...
#17 1.284 transforming...
#17 8.210 ✓ 1432 modules transformed.
#17 9.223 rendering chunks...
#17 10.10 computing gzip size...
#17 10.14 dist/index.html                   0.72 kB │ gzip:   0.48 kB
#17 10.14 dist/assets/index-c5bbd36f.css  303.18 kB │ gzip:  48.14 kB
#17 10.14 dist/assets/index-95427436.js   692.40 kB │ gzip: 181.91 kB │ map: 2,253.05 kB
#17 10.14 
#17 10.14 (!) Some chunks are larger than 500 kBs after minification. Consider:
#17 10.14 - Using dynamic import() to code-split the application
#17 10.14 - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
#17 10.14 - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
#17 10.14 ✓ built in 8.90s
#17 10.24 npm notice
#17 10.24 npm notice New major version of npm available! 10.8.2 -> 11.6.1
#17 10.24 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.1
#17 10.24 npm notice To update run: npm install -g npm@11.6.1
#17 10.24 npm notice
#17 DONE 10.3s

#18 [stage-0 14/15] RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile
#18 DONE 0.1s

#19 [stage-0 15/15] COPY . /app
#19 DONE 0.5s

#20 exporting to image
#20 exporting layers
#20 exporting layers 10.8s done
#20 writing image sha256:016a8c40b1850543e2489e4ec043f7c941f8ac4bf8496e9ff18961b82baf9126 done
#20 naming to docker.io/easypanel/mellevoesto/me_llevo_esto done
#20 DONE 10.8s

 3 warnings found (use docker --debug to expand):
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "VITE_SUPABASE_ANON_KEY") (line 13)
 - SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ENV "VITE_SUPABASE_ANON_KEY") (line 14)
 - UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH' (line 27)
##########################################
### Success
### Tue, 30 Sep 2025 16:54:20 GMT
##########################################