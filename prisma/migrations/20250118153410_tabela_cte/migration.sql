-- CreateTable
CREATE TABLE "cte" (
    "id" SERIAL NOT NULL,
    "chave" VARCHAR(44) NOT NULL,
    "data_emissao" DATE NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "municipio_inicio_id" INTEGER NOT NULL,
    "municipio_fim_id" INTEGER NOT NULL,
    "emitente_id" INTEGER NOT NULL,
    "remetente_id" INTEGER NOT NULL,
    "destinatario_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "cte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cte_chave_key" ON "cte"("chave");

-- AddForeignKey
ALTER TABLE "cte" ADD CONSTRAINT "cte_municipio_inicio_id_fkey" FOREIGN KEY ("municipio_inicio_id") REFERENCES "municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cte" ADD CONSTRAINT "cte_municipio_fim_id_fkey" FOREIGN KEY ("municipio_fim_id") REFERENCES "municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cte" ADD CONSTRAINT "cte_emitente_id_fkey" FOREIGN KEY ("emitente_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cte" ADD CONSTRAINT "cte_remetente_id_fkey" FOREIGN KEY ("remetente_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cte" ADD CONSTRAINT "cte_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cte" ADD CONSTRAINT "cte_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
