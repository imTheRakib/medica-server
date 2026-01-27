/*
  Warnings:

  - You are about to drop the column `adminId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `medicines` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `medicines` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `sellerId` on the `orderItems` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `orderItems` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `customerId` on the `orders` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `customerId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `userId` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `medicines` table without a default value. This is not possible if the table is not empty.
  - Made the column `stocks` on table `medicines` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "category_adminId_idx";

-- DropIndex
DROP INDEX "medicines_sellerId_idx";

-- DropIndex
DROP INDEX "orders_customerId_idx";

-- DropIndex
DROP INDEX "reviews_customerId_idx";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "adminId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "sellerId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "stocks" SET NOT NULL,
ALTER COLUMN "stocks" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "sellerId",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
ADD COLUMN     "status" TEXT DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "category_userId_idx" ON "category"("userId");

-- CreateIndex
CREATE INDEX "medicines_userId_idx" ON "medicines"("userId");

-- CreateIndex
CREATE INDEX "medicines_categoryId_idx" ON "medicines"("categoryId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
