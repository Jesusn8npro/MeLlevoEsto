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
        -768,
        80
      ],
      "id": "16e2b077-b0eb-41f0-88dd-dc3784a5247d",
      "name": "Obtener URL"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "6831d021-c2d0-42a4-b625-aabfed3d170b",
              "name": "images",
              "value": "=['{{ $json.image1 }}','{{ $json.image2 }}']",
              "type": "array"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -1216,
        80
      ],
      "id": "88093832-47af-4437-828a-d691ac38f7e5",
      "name": "Editar Campos"
    },
    {
      "parameters": {
        "fieldToSplitOut": "images",
        "options": {}
      },
      "type": "n8n-nodes-base.splitOut",
      "typeVersion": 1,
      "position": [
        -1072,
        80
      ],
      "id": "aae90a65-f846-4fe7-8796-3f29d52ccbfe",
      "name": "Dividir"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": {
          "__rl": true,
          "value": "={{ $json.images }}",
          "mode": "id"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        -928,
        80
      ],
      "id": "5b130970-0449-4335-bf9d-01b5fe0480d6",
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
        "fieldsToAggregate": {
          "fieldToAggregate": [
            {
              "fieldToAggregate": "data"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.aggregate",
      "typeVersion": 1,
      "position": [
        -624,
        80
      ],
      "id": "ec819930-5fc0-432b-970b-aea321b8de06",
      "name": "Agregar"
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
        "contentType": "=json",
        "specifyBody": "json",
        "bodyParameters": {
          "parameters": [
            {}
          ]
        },
        "jsonBody": "={\n  \"prompt\": \"{{ \n  $('When Executed by Another Workflow').item.json.prompt.replace(/\\\"/g, '\\\\\\\"').replace(/(\\r\\n|\\n|\\r)/g, '\\\\n') }}}}\",\n  \"image_urls\": [\n    \"{{ $json.data[0].url }}\",\n    \"{{ $json.data[1].url }}\"\n  ],\n  \"num_images\": 1,\n  \"output_format\": \"jpeg\"\n}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -480,
        80
      ],
      "id": "4ec801e1-2bf3-489c-8dc6-ce22fbeb0606",
      "name": "Crear Imagen"
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
        -176,
        80
      ],
      "id": "2f7e07e9-c4eb-42bc-a9a3-ad421767ea30",
      "name": "Obtener Resultado",
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "mode": "raw",
        "jsonOutput": "={{\n  {\n    \"Response\": \"La imagen fue creada y nombrada \\\"\" + ($json.name || \"\") + \"\\\".\\n\\nAquí está el enlace a la imagen en Google Drive: \" + ($json.webViewLink || \"\")\n  }\n}}",
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        288,
        0
      ],
      "id": "48e73974-3a4e-416a-9201-5aed168650f9",
      "name": "Resultado"
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
        0
      ],
      "id": "508077ab-c7ea-45eb-a24e-304483c5ed6e",
      "name": "Descargar Imagen"
    },
    {
      "parameters": {
        "amount": 10
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        -336,
        80
      ],
      "id": "49af00d6-96d2-4854-b2f5-3460f6d64079",
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
        144,
        0
      ],
      "id": "84a674e3-5d62-45ef-968d-acbd09093a0a",
      "name": "Subir archivo",
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "JYFM1ZlxpvZ3MVli",
          "name": "Drive Jesus Gonzalez"
        }
      }
    },
    {
      "parameters": {
        "amount": 10
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        0,
        144
      ],
      "id": "66f4f59d-4563-41f7-abf9-3df16ecf7551",
      "name": "5 Segundos",
      "webhookId": "5f6bbd1e-a155-48de-b737-a225c6fd7a84"
    },
    {
      "parameters": {
        "workflowInputs": {
          "values": [
            {
              "name": "prompt"
            },
            {
              "name": "image1"
            },
            {
              "name": "image2"
            },
            {
              "name": "imageTitle"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1.1,
      "position": [
        -1392,
        80
      ],
      "id": "22e36dac-69db-4c56-abe8-642de8973fb2",
      "name": "When Executed by Another Workflow"
    }
  ],
  "connections": {
    "Obtener URL": {
      "main": [
        [
          {
            "node": "Agregar",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Editar Campos": {
      "main": [
        [
          {
            "node": "Dividir",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Dividir": {
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
    "Agregar": {
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
            "node": "Resultado",
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
    "When Executed by Another Workflow": {
      "main": [
        [
          {
            "node": "Editar Campos",
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