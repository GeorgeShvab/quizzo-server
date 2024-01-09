/*
  Warnings:

  - You are about to drop the column `isEnded` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "isEnded",
DROP COLUMN "isOpen",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'closed';
