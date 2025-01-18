'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header, { HeaderButton } from '@/components/header'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface FormData {
    descricao: string
    fornecedorId: string
    valorBruto: string
    valorPago: string
    dataVencimento: string
    dataPagamento: string
    categoriaId: string
    observacao: string
    formaPagamentoId: string
    condicaoPagamentoId: string
}

const ContasPagarCadastro: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        descricao: '',
        fornecedorId: '',
        valorBruto: '',
        valorPago: '',
        dataVencimento: '',
        dataPagamento: '',
        categoriaId: '',
        observacao: '',
        formaPagamentoId: '',
        condicaoPagamentoId: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/contas_pagar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    fornecedorId: Number(formData.fornecedorId),
                    valorBruto: Number(formData.valorBruto),
                    valorPago: formData.valorPago ? Number(formData.valorPago) : 0,
                    categoriaId: Number(formData.categoriaId),
                    datevencimento: formData.dataVencimento,
                    observacao: formData.observacao || null,
                    formapagamentoId: formData.formaPagamentoId ? Number(formData.formaPagamentoId) : null,
                    condicaopagamentoId: formData.condicaoPagamentoId ? Number(formData.condicaoPagamentoId) : null,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao salvar a conta a pagar.')
            }

            toast.success('Conta a pagar criada com sucesso!')
            router.push('/contas_pagar_consulta')

            // Resetando o formulário
            setFormData({
                descricao: '',
                fornecedorId: '',
                valorBruto: '',
                valorPago: '',
                dataVencimento: '',
                dataPagamento: '',
                categoriaId: '',
                observacao: '',
                formaPagamentoId: '',
                condicaoPagamentoId: '',
            })
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
                isConsultaScreen={true}
                title="Cadastro de Contas a Pagar"
                userName="Usuário"
                companyName="Empresa"
                routeConfig={{
                    path: 'contas_pagar',
                    buttons: [HeaderButton.BACK, HeaderButton.HOME, HeaderButton.SAVE],
                    saveConfig: {
                        data: {
                            ...formData,
                            fornecedorId: Number(formData.fornecedorId),
                            valorBruto: Number(formData.valorBruto),
                            valorPago: formData.valorPago ? Number(formData.valorPago) : 0,
                            categoriaId: Number(formData.categoriaId),
                            datevencimento: formData.dataVencimento,
                            observacao: formData.observacao || null,
                            formapagamentoId: formData.formaPagamentoId ? Number(formData.formaPagamentoId) : null,
                            condicaopagamentoId: formData.condicaoPagamentoId ? Number(formData.condicaoPagamentoId) : null,
                        },
                        successMessage: 'Conta a pagar salva com sucesso!',
                        redirectTo: '/contas_pagar_consulta',
                    },
                }}
            />
            <main className="w-full h-[91%] flex flex-col items-start gap-8 p-6 bg-gray-100 overflow-auto">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor={key} className="text-right font-medium">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                            </Label>
                            <Input id={key} name={key} value={value} onChange={handleChange} className="col-span-2" />
                        </div>
                    ))}
                </form>
            </main>
        </div>
    )
}

export default ContasPagarCadastro
