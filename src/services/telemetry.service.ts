import { CycleStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { AppError } from "../utils/http";
import { evaluateSafety } from "./safety.service";
export async function processTelemetry(deviceId: string, data: any) {
  const device = await prisma.device.findUnique({ where: { id: deviceId } });
  if (!device) throw new AppError(404, "Device not found");
  let cycle = data.cycleId
    ? await prisma.dryingCycle.findFirst({
        where: { id: data.cycleId, deviceId },
      })
    : await prisma.dryingCycle.findFirst({
        where: { deviceId, status: { in: ["PREPARING", "DRYING", "PAUSED"] } },
      });
  if (data.cycleId && !cycle)
    throw new AppError(404, "Cycle not found for device");
  const safety = evaluateSafety({
    ...data,
    cycleStatus: cycle?.status,
    maxLoadKg: device.maxLoadKg,
    maxCurrent: device.maxCurrent,
  });
  const low =
    cycle &&
    data.humidity <= cycle.targetHumidity &&
    !data.doorOpen &&
    !safety.command.emergencyStop
      ? cycle.lowHumidityReadings + 1
      : 0;
  let status = cycle?.status;
  if (cycle && safety.command.emergencyStop && cycle.status === "DRYING")
    status = safety.command.reason === "DOOR_OPEN" ? "PAUSED" : "ERROR";
  else if (cycle && cycle.status === "PREPARING" && !data.doorOpen)
    status = "DRYING";
  else if (cycle && low >= env.humidityConfirmationReadings)
    status = "COMPLETED";
  const energyDelta = cycle
    ? Math.max(0, data.energyConsumption - cycle.energyConsumed)
    : 0;
  const tx: any[] = [
    prisma.telemetry.create({
      data: { deviceId, cycleId: cycle?.id, ...data },
    }),
    prisma.device.update({
      where: { id: deviceId },
      data: { lastSeen: new Date(), status: "ONLINE" },
    }),
    prisma.deviceCommand.create({
      data: {
        deviceId,
        cycleId: cycle?.id,
        heater: safety.command.heater,
        motor: safety.command.motor,
        fan: safety.command.fan,
        safe: safety.command.safe,
        emergencyStop: safety.command.emergencyStop,
        reason: safety.command.reason,
      },
    }),
  ];
  for (const a of safety.alerts)
    tx.push(
      prisma.alert.create({ data: { deviceId, cycleId: cycle?.id, ...a } }),
    );
  if (cycle) {
    const update: any = {
      lowHumidityReadings: low,
      maximumTemperature: Math.max(cycle.maximumTemperature, data.temperature),
      energyConsumed: Math.max(cycle.energyConsumed, data.energyConsumption),
    };
    if (status !== cycle.status) update.status = status;
    if (status === "COMPLETED" || status === "ERROR") {
      update.endTime = new Date();
      update.finalWeight = data.weight;
    }
    if (status === "COMPLETED")
      tx.push(
        prisma.alert.create({
          data: {
            deviceId,
            cycleId: cycle.id,
            type: "DRYING_COMPLETE",
            severity: "INFO",
            message: "Humidity target confirmed",
          },
        }),
      );
    tx.push(
      prisma.dryingCycle.update({ where: { id: cycle.id }, data: update }),
    );
  }
  await prisma.$transaction(tx);
  return {
    success: true,
    device: { id: deviceId },
    cycle: cycle ? { id: cycle.id, status: status } : null,
    commands: {
      heater: safety.command.heater,
      fan: safety.command.fan,
      motor: safety.command.motor,
    },
    safety: {
      safe: safety.command.safe,
      emergencyStop: safety.command.emergencyStop,
      ...(safety.command.reason ? { reason: safety.command.reason } : {}),
    },
    nextTelemetryIn: env.telemetryInterval,
  };
}
