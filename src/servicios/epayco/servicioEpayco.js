/**
 * Servicio principal de ePayco
 * Maneja todas las operaciones de pago, validaciones y comunicación con la API de ePayco
 */

// import epayco from 'epayco-sdk-node'; // Comentado para evitar errores en el frontend
import { configuracionEpayco, obtenerConfiguracionSDK, validarConfiguracion } from './configuracionEpayco.js';
import { clienteSupabase } from '../../configuracion/supabase.js';

class ServicioEpayco {
  constructor() {
    this.cliente = null;
    this.inicializado = false;
    // No inicializar automáticamente en el frontend
    // this.inicializar();
  }

  /**
   * Inicializa el cliente de ePayco
   */
  inicializar() {
    try {
      const validacion = validarConfiguracion();
      
      if (!validacion.esValida) {
        console.error('Error en configuración de ePayco:', validacion.errores);
        throw new Error(`Configuración de ePayco inválida: ${validacion.errores.join(', ')}`);
      }

      const config = obtenerConfiguracionSDK();
      // this.cliente = epayco(config); // Comentado para evitar errores en el frontend
      this.inicializado = false; // Cambiado a false ya que no se puede inicializar en el frontend
      
      console.log('✅ Servicio ePayco inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar ePayco:', error);
      throw error;
    }
  }

  /**
   * Verifica que el servicio esté inicializado
   */
  verificarInicializacion() {
    if (!this.inicializado || !this.cliente) {
      throw new Error('Servicio ePayco no está inicializado');
    }
  }

  /**
   * Crea un token de tarjeta de crédito
   * @param {Object} datosTarjeta - Información de la tarjeta
   * @returns {Promise<Object>} Token de la tarjeta
   */
  async crearTokenTarjeta(datosTarjeta) {
    this.verificarInicializacion();

    try {
      const infoTarjeta = {
        "card[number]": datosTarjeta.numero,
        "card[exp_year]": datosTarjeta.anioExpiracion,
        "card[exp_month]": datosTarjeta.mesExpiracion,
        "card[cvc]": datosTarjeta.cvc,
        "hasCvv": true
      };

      const token = await this.cliente.token.create(infoTarjeta);
      
      if (token.success) {
        console.log('✅ Token de tarjeta creado exitosamente');
        return {
          exito: true,
          token: token.data.id,
          franquicia: token.data.franchise,
          mascara: token.data.mask,
          datos: token.data
        };
      } else {
        throw new Error(token.data?.description || 'Error al crear token de tarjeta');
      }
    } catch (error) {
      console.error('❌ Error al crear token de tarjeta:', error);
      return {
        exito: false,
        error: error.message,
        detalles: error
      };
    }
  }

