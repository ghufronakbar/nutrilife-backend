/*
  Warnings:

  - You are about to drop the column `weight` on the `AppActivityLevel` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `AppPrimaryGoal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppActivityLevel" DROP COLUMN "weight",
ALTER COLUMN "factor" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AppPrimaryGoal" DROP COLUMN "weight",
ALTER COLUMN "factor" DROP DEFAULT;
