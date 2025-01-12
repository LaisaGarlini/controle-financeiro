import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const data = await prisma.banco.findMany()
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
