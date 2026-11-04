import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
const prisma = new PrismaClient();
async function main() {
  const key = process.env.SEED_DEVICE_KEY ?? "replace-me-device-key";
  await prisma.device.upsert({
    where: { serialNumber: "ESP8266-001" },
    update: {},
    create: {
      name: "Secadora laboratório",
      serialNumber: "ESP8266-001",
      apiKeyHash: createHash("sha256").update(key).digest("hex"),
    },
  });
}
main().finally(() => prisma.$disconnect());
