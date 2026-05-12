/*
  Warnings:

  - Added the required column `categoryPref` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User"
  ALTER COLUMN "categoryPref"
    TYPE "Category"
    USING("categoryPref"::text::"Category");
