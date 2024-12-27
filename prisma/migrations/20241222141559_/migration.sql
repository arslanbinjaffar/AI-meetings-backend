/*
  Warnings:

  - You are about to drop the column `userId` on the `TimeSlotVote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voterId,slotId]` on the table `TimeSlotVote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voterId` to the `TimeSlotVote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimeSlotVote" DROP CONSTRAINT "TimeSlotVote_userId_fkey";

-- DropIndex
DROP INDEX "TimeSlotVote_userId_slotId_key";

-- AlterTable
ALTER TABLE "TimeSlotVote" DROP COLUMN "userId",
ADD COLUMN     "voterId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlotVote_voterId_slotId_key" ON "TimeSlotVote"("voterId", "slotId");

-- AddForeignKey
ALTER TABLE "TimeSlotVote" ADD CONSTRAINT "TimeSlotVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
