-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "artist" TEXT,
    "duration" INTEGER NOT NULL,
    "bpm" INTEGER,
    "key" TEXT
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mainInstrument" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "tuning" TEXT,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Assignment_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "durationLimit" INTEGER NOT NULL,
    "setlistId" TEXT,
    CONSTRAINT "Gig_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "SetlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "setlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isEncore" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SetlistEntry_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SetlistEntry_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Gig_setlistId_key" ON "Gig"("setlistId");
