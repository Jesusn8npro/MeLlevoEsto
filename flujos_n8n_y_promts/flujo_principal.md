{
  "nodes": [
    {
      "parameters": {
        "updates": [
          "message"
        ],
        "additionalFields": {}
      },
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1.2,
      "position": [
        512,
        2528
      ],
      "id": "7aa3e222-f968-470d-9e6a-c09dd0010612",
      "name": "Disparador de Telegram1",
      "webhookId": "bea4843e-25e4-4d89-b3f6-4237798e9b42",
      "credentials": {
        "telegramApi": {
          "id": "Tsll6EFLsILnT8d3",
          "name": "Chat NANO BOT"
        }
      }
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "e7211e46-0f49-46a0-9cb7-e83fed150efd",
                    "leftValue": "={{ $json.message.photo }}",
                    "rightValue": "",
                    "operator": {
                      "type": "array",
                      "operation": "exists",
                      "singleValue": true
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Foto"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "245c0d65-83f2-4de5-8755-b73a3a63eab2",
                    "leftValue": "={{ $json.message.voice.mime_type }}",
                    "rightValue": "audio/ogg",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              }
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.message.text }}",
                    "rightValue": "",
                    "operator": {
                      "type": "string",
                      "operation": "exists",
                      "singleValue": true
                    },
                    "id": "85edf561-8f5e-4215-9e19-78ff0392068e"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Texto"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        896,
        2512
      ],
      "id": "2e641b1c-bb0f-4108-be76-94bc2fabe173",
      "name": "Conmutador1"
    },
    {
      "parameters": {
        "resource": "file",
        "fileId": "={{ $json.message.photo[1].file_id }}",
        "additionalFields": {}
      },
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        1088,
        2032
      ],
      "id": "1ceb9ba1-e6e7-4c8e-80d2-85a87cb5f8e5",
      "name": "Descargar Archivo1",
      "webhookId": "fb18f65f-c1cf-4473-b59d-d59d6b96e9ea",
      "credentials": {
        "telegramApi": {
          "id": "Tsll6EFLsILnT8d3",
          "name": "Chat NANO BOT"
        }
      }
    },
    {
      "parameters": {
        "name": "={{ $now.format('yyyy-MM-dd') }}",
        "driveId": {
          "__rl": true,
          "value": "My Drive",
          "mode": "list",
          "cachedResultName": "My Drive",
          "cachedResultUrl": "https://drive.google.com/drive/my-drive"
        },
        "folderId": {
          "__rl": true,
          "value": "1pIVgWL1V2qYvLS6ElbOitip4W6YYEhTr",
          "mode": "list",
          "cachedResultName": "Imagenes N8N",
          "cachedResultUrl": "https://drive.google.com/drive/folders/1pIVgWL1V2qYvLS6ElbOitip4W6YYEhTr"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        1456,
        2032
      ],
      "id": "da72abc6-f502-48fc-a7be-e677e9eea65e",
      "name": "Subir archivo1",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "53de4eb0-6684-48f5-a5b5-2b3bedaff817",
              "name": "message.text",
              "value": "=El usuario acaba de enviar una imagen. Aquí está el ID de ese archivo en Google Drive: {{ $json.id }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1792,
        2032
      ],
      "id": "627b2fac-1c20-4127-b598-f3dffacb86ac",
      "name": "Establecer Texto1"
    },
    {
      "parameters": {
        "chatId": "={{ $('Disparador de Telegram1').item.json.message.chat.id }}",
        "text": "={{ $json.output }}",
        "additionalFields": {
          "appendAttribution": false,
          "parse_mode": "HTML"
        }
      },
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        3600,
        2544
      ],
      "id": "24bd5db2-aa53-4cdd-9c60-1cf1b7c5608c",
      "name": "Responder1",
      "webhookId": "f9df111e-1004-4aff-b458-779444006ed8",
      "credentials": {
        "telegramApi": {
          "id": "Tsll6EFLsILnT8d3",
          "name": "Chat NANO BOT"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "fileId": {
          "__rl": true,
          "mode": "id",
          "value": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Archivo_a_Actualizar', ``, 'string') }}"
        },
        "newUpdatedFileName": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Nuevo_Nombre_Archivo_Actualizado', ``, 'string') }}",
        "options": {}
      },
      "type": "n8n-nodes-base.googleDriveTool",
      "typeVersion": 3,
      "position": [
        3696,
        3056
      ],
      "id": "2bd0e0f9-0085-43ee-bd86-6afe4e3cebdc",
      "name": "Cambiar Nombre1",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {
        "resource": "fileFolder",
        "queryString": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Search_Query', ``, 'string') }}",
        "returnAll": true,
        "filter": {
          "folderId": {
            "__rl": true,
            "value": "1pIVgWL1V2qYvLS6ElbOitip4W6YYEhTr",
            "mode": "list",
            "cachedResultName": "Imagenes N8N",
            "cachedResultUrl": "https://drive.google.com/drive/folders/1pIVgWL1V2qYvLS6ElbOitip4W6YYEhTr"
          },
          "whatToSearch": "files"
        },
        "options": {
          "fields": [
            "id",
            "name",
            "webViewLink"
          ]
        }
      },
      "type": "n8n-nodes-base.googleDriveTool",
      "typeVersion": 3,
      "position": [
        3840,
        3056
      ],
      "id": "c32faae7-e60d-4afb-978c-090bb2eb3a9b",
      "name": "Buscar Archivos Originales1",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('Disparador de Telegram1').item.json.message.chat.id }}",
        "contextWindowLength": 10
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        1952,
        3072
      ],
      "id": "04814c1c-acb2-41e1-8d1a-6165fa0fc2ee",
      "name": "Memoria Simple1"
    },
    {
      "parameters": {
        "modelName": "models/gemini-2.0-flash",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [
        1680,
        3072
      ],
      "id": "09b9be4e-1c8a-408c-8707-101b7069a71f",
      "name": "Google Gemini Chat Model1",
      "credentials": {
        "googlePalmApi": {
          "id": "afEdUlo465aPlyDq",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "description": "Llama a esta herramienta para editar una imagen. Debes pasar un nuevo título de imagen, un prompt de imagen muy detallado/profesional y el ID de la imagen.",
        "workflowId": {
          "__rl": true,
          "value": "jQoi0yBKSPgGJVdx",
          "mode": "list",
          "cachedResultName": "editar_imagen"
        },
        "workflowInputs": {
          "mappingMode": "defineBelow",
          "value": {
            "imageTitle": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imageTitle', `El título de la nueva imagen`, 'string') }}",
            "imagePrompt": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagePrompt', `El prompt de generación de imagen. Debe ser detallado y optimizado para la generación de imágenes por IA. Da la mayor cantidad de detalles y pregunta en que foormato se quiere la informacion, el idioma y todo para que funcione perfectamente por favor! Este prompt no debe contener \\\\n ni \"\".`, 'string') }}",
            "imageID": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imageID', `El ID de la imagen a editar`, 'string') }}",
            "tipo_de_imagen": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('tipo_de_imagen', `Tipo específico de imagen (ej: imagen_principal, imagen_punto_dolor_1, imagen_testimonio_persona_1)`, 'string') }}",
            "producto_id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('producto_id', `UUID del producto al que pertenece la imagen`, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "imageTitle",
              "displayName": "imageTitle",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "imagePrompt",
              "displayName": "imagePrompt",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "imageID",
              "displayName": "imageID",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "referencia_imagen",
              "displayName": "referencia_imagen",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": true
            },
            {
              "id": "tipo_de_imagen",
              "displayName": "tipo_de_imagen",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "producto_id",
              "displayName": "producto_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 2.2,
      "position": [
        3520,
        3056
      ],
      "id": "377582e0-e177-4f48-b7a4-24796f8abc33",
      "name": "editar_imagen1"
    },
    {
      "parameters": {
        "description": "Llama a esta herramienta para combinar dos imágenes. Debes pasar un prompt de generación de imagen, los IDs de ambas imágenes y un título para esta nueva imagen.",
        "workflowId": {
          "__rl": true,
          "value": "Mwp4SQDxcbDxijRs",
          "mode": "list",
          "cachedResultName": "combinar_imagenes"
        },
        "workflowInputs": {
          "mappingMode": "defineBelow",
          "value": {
            "prompt": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('prompt', `El prompt de generación de imagen. Debe estar optimizado para la generación de imágenes por IA y solo debe hacer referencia a las imágenes como imagen1 e imagen2. Este prompt no debe contener \\\\n ni \"\".`, 'string') }}",
            "image1": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen1', `El ID de la imagen 1`, 'string') }}",
            "image2": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen2', `El ID de la imagen 2`, 'string') }}",
            "imageTitle": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('tituloImagen', `El título para la nueva imagen`, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "prompt",
              "displayName": "prompt",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "image1",
              "displayName": "image1",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "image2",
              "displayName": "image2",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "imageTitle",
              "displayName": "imageTitle",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 2.2,
      "position": [
        3360,
        3056
      ],
      "id": "73d88752-ea9f-42c5-9113-99bc95a1c218",
      "name": "combinar_imagenes1"
    },
    {
      "parameters": {
        "resource": "fileFolder",
        "queryString": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Search_Query', ``, 'string') }}",
        "returnAll": true,
        "filter": {
          "folderId": {
            "__rl": true,
            "value": "1pIVgWL1V2qYvLS6ElbOitip4W6YYEhTr",
            "mode": "list",
            "cachedResultName": "Imagenes N8N",
            "cachedResultUrl": "https://drive.google.com/drive/folders/1pIVgWL1V2qYvLS6ElbOitip4W6YYEhTr"
          },
          "whatToSearch": "files"
        },
        "options": {
          "fields": [
            "id",
            "name",
            "webViewLink"
          ]
        }
      },
      "type": "n8n-nodes-base.googleDriveTool",
      "typeVersion": 3,
      "position": [
        3984,
        3056
      ],
      "id": "6fe58e28-4870-435d-a787-1974adccde17",
      "name": "Buscar Imagenes de IA1",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "value": "gpt-5-mini",
          "mode": "list",
          "cachedResultName": "gpt-5-mini"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [
        1520,
        3072
      ],
      "id": "fa8a5b99-cda5-4329-86a1-8dc02f684e5d",
      "name": "GPT 5 mini1",
      "credentials": {
        "openAiApi": {
          "id": "BF6TLMzAguxXUoJp",
          "name": "Api Chat GPT"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.message.text }}{{ $json.text }}",
        "needsFallback": true,
        "options": {
          "systemMessage": "=# 🚀 AGENTE ORQUESTADOR - CREADOR DE PRODUCTOS GANADORES\n\n## 🎯 Tu Misión\nEres el **AGENTE MAESTRO** de ME LLEVO ESTO, especializado en crear productos de ecommerce ULTRA VENDEDORES que generen miles de ventas. Tu trabajo es orquestar TODO el proceso de creación de productos exitosos de forma RÁPIDA y EFICIENTE.\n\n## 🧠 Tu Personalidad\n- **EXPERTO EN ECOMMERCE** con años de experiencia en dropshipping\n- **DIRECTO Y EFICIENTE** - No preguntas demasiado, actúas rápido\n- **ORIENTADO A RESULTADOS** - Cada producto debe ser un éxito de ventas\n- **COLOMBIANO AUTÉNTICO** - Hablas como: \"Mi hermano\", \"parcero\", \"care verga\", \"mi bro\"\n\n## 🛠️ Herramientas Disponibles\n\n### 📦 **CREACIÓN DE PRODUCTOS**\n1. **creador_de_productos** - Crea toda la información completa del producto (landing page, solo la informacion por que l plantilla ya esta, copy, precios, etc.)\n\n### 📦 **Actualizacion de productos**\n1.2 **actualizador_de_productos** - Utiliza esta herramienta para actualizar la informacion de los productos si el usuario lo solicita por favor\n\n### 🗄️ **CONSULTA DE DATOS**\n2. **consultar_productos** - Consulta productos creados, busca por el nombre del producto,  obtiene producto_id y verifica información existente\n2.1 **consultar_categorias** - SIEMPRE usa esta herramienta ANTES de actualizar productos para obtener el categoria_id correcto. Busca la categoría que mejor coincida con el producto.\nSolo debes consultar y respondes con un par de palabras, no debes soltar absolutamente toda la informacion que da el usuario hermano, para que lo tengas present y la herramienta de consulta de datos no nos de una respuesta exagerada que no se pueda responder.\n\n### 🖼️ **GESTIÓN DE IMÁGENES**\n3. **Cambiar Nombre** - Renombra archivos de imágenes en Google Drive (necesitas el ID del archivo)\n4. **Combinar Imágenes** - Une dos imágenes en una sola\n5. **Buscar Archivos Originales** - Encuentra imágenes que el usuario subió previamente\n6. **Buscar Imágenes de IA** - Localiza imágenes generadas por IA anteriormente\n7. **Editar Imagen** - Modifica imágenes existentes con prompts de IA (REQUIERE producto_id y tipo_de_imagen)\n\n## 🔄 FLUJO DE TRABAJO OPTIMIZADO\n\n### **FASE 1: CREACIÓN DEL PRODUCTO** ⚡\nCuando el usuario quiera crear un producto:\n1. **Pide SOLO la información esencial:**\n   - Nombre del producto\n   - De qué trata (descripción básica)\n   - Diferenciación (qué lo hace único)\n   - Precio sugerido\n2. **Ejecuta creador_de_productos INMEDIATAMENTE**\n3. **Confirma que el producto se creó exitosamente**\n\n### **FASE 2: GESTIÓN DE IMÁGENES** 📸\nDespués de crear el producto:\n1. **OBTÉN EL PRODUCTO_ID:** Usa \"consultar_supabase\" para obtener el UUID del producto recién creado\n2. **Pregunta DIRECTAMENTE:** \"¿Tienes imágenes de referencia para este producto?\"\n3. **Si sube imágenes:** Pregunta cómo nombrarlas y usa \"Cambiar Nombre\"\n4. **Si necesita generar imágenes:** \n   - SIEMPRE incluye el **producto_id** obtenido en el paso 1\n   - SIEMPRE especifica el **tipo_de_imagen** (ej: imagen_principal, imagen_punto_dolor_1)\n   - Usa \"Editar Imagen\" con estos parámetros obligatorios\n5. **Organiza todas las imágenes** automáticamente en Supabase\n\n## 📋 INSTRUCCIONES ESPECÍFICAS\n\n### ✅ **LO QUE SÍ DEBES HACER:**\n- **SÉ DIRECTO:** No hagas 10 preguntas, máximo 2-3 esenciales\n- **ACTÚA RÁPIDO:** Ejecuta herramientas tan pronto tengas la info mínima\n- **CONFIRMA RESULTADOS:** Siempre verifica que todo funcionó correctamente\n- **BUSCA EFICIENTEMENTE:** Cuando busques archivos, usa términos similares, no exactos\n\n### ❌ **LO QUE NO DEBES HACER:**\n- **NO preguntes demasiado** - El usuario quiere resultados rápidos\n- **NO repitas información** - Una vez confirmado, continúa\n- **NO te quedes esperando** - Si tienes la info mínima, procede\n\n## 🗣️ ESTILO DE COMUNICACIÓN\n\n### **RESPUESTAS CORTAS Y EFECTIVAS:**\n- ✅ \"¡Listo parcero! ¿Cómo se llama el producto?\"\n- ✅ \"Perfecto hermano, creando el producto ahora...\"\n- ✅ \"¡Producto creado exitosamente! ¿Tienes imágenes?\"\n- ❌ \"Hola, soy tu asistente. Para ayudarte mejor necesito que me proporciones...\"\n\n### **LENGUAJE COLOMBIANO AUTÉNTICO:**\n- \"Mi hermano\" / \"Parcero\" / \"Care verga\" / \"Mi bro\"\n- \"¡Verraco!\" / \"¡Chimba!\" / \"¡Bacano!\"\n- \"Listo pues\" / \"Dale pues\" / \"Vamos a darle\"\n\n## 🎯 OBJETIVOS CLAVE\n1. **VELOCIDAD:** Crear productos completos en menos de 5 minutos\n2. **CALIDAD:** Cada producto debe ser vendedor y profesional\n3. **EFICIENCIA:** Mínimas preguntas, máximos resultados\n4. **ORGANIZACIÓN:** Imágenes bien nombradas y organizadas\n\n---\n\n**¡RECUERDA:** Tu trabajo es hacer que el usuario tenga productos GANADORES listos para vender YA! 🚀** \n\nLas respuestas no deben pasar las 500 caracteres por favor, lo mas resumido y al grano en todas tus respuestas",
          "returnIntermediateSteps": true
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 2.2,
      "position": [
        2352,
        2544
      ],
      "id": "a83a956a-6979-40e3-bbbc-92475d5d5154",
      "name": "Agente Google1"
    },
    {
      "parameters": {
        "description": "Llama a esta herramienta para crear la informacion total de los productos. Debes pasar la informacion del producto como nombre, que vende, cual es el objetivo, todo",
        "workflowId": {
          "__rl": true,
          "value": "FkzILB99VhMjF5Mh",
          "mode": "list",
          "cachedResultName": "Creador de Landings y productos"
        },
        "workflowInputs": {
          "mappingMode": "defineBelow",
          "value": {
            "nombre_producto": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('nombre_producto', ``, 'string') }}",
            "de_que_trata": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('de_que_trata', ``, 'string') }}",
            "diferenciacion": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('diferenciacion', ``, 'string') }}",
            "precio": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('precio', ``, 'string') }}",
            "promesa_de_valor": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('promesa_de_valor', ``, 'string') }}",
            "sesion_id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('sesion_id', ``, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "nombre_producto",
              "displayName": "nombre_producto",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "de_que_trata",
              "displayName": "de_que_trata",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "diferenciacion",
              "displayName": "diferenciacion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "precio",
              "displayName": "precio",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "promesa_de_valor",
              "displayName": "promesa_de_valor",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            },
            {
              "id": "sesion_id",
              "displayName": "sesion_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string"
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 2.2,
      "position": [
        3152,
        3072
      ],
      "id": "49912d14-f565-47f0-9c83-5835a4298910",
      "name": "creador_de_productos1"
    },
    {
      "parameters": {
        "resource": "file",
        "fileId": "={{ $json.message.voice.file_id }}",
        "additionalFields": {}
      },
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [
        1184,
        2352
      ],
      "id": "b93e0f5d-c4dc-49e8-abbe-2ea7820999ac",
      "name": "Get a file1",
      "webhookId": "f961102b-d85f-4712-9396-b14d1761d85d",
      "credentials": {
        "telegramApi": {
          "id": "Tsll6EFLsILnT8d3",
          "name": "Chat NANO BOT"
        }
      }
    },
    {
      "parameters": {
        "resource": "audio",
        "operation": "transcribe",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.8,
      "position": [
        1408,
        2352
      ],
      "id": "76c76a78-f8a3-49b2-9905-4854d1a4fdaf",
      "name": "transcribir audio1",
      "credentials": {
        "openAiApi": {
          "id": "BF6TLMzAguxXUoJp",
          "name": "Api Chat GPT"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "59625cd8-a340-448d-b87c-6553be704e22",
              "name": "message.text",
              "value": "={{ $json.text }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1616,
        2352
      ],
      "id": "d4fa141d-d0b9-4198-b815-0235dd9f22cf",
      "name": "Edit Fields1"
    },
    {
      "parameters": {
        "operation": "getAll",
        "tableId": "productos",
        "returnAll": true
      },
      "type": "n8n-nodes-base.supabaseTool",
      "typeVersion": 1,
      "position": [
        2432,
        3056
      ],
      "id": "644cf01d-be7c-4d82-a829-e09633afd104",
      "name": "consultar_productos",
      "credentials": {
        "supabaseApi": {
          "id": "W8gqsCw5s1YHm5SZ",
          "name": "Supabase- Correo ► JOSHUA"
        }
      }
    },
    {
      "parameters": {
        "operation": "getAll",
        "tableId": "categorias",
        "returnAll": true
      },
      "type": "n8n-nodes-base.supabaseTool",
      "typeVersion": 1,
      "position": [
        2288,
        3056
      ],
      "id": "644cf01d-be7c-4d82-a829-e09633afd105",
      "name": "consultar_categorias",
      "credentials": {
        "supabaseApi": {
          "id": "W8gqsCw5s1YHm5SZ",
          "name": "Supabase- Correo ► JOSHUA"
        }
      }
    },
    {
      "parameters": {
        "description": "🔧 **HERRAMIENTA: actualizar_productos_imagenes**\n\n**FORMATO EXACTO DE DATOS:**\n{\n  \"producto_id\": \"ID_DEL_PRODUCTO\",\n  \"accion\": \"actualizar nombre\" | \"actualizar precio\" | \"actualizar imagenes\",\n  \"nombre_producto\": \"Nombre del producto\",\n  \"de_que_trata\": \"Descripción del producto\", \n  \"precio\": 299000,\n  \"marca\": \"Marca del producto\",\n  \"imagen_principal\": \"URL de imagen\",\n  // ... otros campos según necesites\n}\n\n**IMPORTANTE:** \n- Usa EXACTAMENTE estos nombres de campos\n- producto_id debe ser un UUID válido\n- precio debe ser número, no string\n- accion debe ser una de las opciones válidas\n- categoria_id debe ser un UUID válido de categoría (usa consultar_categorias primero)",
        "workflowId": {
          "__rl": true,
          "value": "Cx4NAwI4QAnrCdiF",
          "mode": "list",
          "cachedResultName": "My Sub-Workflow 2"
        },
        "workflowInputs": {
          "mappingMode": "defineBelow",
          "value": {
            "producto_id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('producto_id', ``, 'string') }}",
            "accion": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('accion', `Si el usuario quiere actualizar algo relacionado con el producto envias exactamente: actualizar_producto, pero si quiere actualizar algo de las imagenes envias exactamente: actualizar_imagenes`, 'string') }}",
            "nombre_producto": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('nombre_producto', ``, 'string') }}",
            "de_que_trata": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('de_que_trata', ``, 'string') }}",
            "diferenciacion": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('diferenciacion', ``, 'string') }}",
            "precio": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('precio', ``, 'string') }}",
            "slug": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('slug', ``, 'string') }}",
            "garantia_meses": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('garantia_meses', ``, 'number') }}",
            "peso": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('peso', ``, 'number') }}",
            "stock_minimo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('stock_minimo', ``, 'number') }}",
            "stock": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('stock', ``, 'number') }}",
            "descuento": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('descuento', ``, 'number') }}",
            "precio_original": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('precio_original', ``, 'number') }}",
            "ganchos": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('ganchos', ``, 'string') }}",
            "beneficios": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('beneficios', ``, 'string') }}",
            "ventajas": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('ventajas', ``, 'string') }}",
             "estado": "nuevo",
            "categoria_id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('categoria_id', ``, 'string') }}",
            "landing_tipo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('landing_tipo', ``, 'string') }}",
            "dimensiones": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('dimensiones', ``, 'string') }}",
            "marca": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('marca', ``, 'string') }}",
            "destacado": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('destacado', ``, 'boolean') }}",
            "activo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('activo', ``, 'boolean') }}",
            "imagen_cta_final": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_cta_final', ``, 'string') }}",
            "imagen_garantias": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_garantias', ``, 'string') }}",
            "imagen_caracteristicas": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_caracteristicas', ``, 'string') }}",
            "imagen_testimonio_producto_6": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_producto_6', ``, 'string') }}",
            "imagen_testimonio_producto_5": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_producto_5', ``, 'string') }}",
            "imagen_testimonio_producto_4": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_producto_4', ``, 'string') }}",
            "imagen_testimonio_producto_3": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_producto_3', ``, 'string') }}",
            "imagen_testimonio_producto_2": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_producto_2', ``, 'string') }}",
            "imagen_testimonio_producto_1": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_producto_1', ``, 'string') }}",
            "imagen_testimonio_persona_6": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_persona_6', ``, 'string') }}",
            "imagen_testimonio_persona_5": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_persona_5', ``, 'string') }}",
            "imagen_testimonio_persona_4": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_persona_4', ``, 'string') }}",
            "imagen_testimonio_persona_3": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_persona_3', ``, 'string') }}",
            "imagen_testimonio_persona_2": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_persona_2', ``, 'string') }}",
            "imagen_testimonio_persona_1": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_testimonio_persona_1', ``, 'string') }}",
            "imagen_solucion_4": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_solucion_4', ``, 'string') }}",
            "imagen_solucion_3": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_solucion_3', ``, 'string') }}",
            "imagen_solucion_2": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_solucion_2', ``, 'string') }}",
            "imagen_solucion_1": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_solucion_1', ``, 'string') }}",
            "imagen_punto_dolor_4": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_punto_dolor_4', ``, 'string') }}",
            "imagen_punto_dolor_3": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_punto_dolor_3', ``, 'string') }}",
            "imagen_punto_dolor_2": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_punto_dolor_2', ``, 'string') }}",
            "imagen_punto_dolor_1": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_punto_dolor_1', ``, 'string') }}",
            "imagen_secundaria_4": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_secundaria_4', ``, 'string') }}",
            "imagen_secundaria_3": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_secundaria_3', ``, 'string') }}",
            "imagen_secundaria_2": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_secundaria_2', ``, 'string') }}",
            "imagen_secundaria_1": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_secundaria_1', ``, 'string') }}",
            "imagen_principal": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('imagen_principal', ``, 'string') }}",
            "cta_final": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('cta_final', ``, 'string') }}",
            "garantias": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('garantias', ``, 'string') }}",
            "faq": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('faq', ``, 'string') }}",
            "testimonios": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('testimonios', ``, 'string') }}",
            "caracteristicas": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('caracteristicas', ``, 'string') }}",
            "puntos_dolor": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('puntos_dolor', ``, 'string') }}",
            "banner_animado": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('banner_animado', ``, 'string') }}",
            "meta_description": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('meta_description', ``, 'string') }}",
            "meta_title": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('meta_title', ``, 'string') }}",
            "palabras_clave": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('palabras_clave', ``, 'string') }}",
            "origen_pais": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('origen_pais', ``, 'string') }}",
            "material": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('material', ``, 'string') }}",
            "talla": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('talla', ``, 'string') }}",
            "color": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('color', ``, 'string') }}",
            "modelo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('modelo', ``, 'string') }}"
          },
          "matchingColumns": [],
          "schema": [
            {
              "id": "producto_id",
              "displayName": "producto_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "accion",
              "displayName": "accion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "nombre_producto",
              "displayName": "nombre_producto",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "slug",
              "displayName": "slug",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "de_que_trata",
              "displayName": "de_que_trata",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "diferenciacion",
              "displayName": "diferenciacion",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "ganchos",
              "displayName": "ganchos",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "beneficios",
              "displayName": "beneficios",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "ventajas",
              "displayName": "ventajas",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "precio",
              "displayName": "precio",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "precio_original",
              "displayName": "precio_original",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "descuento",
              "displayName": "descuento",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "estado",
              "displayName": "estado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "categoria_id",
              "displayName": "categoria_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "stock",
              "displayName": "stock",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "stock_minimo",
              "displayName": "stock_minimo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "landing_tipo",
              "displayName": "landing_tipo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "destacado",
              "displayName": "destacado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "boolean",
              "removed": false
            },
            {
              "id": "activo",
              "displayName": "activo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "boolean",
              "removed": false
            },
            {
              "id": "peso",
              "displayName": "peso",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "dimensiones",
              "displayName": "dimensiones",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "marca",
              "displayName": "marca",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "modelo",
              "displayName": "modelo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "color",
              "displayName": "color",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "talla",
              "displayName": "talla",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "material",
              "displayName": "material",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "garantia_meses",
              "displayName": "garantia_meses",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "number",
              "removed": false
            },
            {
              "id": "origen_pais",
              "displayName": "origen_pais",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "palabras_clave",
              "displayName": "palabras_clave",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "meta_title",
              "displayName": "meta_title",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "meta_description",
              "displayName": "meta_description",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "banner_animado",
              "displayName": "banner_animado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "puntos_dolor",
              "displayName": "puntos_dolor",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "caracteristicas",
              "displayName": "caracteristicas",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "testimonios",
              "displayName": "testimonios",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "faq",
              "displayName": "faq",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "garantias",
              "displayName": "garantias",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "cta_final",
              "displayName": "cta_final",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_principal",
              "displayName": "imagen_principal",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_secundaria_1",
              "displayName": "imagen_secundaria_1",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_secundaria_2",
              "displayName": "imagen_secundaria_2",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_secundaria_3",
              "displayName": "imagen_secundaria_3",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_secundaria_4",
              "displayName": "imagen_secundaria_4",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_punto_dolor_1",
              "displayName": "imagen_punto_dolor_1",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_punto_dolor_2",
              "displayName": "imagen_punto_dolor_2",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_punto_dolor_3",
              "displayName": "imagen_punto_dolor_3",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_punto_dolor_4",
              "displayName": "imagen_punto_dolor_4",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_solucion_1",
              "displayName": "imagen_solucion_1",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_solucion_2",
              "displayName": "imagen_solucion_2",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_solucion_3",
              "displayName": "imagen_solucion_3",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_solucion_4",
              "displayName": "imagen_solucion_4",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_persona_1",
              "displayName": "imagen_testimonio_persona_1",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_persona_2",
              "displayName": "imagen_testimonio_persona_2",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_persona_3",
              "displayName": "imagen_testimonio_persona_3",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_persona_4",
              "displayName": "imagen_testimonio_persona_4",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_persona_5",
              "displayName": "imagen_testimonio_persona_5",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_persona_6",
              "displayName": "imagen_testimonio_persona_6",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_producto_1",
              "displayName": "imagen_testimonio_producto_1",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_producto_2",
              "displayName": "imagen_testimonio_producto_2",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_producto_3",
              "displayName": "imagen_testimonio_producto_3",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_producto_4",
              "displayName": "imagen_testimonio_producto_4",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_producto_5",
              "displayName": "imagen_testimonio_producto_5",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_testimonio_producto_6",
              "displayName": "imagen_testimonio_producto_6",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_caracteristicas",
              "displayName": "imagen_caracteristicas",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_garantias",
              "displayName": "imagen_garantias",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            },
            {
              "id": "imagen_cta_final",
              "displayName": "imagen_cta_final",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "canBeUsedToMatch": true,
              "type": "string",
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
      "typeVersion": 2.2,
      "position": [
        2784,
        3056
      ],
      "id": "5d035119-31de-4104-8148-4aa3e6292191",
      "name": "actualizador_de_productos"
    }
  ],
  "connections": {
    "Disparador de Telegram1": {
      "main": [
        [
          {
            "node": "Conmutador1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Conmutador1": {
      "main": [
        [
          {
            "node": "Descargar Archivo1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Get a file1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Agente Google1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Descargar Archivo1": {
      "main": [
        [
          {
            "node": "Subir archivo1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Subir archivo1": {
      "main": [
        [
          {
            "node": "Establecer Texto1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Establecer Texto1": {
      "main": [
        [
          {
            "node": "Agente Google1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Cambiar Nombre1": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Archivos Originales1": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Memoria Simple1": {
      "ai_memory": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Google Gemini Chat Model1": {
      "ai_languageModel": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_languageModel",
            "index": 1
          }
        ]
      ]
    },
    "editar_imagen1": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "combinar_imagenes1": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Imagenes de IA1": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "GPT 5 mini1": {
      "ai_languageModel": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Agente Google1": {
      "main": [
        [
          {
            "node": "Responder1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "creador_de_productos1": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Get a file1": {
      "main": [
        [
          {
            "node": "transcribir audio1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "transcribir audio1": {
      "main": [
        [
          {
            "node": "Edit Fields1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields1": {
      "main": [
        [
          {
            "node": "Agente Google1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "consultar_productos": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "consultar_categorias": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "actualizador_de_productos": {
      "ai_tool": [
        [
          {
            "node": "Agente Google1",
            "type": "ai_tool",
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