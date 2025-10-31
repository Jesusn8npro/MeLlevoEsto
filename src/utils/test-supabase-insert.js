// Script de prueba para verificar la inserción en Supabase
// Ejecutar desde la consola del navegador para diagnosticar problemas

import { clienteSupabase } from '../configuracion/supabase.js';

/**
 * Función para probar la inserción en la tabla transacciones_epayco_logs
 */
export async function probarInsercionSupabase() {
  console.log('🧪 Iniciando prueba de inserción en Supabase...');
  
  try {
    // 1. Verificar configuración del cliente
    console.log('1️⃣ Verificando configuración del cliente Supabase...');
    if (!clienteSupabase) {
      console.error('❌ Cliente Supabase no está configurado');
      return;
    }
    console.log('✅ Cliente Supabase configurado correctamente');

    // 2. Probar conexión básica
    console.log('2️⃣ Probando conexión básica...');
    const { data: testConnection, error: connectionError } = await clienteSupabase
      .from('transacciones_epayco_logs')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      return;
    }
    console.log('✅ Conexión exitosa. Registros en tabla:', testConnection);

    // 3. Probar inserción de datos de prueba
    console.log('3️⃣ Probando inserción de datos de prueba...');
    const datosTest = {
      pedido_id: 'TEST_' + Date.now(),
      epayco_ref_payco: 'REF_TEST_' + Date.now(),
      epayco_transaction_id: 'TXN_TEST_' + Date.now(),
      tipo_evento: 'test',
      estado_nuevo: 'test',
      cod_response: '999',
      mensaje_response: 'Prueba de inserción',
      datos_completos: { test: true, timestamp: new Date().toISOString() },
      creado_el: new Date().toISOString()
    };

    console.log('📊 Datos a insertar:', datosTest);

    const { data, error } = await clienteSupabase
      .from('transacciones_epayco_logs')
      .insert([datosTest])
      .select();

    if (error) {
      console.error('❌ Error en la inserción:', error);
      console.error('📋 Detalles del error:');
      console.error('  - Código:', error.code);
      console.error('  - Mensaje:', error.message);
      console.error('  - Detalles:', error.details);
      console.error('  - Hint:', error.hint);
      
      // Diagnóstico específico
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        console.error('🔒 PROBLEMA: Las políticas RLS están bloqueando la inserción');
        console.error('💡 SOLUCIÓN: Ejecuta el script fix_rls_policies.sql en Supabase');
      } else if (error.message?.includes('permission denied')) {
        console.error('🔒 PROBLEMA: Permisos insuficientes');
        console.error('💡 SOLUCIÓN: Verifica las políticas RLS y permisos de la tabla');
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.error('🗃️ PROBLEMA: La tabla no existe');
        console.error('💡 SOLUCIÓN: Ejecuta los scripts de creación de tablas');
      }
      
      return false;
    }

    console.log('✅ Inserción exitosa:', data);
    
    // 4. Verificar que se puede leer el registro insertado
    console.log('4️⃣ Verificando lectura del registro insertado...');
    const { data: readData, error: readError } = await clienteSupabase
      .from('transacciones_epayco_logs')
      .select('*')
      .eq('pedido_id', datosTest.pedido_id);

    if (readError) {
      console.error('❌ Error al leer el registro:', readError);
      return false;
    }

    console.log('✅ Lectura exitosa:', readData);
    
    // 5. Limpiar datos de prueba
    console.log('5️⃣ Limpiando datos de prueba...');
    const { error: deleteError } = await clienteSupabase
      .from('transacciones_epayco_logs')
      .delete()
      .eq('pedido_id', datosTest.pedido_id);

    if (deleteError) {
      console.warn('⚠️ No se pudo eliminar el registro de prueba:', deleteError);
    } else {
      console.log('✅ Datos de prueba eliminados');
    }

    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error inesperado en la prueba:', error);
    console.error('📋 Stack trace:', error.stack);
    return false;
  }
}

// Función para ejecutar desde la consola del navegador
window.probarSupabase = probarInsercionSupabase;