'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Header from '@/components/header'
import { BotoesCabecalho } from '@/components/header'

interface FormData {
    id?: number
    nome: string
}

const BancoCadastro: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        id: undefined,
        nome: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'id' ? (value ? parseInt(value) : undefined) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nome.trim()) {
            toast.error('Nome do banco é obrigatório')
            return
        }

        if (formData.id !== undefined && (isNaN(formData.id) || formData.id <= 0)) {
            toast.error('Código do banco deve ser um número positivo')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/banco', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Erro ao cadastrar banco')
            }

            toast.success('Banco cadastrado com sucesso!')
            router.push('/banco_consulta')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar banco'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-full">
            <Header
                TelaConsulta={true}
                titulo="Cadastro de Banco"
                configuracoesRota={{
                    caminho: 'banco',
                    botoes: [BotoesCabecalho.VOLTAR, BotoesCabecalho.SALVAR],
                    configuracoesSalvar: {
                        dados: formData,
                        redirecionarPara: '/banco_consulta',
                        successCallback: () => {
                            setFormData({ id: undefined, nome: '' })
                        },
                    },
                }}
            />
            <main className="w-full h-[91%] flex flex-col items-start gap-8 p-6 bg-gray-100 overflow-auto">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl w-full">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="id" className="text-right font-medium">
                            Código:
                        </Label>
                        <Input
                            id="id"
                            name="id"
                            type="number"
                            value={formData.id || ''}
                            onChange={handleChange}
                            className="col-span-2"
                            disabled={loading}
                            min={1}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="nome" className="text-right font-medium">
                            Nome:
                        </Label>
                        <Input
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="col-span-2"
                            disabled={loading}
                            required
                        />
                    </div>
                </form>
            </main>
        </div>
    )
}

export default BancoCadastro
