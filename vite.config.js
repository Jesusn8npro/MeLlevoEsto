import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Ofuscar el bundle solo en producción
    obfuscatorPlugin({
      apply: 'build',
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.7,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: false,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      }
    })
  ],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    // En producción no exponemos sourcemaps ni consola
    sourcemap: false,
    minify: 'esbuild',
    esbuild: {
      // Elimina llamadas a console y debugger en el build de producción
      drop: ['console', 'debugger']
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}))

