import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const data = await prisma.categoria.findMany();
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

export async function POST(request: Request) {
  try {
    const body = await request.json(); 
    const { nome, tipo } = body;

    console.log('Dados recebidos:', body);

    if (!nome || !tipo) {
        return new Response(JSON.stringify({ error: 'Campos nome e tipo são obrigatórios' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });          
    }

    try {
        const newCategoria = await prisma.categoria.create({
          data: {
            nome,
            tipo: Number(tipo),
            empresa_id: 1,
          },
        });
      
        console.log('Categoria inserida:', newCategoria);
        return new Response(JSON.stringify(newCategoria), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
        } catch (error) {
            console.error('Erro no backend:', (error as Error).message);
            return new Response(JSON.stringify({ error: 'Erro ao inserir dados' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            });
        }      
      } finally {
        await prisma.$disconnect();
      }      
}

export async function DELETE(request: Request) {
    try {
      const body = await request.json();
      const { ids } = body; 
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return new Response(JSON.stringify({ error: 'IDs inválidos ou ausentes' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const deleted = await prisma.categoria.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
  
      console.log('Categorias excluídas:', deleted);
  
      return new Response(JSON.stringify({ message: 'Categorias excluídas com sucesso', count: deleted.count }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Erro ao excluir categorias:', (error as Error).message);
      return new Response(JSON.stringify({ error: 'Erro ao excluir categorias' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      await prisma.$disconnect();
    }
  }  