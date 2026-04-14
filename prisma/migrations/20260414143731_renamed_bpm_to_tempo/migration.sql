/*
  Warnings:

  - You are about to drop the column `bpm` on the `Song` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "artist" TEXT,
    "duration" INTEGER NOT NULL,
    "tempo" INTEGER,
    "key" TEXT
);
INSERT INTO "new_Song" ("artist", "duration", "id", "key", "name") SELECT "artist", "duration", "id", "key", "name" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
