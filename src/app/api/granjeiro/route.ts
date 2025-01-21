import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const data = await prisma.pessoa.findMany({
            where: { empresa_id: 1, tipo_granjeiro: true },
        })
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
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
        const { nome, tipo } = body

        if (!nome || !tipo) {
            return new Response(JSON.stringify({ error: 'Campos nome e tipo são obrigatórios' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        try {
            const newPessoa = await prisma.pessoa.create({
                data: {
                    nome,
                    tipo: Number(tipo),
                    empresa_id: 1,
                },
            })

            return new Response(JSON.stringify(newPessoa), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            })
        } catch (error) {
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

        const deleted = await prisma.pessoa.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return new Response(JSON.stringify({ message: 'Granjeiros excluídas com sucesso', count: deleted.count }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao excluir granjeiros' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    } finally {
        await prisma.$disconnect()
    }
}
