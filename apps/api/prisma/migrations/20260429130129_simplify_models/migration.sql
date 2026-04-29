/*
  Warnings:

  - You are about to drop the column `mainInstrument` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_songId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "mainInstrument",
ADD COLUMN     "isLeadVocalist" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "leadVocals" TEXT[];

-- DropTable
DROP TABLE "Assignment";

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "tuning" TEXT,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
