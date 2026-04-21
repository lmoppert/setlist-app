/*
  Warnings:

  - You are about to drop the `Gig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `order` on the `SetlistEntry` table. All the data in the column will be lost.
  - Added the required column `date` to the `Setlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Setlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Setlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `SetlistEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Gig_setlistId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Gig";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "name" TEXT,
    "duration" INTEGER
);
INSERT INTO "new_Setlist" ("id", "name") SELECT "id", "name" FROM "Setlist";
DROP TABLE "Setlist";
ALTER TABLE "new_Setlist" RENAME TO "Setlist";
CREATE UNIQUE INDEX "Setlist_slug_key" ON "Setlist"("slug");
CREATE TABLE "new_SetlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isEncore" BOOLEAN NOT NULL DEFAULT false,
    "setlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    CONSTRAINT "SetlistEntry_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SetlistEntry_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SetlistEntry" ("id", "isEncore", "isOptional", "setlistId", "songId") SELECT "id", "isEncore", "isOptional", "setlistId", "songId" FROM "SetlistEntry";
DROP TABLE "SetlistEntry";
ALTER TABLE "new_SetlistEntry" RENAME TO "SetlistEntry";
CREATE INDEX "SetlistEntry_setlistId_position_idx" ON "SetlistEntry"("setlistId", "position");
CREATE TABLE "new_Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT,
    "duration" INTEGER NOT NULL,
    "tempo" INTEGER,
    "key" TEXT
);
INSERT INTO "new_Song" ("artist", "duration", "id", "key", "name", "tempo") SELECT "artist", "duration", "id", "key", "name", "tempo" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE UNIQUE INDEX "Song_slug_key" ON "Song"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
