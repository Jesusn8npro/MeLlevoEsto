/**
 * Hook personalizado para usar ePayco en componentes React
 * Proporciona funciones y estado para manejar pagos con ePayco
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  validarDatosTarjeta, 
  validarDatosCliente, 
  validarDatosPago,
  generarNumeroFactura,
  calcularIVA
} from '../servicios/epayco';
import { EPAYCO_CONFIG } from '../configuracion/constantes';
import servicioEpayco from '../servicios/epayco/servicioEpayco';
import pedidosServicio from '../servicios/pedidosServicio';

export const usarEpayco = () => {
  // Estados del hook
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [transaccionActual, setTransaccionActual] = useState(null);
  const [servicioListo, setServicioListo] = useState(false);

  // Verificar si ePayco está disponible globalmente
  useEffect(() => {
    let intentos = 0;
    const maxIntentos = 50; // 5 segundos máximo
    
    const verificarEpayco = () => {
      intentos++;
      
      if (typeof window.ePayco !== 'undefined') {
        console.log('✅ SDK de ePayco cargado correctamente');
        setServicioListo(true);
        setError(null);
      } else if (intentos < maxIntentos) {
        // Reintentar después de un breve delay
        setTimeout(verificarEpayco, 100);
      } else {
        console.error('❌ No se pudo cargar el SDK de ePayco después de 5 segundos');
        setError('No se pudo cargar el sistema de pagos. Por favor, recarga la página.');
        setServicioListo(false);
      }
    };
    
    verificarEpayco();
  }, []);

  /**
   * Limpia el estado de error
   */
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);





  /**
   * Calcula el total de un pago incluyendo IVA
   * @param {number} valorBase - Valor base sin IVA
   * @param {number} porcentajeIva - Porcentaje de IVA
   * @returns {Object} Cálculo detallado
   */
  const calcularTotalPago = useCallback((valorBase, porcentajeIva = 19) => {
    return calcularIVA(valorBase, porcentajeIva);
  }, []);

  /**
   * Genera un número de factura único
   * @param {string} prefijo - Prefijo para la factura
   * @returns {string} Número de factura
   */
  const generarFactura = useCallback((prefijo = 'FAC') => {
    return generarNumeroFactura(prefijo);
  }, []);

  /**
   * Procesa un pago usando ePayco OnPage Checkout
   * @param {Object} datosEpayco - Datos del pago para OnPage Checkout
   * @returns {Promise<Object>} Resultado del pago
   */
  const procesarPagoOnPage = useCallback(async (datosEpayco) => {
    setCargando(true);
    setError(null);

    try {
      // Validar datos de entrada
      if (!datosEpayco || !datosEpayco.cliente || !datosEpayco.pedido) {
        throw new Error('Datos de pago incompletos. Verifica la información del cliente y pedido.');
      }

      // Verificar que ePayco esté disponible globalmente
      if (typeof window.ePayco === 'undefined') {
        throw new Error('ePayco SDK no está cargado. Por favor, recarga la página e intenta nuevamente.');
      }

      // Verificar que el checkout esté disponible
      if (typeof window.ePayco.checkout === 'undefined') {
        throw new Error('ePayco checkout no está disponible. Verifica la conexión a internet.');
      }

      // Verificar que configure esté disponible
      if (typeof window.ePayco.checkout.configure !== 'function') {
        throw new Error('ePayco checkout.configure no es una función. Versión del SDK incompatible.');
      }

      console.log('✅ SDK de ePayco verificado correctamente');
      console.log('📋 Datos recibidos:', {
        cliente: datosEpayco.cliente.nombre + ' ' + datosEpayco.cliente.apellido,
        email: datosEpayco.cliente.email,
        valor: datosEpayco.pedido.valor,
        referencia: datosEpayco.pedido.referencia
      });

      // Configurar los datos para ePayco OnPage Checkout según documentación oficial
      const datosPago = {
        // Información del producto/pedido (obligatorio)
        name: datosEpayco.pedido.descripcion,
        description: datosEpayco.pedido.descripcion,
        invoice: datosEpayco.pedido.referencia,
        currency: EPAYCO_CONFIG.CURRENCY.toLowerCase(), // debe ser minúscula
        amount: datosEpayco.pedido.valor.toString(),
        tax_base: (datosEpayco.pedido.subtotal || datosEpayco.pedido.valor).toString(),
        tax: "0", // Sin IVA por ahora
        tax_ico: "0", // Sin impuesto al consumo
        country: EPAYCO_CONFIG.COUNTRY.toLowerCase(), // debe ser minúscula
        lang: "es", // idioma español
        
        // Configuración del checkout
        external: "false", // Para OnPage Checkout
        
        // URLs de respuesta (usando configuración centralizada)
        response: EPAYCO_CONFIG.RESPONSE_URL,
        confirmation: EPAYCO_CONFIG.CONFIRMATION_URL,
        
        // Información del cliente (billing)
        name_billing: `${datosEpayco.cliente.nombre} ${datosEpayco.cliente.apellido}`,
        address_billing: datosEpayco.cliente.direccion,
        type_doc_billing: (datosEpayco.cliente.tipoDocumento || 'CC').toLowerCase(),
        mobilephone_billing: datosEpayco.cliente.telefono,
        number_doc_billing: datosEpayco.cliente.numeroDocumento,
        email_billing: datosEpayco.cliente.email,
        
        // Datos extras (opcional)
        extra1: datosEpayco.pedido.id || datosEpayco.pedido.referencia, // ID del pedido en Supabase
        extra2: "ecommerce",
        extra3: datosEpayco.cliente.email
      };

      console.log('🚀 Iniciando ePayco OnPage Checkout:', datosPago);

      // Crear una promesa para manejar el resultado del pago
      return new Promise((resolve, reject) => {
        try {
          // Configurar el handler de ePayco con la clave pública (separado de los datos)
          const handler = window.ePayco.checkout.configure({
            key: EPAYCO_CONFIG.PUBLIC_KEY,
            test: EPAYCO_CONFIG.TEST_MODE
          });

          console.log('✅ Handler de ePayco configurado correctamente');

          // Configurar listener para la respuesta ANTES de abrir el checkout
          const manejarRespuesta = async (event) => {
            // Verificar origen por seguridad
            if (event.origin !== 'https://checkout.epayco.co') return;
            
            console.log('✅ Respuesta de ePayco recibida:', event.data);
            
            // Remover el listener para evitar múltiples llamadas
            window.removeEventListener('message', manejarRespuesta);
            
            // Actualizar estado de la transacción
            const transaccionData = {
              referencia: event.data.ref_payco || event.data.x_ref_payco,
              estado: event.data.x_response || 'pendiente',
              datos: event.data
            };
            
            setTransaccionActual(transaccionData);

            // Guardar transacción en Supabase
            try {
              console.log('💾 Guardando transacción en Supabase...');
              console.log('📊 Datos completos de ePayco recibidos:', event.data);
              console.log('🔍 Datos que se enviarán a registrarTransaccion:', {
                pedidoId: datosEpayco.pedido.id || datosPago.invoice || null,
                referenciaPago: event.data.ref_payco || event.data.x_ref_payco,
                estado: event.data.x_response || 'pendiente',
                respuestaCompleta: event.data,
                tipo: 'onpage_checkout'
              });
              
              const resultado = await servicioEpayco.registrarTransaccion({
                pedidoId: datosEpayco.pedido.id || datosPago.invoice || null, // Usar el ID real del pedido
                referenciaPago: event.data.ref_payco || event.data.x_ref_payco,
                estado: event.data.x_response || 'pendiente',
                respuestaCompleta: event.data,
                tipo: 'onpage_checkout'
              });
              
              console.log('✅ Transacción guardada exitosamente en Supabase');
              console.log('📋 Resultado del guardado:', resultado);
              
            } catch (errorGuardado) {
              console.error('❌ Error al guardar transacción en Supabase:', errorGuardado);
              console.error('📋 Detalles completos del error:', {
                name: errorGuardado.name,
                message: errorGuardado.message,
                stack: errorGuardado.stack,
                code: errorGuardado.code
              });
              // No fallar el proceso por error de guardado
            }

            // Actualizar el pedido con los datos de ePayco
            try {
              const pedidoId = datosEpayco.pedido.id || datosPago.invoice;
              if (pedidoId) {
                console.log('🔄 Actualizando pedido con datos de ePayco...', { pedidoId });
                
                const pedidoActualizado = await pedidosServicio.actualizarPedidoConEpayco(pedidoId, event.data);
                
                console.log('✅ Pedido actualizado exitosamente con datos de ePayco:', pedidoActualizado);
              } else {
                console.warn('⚠️ No se pudo obtener el ID del pedido para actualizar con datos de ePayco');
              }
            } catch (errorActualizacion) {
              console.error('❌ Error al actualizar pedido con datos de ePayco:', errorActualizacion);
              console.error('📋 Detalles del error de actualización:', {
                name: errorActualizacion.name,
                message: errorActualizacion.message,
                stack: errorActualizacion.stack
              });
              // No fallar el proceso por error de actualización
            }

            resolve({
              exito: true,
              transaccion: event.data,
              mensaje: 'Pago procesado correctamente'
            });
          };

          // Agregar listener
          window.addEventListener('message', manejarRespuesta);

          // Abrir el checkout con los datos del pago
          handler.open(datosPago);

          console.log('🎯 Checkout de ePayco abierto exitosamente');

          // Timeout de seguridad
          setTimeout(() => {
            window.removeEventListener('message', manejarRespuesta);
            reject({
              exito: false,
              error: 'Timeout: El checkout no respondió en el tiempo esperado (30s)'
            });
          }, 30000); // 30 segundos

        } catch (handlerError) {
          console.error('❌ Error al configurar el handler de ePayco:', handlerError);
          reject({
            exito: false,
            error: 'Error al configurar el checkout: ' + handlerError.message
          });
        }
      });

    } catch (error) {
      const mensajeError = error.message || 'Error desconocido al procesar el pago';
      setError(mensajeError);
      
      return {
        exito: false,
        error: mensajeError
      };
    } finally {
      setCargando(false);
    }
  }, []);

  /**
   * Reinicia el estado del hook
   */
  const reiniciarEstado = useCallback(() => {
    setCargando(false);
    setError(null);
    setTransaccionActual(null);
  }, []);

  return {
    // Estados
    cargando,
    error,
    transaccionActual,
    servicioListo,

    // Funciones principales
    procesarPagoOnPage,

    // Utilidades
    calcularTotalPago,
    generarFactura,
    
    // Funciones de control
    limpiarError,
    reiniciarEstado,

    // Validaciones (re-exportadas para conveniencia)
    validarDatosTarjeta,
    validarDatosCliente,
    validarDatosPago
  };
};

export default usarEpayco;