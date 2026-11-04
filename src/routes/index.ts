import { Router } from "express";
import * as c from "../controllers/controllers";
import { authenticateAdmin, authenticateDevice } from "../middlewares/auth";
export const router = Router();
router.post(
  "/iot/devices/:deviceId/telemetry",
  authenticateDevice,
  c.telemetry,
);
router.post(
  "/iot/devices/:deviceId/heartbeat",
  authenticateDevice,
  c.heartbeat,
);
router.get("/iot/devices/:deviceId/status", authenticateDevice, c.iotStatus);
router.use(authenticateAdmin);
router.route("/devices").get(c.listDevices).post(c.createDevice);
router.route("/devices/:id").get(c.getDevice).patch(c.patchDevice);
router.get("/devices/:deviceId/telemetry", c.telemetryHistory);
router.get("/devices/:deviceId/telemetry/latest", c.latestTelemetry);
router.get("/devices/:deviceId/alerts", c.alerts);
router.get("/devices/:deviceId/dashboard", c.dashboard);
router.patch("/alerts/:id/acknowledge", c.acknowledge);
router.route("/cycles").get(c.listCycles).post(c.createCycle);
router.get("/cycles/:id", c.getCycle);
router.patch("/cycles/:id/status", c.setCycleStatus);
router.post("/cycles/:id/cancel", c.cancelCycle);
