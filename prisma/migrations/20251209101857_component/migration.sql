/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Component` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Component_importPath_key";

-- DropIndex
DROP INDEX "Component_nameComponent_key";

-- CreateIndex
CREATE UNIQUE INDEX "Component_id_key" ON "Component"("id");
