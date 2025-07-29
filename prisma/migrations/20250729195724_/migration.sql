-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "AppFood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AppFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AppMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppPlanningMenu" (
    "id" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "AppPlanningMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppActivityLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AppActivityLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppPrimaryGoal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AppPrimaryGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bmr" DOUBLE PRECISION NOT NULL,
    "tdee" DOUBLE PRECISION NOT NULL,
    "dailyCalories" DOUBLE PRECISION NOT NULL,
    "proteinGoal" DOUBLE PRECISION NOT NULL,
    "carbsGoal" DOUBLE PRECISION NOT NULL,
    "fatGoal" DOUBLE PRECISION NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "appPrimaryGoalId" TEXT NOT NULL,
    "appActivityLevelId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodLog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "portions" DOUBLE PRECISION NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppFoodToAppMenu" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AppMenuToAppPlanningMenu" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AppPlanningMenuToAppPrimaryGoal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_AppFoodToAppMenu_AB_unique" ON "_AppFoodToAppMenu"("A", "B");

-- CreateIndex
CREATE INDEX "_AppFoodToAppMenu_B_index" ON "_AppFoodToAppMenu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AppMenuToAppPlanningMenu_AB_unique" ON "_AppMenuToAppPlanningMenu"("A", "B");

-- CreateIndex
CREATE INDEX "_AppMenuToAppPlanningMenu_B_index" ON "_AppMenuToAppPlanningMenu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AppPlanningMenuToAppPrimaryGoal_AB_unique" ON "_AppPlanningMenuToAppPrimaryGoal"("A", "B");

-- CreateIndex
CREATE INDEX "_AppPlanningMenuToAppPrimaryGoal_B_index" ON "_AppPlanningMenuToAppPrimaryGoal"("B");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_appPrimaryGoalId_fkey" FOREIGN KEY ("appPrimaryGoalId") REFERENCES "AppPrimaryGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_appActivityLevelId_fkey" FOREIGN KEY ("appActivityLevelId") REFERENCES "AppActivityLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodLog" ADD CONSTRAINT "FoodLog_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppFoodToAppMenu" ADD CONSTRAINT "_AppFoodToAppMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "AppFood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppFoodToAppMenu" ADD CONSTRAINT "_AppFoodToAppMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "AppMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppMenuToAppPlanningMenu" ADD CONSTRAINT "_AppMenuToAppPlanningMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "AppMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppMenuToAppPlanningMenu" ADD CONSTRAINT "_AppMenuToAppPlanningMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "AppPlanningMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppPlanningMenuToAppPrimaryGoal" ADD CONSTRAINT "_AppPlanningMenuToAppPrimaryGoal_A_fkey" FOREIGN KEY ("A") REFERENCES "AppPlanningMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppPlanningMenuToAppPrimaryGoal" ADD CONSTRAINT "_AppPlanningMenuToAppPrimaryGoal_B_fkey" FOREIGN KEY ("B") REFERENCES "AppPrimaryGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
