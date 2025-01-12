import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const data = await prisma.financeiro.findMany(
        { 
            where: { empresa_id: 1 },
            select: {
                id: true,
                descricao: true,
                valor_bruto: true,
                valor_pago: true,
                data_vencimento: true,
                data_pagamento: true,
                categoria: {
                    select: {
                        nome: true,
                        tipo: true
                    }
                }
            }
        }
    );
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar dados' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}