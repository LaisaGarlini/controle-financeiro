import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const data = await prisma.financeiro.findMany({
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
                        tipo: true,
                    },
                },
            },
        })
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Erro ao buscar dados' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    } finally {
        await prisma.$disconnect()
    }
}

function formatDateToDateObject(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            descricao,
            fornecedorId,
            dataVencimento,
            dataPagamento,
            valorBruto,
            valorPago,
            categoriaId,
            observacao,
            formaPagamentoId,
            condicaoPagamentoId,
        } = body

        console.log('Dados recebidos:', body)

        // Validação de campos obrigatórios
        if (!descricao || !fornecedorId || !dataVencimento || !valorBruto || !categoriaId) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios não preenchidos.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Criar registro na tabela `financeiro`
        try {
            const novoFinanceiro = await prisma.financeiro.create({
                data: {
                    descricao,
                    fornecedor_id: Number(fornecedorId),
                    data_vencimento: formatDateToDateObject(dataVencimento),
                    data_pagamento: dataPagamento ? formatDateToDateObject(dataPagamento) : null,
                    valor_bruto: Number(valorBruto),
                    valor_pago: valorPago ? Number(valorPago) : 0,
                    categoria_id: Number(categoriaId),
                    observacao: observacao || null,
                    forma_pagamento_id: formaPagamentoId ? Number(formaPagamentoId) : null,
                    condicao_pagamento_id: condicaoPagamentoId ? Number(condicaoPagamentoId) : null,
                    // empresa_id: Number(empresaId),
                    empresa_id: 1,
                },
            })

            return new Response(JSON.stringify(novoFinanceiro), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (error) {
            console.error('Erro no backend:', (error as Error).message)
            return new Response(JSON.stringify({ error: 'Erro ao inserir dados no banco.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const { ids } = body

        if (!Array.isArray(ids) || ids.length === 0) {
            return new Response(JSON.stringify({ error: 'IDs inválidos ou ausentes' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const deleted = await prisma.financeiro.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        console.log('Contas a pagar excluídas:', deleted)

        return new Response(JSON.stringify({ message: 'Contas a pagar excluídas com sucesso', count: deleted.count }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Erro ao excluir contas a pagar:', (error as Error).message)
        return new Response(JSON.stringify({ error: 'Erro ao excluir contas a pagar' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    } finally {
        await prisma.$disconnect()
    }
}
