/*
  Warnings:

  - Changed the type of `type` on the `SongResource` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `filetype` on the `SongResource` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SongResource"
  ALTER COLUMN "type"
    TYPE "Category"
    USING("type"::text::"Category");
ALTER TABLE "SongResource"
  ALTER COLUMN "filetype"
    TYPE "FileType"
    USING("filetype"::text::"FileType");