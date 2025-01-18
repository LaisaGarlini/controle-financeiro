'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header, { BotoesCabecalho } from '@/components/header'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FormData {
    id: string
    nome: string
    tipo: string
    empresaId: number
}

const CategoriaCadastro: React.FC = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        id: '',
        nome: '',
        tipo: '',
        empresaId: 1,
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/categoria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome,
                    tipo: formData.tipo,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao salvar categoria')
            }

            const data = await response.json()
            toast.success(`Categoria "${data.nome}" criada com sucesso!`)
            router.push('/categoria_consulta')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro inesperado. Tente novamente mais tarde.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen w-full">
            <Header
                TelaConsulta={true}
                titulo="Cadastro de Categorias"
                configuracoesRota={{
                    caminho: 'categoria',
                    botoes: [BotoesCabecalho.VOLTAR, BotoesCabecalho.SALVAR],
                    configuracoesSalvar: {
                        dados: formData,
                        redirecionarPara: '/categoria_consulta',
                        successCallback: () => {
                            setFormData({ id: '', nome: '', tipo: '', empresaId: 1 })
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
                        <Input id="id" name="id" value={formData.id} onChange={handleChange} className="col-span-2" disabled={true} />
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
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right font-medium">
                            Tipo:
                        </Label>
                        <Input
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
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

export default CategoriaCadastro
