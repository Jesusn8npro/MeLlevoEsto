import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clienteSupabase } from '../../configuracion/supabase';

const ConfirmacionEpayco = () => {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState('procesando');
  const [mensaje, setMensaje] = useState('Procesando confirmación...');

  useEffect(() => {
    procesarConfirmacion();
  }, []);

  const procesarConfirmacion = async () => {
    try {
      // Obtener todos los parámetros de ePayco
      const parametros = {
        ref_payco: searchParams.get('ref_payco'),
        response: searchParams.get('response'),
        transaction_id: searchParams.get('transaction_id'),
        approval_code: searchParams.get('approval_code'),
        franchise: searchParams.get('franchise'),
        bank_name: searchParams.get('bank_name'),
        cod_response: searchParams.get('cod_response'),
        signature: searchParams.get('signature'),
        test_request: searchParams.get('test_request'),
        x_amount: searchParams.get('x_amount'),
        x_currency_code: searchParams.get('x_currency_code'),
        x_description: searchParams.get('x_description'),
        x_id_invoice: searchParams.get('x_id_invoice')
      };

      console.log('🔔 Confirmación de ePayco recibida:', parametros);

      // Registrar en logs de transacciones
      const logData = {
        epayco_ref_payco: parametros.ref_payco,
        epayco_transaction_id: parametros.transaction_id,
        tipo_evento: 'confirmation',
        cod_response: parametros.cod_response,
        mensaje_response: parametros.response,
        signature_valida: true, // TODO: Implementar validación de firma
        datos_completos: parametros,
        creado_el: new Date().toISOString()
      };

      // Insertar log en Supabase
      const { error: errorLog } = await clienteSupabase
        .from('transacciones_epayco_logs')
        .insert([logData]);

      if (errorLog) {
        console.error('❌ Error al insertar log:', errorLog);
      } else {
        console.log('✅ Log de confirmación guardado');
      }

      // Buscar el pedido por referencia
      if (parametros.ref_payco) {
        const { data: pedidos, error: errorPedido } = await clienteSupabase
          .from('pedidos')
          .select('*')
          .eq('epayco_ref_payco', parametros.ref_payco)
          .single();

        if (errorPedido) {
          console.error('❌ Error al buscar pedido:', errorPedido);
          setEstado('error');
          setMensaje('Error al buscar el pedido');
          return;
        }

        if (pedidos) {
          // Actualizar el pedido con los datos de ePayco
          const datosActualizacion = {
            epayco_transaction_id: parametros.transaction_id,
            epayco_cod_response: parametros.cod_response,
            epayco_signature: parametros.signature,
            epayco_approval_code: parametros.approval_code,
            epayco_fecha_transaccion: new Date().toISOString(),
            epayco_franchise: parametros.franchise,
            epayco_bank_name: parametros.bank_name,
            epayco_test_request: parametros.test_request === 'true',
            epayco_response_raw: parametros
          };

          // Actualizar estado del pedido según la respuesta
          if (parametros.cod_response === '1') {
            datosActualizacion.estado = 'confirmado';
          } else if (parametros.cod_response === '2') {
            datosActualizacion.estado = 'cancelado';
          } else if (parametros.cod_response === '3') {
            datosActualizacion.estado = 'pendiente';
          }

          const { error: errorActualizacion } = await clienteSupabase
            .from('pedidos')
            .update(datosActualizacion)
            .eq('id', pedidos.id);

          if (errorActualizacion) {
            console.error('❌ Error al actualizar pedido:', errorActualizacion);
            setEstado('error');
            setMensaje('Error al actualizar el pedido');
          } else {
            console.log('✅ Pedido actualizado correctamente');
            setEstado('exitoso');
            setMensaje('Confirmación procesada correctamente');
          }
        } else {
          console.warn('⚠️ No se encontró pedido con ref_payco:', parametros.ref_payco);
          setEstado('advertencia');
          setMensaje('Pedido no encontrado');
        }
      } else {
        console.error('❌ No se recibió ref_payco');
        setEstado('error');
        setMensaje('Referencia de pago no válida');
      }

    } catch (error) {
      console.error('❌ Error al procesar confirmación:', error);
      setEstado('error');
      setMensaje('Error interno del servidor');
    }
  };

  // Esta página es principalmente para webhooks, no para mostrar al usuario
  // Pero incluimos una respuesta básica por si acaso
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          {estado === 'procesando' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          )}
          {estado === 'exitoso' && (
            <div className="text-green-600 text-4xl">✅</div>
          )}
          {estado === 'error' && (
            <div className="text-red-600 text-4xl">❌</div>
          )}
          {estado === 'advertencia' && (
            <div className="text-yellow-600 text-4xl">⚠️</div>
          )}
        </div>
        
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Confirmación de Pago
        </h1>
        
        <p className="text-gray-600 mb-6">
          {mensaje}
        </p>

        <div className="text-sm text-gray-500">
          <p>Esta página procesa las confirmaciones automáticas de ePayco.</p>
          <p>Si ves esta página, la confirmación se está procesando correctamente.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionEpayco;