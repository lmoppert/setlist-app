-- CreateTable
CREATE TABLE "SongResource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "SongResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SongResource" ADD CONSTRAINT "SongResource_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
