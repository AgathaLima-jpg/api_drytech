import { CycleStatus } from "@prisma/client";
import { AppError } from "../utils/http";
const transitions: Record<CycleStatus, CycleStatus[]> = {
  IDLE: ["PREPARING"],
  PREPARING: ["DRYING", "CANCELLED", "ERROR"],
  DRYING: ["PAUSED", "COMPLETED", "CANCELLED", "ERROR"],
  PAUSED: ["DRYING", "CANCELLED", "ERROR"],
  COMPLETED: [],
  CANCELLED: [],
  ERROR: [],
};
export function validateCycleTransition(
  current: CycleStatus,
  next: CycleStatus,
) {
  return transitions[current].includes(next);
}
export function assertCycleTransition(current: CycleStatus, next: CycleStatus) {
  if (!validateCycleTransition(current, next))
    throw new AppError(409, `Invalid cycle transition: ${current} -> ${next}`);
}
