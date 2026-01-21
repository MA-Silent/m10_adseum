-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "componentID" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_componentID_key" ON "Image"("componentID");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_componentID_fkey" FOREIGN KEY ("componentID") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
