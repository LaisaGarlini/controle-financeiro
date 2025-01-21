/*
  Warnings:

  - A unique constraint covering the columns `[nome,estadoId]` on the table `municipio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "municipio_nome_estadoId_key" ON "municipio"("nome", "estadoId");