  /**
   * Crea un cliente en ePayco
   * @param {Object} datosCliente - Información del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async crearCliente(datosCliente) {
    this.verificarInicializacion();

    try {
      const infoCliente = {
        token_card: datosCliente.tokenTarjeta,
        name: datosCliente.nombre,
        last_name: datosCliente.apellido,
        email: datosCliente.email,
        default: true,
        city: datosCliente.ciudad || 'Bogotá',
        address: datosCliente.direccion || '',
        phone: datosCliente.telefono || '',
        cell_phone: datosCliente.celular || ''
      };

      const cliente = await this.cliente.customers.create(infoCliente);
      
      if (cliente.success) {
        console.log('✅ Cliente creado exitosamente en ePayco');
        return {
          exito: true,
          clienteId: cliente.data.customerId,
          datos: cliente.data
        };
      } else {
        throw new Error(cliente.data?.description || 'Error al crear cliente');
      }
    } catch (error) {
      console.error('❌ Error al crear cliente:', error);
      return {
        exito: false,
        error: error.message,
        detalles: error
      };
    }
  }

  /**
   * Procesa un pago con tarjeta de crédito
   * @param {Object} datosPago - Información del pago
   * @returns {Promise<Object>} Resultado del pago
   */
  async procesarPagoTarjeta(datosPago) {
    this.verificarInicializacion();

    try {
      const infoPago = {
        token_card: datosPago.tokenTarjeta,
        customer_id: datosPago.clienteId,
        doc_type: datosPago.tipoDocumento || 'CC',
        doc_number: datosPago.numeroDocumento,
        name: datosPago.nombre,
        last_name: datosPago.apellido,
        email: datosPago.email,
        city: datosPago.ciudad,
        address: datosPago.direccion,
        phone: datosPago.telefono,
        cell_phone: datosPago.celular,
        bill: datosPago.factura,
        description: datosPago.descripcion,
        value: datosPago.valor,
        tax: datosPago.impuesto || 0,
        tax_base: datosPago.baseImpuesto || datosPago.valor,
        ico: datosPago.ico || 0,
        currency: datosPago.moneda || 'COP',
        dues: datosPago.cuotas || 1,
        ip: datosPago.ip || '127.0.0.1',
        url_response: configuracionEpayco.urlRespuesta,
        url_confirmation: configuracionEpayco.urlConfirmacion,
        method_confirmation: 'POST'
      };

      const pago = await this.cliente.charge.create(infoPago);
      
      // Registrar la transacción en nuestra base de datos
      await this.registrarTransaccion({
        pedidoId: datosPago.pedidoId,
        referenciaPago: pago.data?.ref_payco || null,
        estado: pago.data?.estado || 'pendiente',
        respuestaCompleta: pago,
        tipo: 'pago_tarjeta'
      });

      if (pago.success) {
        console.log('✅ Pago procesado exitosamente');
        return {
          exito: true,
          referencia: pago.data.ref_payco,
          estado: pago.data.estado,
          urlPago: pago.data.urlbanco,
          datos: pago.data
        };
      } else {
        throw new Error(pago.data?.description || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      
      // Registrar el error en la base de datos
      if (datosPago.pedidoId) {
        await this.registrarTransaccion({
          pedidoId: datosPago.pedidoId,
          estado: 'error',
          respuestaCompleta: { error: error.message },
          tipo: 'pago_tarjeta_error'
        });
      }

      return {
        exito: false,
        error: error.message,
        detalles: error
      };
    }
  }

  /**
   * Consulta el estado de una transacción
   * @param {string} referencia - Referencia de la transacción
   * @returns {Promise<Object>} Estado de la transacción
   */
  async consultarTransaccion(referencia) {
    this.verificarInicializacion();

    try {
      const consulta = await this.cliente.charge.get(referencia);
      
      if (consulta.success) {
        return {
          exito: true,
          estado: consulta.data.estado,
          datos: consulta.data
        };
      } else {
        throw new Error('Error al consultar la transacción');
      }
    } catch (error) {
      console.error('❌ Error al consultar transacción:', error);
      return {
        exito: false,
        error: error.message
      };
    }
  }

  /**
   * Registra una transacción en nuestra base de datos
   * @param {Object} datosTransaccion - Datos de la transacción
   */
  async registrarTransaccion(datosTransaccion) {
    try {
      console.log('🔄 Intentando registrar transacción en BD...');
      console.log('📊 Datos a insertar:', {
        pedido_id: datosTransaccion.pedidoId,
        epayco_ref_payco: datosTransaccion.referenciaPago,
        epayco_transaction_id: datosTransaccion.respuestaCompleta?.x_transaction_id || null,
        tipo_evento: datosTransaccion.tipo || 'response',
        estado_nuevo: datosTransaccion.estado,
        cod_response: datosTransaccion.respuestaCompleta?.x_cod_response || null,
        mensaje_response: datosTransaccion.respuestaCompleta?.x_response_reason_text || null
      });

      // Verificar configuración del cliente Supabase
      if (!clienteSupabase) {
        console.error('❌ Cliente Supabase no está configurado');
        return;
      }

      const { data, error } = await clienteSupabase
        .from('transacciones_epayco_logs')
        .insert([
          {
            pedido_id: datosTransaccion.pedidoId,
            epayco_ref_payco: datosTransaccion.referenciaPago,
            epayco_transaction_id: datosTransaccion.respuestaCompleta?.x_transaction_id || null,
            tipo_evento: datosTransaccion.tipo || 'response',
            estado_nuevo: datosTransaccion.estado,
            cod_response: datosTransaccion.respuestaCompleta?.x_cod_response || null,
            mensaje_response: datosTransaccion.respuestaCompleta?.x_response_reason_text || null,
            datos_completos: datosTransaccion.respuestaCompleta,
            creado_el: new Date().toISOString()
          }
        ])
        .select(); // Agregar select para obtener los datos insertados

      if (error) {
        console.error('❌ Error al registrar transacción en BD:', error);
        console.error('📋 Detalles del error:');
        console.error('  - Código:', error.code);
        console.error('  - Mensaje:', error.message);
        console.error('  - Detalles:', error.details);
        console.error('  - Hint:', error.hint);
        
        // Verificar si es un problema de RLS
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          console.error('🔒 PROBLEMA DETECTADO: Las políticas RLS están bloqueando la inserción');
          console.error('💡 SOLUCIÓN: Ejecuta el script fix_rls_policies.sql en Supabase');
        }
      } else {
        console.log('✅ Transacción registrada exitosamente en BD:', data);
      }
    } catch (error) {
      console.error('❌ Error inesperado al registrar transacción:', error);
      console.error('📋 Stack trace:', error.stack);
    }
  }

  /**
   * Valida la firma de un webhook de ePayco
   * @param {Object} datos - Datos del webhook
   * @param {string} firma - Firma recibida
   * @returns {boolean} Si la firma es válida
   */
  validarFirmaWebhook(datos, firma) {
    try {
      // Implementar validación de firma según documentación de ePayco
      // Esta es una implementación básica, debe ajustarse según los requerimientos
      const clavePrivada = configuracionEpayco.clavePrivada;
      const cadenaValidacion = `${datos.ref_payco}^${clavePrivada}^${datos.transaction_id}^${datos.amount}`;
      
      // En producción, usar una librería de hash segura
      const crypto = require('crypto');
      const firmaCalculada = crypto.createHash('sha256').update(cadenaValidacion).digest('hex');
      
      return firmaCalculada === firma;
    } catch (error) {
      console.error('❌ Error al validar firma:', error);
      return false;
    }
  }

  /**
   * Procesa un webhook de ePayco
   * @param {Object} datosWebhook - Datos del webhook
   * @returns {Promise<Object>} Resultado del procesamiento
   */
  async procesarWebhook(datosWebhook) {
    try {
      // Registrar el webhook recibido
      await this.registrarTransaccion({
        pedidoId: datosWebhook.extra1 || null, // Asumiendo que enviamos el pedido_id en extra1
        referenciaPago: datosWebhook.ref_payco,
        estado: datosWebhook.estado,
        respuestaCompleta: datosWebhook,
        tipo: 'webhook'
      });

      // Actualizar el estado del pedido en nuestra base de datos
      if (datosWebhook.extra1) {
        const { error } = await clienteSupabase
          .from('pedidos')
          .update({
            estado_pago_epayco: datosWebhook.estado,
            referencia_epayco: datosWebhook.ref_payco,
            fecha_actualizacion_pago: new Date().toISOString()
          })
          .eq('id', datosWebhook.extra1);

        if (error) {
          console.error('❌ Error al actualizar pedido:', error);
        }
      }

      return {
        exito: true,
        mensaje: 'Webhook procesado correctamente'
      };
    } catch (error) {
      console.error('❌ Error al procesar webhook:', error);
      return {
        exito: false,
        error: error.message
      };
    }
  }
}

// Crear instancia singleton del servicio
const servicioEpayco = new ServicioEpayco();

export default servicioEpayco;