ALTER TABLE `DryingCycle`
  ADD COLUMN `foodName` VARCHAR(191) NULL,
  ADD COLUMN `targetTemperature` DOUBLE NULL,
  ADD COLUMN `plannedDurationSeconds` INTEGER NULL;
