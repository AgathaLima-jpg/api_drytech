import swaggerJSDoc from "swagger-jsdoc";
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "DryTech IoT API",
      version: "1.0.0",
      description: "API segura para controle e telemetria de secadoras IoT",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
        deviceApiKey: {
          type: "apiKey",
          in: "header",
          name: "x-device-api-key",
        },
      },
      schemas: {
        Telemetry: {
          type: "object",
          required: [
            "temperature",
            "humidity",
            "weight",
            "doorOpen",
            "motorOn",
            "heaterOn",
            "fanOn",
            "current",
            "voltage",
            "energyConsumption",
            "timestamp",
          ],
          properties: {
            temperature: { type: "number", example: 52.4 },
            humidity: { type: "number", example: 31.8 },
            weight: { type: "number", example: 2.4 },
            doorOpen: { type: "boolean" },
            motorOn: { type: "boolean" },
            heaterOn: { type: "boolean" },
            fanOn: { type: "boolean" },
            current: { type: "number" },
            voltage: { type: "number", example: 220 },
            energyConsumption: { type: "number" },
            cycleId: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      "/api/iot/devices/{deviceId}/telemetry": {
        post: {
          summary: "Recebe telemetria e retorna comandos",
          security: [{ deviceApiKey: [] }],
          parameters: [
            {
              name: "deviceId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Telemetry" },
              },
            },
          },
          responses: {
            "200": { description: "Instruções ao ESP8266" },
            "400": { description: "Payload inválido" },
            "401": { description: "Credenciais inválidas" },
          },
        },
      },
      "/api/devices": {
        get: {
          summary: "Lista dispositivos",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "OK" } },
        },
        post: {
          summary: "Cadastra dispositivo",
          security: [{ bearerAuth: [] }],
          responses: { "201": { description: "Criado" } },
        },
      },
      "/api/cycles": {
        get: {
          summary: "Lista ciclos",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "OK" } },
        },
        post: {
          summary: "Inicia ciclo",
          security: [{ bearerAuth: [] }],
          responses: { "201": { description: "Criado" } },
        },
      },
    },
  },
  apis: [],
});
