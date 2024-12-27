/*
  Warnings:

  - You are about to drop the column `tite` on the `Event` table. All the data in the column will be lost.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "tite",
ADD COLUMN     "title" TEXT NOT NULL;
