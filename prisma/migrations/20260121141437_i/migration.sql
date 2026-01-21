/*
  Warnings:

  - Made the column `src` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "src" SET NOT NULL;
