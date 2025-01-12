-- CreateTable
CREATE TABLE "empresa" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "deve_filtrar_por_id" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conta_financeira" (
    "id" SERIAL NOT NULL,
    "titular_id" INTEGER NOT NULL,
    "banco_id" INTEGER NOT NULL,
    "agencia" VARCHAR(20) NOT NULL,
    "numero_conta" VARCHAR(20) NOT NULL,
    "tipo_conta" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "conta_financeira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condicao_pagamento" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "dias_intervalo" INTEGER NOT NULL,
    "quantidade_parcela" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "condicao_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forma_pagamento" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "forma_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "tipo" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financeiro" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "fornecedor_id" INTEGER NOT NULL,
    "valor_bruto" DECIMAL(10,2) NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL,
    "data_vencimento" DATE NOT NULL,
    "data_pagamento" DATE,
    "categoria_id" INTEGER NOT NULL,
    "observacao" TEXT,
    "forma_pagamento_id" INTEGER,
    "condicao_pagamento_id" INTEGER,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banco" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "banco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "fantasia" VARCHAR(100),
    "tipo" CHAR(1) NOT NULL,
    "cpf_cnpj" VARCHAR(18),
    "rg_ie" VARCHAR(20),
    "celular" VARCHAR(20),
    "email" VARCHAR(255),
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tipo_granjeiro" BOOLEAN NOT NULL DEFAULT false,
    "tipo_motorista" BOOLEAN NOT NULL DEFAULT false,
    "tipo_fornecedor" BOOLEAN NOT NULL DEFAULT false,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pais" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" VARCHAR(2) NOT NULL,
    "paisId" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bairro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "municipioId" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "bairro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logradouro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "bairroId" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "logradouro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "logradouroId" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "cep" VARCHAR(10),
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco_pessoa" (
    "pessoaId" INTEGER NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "endereco_pessoa_pkey" PRIMARY KEY ("pessoaId","enderecoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "forma_pagamento_descricao_key" ON "forma_pagamento"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_cpf_cnpj_key" ON "pessoa"("cpf_cnpj");

-- AddForeignKey
ALTER TABLE "conta_financeira" ADD CONSTRAINT "conta_financeira_titular_id_fkey" FOREIGN KEY ("titular_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conta_financeira" ADD CONSTRAINT "conta_financeira_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "banco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conta_financeira" ADD CONSTRAINT "conta_financeira_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condicao_pagamento" ADD CONSTRAINT "condicao_pagamento_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forma_pagamento" ADD CONSTRAINT "forma_pagamento_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_forma_pagamento_id_fkey" FOREIGN KEY ("forma_pagamento_id") REFERENCES "forma_pagamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_condicao_pagamento_id_fkey" FOREIGN KEY ("condicao_pagamento_id") REFERENCES "condicao_pagamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banco" ADD CONSTRAINT "banco_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa" ADD CONSTRAINT "pessoa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pais" ADD CONSTRAINT "pais_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estado" ADD CONSTRAINT "estado_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estado" ADD CONSTRAINT "estado_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipio" ADD CONSTRAINT "municipio_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipio" ADD CONSTRAINT "municipio_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bairro" ADD CONSTRAINT "bairro_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bairro" ADD CONSTRAINT "bairro_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logradouro" ADD CONSTRAINT "logradouro_bairroId_fkey" FOREIGN KEY ("bairroId") REFERENCES "bairro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logradouro" ADD CONSTRAINT "logradouro_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_logradouroId_fkey" FOREIGN KEY ("logradouroId") REFERENCES "logradouro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_pessoa" ADD CONSTRAINT "endereco_pessoa_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_pessoa" ADD CONSTRAINT "endereco_pessoa_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_pessoa" ADD CONSTRAINT "endereco_pessoa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
