'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header, { BotoesCabecalho } from '@/components/header'

interface FormData {
    id: string
    nome: string
    tipo: string
    empresaId: number
}

const CategoriaCadastro: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        id: '',
        nome: '',
        tipo: '',
        empresaId: 1,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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
                <form className="space-y-6 max-w-4xl w-full">
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
                        <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} className="col-span-2" required />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right font-medium">
                            Tipo:
                        </Label>
                        <Input id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} className="col-span-2" required />
                    </div>
                </form>
            </main>
        </div>
    )
}

export default CategoriaCadastro
