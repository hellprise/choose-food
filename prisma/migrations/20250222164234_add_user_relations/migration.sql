/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Dish` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date,mealType,userId]` on the table `MealPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create default user for existing data
INSERT INTO "User" (id, email, password, "updatedAt")
VALUES ('default', 'default@example.com', 'default', CURRENT_TIMESTAMP);

-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_dishId_fkey";

-- DropIndex
DROP INDEX "Dish_name_key";

-- DropIndex
DROP INDEX "MealPlan_date_mealType_key";

-- AlterTable
ALTER TABLE "Dish" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'default';

-- Remove defaults after data migration
ALTER TABLE "Dish" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE "MealPlan" ALTER COLUMN "userId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dish_name_userId_key" ON "Dish"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_date_mealType_userId_key" ON "MealPlan"("date", "mealType", "userId");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
