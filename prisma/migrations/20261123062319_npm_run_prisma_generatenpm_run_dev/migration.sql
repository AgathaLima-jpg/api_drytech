/*
  Warnings:

  - You are about to drop the column `foodName` on the `dryingcycle` table. All the data in the column will be lost.
  - You are about to drop the column `plannedDurationSeconds` on the `dryingcycle` table. All the data in the column will be lost.
  - You are about to drop the column `targetTemperature` on the `dryingcycle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dryingcycle` DROP COLUMN `foodName`,
    DROP COLUMN `plannedDurationSeconds`,
    DROP COLUMN `targetTemperature`;
