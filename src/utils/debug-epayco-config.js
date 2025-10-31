/**
 * Script de diagnóstico para verificar la configuración de ePayco
 * Ejecutar en la consola del navegador en producción para identificar problemas
 */

console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN EPAYCO');
console.log('=====================================');

// Verificar variables de entorno
console.log('\n📋 Variables de entorno:');
console.log('VITE_EPAYCO_PUBLIC_KEY:', import.meta.env.VITE_EPAYCO_PUBLIC_KEY);
console.log('VITE_EPAYCO_PRIVATE_KEY:', import.meta.env.VITE_EPAYCO_PRIVATE_KEY ? '***CONFIGURADA***' : 'NO CONFIGURADA');
console.log('VITE_EPAYCO_TEST_MODE:', import.meta.env.VITE_EPAYCO_TEST_MODE);
console.log('VITE_EPAYCO_ENVIRONMENT:', import.meta.env.VITE_EPAYCO_ENVIRONMENT);
console.log('VITE_EPAYCO_URL_RESPONSE:', import.meta.env.VITE_EPAYCO_URL_RESPONSE);
console.log('VITE_EPAYCO_URL_CONFIRMATION:', import.meta.env.VITE_EPAYCO_URL_CONFIRMATION);

// Verificar configuración importada
try {
  const { EPAYCO_CONFIG } = await import('../configuracion/constantes.js');
  console.log('\n⚙️ Configuración EPAYCO_CONFIG:');
  console.log('PUBLIC_KEY:', EPAYCO_CONFIG.PUBLIC_KEY);
  console.log('PRIVATE_KEY:', EPAYCO_CONFIG.PRIVATE_KEY ? '***CONFIGURADA***' : 'NO CONFIGURADA');
  console.log('TEST_MODE:', EPAYCO_CONFIG.TEST_MODE);
  console.log('COUNTRY:', EPAYCO_CONFIG.COUNTRY);
  console.log('CURRENCY:', EPAYCO_CONFIG.CURRENCY);
  console.log('RESPONSE_URL:', EPAYCO_CONFIG.RESPONSE_URL);
  console.log('CONFIRMATION_URL:', EPAYCO_CONFIG.CONFIRMATION_URL);
  
  // Verificar qué valores están undefined
  const valoresUndefined = [];
  Object.keys(EPAYCO_CONFIG).forEach(key => {
    if (EPAYCO_CONFIG[key] === undefined) {
      valoresUndefined.push(key);
    }
  });
  
  if (valoresUndefined.length > 0) {
    console.log('\n❌ Valores UNDEFINED encontrados:');
    valoresUndefined.forEach(key => {
      console.log(`- ${key}: undefined`);
    });
  } else {
    console.log('\n✅ Todos los valores están configurados');
  }
  
} catch (error) {
  console.error('\n❌ Error al importar configuración:', error);
}

// Verificar SDK de ePayco
console.log('\n🔌 SDK de ePayco:');
console.log('window.ePayco disponible:', typeof window.ePayco !== 'undefined');
if (typeof window.ePayco !== 'undefined') {
  console.log('window.ePayco.checkout disponible:', typeof window.ePayco.checkout !== 'undefined');
  if (typeof window.ePayco.checkout !== 'undefined') {
    console.log('window.ePayco.checkout.configure disponible:', typeof window.ePayco.checkout.configure === 'function');
  }
}

console.log('\n🎯 RESUMEN:');
console.log('===========');
if (import.meta.env.VITE_EPAYCO_PUBLIC_KEY) {
  console.log('✅ Variables de entorno parecen estar configuradas');
} else {
  console.log('❌ Variables de entorno NO están configuradas en producción');
  console.log('💡 Solución: Configurar las variables VITE_EPAYCO_* en tu plataforma de despliegue');
}