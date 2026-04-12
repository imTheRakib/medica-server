-- CreateEnum
CREATE TYPE "MedicineVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('OPEN', 'ANSWERED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReplyStatus" AS ENUM ('ACTIVE', 'HIDDEN');

-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "verificationNote" TEXT,
ADD COLUMN     "verificationStatus" "MedicineVerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" TEXT;

-- CreateTable
CREATE TABLE "categoryRecommendation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "pharmacistId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoryRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicineQuestion" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicineQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicineQuestionReply" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "pharmacistId" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "status" "ReplyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicineQuestionReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categoryRecommendation_categoryId_idx" ON "categoryRecommendation"("categoryId");

-- CreateIndex
CREATE INDEX "categoryRecommendation_pharmacistId_idx" ON "categoryRecommendation"("pharmacistId");

-- CreateIndex
CREATE INDEX "medicineQuestion_customerId_idx" ON "medicineQuestion"("customerId");

-- CreateIndex
CREATE INDEX "medicineQuestion_medicineId_idx" ON "medicineQuestion"("medicineId");

-- CreateIndex
CREATE INDEX "medicineQuestion_status_idx" ON "medicineQuestion"("status");

-- CreateIndex
CREATE INDEX "medicineQuestionReply_questionId_idx" ON "medicineQuestionReply"("questionId");

-- CreateIndex
CREATE INDEX "medicineQuestionReply_pharmacistId_idx" ON "medicineQuestionReply"("pharmacistId");

-- CreateIndex
CREATE INDEX "medicineQuestionReply_status_idx" ON "medicineQuestionReply"("status");

-- CreateIndex
CREATE INDEX "medicines_verificationStatus_idx" ON "medicines"("verificationStatus");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoryRecommendation" ADD CONSTRAINT "categoryRecommendation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoryRecommendation" ADD CONSTRAINT "categoryRecommendation_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineQuestion" ADD CONSTRAINT "medicineQuestion_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineQuestion" ADD CONSTRAINT "medicineQuestion_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineQuestionReply" ADD CONSTRAINT "medicineQuestionReply_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "medicineQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicineQuestionReply" ADD CONSTRAINT "medicineQuestionReply_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
