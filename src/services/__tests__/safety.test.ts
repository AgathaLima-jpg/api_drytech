import { describe, it, expect } from "vitest";
import { evaluateSafety } from "../safety.service";
import { validateCycleTransition } from "../dryingCycle.service";
describe("dryer safety", () => {
  const normal = {
    temperature: 50,
    doorOpen: false,
    weight: 2,
    current: 2,
    cycleStatus: "DRYING" as const,
  };
  it("accepts normal temperature", () =>
    expect(evaluateSafety(normal).command.safe).toBe(true));
  it("emergency stops critical heat", () =>
    expect(evaluateSafety({ ...normal, temperature: 71 }).command.reason).toBe(
      "HIGH_TEMPERATURE",
    ));
  it("stops for door open", () =>
    expect(evaluateSafety({ ...normal, doorOpen: true }).command.reason).toBe(
      "DOOR_OPEN",
    ));
  it("stops overcurrent", () =>
    expect(evaluateSafety({ ...normal, current: 11 }).command.reason).toBe(
      "OVERCURRENT",
    ));
  it("stops overweight", () =>
    expect(evaluateSafety({ ...normal, weight: 11 }).command.reason).toBe(
      "OVERWEIGHT",
    ));
  it("accepts valid transition", () =>
    expect(validateCycleTransition("DRYING", "PAUSED")).toBe(true));
  it("rejects invalid transition", () =>
    expect(validateCycleTransition("COMPLETED", "DRYING")).toBe(false));
});
