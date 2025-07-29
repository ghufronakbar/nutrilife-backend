/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodLog" DROP CONSTRAINT "FoodLog_userPreferencesId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_appActivityLevelId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_appPrimaryGoalId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_appPrimaryGoalId_fkey" FOREIGN KEY ("appPrimaryGoalId") REFERENCES "AppPrimaryGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_appActivityLevelId_fkey" FOREIGN KEY ("appActivityLevelId") REFERENCES "AppActivityLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodLog" ADD CONSTRAINT "FoodLog_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
