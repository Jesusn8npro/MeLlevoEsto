import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
<<<<<<< HEAD
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isProduction
          ? '[hash:base64:8]'
          : '[name]__[local]__[hash:base64:5]',
      },
    },
=======
>>>>>>> bf661ffa5c8178383d447a0252a503d6f79768bc
    build: {
      sourcemap: false, // Desactivar source maps en producción
      minify: 'terser', // Usar Terser para minificación
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remover console.logs en producción
          drop_debugger: isProduction, // Remover debuggers en producción
          pure_funcs: ['console.log', 'console.info', 'console.debug'], // Eliminar llamadas específicas
          passes: 3, // Múltiples pases de compresión para mejor optimización
        },
        mangle: {
          properties: true, // Ofuscar nombres de propiedades
          safari10: true, // Soporte para Safari 10
        },
        format: {
          comments: false, // Eliminar comentarios
        },
      },
    },
  };
});