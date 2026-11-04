import { AlertType, CycleStatus, Severity } from "@prisma/client";
import { env } from "../config/env";
export type Command = {
  heater: "ON" | "OFF";
  fan: "ON" | "OFF";
  motor: "ON" | "OFF";
  safe: boolean;
  emergencyStop: boolean;
  reason?: string;
};
export function evaluateSafety(input: {
  temperature: number;
  doorOpen: boolean;
  weight: number;
  current: number;
  cycleStatus?: CycleStatus;
  maxLoadKg?: number | null;
  maxCurrent?: number | null;
}) {
  const alerts: {
    type: AlertType;
    severity: Severity;
    message: string;
    value?: number;
  }[] = [];
  let command: Command = {
    heater: "ON",
    fan: "ON",
    motor: "ON",
    safe: true,
    emergencyStop: false,
  };
  if (input.temperature > env.criticalTemperature) {
    alerts.push({
      type: "HIGH_TEMPERATURE",
      severity: "CRITICAL",
      message: "Critical temperature reached",
      value: input.temperature,
    });
    command = {
      heater: "OFF",
      fan: "ON",
      motor: "OFF",
      safe: false,
      emergencyStop: true,
      reason: "HIGH_TEMPERATURE",
    };
  } else if (input.temperature > env.maxTemperature)
    alerts.push({
      type: "HIGH_TEMPERATURE",
      severity: "WARNING",
      message: "Temperature above normal range",
      value: input.temperature,
    });
  if (input.current > (input.maxCurrent ?? env.maxCurrent)) {
    alerts.push({
      type: "OVERCURRENT",
      severity: "CRITICAL",
      message: "Current above allowed limit",
      value: input.current,
    });
    command = {
      heater: "OFF",
      fan: "ON",
      motor: "OFF",
      safe: false,
      emergencyStop: true,
      reason: "OVERCURRENT",
    };
  }
  if (input.weight > (input.maxLoadKg ?? env.maxLoadKg)) {
    alerts.push({
      type: "OVERWEIGHT",
      severity: "WARNING",
      message: "Load exceeds capacity",
      value: input.weight,
    });
    command = {
      heater: "OFF",
      fan: "OFF",
      motor: "OFF",
      safe: false,
      emergencyStop: true,
      reason: "OVERWEIGHT",
    };
  }
  if (input.doorOpen && input.cycleStatus === "DRYING") {
    alerts.push({
      type: "DOOR_OPEN",
      severity: "CRITICAL",
      message: "Door opened during drying",
    });
    command = {
      heater: "OFF",
      fan: "OFF",
      motor: "OFF",
      safe: false,
      emergencyStop: true,
      reason: "DOOR_OPEN",
    };
  }
  return { alerts, command };
}
