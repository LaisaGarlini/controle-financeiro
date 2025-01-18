import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const data = await prisma.cTE.findMany({
            where: { empresa_id: 1 },
            select: {
                id: true,
                data_emissao: true,
                valor: true,
                municipio_inicio: {
                    select: {
                        nome: true,
                    },
                },
                municipio_fim: {
                    select: {
                        nome: true,
                    },
                },
                destinatario: {
                    select: {
                        nome: true,
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

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { chave, data_emissao, valor, municipio_inicio_id, municipio_fim_id, emitente_id, remetente_id, destinatario_id } = body

        console.log('Dados recebidos:', body)

        if (
            !chave ||
            !data_emissao ||
            !valor ||
            !municipio_inicio_id ||
            !municipio_fim_id ||
            !emitente_id ||
            !remetente_id ||
            !destinatario_id
        ) {
            return new Response(JSON.stringify({ error: 'Campos nome e tipo são obrigatórios' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        try {
            const newCTE = await prisma.cTE.create({
                data: {
                    chave,
                    data_emissao,
                    valor: Number(valor),
                    municipio_inicio_id: Number(municipio_inicio_id),
                    municipio_fim_id: Number(municipio_fim_id),
                    emitente_id: Number(emitente_id),
                    remetente_id: Number(remetente_id),
                    destinatario_id: Number(destinatario_id),
                    empresa_id: 1,
                },
            })

            console.log('CTe inserida:', newCTE)
            return new Response(JSON.stringify(newCTE), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (error) {
            console.error('Erro no backend:', (error as Error).message)
            return new Response(JSON.stringify({ error: 'Erro ao inserir dados' }), {
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

        const deleted = await prisma.cTE.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        console.log('CTE excluídas:', deleted)

        return new Response(JSON.stringify({ message: 'CTE excluídas com sucesso', count: deleted.count }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Erro ao excluir ctes:', (error as Error).message)
        return new Response(JSON.stringify({ error: 'Erro ao excluir ctes' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    } finally {
        await prisma.$disconnect()
    }
}
