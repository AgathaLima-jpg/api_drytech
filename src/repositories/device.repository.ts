import { prisma } from "../config/prisma";
export const deviceRepository = {
  findById: (id: string) => prisma.device.findUnique({ where: { id } }),
  findBySerial: (serialNumber: string) =>
    prisma.device.findUnique({ where: { serialNumber } }),
};
