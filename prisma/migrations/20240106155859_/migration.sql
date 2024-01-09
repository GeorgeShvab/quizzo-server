/*
  Warnings:

  - You are about to drop the column `participantId` on the `SessionQuestion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionQuestion" DROP CONSTRAINT "SessionQuestion_participantId_fkey";

-- AlterTable
ALTER TABLE "SessionQuestion" DROP COLUMN "participantId";
