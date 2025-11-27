/*
  Warnings:

  - You are about to drop the `_PageComponents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PageComponents" DROP CONSTRAINT "_PageComponents_A_fkey";

-- DropForeignKey
ALTER TABLE "_PageComponents" DROP CONSTRAINT "_PageComponents_B_fkey";

-- DropTable
DROP TABLE "_PageComponents";

-- CreateTable
CREATE TABLE "_ComponentToPage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ComponentToPage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ComponentToPage_B_index" ON "_ComponentToPage"("B");

-- AddForeignKey
ALTER TABLE "_ComponentToPage" ADD CONSTRAINT "_ComponentToPage_A_fkey" FOREIGN KEY ("A") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentToPage" ADD CONSTRAINT "_ComponentToPage_B_fkey" FOREIGN KEY ("B") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
