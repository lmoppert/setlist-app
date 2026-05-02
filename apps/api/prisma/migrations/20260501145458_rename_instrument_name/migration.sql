/*
  Warnings:

  - You are about to drop the column `instrument` on the `Instrument` table. All the data in the column will be lost.
  - Added the required column `name` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Instrument" DROP CONSTRAINT "Instrument_songId_fkey";

-- AlterTable
ALTER TABLE "Instrument" DROP COLUMN "instrument",
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
