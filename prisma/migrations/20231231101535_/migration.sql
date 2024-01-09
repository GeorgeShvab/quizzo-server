/*
  Warnings:

  - You are about to drop the column `userId` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_userId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
