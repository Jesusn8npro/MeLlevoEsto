{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.imgbb.com/1/upload",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "key",
              "value": "7cd0a39377ea330cb0f359a1614582d0"
            }
          ]
        },
        "sendBody": true,
        "contentType": "multipart-form-data",
        "bodyParameters": {
          "parameters": [
            {
              "parameterType": "formBinaryData",
              "name": "image",
              "inputDataFieldName": "data"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -896,
        192
      ],
      "id": "9a8b2f96-a72d-4d59-ba0a-06606bc1b8e5",
      "name": "Obtener URL"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": {
          "__rl": true,
          "value": "={{ $json.imageID }}",
          "mode": "id"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        -1120,
        192
      ],
      "id": "8a30ab3c-4d30-41d4-83cc-5d8b86460ee5",
      "name": "Descargar archivo",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://queue.fal.run/fal-ai/nano-banana/edit",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Key 21f46ed9-0225-40f6-9ffc-25661e559c38:851595cba3c58067fd73c650a492aeb7"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"prompt\": \"{{ \n  $('When Executed by Another Workflow').item.json.imagePrompt.replace(/\\\"/g, '\\\\\\\"').replace(/(\\r\\n|\\n|\\r)/g, '\\\\n') }}}}\",\n  \"image_urls\": [\n    \"{{ $json.data.url }}\"\n  ],\n  \"num_images\": 1,\n  \"output_format\": \"jpeg\"\n}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -672,
        192
      ],
      "id": "1af96418-da7f-41b2-8776-bdf015ffa690",
      "name": "Crear Imagen"
    },
    {
      "parameters": {
        "url": "={{ $json.images[0].url }}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        0,
        48
      ],
      "id": "22680e63-01f2-4dad-8d77-8b0f1ca28d3b",
      "name": "Descargar Imagen"
    },
    {
      "parameters": {
        "amount": 10
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        -448,
        192
      ],
      "id": "bda0ec0a-9a86-4f2f-a05b-a15043d3d1ee",
      "name": "10 Segundos",
      "webhookId": "caad73e3-58d8-4fbd-a3e9-c42424f2d1ee"
    },
    {
      "parameters": {
        "name": "={{ $('When Executed by Another Workflow').item.json.imageTitle }}",
        "driveId": {
          "__rl": true,
          "mode": "list",
          "value": "My Drive"
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
        224,
        48
      ],
      "id": "d2795648-c544-484d-8187-7393fcd92a81",
      "name": "Subir archivo",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        0,
        240
      ],
      "id": "516c1e21-920d-4b01-8417-0d764110b9ed",
      "name": "5 Segundos",
      "webhookId": "5f6bbd1e-a155-48de-b737-a225c6fd7a84"
    },
    {
      "parameters": {
        "url": "=https://queue.fal.run/fal-ai/nano-banana/requests/{{ $json.request_id }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Key 21f46ed9-0225-40f6-9ffc-25661e559c38:851595cba3c58067fd73c650a492aeb7"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -224,
        192
      ],
      "id": "0c7eab14-459a-4660-976f-98173548fe6c",
      "name": "Obtener Resultado",
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "workflowInputs": {
          "values": [
            {
              "name": "imageTitle"
            },
            {
              "name": "imagePrompt"
            },
            {
              "name": "imageID"
            },
            {
              "name": "tipo_de_imagen"
            },
            {
              "name": "producto_id"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1.1,
      "position": [
        -1344,
        192
      ],
      "id": "f0d1c5ca-14d2-4379-a5a6-496ea8feef88",
      "name": "When Executed by Another Workflow"
    },
    {
      "parameters": {
        "operation": "select",
        "tableId": "producto_imagenes",
        "filterType": "manual",
        "matchType": "allFilters",
        "filters": {
          "conditions": [
            {
              "keyName": "producto_id",
              "condition": "equals",
              "keyValue": "={{ $('When Executed by Another Workflow').item.json.producto_id }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        448,
        48
      ],
      "id": "buscar-producto-imagenes",
      "name": "Buscar Producto Imágenes",
      "credentials": {
        "supabaseApi": {
          "id": "W8gqsCw5s1YHm5SZ",
          "name": "Supabase- Correo ► JOSHUA"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "tableId": "producto_imagenes",
        "filterType": "manual",
        "matchType": "allFilters",
        "filters": {
          "conditions": [
            {
              "keyName": "producto_id",
              "condition": "equals",
              "keyValue": "={{ $('When Executed by Another Workflow').item.json.producto_id }}"
            }
          ]
        },
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "={{ $('When Executed by Another Workflow').item.json.tipo_de_imagen }}",
              "fieldValue": "={{ $json.webViewLink.replace('/file/d/', '/thumbnail?id=').replace('/view?usp=drivesdk', '&sz=w1000') }}"
            },
            {
              "fieldId": "estado",
              "fieldValue": "procesando"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        672,
        48
      ],
      "id": "actualizar-imagen-supabase",
      "name": "Actualizar Imagen Supabase",
      "credentials": {
        "supabaseApi": {
          "id": "W8gqsCw5s1YHm5SZ",
          "name": "Supabase- Correo ► JOSHUA"
        }
      }
    },
    {
      "parameters": {
        "operation": "runSql",
        "query": "UPDATE producto_imagenes \nSET \n  total_imagenes_generadas = (\n    CASE WHEN imagen_principal IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_secundaria_1 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_secundaria_2 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_secundaria_3 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_secundaria_4 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_punto_dolor_1 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_punto_dolor_2 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_punto_dolor_3 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_punto_dolor_4 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_solucion_1 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_solucion_2 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_solucion_3 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_solucion_4 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_persona_1 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_persona_2 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_persona_3 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_persona_4 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_persona_5 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_persona_6 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_producto_1 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_producto_2 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_producto_3 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_producto_4 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_producto_5 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_testimonio_producto_6 IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_caracteristicas IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_garantias IS NOT NULL THEN 1 ELSE 0 END +\n    CASE WHEN imagen_cta_final IS NOT NULL THEN 1 ELSE 0 END\n  ),\n  estado = CASE \n    WHEN total_imagenes_generadas >= 28 THEN 'completado'\n    WHEN total_imagenes_generadas >= 15 THEN 'avanzado' \n    WHEN total_imagenes_generadas >= 5 THEN 'procesando'\n    ELSE 'iniciado'\n  END\nWHERE producto_id = '{{ $('When Executed by Another Workflow').item.json.producto_id }}'\nRETURNING *;",
        "options": {}
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        896,
        48
      ],
      "id": "actualizar-contador",
      "name": "Actualizar Contador",
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
        "jsonOutput": "={\n  \"Response\": \"¡Imagen generada y guardada exitosamente!\\n\\n📸 Tipo: {{ $('When Executed by Another Workflow').item.json.tipo_de_imagen }}\\n🎯 Título: {{ $('When Executed by Another Workflow').item.json.imageTitle }}\\n🔗 URL: {{ $('Subir archivo').item.json.webViewLink }}\\n📊 Progreso: {{ $json[0].total_imagenes_generadas }}/28 imágenes completadas\\n⚡ Estado: {{ $json[0].estado }}\\n\\n¡Imagen lista para la landing page!\"\n}",
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1120,
        48
      ],
      "id": "8ecc85a7-a403-4228-a5df-cb9cafb690d4",
      "name": "Resultado"
    }
  ],
  "connections": {
    "Obtener URL": {
      "main": [
        [
          {
            "node": "Crear Imagen",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Descargar archivo": {
      "main": [
        [
          {
            "node": "Obtener URL",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crear Imagen": {
      "main": [
        [
          {
            "node": "10 Segundos",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Descargar Imagen": {
      "main": [
        [
          {
            "node": "Subir archivo",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "10 Segundos": {
      "main": [
        [
          {
            "node": "Obtener Resultado",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Subir archivo": {
      "main": [
        [
          {
            "node": "Buscar Producto Imágenes",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "5 Segundos": {
      "main": [
        [
          {
            "node": "Obtener Resultado",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Obtener Resultado": {
      "main": [
        [
          {
            "node": "Descargar Imagen",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "5 Segundos",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "When Executed by Another Workflow": {
      "main": [
        [
          {
            "node": "Descargar archivo",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Producto Imágenes": {
      "main": [
        [
          {
            "node": "Actualizar Imagen Supabase",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Actualizar Imagen Supabase": {
      "main": [
        [
          {
            "node": "Actualizar Contador",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Actualizar Contador": {
      "main": [
        [
          {
            "node": "Resultado",
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

