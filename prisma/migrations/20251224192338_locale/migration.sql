-- CreateTable
CREATE TABLE "LocaleText" (
    "key" TEXT NOT NULL,
    "contentNL" TEXT NOT NULL,
    "contentEN" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LocaleText_key_key" ON "LocaleText"("key");
