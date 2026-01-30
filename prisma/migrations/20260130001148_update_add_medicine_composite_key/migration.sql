/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,manufacturer]` on the table `medicines` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicines_name_userId_manufacturer_key" ON "medicines"("name", "userId", "manufacturer");
