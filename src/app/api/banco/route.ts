import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
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

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validação básica
        if (!body.nome) {
            return new Response(JSON.stringify({ error: 'Nome é obrigatório' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Validar ID se fornecido
        if (body.id !== undefined) {
            if (isNaN(body.id) || body.id <= 0) {
                return new Response(JSON.stringify({ error: 'Código do banco deve ser um número positivo' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                })
            }

            // Verificar se o ID já existe
            const existingBanco = await prisma.banco.findUnique({
                where: { id: body.id },
            })

            if (existingBanco) {
                return new Response(JSON.stringify({ error: 'Código já está em uso' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                })
            }
        }

        const novoBanco = await prisma.banco.create({
            data: {
                ...(body.id && { id: body.id }), // Inclui o ID apenas se fornecido
                nome: body.nome,
                empresa_id: 1, // Por enquanto fixo, depois implementar autenticação
            },
        })

        return new Response(JSON.stringify(novoBanco), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Erro ao cadastrar banco' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()

        if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
            return new Response(JSON.stringify({ error: 'IDs inválidos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        // Deletar os bancos
        await prisma.banco.deleteMany({
            where: {
                id: {
                    in: body.ids,
                },
            },
        })

        return new Response(JSON.stringify({ message: 'Bancos excluídos com sucesso' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Erro ao excluir bancos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    } finally {
        await prisma.$disconnect()
    }
}
