// SÓ COPIEI O EXEMPLO, NÃO DESENVOLVI NADA

import prisma from './prismaClient'

// Insert (criar um usuário)
export const createUsuario = async (data: { nome: string; email: string; senha: string }) => {
    return await prisma.usuario.create({
        data,
    })
}

// Select (buscar um usuário pelo ID)
export const getUsuarioById = async (id: number) => {
    return await prisma.usuario.findUnique({
        where: { id },
    })
}

// Update (atualizar um usuário)
export const updateUsuario = async (id: number, data: Partial<{ nome: string; email: string; senha: string }>) => {
    return await prisma.usuario.update({
        where: { id },
        data,
    })
}

// Delete (remover um usuário)
export const deleteUsuario = async (id: number) => {
    return await prisma.usuario.delete({
        where: { id },
    })
}
