import { z } from "zod";
export const telemetrySchema = z.object({
  temperature: z.number().finite().min(-40).max(150),
  humidity: z.number().finite().min(0).max(100),
  weight: z.number().finite().min(0).max(100),
  doorOpen: z.boolean(),
  motorOn: z.boolean(),
  heaterOn: z.boolean(),
  fanOn: z.boolean(),
  current: z.number().finite().min(0).max(100),
  voltage: z.number().finite().min(0).max(500),
  energyConsumption: z.number().finite().min(0).max(10000),
  cycleId: z.string().cuid().optional(),
  timestamp: z
    .string()
    .datetime()
    .transform((v) => new Date(v)),
});
export const deviceSchema = z.object({
  name: z.string().min(2).max(100),
  serialNumber: z.string().min(3).max(100),
  apiKey: z.string().min(24),
  maxLoadKg: z.number().positive().max(100).optional(),
  maxCurrent: z.number().positive().max(100).optional(),
});
export const cycleSchema = z.object({
  deviceId: z.string().cuid(),
  initialWeight: z.number().positive(),
  targetHumidity: z.number().min(0).max(100).optional(),
});
export const statusSchema = z.object({
  status: z.enum([
    "IDLE",
    "PREPARING",
    "DRYING",
    "PAUSED",
    "COMPLETED",
    "CANCELLED",
    "ERROR",
  ]),
});
