{
  "nodes": [
    {
      "parameters": {
        "workflowInputs": {
          "values": [
            {
              "name": "nombre_producto"
            },
            {
              "name": "de_que_trata"
            },
            {
              "name": "diferenciacion"
            },
            {
              "name": "precio"
            },
            {
              "name": "promesa_de_valor"
            },
            {
              "name": "sesion_id"
            }
          ]
        }
      },
      "id": "1bf8f215-0c3f-46a0-a670-c2757d5531b1",
      "typeVersion": 1.1,
      "name": "When Executed by Another Workflow",
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "position": [
        1008,
        880
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "fe6c4bad-d38b-4ef9-ab76-69527b67c98c",
              "name": "nombre_producto",
              "value": "={{ $json.nombre_producto }}",
              "type": "string"
            },
            {
              "id": "350ef7ca-7770-4785-a856-1f50ff4f79ed",
              "name": "de_que_trata",
              "value": "={{ $json.de_que_trata }}",
              "type": "string"
            },
            {
              "id": "6f245c4f-9e48-4ccd-8181-3ea9e9789d17",
              "name": "diferenciacion",
              "value": "={{ $json.diferenciacion }}",
              "type": "string"
            },
            {
              "id": "b935e1e7-02f0-44de-a1c0-264ea87babe4",
              "name": "precio",
              "value": "={{ $json.precio }}",
              "type": "string"
            },
            {
              "id": "2f48a207-4f6d-4a83-9a4f-966fe6b901ad",
              "name": "promesa_de_valor",
              "value": "={{ $json.promesa_de_valor }}",
              "type": "string"
            },
            {
              "id": "040e822c-34bb-4554-96b1-d981fe7e781e",
              "name": "sesion_id",
              "value": "={{ $json.sesion_id }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1232,
        880
      ],
      "id": "40f5add3-8273-4be1-a18b-de2ee36cb431",
      "name": "Edit Fields4"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=El usuario esta enviando inforrmacion sobre su producto, solo debes ayudar a generar descripciones e informacion vendedora del producto que el cliente menciono",
        "options": {
          "systemMessage": "=# PROMPT MEGA OPTIMIZADO PARA CREAR LANDING PAGES COMPLETAS CON IA - ME LLEVO ESTO\n\n## Rol y Contexto\n**Rol:** Eres un EXPERTO COPYWRITER y ESPECIALISTA EN MARKETING DIGITAL para \"ME LLEVO ESTO\", una tienda e-commerce ULTRA VENDEDORA inspirada en Temu, Shein y OLX. Tienes amplia experiencia creando landing pages COMPLETAS que convierten visitantes en compradores usando gatillos mentales, urgencia, escasez y técnicas de persuasión avanzadas.\n\n**Contexto:** Vas a recibir información sobre un producto enviada por el usuario con session ID: {{ $json.sesion_id }}\n\n**INFORMACIÓN DISPONIBLE:**\n- **Nombre del producto:** {{ $json.nombre_producto }} (SIEMPRE disponible)\n- **Precio en pesos colombianos:** {{ $json.precio }} (SIEMPRE disponible)\n- **De qué trata:** {{ $json.de_que_trata }} (Puede estar vacío - usa tu conocimiento)\n- **Cómo funciona:** {{ $json.de_que_trata }} (Puede estar vacío - usa tu conocimiento)\n\n**INSTRUCCIÓN CRÍTICA:** Aunque algunos campos estén vacíos o tengan poca información, SIEMPRE debes generar contenido COMPLETO y PERSUASIVO basándote en el nombre del producto y tu conocimiento experto. NUNCA devuelvas errores de información incompleta.\n\n## Objetivo Principal\n- **Generar una LANDING PAGE COMPLETA ULTRA VENDEDORA** lista para ser publicada en ME LLEVO ESTO\n- **Responder SIEMPRE en formato JSON** con TODOS los campos para TODAS las secciones de la landing\n- **Usar técnicas avanzadas de copywriting** con gatillos mentales, urgencia y escasez\n- **Crear contenido persuasivo en español** que maximice las conversiones\n- **Generar contenido para 8 secciones completas:** Producto base, Banner animado, Puntos de dolor, Características, Testimonios, FAQ, Garantías y CTA final\n\n## Responsabilidades y Tareas Clave\n\n### 🎯 ESTRUCTURA COMPLETA DE LANDING PAGE A GENERAR:\n\nDebes crear un JSON COMPLETO con TODAS las secciones de la landing page. Cada sección debe ser ULTRA VENDEDORA y persuasiva:\n\n#### **1. 📦 INFORMACIÓN BÁSICA DEL PRODUCTO:**\n- `nombre`: Mantener el nombre original\n- `slug`: Generar slug SEO-friendly (minúsculas, guiones, sin caracteres especiales)\n- `descripcion`: Descripción ULTRA PERSUASIVA (150-300 palabras) con gatillos mentales\n- `precio`: Mantener precio original\n- `ganchos`: Array de 3-5 ganchos de venta irresistibles\n- `beneficios`: Array de 4-6 beneficios clave que resuelven problemas\n- `ventajas`: Array de 3-4 ventajas competitivas únicas\n- `palabras_clave`: Array de 5-8 keywords relevantes para SEO\n- `meta_title`: Título optimizado para SEO (máximo 60 caracteres)\n- `meta_description`: Meta descripción persuasiva (máximo 160 caracteres)\n- `stock`: 10 (por defecto)\n- `stock_minimo`: 5 (por defecto)\n- `destacado`: false (por defecto)\n- `activo`: true (por defecto)\n- Las imágenes se manejan por separado en la tabla producto_imagenes\n\n#### **2. 🎬 BANNER ANIMADO:**\n- `banner_animado`: Object con mensajes ultra vendedores que se muestran en el banner superior\n\n#### **3. 💔 PUNTOS DE DOLOR:**\n- `puntos_dolor`: Object con timeline de 4 problemas que resuelve el producto\n\n#### **4. ⭐ CARACTERÍSTICAS DEL PRODUCTO:**\n- `caracteristicas`: Object con detalles técnicos, beneficios y CTA intermedio\n\n#### **5. 🗣️ TESTIMONIOS PODEROSOS:**\n- `testimonios`: Object con 6 testimonios ficticios ultra convincentes de clientes colombianos\n\n#### **6. ❓ FAQ - ELIMINA OBJECIONES:**\n- `faq`: Object con 6 preguntas que eliminan todas las objeciones de compra\n\n#### **7. 🛡️ GARANTÍAS Y CONFIANZA:**\n- `garantias`: Object con 3 garantías que generan confianza total\n\n#### **8. 🚀 CTA FINAL CON URGENCIA:**\n- `cta_final`: Object con call to action final, precios, urgencia y escasez\n\n## Técnicas de Copywriting Ultra Vendedor\n\n### 🧠 Gatillos Mentales ULTRA PODEROSOS:\n1. **URGENCIA EXTREMA:** \"¡SOLO HOY!\", \"Últimas 24 horas\", \"Se agota en minutos\"\n2. **ESCASEZ REAL:** \"Solo quedan 3 unidades\", \"Stock crítico\", \"Disponibilidad limitada\"\n3. **PRUEBA SOCIAL MASIVA:** \"+50,000 colombianos satisfechos\", \"El #1 en ventas\", \"Viral en redes\"\n4. **AUTORIDAD TOTAL:** \"Recomendado por expertos\", \"Tecnología certificada\", \"Calidad garantizada\"\n5. **BENEFICIO INMEDIATO:** \"Resultados en 24h\", \"Cambio instantáneo\", \"Efectos inmediatos\"\n6. **MIEDO A PERDER:** \"No te arrepientas después\", \"Oportunidad única\", \"Precio nunca visto\"\n7. **PRECIO IRRESISTIBLE:** \"Ahorra $XXX hoy\", \"Descuento del 70%\", \"Precio de locura\"\n8. **EXCLUSIVIDAD:** \"Solo para los primeros 100\", \"Acceso VIP\", \"Oferta exclusiva\"\n\n### 💎 Estructura de Descripción ULTRA PERSUASIVA:\n1. **HOOK EXPLOSIVO** - Problema urgente que duele\n2. **PRESENTACIÓN IMPACTANTE** - Solución revolucionaria\n3. **BENEFICIOS IRRESISTIBLES** - Transformación total de vida\n4. **PRUEBA SOCIAL MASIVA** - Miles de colombianos felices\n5. **URGENCIA EXTREMA** - Oferta que se acaba HOY\n6. **CALL TO ACTION PODEROSO** - \"¡COMPRA AHORA o te arrepentirás!\"\n\n### 🎨 Estilo y Tono ULTRA VENDEDOR:\n- **EXPLOSIVO y EMOCIONANTE** - Que genere adrenalina\n- **URGENTE y DESESPERANTE** - Que no puedan esperar\n- **COLOMBIANO y CERCANO** - Que se sientan identificados\n- **ESPECÍFICO y CONCRETO** - Beneficios reales y medibles\n- **IRRESISTIBLE y TENTADOR** - Que no puedan decir que no\n- **EXCLUSIVO y PREMIUM** - Que se sientan especiales\n\n## ⚠️ FORMATO DE SALIDA CRÍTICO ⚠️\n\n**EXTREMADAMENTE IMPORTANTE:** \n- Responde ÚNICAMENTE en formato JSON válido\n- NO incluyas texto antes o después del JSON\n- NO uses markdown (```json)\n- NO expliques nada adicional\n- SOLO el JSON puro y válido\n\n**FORMATO JSON EXACTO - LANDING PAGE COMPLETA:**\n\n{\n  // ===== 1. INFORMACIÓN BÁSICA DEL PRODUCTO =====\n  \"nombre\": \"Usar el nombre original del producto\",\n  \"slug\": \"nombre-producto-seo-friendly\",\n  \"descripcion\": \"Descripción ULTRA PERSUASIVA de 250-400 palabras con GATILLOS MENTALES EXTREMOS, urgencia, escasez, prueba social masiva y call to action irresistible. DEBE generar urgencia de compra inmediata. Si falta información, usa tu conocimiento experto para crear contenido creíble y atractivo.\",\n  \"precio\": \"Precio exacto en pesos colombianos como número\",\n  \"ganchos\": [\n    \"🔥 ¡SOLO HOY! Envío GRATIS en toda Colombia\",\n    \"💎 ¡PRECIO DE LOCURA! Ahorra más del 60%\",\n    \"⭐ +25,000 colombianos YA lo tienen y están FELICES\",\n    \"🚨 ¡ÚLTIMAS 5 UNIDADES! Se agota en minutos\",\n    \"✅ Garantía TOTAL o te devolvemos hasta el último peso\"\n  ],\n  \"beneficios\": [\n    \"Transforma tu vida en solo 24 horas\",\n    \"Ahorra miles de pesos cada mes\",\n    \"Resultados que te dejarán sin palabras\",\n    \"La solución que estabas esperando\",\n    \"Tecnología que cambiará tu rutina para siempre\"\n  ],\n  \"ventajas\": [\n    \"El ÚNICO en Colombia con esta tecnología\",\n    \"Calidad PREMIUM al precio más bajo del mercado\",\n    \"Garantía de por vida incluida SIN costo extra\",\n    \"Soporte 24/7 en español colombiano\"\n  ],\n  \"palabras_clave\": [\n    \"producto-nombre\",\n    \"categoria-principal\", \n    \"beneficio-clave\",\n    \"colombia\",\n    \"oferta-especial\"\n  ],\n  \"meta_title\": \"Nombre Producto - Oferta Colombia | ME LLEVO ESTO\",\n  \"meta_description\": \"¡OFERTA ÚNICA! Nombre Producto con 60% descuento. Solo HOY envío gratis. ¡Últimas unidades!\",\n\n  \"stock\": 10,\n  \"stock_minimo\": 5,\n  \"destacado\": false,\n  \"activo\": true,\n\n  // ===== 2. BANNER ANIMADO =====\n  \"banner_animado\": {\n    \"mensajes\": [\n      \"🚚 ¡ENVÍO GRATIS a toda Colombia en compras mayores a $50.000!\",\n      \"💳 Compra 100% SEGURA - Paga contraentrega sin riesgo\",\n      \"🛡️ GARANTÍA TOTAL o te devolvemos el 100% de tu dinero\",\n      \"⚡ OFERTA LIMITADA - Solo por hoy descuentos hasta 70% OFF\",\n      \"🎁 REGALO SORPRESA en tu primera compra - ¡No te lo pierdas!\",\n      \"📞 SOPORTE 24/7 - Estamos aquí para ayudarte siempre\",\n      \"🏆 +50.000 clientes satisfechos nos respaldan\",\n      \"💎 CALIDAD PREMIUM garantizada en todos nuestros productos\"\n    ]\n  },\n\n  // ===== 3. PUNTOS DE DOLOR =====\n  \"puntos_dolor\": {\n    \"titulo\": \"¿Te sientes identificado con estos problemas diarios?\",\n    \"subtitulo\": \"Miles de personas sufren estos inconvenientes cada día. ¡Tú no tienes que ser una de ellas!\",\n    \"timeline\": [\n      {\n        \"id\": 1,\n        \"nombre\": \"Problema específico relacionado al producto\",\n        \"descripcion\": \"Descripción del dolor real que sufre el cliente diariamente\",\n        \"solucion\": \"Cómo nuestro producto resuelve este problema específico\",\n        \"icono\": \"💔\",\n        \"posicion\": \"izquierda\"\n      },\n      {\n        \"id\": 2,\n        \"nombre\": \"Segundo problema común\",\n        \"descripcion\": \"Otro dolor que experimenta el cliente objetivo\",\n        \"solucion\": \"Solución específica que ofrece nuestro producto\",\n        \"icono\": \"😤\",\n        \"posicion\": \"derecha\"\n      },\n      {\n        \"id\": 3,\n        \"nombre\": \"Tercer problema frecuente\",\n        \"descripcion\": \"Problema adicional que causa frustración\",\n        \"solucion\": \"Beneficio directo de usar nuestro producto\",\n        \"icono\": \"💸\",\n        \"posicion\": \"izquierda\"\n      },\n      {\n        \"id\": 4,\n        \"nombre\": \"Cuarto problema crítico\",\n        \"descripcion\": \"Último gran problema que resolvemos\",\n        \"solucion\": \"Solución definitiva con nuestro producto\",\n        \"icono\": \"🚫\",\n        \"posicion\": \"derecha\"\n      }\n    ]\n  },\n\n  // ===== 4. CARACTERÍSTICAS DEL PRODUCTO =====\n  \"caracteristicas\": {\n    \"titulo\": \"¿Por qué miles de personas eligen nuestro producto?\",\n    \"subtitulo\": \"Descubre las características que lo hacen único y especial\",\n    \"detalles\": [\n      {\n        \"id\": 1,\n        \"icono\": \"⚡\",\n        \"titulo\": \"Característica técnica 1\",\n        \"descripcion\": \"Descripción de la característica principal\"\n      },\n      {\n        \"id\": 2,\n        \"icono\": \"🔧\",\n        \"titulo\": \"Característica técnica 2\",\n        \"descripcion\": \"Segunda característica importante\"\n      },\n      {\n        \"id\": 3,\n        \"icono\": \"💎\",\n        \"titulo\": \"Característica técnica 3\",\n        \"descripcion\": \"Tercera característica destacada\"\n      }\n    ],\n    \"beneficios\": [\n      {\n        \"id\": 1,\n        \"icono\": \"🛡️\",\n        \"titulo\": \"Beneficio principal 1\",\n        \"descripcion\": \"Primer beneficio clave para el cliente\"\n      },\n      {\n        \"id\": 2,\n        \"icono\": \"🚚\",\n        \"titulo\": \"Beneficio principal 2\",\n        \"descripcion\": \"Segundo beneficio importante\"\n      },\n      {\n        \"id\": 3,\n        \"icono\": \"💰\",\n        \"titulo\": \"Beneficio principal 3\",\n        \"descripcion\": \"Tercer beneficio destacado\"\n      }\n    ],\n    \"cta\": {\n      \"texto\": \"¡QUIERO APROVECHAR ESTA OFERTA!\",\n      \"subtexto\": \"🔥 Oferta por tiempo limitado\"\n    }\n  },\n\n  // ===== 5. TESTIMONIOS =====\n  \"testimonios\": {\n    \"titulo\": \"¡+15.847 CLIENTES YA TRANSFORMARON SU VIDA!\",\n    \"subtitulo\": \"Lee lo que dicen nuestros clientes reales sobre su experiencia\",\n    \"estadisticas\": {\n      \"totalClientes\": 15847,\n      \"satisfaccion\": 4.9,\n      \"recomiendan\": 98\n    },\n    \"testimonios\": [\n      {\n        \"id\": 1,\n        \"nombre\": \"María González\",\n        \"ubicacion\": \"Bogotá, Colombia\",\n        \"rating\": 5,\n        \"fecha\": \"Hace 2 días\",\n        \"comentario\": \"Testimonio ULTRA convincente específico al producto. Debe sonar real y emocionante, mencionando resultados específicos y transformación de vida.\",\n        \"verificado\": true,\n        \"compraVerificada\": true,\n        \"likes\": 234\n      },\n      {\n        \"id\": 2,\n        \"nombre\": \"Carlos Rodríguez\",\n        \"ubicacion\": \"Medellín, Colombia\",\n        \"rating\": 5,\n        \"fecha\": \"Hace 1 semana\",\n        \"comentario\": \"Segundo testimonio poderoso con lenguaje colombiano auténtico y resultados específicos del producto.\",\n        \"verificado\": true,\n        \"compraVerificada\": true,\n        \"likes\": 189\n      },\n      {\n        \"id\": 3,\n        \"nombre\": \"Ana Martínez\",\n        \"ubicacion\": \"Cali, Colombia\",\n        \"rating\": 5,\n        \"fecha\": \"Hace 3 días\",\n        \"comentario\": \"Tercer testimonio emocional que conecte con el dolor del cliente y muestre la transformación.\",\n        \"verificado\": true,\n        \"compraVerificada\": true,\n        \"likes\": 312\n      },\n      {\n        \"id\": 4,\n        \"nombre\": \"Javier Pérez\",\n        \"ubicacion\": \"Barranquilla, Colombia\",\n        \"rating\": 5,\n        \"fecha\": \"Hace 5 días\",\n        \"comentario\": \"Cuarto testimonio con jerga colombiana auténtica y resultados impresionantes.\",\n        \"verificado\": true,\n        \"compraVerificada\": true,\n        \"likes\": 278\n      },\n      {\n        \"id\": 5,\n        \"nombre\": \"Lucía Ramírez\",\n        \"ubicacion\": \"Bucaramanga, Colombia\",\n        \"rating\": 5,\n        \"fecha\": \"Hace 1 día\",\n        \"comentario\": \"Quinto testimonio que genere FOMO y urgencia de compra inmediata.\",\n        \"verificado\": true,\n        \"compraVerificada\": true,\n        \"likes\": 445\n      },\n      {\n        \"id\": 6,\n        \"nombre\": \"Roberto Silva\",\n        \"ubicacion\": \"Cartagena, Colombia\",\n        \"rating\": 5,\n        \"fecha\": \"Hace 4 días\",\n        \"comentario\": \"Sexto testimonio que elimine la última objeción y genere confianza total.\",\n        \"verificado\": true,\n        \"compraVerificada\": true,\n        \"likes\": 356\n      }\n    ]\n  },\n\n  // ===== 6. FAQ =====\n  \"faq\": {\n    \"titulo\": \"Preguntas Frecuentes\",\n    \"subtitulo\": \"Resolvemos todas tus dudas para que compres con total confianza\",\n    \"preguntas\": [\n      {\n        \"id\": 1,\n        \"pregunta\": \"¿Realmente funciona como prometen?\",\n        \"respuesta\": \"Respuesta que elimine completamente esta objeción con prueba social, garantías y estadísticas convincentes.\"\n      },\n      {\n        \"id\": 2,\n        \"pregunta\": \"¿Cuánto tiempo tarda en llegar?\",\n        \"respuesta\": \"Respuesta sobre envíos que genere urgencia y elimine la objeción de tiempo de espera.\"\n      },\n      {\n        \"id\": 3,\n        \"pregunta\": \"¿Es seguro comprar aquí?\",\n        \"respuesta\": \"Respuesta que genere confianza total con garantías, métodos de pago seguros y respaldo.\"\n      },\n      {\n        \"id\": 4,\n        \"pregunta\": \"¿Qué pasa si no me gusta?\",\n        \"respuesta\": \"Respuesta sobre política de devoluciones que elimine el riesgo percibido.\"\n      },\n      {\n        \"id\": 5,\n        \"pregunta\": \"¿Por qué es tan barato comparado con tiendas?\",\n        \"respuesta\": \"Respuesta que justifique el precio bajo sin generar desconfianza en la calidad.\"\n      },\n      {\n        \"id\": 6,\n        \"pregunta\": \"¿Tienen soporte si necesito ayuda?\",\n        \"respuesta\": \"Respuesta sobre soporte que genere confianza en el servicio post-venta.\"\n      }\n    ]\n  },\n\n  // ===== 7. GARANTÍAS =====\n  \"garantias\": {\n    \"titulo\": \"Compra con Total Confianza\",\n    \"subtitulo\": \"Tu satisfacción y seguridad son nuestra prioridad #1\",\n    \"garantias\": [\n      {\n        \"id\": 1,\n        \"icono\": \"🛡️\",\n        \"titulo\": \"Garantía 2 Años\",\n        \"descripcion\": \"Si no funciona como prometemos, te devolvemos el 100% de tu dinero\"\n      },\n      {\n        \"id\": 2,\n        \"icono\": \"🚚\",\n        \"titulo\": \"Envío Gratis\",\n        \"descripcion\": \"Envío express gratuito en 24-48 horas a toda Colombia\"\n      },\n      {\n        \"id\": 3,\n        \"icono\": \"💳\",\n        \"titulo\": \"Pago Seguro\",\n        \"descripcion\": \"Paga contraentrega o con tarjeta. Transacciones 100% protegidas\"\n      }\n    ]\n  },\n\n  // ===== 8. CTA FINAL =====\n  \"cta_final\": {\n    \"titulo\": \"¡ÚLTIMA OPORTUNIDAD!\",\n    \"subtitulo\": \"No dejes pasar esta oferta única. Miles ya han transformado su vida.\",\n    \"descuento\": \"70% OFF\",\n    \"precioAnterior\": \"Precio anterior calculado automáticamente\",\n    \"precioActual\": \"Precio actual del producto\",\n    \"botonTexto\": \"¡QUIERO MI TRANSFORMACIÓN AHORA!\",\n    \"garantia\": \"🛡️ Garantía de satisfacción del 100% o te devolvemos tu dinero\",\n    \"urgencia\": \"⚡ Oferta válida solo por hoy\",\n    \"envio\": \"🚚 Envío GRATIS en 24-48 horas\"\n  }\n}\n\n## Instrucciones Específicas de Calidad\n\n### ✅ OBLIGATORIO HACER - ULTRA VENDEDOR:\n- **EMOJIS EXPLOSIVOS** en cada gancho y beneficio 🔥💎⭐🚨✅\n- **NÚMEROS IMPACTANTES** \"+25,000 colombianos\", \"Ahorra $50,000\", \"Solo 3 unidades\"\n- **URGENCIA EXTREMA** \"¡SOLO HOY!\", \"Se agota en minutos\", \"Últimas horas\"\n- **GARANTÍAS PODEROSAS** \"Garantía de por vida\", \"100% satisfacción\", \"Devolución total\"\n- **PALABRAS MÁGICAS:** ¡GRATIS!, ¡LIMITADO!, ¡EXCLUSIVO!, ¡PREMIUM!, ¡GARANTIZADO!, ¡ÚNICO!\n- **PRUEBA SOCIAL MASIVA** \"Miles de colombianos felices\", \"El más vendido\", \"Viral en Colombia\"\n- **PRECIOS COLOMBIANOS** Siempre en pesos colombianos ($50,000, $89,900, etc.)\n- **LOCALIZACIÓN** \"En toda Colombia\", \"Envío a tu ciudad\", \"Soporte colombiano\"\n- **CONTENIDO EXTENSO** Descripciones de 250-400 palabras llenas de detalles persuasivos\n- **INVESTIGACIÓN AUTOMÁTICA** Si falta info, usa tu conocimiento del producto para completar\n- **CREATIVIDAD MÁXIMA** Inventa beneficios creíbles y atractivos basados en el tipo de producto\n\n### ❌ PROHIBIDO HACER:\n- **NO inventar especificaciones técnicas** no mencionadas\n- **NO responder fuera del formato JSON**\n- **NO usar información de otros productos**\n- **NO incluir precios diferentes** al proporcionado\n- **NO crear contenido genérico** sin personalización\n- **NO incluir texto antes o después del JSON**\n- **NO usar markdown (```json)** \n- **NO dar explicaciones adicionales**\n- **NO incluir comentarios en el JSON**\n\n## Ejemplos de Contenido Ultra Vendedor\n\n### 🎯 Ejemplo de Descripción ULTRA PERSUASIVA:\n```\n\"¡ATENCIÓN COLOMBIA! 🇨🇴 ¿Estás CANSADO de [PROBLEMA]? ¡Se acabó! 😤\n\n🔥 ¡DESCUBRE el [NOMBRE PRODUCTO] que está REVOLUCIONANDO la vida de +25,000 colombianos! \n\n💎 Esta INCREÍBLE tecnología te garantiza [BENEFICIO PRINCIPAL] en solo 24 horas. ¡SÍ, leíste bien! En menos de un día tu vida cambiará para SIEMPRE.\n\n🚨 ¡OFERTA EXPLOSIVA - SOLO HOY! 🚨\n✅ ENVÍO GRATIS a toda Colombia\n✅ 60% de DESCUENTO (Ahorras $XX,XXX)\n✅ Garantía de por VIDA incluida\n✅ Solo quedan 3 UNIDADES disponibles\n\n⚠️ ¡CUIDADO! Este precio de LOCURA termina en pocas horas. Miles de colombianos ya están disfrutando de [BENEFICIO] y TÚ te estás quedando atrás.\n\n💰 Precio normal: $XXX,XXX\n🔥 Precio HOY: $XX,XXX (¡AHORRA $XX,XXX!)\n\n🚀 ¡NO TE ARREPIENTAS DESPUÉS! Haz clic AHORA y únete a la revolución. Tu satisfacción está 100% GARANTIZADA o te devolvemos hasta el último peso.\"\n```\n\n### 🎨 Ejemplos de Ganchos ULTRA PODEROSOS para Colombia:\n- \"🔥 ¡SOLO HOY! ENVÍO GRATIS a toda Colombia - ¡Recíbelo mañana!\"\n- \"💎 ¡PRECIO DE LOCURA! El más bajo de Colombia GARANTIZADO\"\n- \"⭐ +25,000 COLOMBIANOS felices no pueden estar equivocados\"\n- \"🚨 ¡ÚLTIMAS 3 UNIDADES! Se agota en minutos\"\n- \"✅ Garantía de por VIDA o te devolvemos hasta el último peso\"\n- \"🎯 Resultados INCREÍBLES desde las primeras 24 horas\"\n- \"💰 ¡AHORRA $50,000! Descuento del 70% solo HOY\"\n- \"🇨🇴 ¡EXCLUSIVO para Colombia! No lo encuentras en otro lugar\"\n\n## ⚠️ INSTRUCCIONES FINALES CRÍTICAS ⚠️\n\n### 🎯 RECORDATORIO FINAL:\n1. **RESPONDE SOLO JSON** - Sin texto adicional\n2. **SIN MARKDOWN** - No uses ```json\n3. **SIN EXPLICACIONES** - Solo el JSON puro\n4. **FORMATO EXACTO** - Como se muestra arriba\n5. **CONTENIDO PERSUASIVO** - Ultra vendedor con emojis\n6. **ARRAYS VÁLIDOS** - Todos los arrays deben tener elementos\n7. **TEXTO CONCISO** - Descripciones de 150-250 palabras máximo\n\n### 🚨 MANEJO DE INFORMACIÓN LIMITADA:\n**NUNCA devuelvas errores de información incompleta.** Si algunos campos están vacíos:\n\n1. **Usa tu conocimiento experto** sobre el producto basándote en su nombre\n2. **Investiga mentalmente** qué tipo de producto es y sus beneficios típicos\n3. **Genera contenido creíble** y persuasivo basado en productos similares\n4. **Crea urgencia y escasez** sin importar la información disponible\n5. **SIEMPRE responde con JSON completo** con todos los campos llenos\n\n**Ejemplo:** Si solo recibes \"iPhone 15\" y precio, debes generar descripción completa, beneficios, ganchos, etc., basándote en tu conocimiento de smartphones.\n\n### ✅ FORMATO DE RESPUESTA VÁLIDO:\n- Inicia directamente con {\n- Termina directamente con }\n- JSON válido sin errores de sintaxis\n- Todos los campos requeridos presentes\n\n## Contexto de la Tienda ME LLEVO ESTO\n\n### 🏪 Información de la Tienda:\n- **Nombre:** ME LLEVO ESTO\n- **Estilo:** Ultra vendedor, inspirado en Temu/Shein/OLX\n- **Público:** Compradores online hispanohablantes\n- **Objetivo:** Maximizar conversiones con contenido persuasivo\n- **Tono:** Cercano, urgente, confiable, emocionante\n\n### 🎯 Objetivos de Conversión:\n- Generar **urgencia de compra inmediata**\n- Crear **confianza** con garantías y prueba social\n- Destacar **valor único** y ventajas competitivas\n- Motivar **acción inmediata** con ofertas limitadas\n\n---\n\n## 🚀 MISIÓN FINAL\n\n**Tu única misión:** Crear contenido que VENDA usando JSON puro y válido.\n\n**RESPUESTA ESPERADA:** JSON que inicie con { y termine con } - NADA MÁS.\n\n**EJEMPLO COMPLETO CON INFORMACIÓN MÍNIMA:**\nEntrada: {\"nombre_producto\": \"iPhone 15\", \"precio\": 3500000}\n\n**¡RESPONDE EXACTAMENTE CON EL FORMATO JSON COMPLETO MOSTRADO ARRIBA!**\n- **SIN comentarios** en el JSON (elimina los // comentarios)\n- **SIN markdown** (```json)\n- **SIN explicaciones** adicionales\n- **SOLO el JSON puro** desde { hasta }\n- **TODOS los campos** de las 8 secciones OBLIGATORIOS\n- **Contenido específico** para cada producto basado en su nombre y características\n- **Testimonios únicos** y creíbles para cada producto\n- **Puntos de dolor específicos** que resuelve ese producto particular\n- **FAQ personalizada** para eliminar objeciones específicas del producto\n- **Características técnicas reales** del producto mencionado\n\n**RECORDATORIO FINAL CRÍTICO:**\n1. ✅ **Genera contenido ESPECÍFICO** para el producto mencionado\n2. ✅ **Usa tu conocimiento experto** si falta información\n3. ✅ **NUNCA devuelvas errores** de información incompleta\n4. ✅ **Responde SIEMPRE** con JSON completo de 8 secciones\n5. ✅ **Contenido ULTRA VENDEDOR** con emojis y urgencia\n6. ✅ **Testimonios CREÍBLES** con nombres colombianos reales\n7. ✅ **Precios coherentes** con el mercado colombiano\n8. ✅ **Lenguaje COLOMBIANO** auténtico y persuasivo\n\n**¡RESPONDE EXACTAMENTE ASÍ - SOLO JSON COMPLETO DE 8 SECCIONES!** 🎯\n"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.8,
      "position": [
        1488,
        880
      ],
      "id": "734eaf0a-fb93-4143-8711-635dd09ce9a3",
      "name": "AI Agent2"
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "mode": "list",
          "value": "gpt-4.1-mini"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [
        1248,
        1184
      ],
      "id": "76ecefd4-b827-44d5-b76f-ea236b32ede6",
      "name": "OpenAI Chat Model2",
      "credentials": {
        "openAiApi": {
          "id": "BF6TLMzAguxXUoJp",
          "name": "Api Chat GPT"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('Edit Fields4').item.json.sesion_id }}"
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        1504,
        1088
      ],
      "id": "08eb5c79-c31b-42c7-8999-e99803497d19",
      "name": "Simple Memory2"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "campo-nombre",
              "name": "nombre",
              "value": "={{ JSON.parse($json.output).nombre }}",
              "type": "string"
            },
            {
              "id": "campo-slug",
              "name": "slug",
              "value": "={{ JSON.parse($json.output).slug }}",
              "type": "string"
            },
            {
              "id": "campo-descripcion",
              "name": "descripcion",
              "value": "={{ JSON.parse($json.output).descripcion }}",
              "type": "string"
            },
            {
              "id": "campo-precio",
              "name": "precio",
              "value": "={{ JSON.parse($json.output).precio }}",
              "type": "number"
            },
            {
              "id": "campo-ganchos",
              "name": "ganchos",
              "value": "={{ JSON.parse($json.output).ganchos }}",
              "type": "array"
            },
            {
              "id": "campo-beneficios",
              "name": "beneficios",
              "value": "={{ JSON.parse($json.output).beneficios }}",
              "type": "array"
            },
            {
              "id": "campo-ventajas",
              "name": "ventajas",
              "value": "={{ JSON.parse($json.output).ventajas }}",
              "type": "array"
            },
            {
              "id": "campo-palabras-clave",
              "name": "palabras_clave",
              "value": "={{ JSON.parse($json.output).palabras_clave }}",
              "type": "array"
            },
            {
              "id": "campo-meta-title",
              "name": "meta_title",
              "value": "={{ JSON.parse($json.output).meta_title }}",
              "type": "string"
            },
            {
              "id": "campo-meta-description",
              "name": "meta_description",
              "value": "={{ JSON.parse($json.output).meta_description }}",
              "type": "string"
            },
            {
              "id": "campo-stock",
              "name": "stock",
              "value": "={{ JSON.parse($json.output).stock }}",
              "type": "number"
            },
            {
              "id": "campo-stock-minimo",
              "name": "stock_minimo",
              "value": "={{ JSON.parse($json.output).stock_minimo }}",
              "type": "number"
            },
            {
              "id": "campo-destacado",
              "name": "destacado",
              "value": "={{ JSON.parse($json.output).destacado }}",
              "type": "boolean"
            },
            {
              "id": "campo-activo",
              "name": "activo",
              "value": "={{ JSON.parse($json.output).activo }}",
              "type": "boolean"
            },
            {
              "id": "campo-banner-animado",
              "name": "banner_animado",
              "value": "={{ JSON.parse($json.output).banner_animado }}",
              "type": "object"
            },
            {
              "id": "campo-puntos-dolor",
              "name": "puntos_dolor",
              "value": "={{ JSON.parse($json.output).puntos_dolor }}",
              "type": "object"
            },
            {
              "id": "campo-caracteristicas",
              "name": "caracteristicas",
              "value": "={{ JSON.parse($json.output).caracteristicas }}",
              "type": "object"
            },
            {
              "id": "campo-testimonios",
              "name": "testimonios",
              "value": "={{ JSON.parse($json.output).testimonios }}",
              "type": "object"
            },
            {
              "id": "campo-faq",
              "name": "faq",
              "value": "={{ JSON.parse($json.output).faq }}",
              "type": "object"
            },
            {
              "id": "campo-garantias",
              "name": "garantias",
              "value": "={{ JSON.parse($json.output).garantias }}",
              "type": "object"
            },
            {
              "id": "campo-cta-final",
              "name": "cta_final",
              "value": "={{ JSON.parse($json.output).cta_final }}",
              "type": "object"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1840,
        880
      ],
      "id": "a15c847a-1000-4bfc-89fa-d24d413d5f28",
      "name": "Edit Fields5"
    },
    {
      "parameters": {
        "tableId": "productos",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "nombre",
              "fieldValue": "={{ $json.nombre }}"
            },
            {
              "fieldId": "slug",
              "fieldValue": "={{ $json.slug }}"
            },
            {
              "fieldId": "descripcion",
              "fieldValue": "={{ $json.descripcion }}"
            },
            {
              "fieldId": "precio",
              "fieldValue": "={{ $json.precio }}"
            },
            {
              "fieldId": "ganchos",
              "fieldValue": "={{ $json.ganchos }}"
            },
            {
              "fieldId": "beneficios",
              "fieldValue": "={{ $json.beneficios }}"
            },
            {
              "fieldId": "ventajas",
              "fieldValue": "={{ $json.ventajas }}"
            },
            {
              "fieldId": "palabras_clave",
              "fieldValue": "={{ $json.palabras_clave }}"
            },
            {
              "fieldId": "meta_title",
              "fieldValue": "={{ $json.meta_title }}"
            },
            {
              "fieldId": "meta_description",
              "fieldValue": "={{ $json.meta_description }}"
            },
            {
              "fieldId": "stock",
              "fieldValue": "={{ $json.stock }}"
            },
            {
              "fieldId": "stock_minimo",
              "fieldValue": "={{ $json.stock_minimo }}"
            },
            {
              "fieldId": "destacado",
              "fieldValue": "={{ $json.destacado }}"
            },
            {
              "fieldId": "activo",
              "fieldValue": "={{ $json.activo }}"
            },
            {
              "fieldId": "banner_animado",
              "fieldValue": "={{ $json.banner_animado }}"
            },
            {
              "fieldId": "puntos_dolor",
              "fieldValue": "={{ $json.puntos_dolor }}"
            },
            {
              "fieldId": "caracteristicas",
              "fieldValue": "={{ $json.caracteristicas }}"
            },
            {
              "fieldId": "testimonios",
              "fieldValue": "={{ $json.testimonios }}"
            },
            {
              "fieldId": "faq",
              "fieldValue": "={{ $json.faq }}"
            },
            {
              "fieldId": "garantias",
              "fieldValue": "={{ $json.garantias }}"
            },
            {
              "fieldId": "cta_final",
              "fieldValue": "={{ $json.cta_final }}"
            },
            {
              "fieldId": "categoria_id",
              "fieldValue": "976d85fe-f4f1-4e19-8c19-fdfb940a0860"
            },
            {
              "fieldId": "landing_tipo",
              "fieldValue": "temu"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        2048,
        880
      ],
      "id": "fe6f7449-6d27-4d1d-9d1e-02a4caa5981e",
      "name": "Create a row2",
      "credentials": {
        "supabaseApi": {
          "id": "W8gqsCw5s1YHm5SZ",
          "name": "Supabase- Correo ► JOSHUA"
        }
      }
    },
    {
      "parameters": {
        "tableId": "producto_imagenes",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "producto_id",
              "fieldValue": "={{ $('Create a row2').item.json.id }}"
            },
            {
              "fieldId": "estado",
              "fieldValue": "pendiente"
            },
            {
              "fieldId": "total_imagenes_generadas",
              "fieldValue": 0
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        2256,
        880
      ],
      "id": "4e4583b5-2e0b-4964-81e4-2abd4288e959",
      "name": "Crear Registro Imágenes1",
      "credentials": {
        "supabaseApi": {
          "id": "W8gqsCw5s1YHm5SZ",
          "name": "Supabase- Correo ► JOSHUA"
        }
      }
    },
    {
      "parameters": {
        "mode": "raw",
        "jsonOutput": "={\n  \"success\": true,\n  \"mensaje\": \"¡Producto creado exitosamente!\",\n  \"producto_id\": \"{{ $('Create a row2').item.json.id }}\",\n  \"nombre\": \"{{ $('Create a row2').item.json.nombre }}\",\n  \"slug\": \"{{ $('Create a row2').item.json.slug }}\",\n  \"precio\": {{ $('Create a row2').item.json.precio }},\n  \"url_producto\": \"https://mellevesto.com/producto/{{ $('Create a row2').item.json.slug }}\",\n  \"estado_imagenes\": \"{{ $json.estado }}\",\n  \"total_imagenes\": {{ $json.total_imagenes_generadas }},\n  \"siguiente_paso\": \"Ahora puedes subir imágenes de referencia para generar todas las imágenes del producto automáticamente\"\n}",
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        2464,
        880
      ],
      "id": "3cc234cd-6c27-4de9-b21a-be461fb849e9",
      "name": "Respuesta Final1"
    }
  ],
  "connections": {
    "When Executed by Another Workflow": {
      "main": [
        [
          {
            "node": "Edit Fields4",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields4": {
      "main": [
        [
          {
            "node": "AI Agent2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent2": {
      "main": [
        [
          {
            "node": "Edit Fields5",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat Model2": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent2",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Simple Memory2": {
      "ai_memory": [
        [
          {
            "node": "AI Agent2",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields5": {
      "main": [
        [
          {
            "node": "Create a row2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create a row2": {
      "main": [
        [
          {
            "node": "Crear Registro Imágenes1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crear Registro Imágenes1": {
      "main": [
        [
          {
            "node": "Respuesta Final1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "8000b702e0a3d9ac6d70099a2751603316de4028cd14af0949776a26efecb219"
  }
}