/*
  Warnings:

  - You are about to drop the column `userId` on the `UserEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[participantId,eventId]` on the table `UserEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participantId` to the `UserEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_userId_fkey";

-- DropIndex
DROP INDEX "UserEvent_userId_eventId_key";

-- AlterTable
ALTER TABLE "UserEvent" DROP COLUMN "userId",
ADD COLUMN     "participantId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserEvent_participantId_eventId_key" ON "UserEvent"("participantId", "eventId");

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
