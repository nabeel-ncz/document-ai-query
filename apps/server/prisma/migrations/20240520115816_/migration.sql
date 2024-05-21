/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Project";

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "file" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embeddings" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "vector" VARCHAR(255) NOT NULL,

    CONSTRAINT "Embeddings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Embeddings" ADD CONSTRAINT "Embeddings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
