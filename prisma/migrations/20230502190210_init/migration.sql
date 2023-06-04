-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "conditions" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
