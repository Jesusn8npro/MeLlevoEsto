import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    build: {
      sourcemap: false, // Desactivar source maps en producción
      minify: 'terser', // Usar Terser para minificación
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remover console.logs en producción
          drop_debugger: isProduction, // Remover debuggers en producción
        },
      },
    },
  };
});