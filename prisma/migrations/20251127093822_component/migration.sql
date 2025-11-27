/*
  Warnings:

  - You are about to drop the column `components` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "components";

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "importPath" TEXT NOT NULL,
    "nameComponent" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PageComponents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PageComponents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_importPath_key" ON "Component"("importPath");

-- CreateIndex
CREATE UNIQUE INDEX "Component_nameComponent_key" ON "Component"("nameComponent");

-- CreateIndex
CREATE INDEX "_PageComponents_B_index" ON "_PageComponents"("B");

-- AddForeignKey
ALTER TABLE "_PageComponents" ADD CONSTRAINT "_PageComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PageComponents" ADD CONSTRAINT "_PageComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
