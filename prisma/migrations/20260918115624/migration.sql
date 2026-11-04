-- CreateTable
CREATE TABLE `Device` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `apiKeyHash` VARCHAR(191) NOT NULL,
    `status` ENUM('ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR') NOT NULL DEFAULT 'OFFLINE',
    `lastSeen` DATETIME(3) NULL,
    `maxLoadKg` DOUBLE NULL,
    `maxCurrent` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Device_serialNumber_key`(`serialNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Telemetry` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `cycleId` VARCHAR(191) NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `doorOpen` BOOLEAN NOT NULL,
    `motorOn` BOOLEAN NOT NULL,
    `heaterOn` BOOLEAN NOT NULL,
    `fanOn` BOOLEAN NOT NULL,
    `current` DOUBLE NOT NULL,
    `voltage` DOUBLE NOT NULL,
    `energyConsumption` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Telemetry_deviceId_timestamp_idx`(`deviceId`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DryingCycle` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `status` ENUM('IDLE', 'PREPARING', 'DRYING', 'PAUSED', 'COMPLETED', 'CANCELLED', 'ERROR') NOT NULL DEFAULT 'PREPARING',
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endTime` DATETIME(3) NULL,
    `initialWeight` DOUBLE NOT NULL,
    `finalWeight` DOUBLE NULL,
    `targetHumidity` DOUBLE NOT NULL,
    `maximumTemperature` DOUBLE NOT NULL DEFAULT 0,
    `energyConsumed` DOUBLE NOT NULL DEFAULT 0,
    `lowHumidityReadings` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alert` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `cycleId` VARCHAR(191) NULL,
    `type` ENUM('HIGH_TEMPERATURE', 'LOW_TEMPERATURE', 'HIGH_HUMIDITY', 'DOOR_OPEN', 'OVERCURRENT', 'OVERWEIGHT', 'SENSOR_FAILURE', 'COMMUNICATION_FAILURE', 'ABNORMAL_ENERGY', 'DRYING_COMPLETE') NOT NULL,
    `severity` ENUM('INFO', 'WARNING', 'CRITICAL') NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `value` DOUBLE NULL,
    `acknowledged` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Alert_deviceId_acknowledged_idx`(`deviceId`, `acknowledged`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceCommand` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `cycleId` VARCHAR(191) NULL,
    `heater` VARCHAR(191) NOT NULL,
    `motor` VARCHAR(191) NOT NULL,
    `fan` VARCHAR(191) NOT NULL,
    `safe` BOOLEAN NOT NULL,
    `emergencyStop` BOOLEAN NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Telemetry` ADD CONSTRAINT `Telemetry_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Telemetry` ADD CONSTRAINT `Telemetry_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `DryingCycle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DryingCycle` ADD CONSTRAINT `DryingCycle_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `DryingCycle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeviceCommand` ADD CONSTRAINT `DeviceCommand_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
