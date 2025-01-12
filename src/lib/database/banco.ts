import Prisma from './prismaClient'

// const prisma = new PrismaClient();

// Função para inserir um novo banco
export const insertBanco = async (usuario_id: number, nome: string) => {
    try {
        const novoBanco = await Prisma.banco.create({
            data: {
                usuario_id,
                nome,
            },
        })
        return novoBanco
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Erro ao inserir banco: ' + error.message)
        }
        throw new Error('Erro desconhecido ao inserir banco')
    }
}

// Função para atualizar um banco existente
export const updateBanco = async (id: number, nome: string) => {
    try {
        const bancoAtualizado = await Prisma.banco.update({
            where: { id },
            data: { nome },
        })
        return bancoAtualizado
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Erro ao atualizar banco: ' + error.message)
        }
        throw new Error('Erro desconhecido ao atualizar banco')
    }
}

// Função para excluir um banco (um ou vários)
export const deleteBanco = async (ids: number | number[]) => {
    try {
        if (Array.isArray(ids)) {
            const bancosDeletados = await Prisma.banco.deleteMany({
                where: {
                    id: { in: ids },
                },
            })
            return bancosDeletados
        } else {
            const bancoDeletado = await Prisma.banco.delete({
                where: { id: ids },
            })
            return bancoDeletado
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Erro ao excluir banco: ' + error.message)
        }
        throw new Error('Erro desconhecido ao excluir banco')
    }
}

// Função para buscar todos os bancos ou um banco específico
export const selectBanco = async (id?: number) => {
    try {
        if (id) {
            const banco = await Prisma.banco.findUnique({
                where: { id },
                include: { usuario: true },
            })
            return banco
        } else {
            console.log('CHEGOUEI AQUI')
            const bancos = await Prisma.banco.findMany({
                // include: { usuario: true, contas_financeiras: true },
            })
            console.log('Bancos:', bancos)
            return bancos
        }
    } catch (error) {
        console.log('ERRO: ', error)
        // if (error instanceof Error) {
        //   throw new Error('Erro ao buscar banco: ' + error.message);
        // }
        //throw new Error('Erro desconhecido ao buscar banco');
    }
}

// // Exemplo de como usar as funções acima
const main = async () => {
    try {
        //     // Inserir um banco
        //     // const novoBanco = await insertBanco(1, 'Banco do Brasil');
        //     // console.log('Banco inserido:', novoBanco);

        //     // // Atualizar um banco
        //     // const bancoAtualizado = await updateBanco(novoBanco.id, 'Banco Santander');
        //     // console.log('Banco atualizado:', bancoAtualizado);

        //     // Selecionar todos os bancos
        const todosBancos = await selectBanco()
        console.log('Todos os Bancos:', todosBancos)

        //     // Excluir um banco específico
        // //     const bancoDeletado = await deleteBanco(novoBanco.id);
        // //     console.log('Banco excluído:', bancoDeletado);

        // //     // Excluir múltiplos bancos
        // //     const bancosDeletados = await deleteBanco([1, 2]);
        // //     console.log('Bancos excluídos:', bancosDeletados);
    } catch (error) {
        console.error(error)
    } finally {
        await Prisma.$disconnect()
    }
}

//main();
