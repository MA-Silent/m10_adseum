/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_componentID_fkey";

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "imageSrc" TEXT;

-- DropTable
DROP TABLE "Image";
