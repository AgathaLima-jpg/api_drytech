# DryTech IoT API

API REST em Node.js/TypeScript para uma secadora conectada, com Prisma para MariaDB, Zod, JWT, autenticação por API key dos dispositivos e Swagger.

## Início rápido

1. Copie `.env.example` para `.env` e informe `DATABASE_URL` e um `JWT_SECRET` forte.
2. `npm install`
3. `npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed`
4. `npm run dev`

Documentação: `http://localhost:3000/api/docs`. Para endpoints administrativos, envie `Authorization: Bearer <JWT>`. Para IoT, envie `x-device-api-key`; a chave de seed é definida por `SEED_DEVICE_KEY` (use uma chave forte fora de desenvolvimento).

As leituras são o estado informado pelo ESP8266. As instruções retornadas são o estado desejado pela API e cada comando é auditado em `DeviceCommand`; a execução pelo hardware nunca é presumida.

## Segurança física

Temperatura crítica, sobrecorrente, sobrepeso e porta aberta durante secagem retornam parada de emergência. A finalização por umidade exige leituras consecutivas configuráveis. O firmware deve ter seu próprio watchdog/fail-safe: se perder comunicação com a API, desligue os atuadores perigosos.
