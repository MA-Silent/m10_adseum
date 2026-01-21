-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_componentID_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "componentID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_componentID_fkey" FOREIGN KEY ("componentID") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;
