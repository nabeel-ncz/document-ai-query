/*
  Warnings:

  - The `vector` column on the `Embeddings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Embeddings" DROP COLUMN "vector",
ADD COLUMN     "vector" TEXT[];
