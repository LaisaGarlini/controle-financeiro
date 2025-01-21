'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header, { BotoesCabecalho } from '@/components/header'

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

    return (
        <div className="h-screen w-full">
            <Header
                TelaConsulta={true}
                titulo="Cadastro de Contas a Pagar"
                configuracoesRota={{
                    caminho: 'contas_pagar',
                    botoes: [BotoesCabecalho.VOLTAR, BotoesCabecalho.SALVAR],
                    configuracoesSalvar: {
                        dados: {
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
                        redirecionarPara: '/contas_pagar_consulta',
                    },
                }}
            />
            <main className="w-full h-[91%] flex flex-col items-start gap-8 p-6 bg-gray-100 overflow-auto">
                <form className="space-y-6 max-w-4xl w-full">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="descricao" className="text-right font-medium">
                            Descrição:
                        </Label>
                        <Input id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="fornecedorId" className="text-right font-medium">
                            Fornecedor:
                        </Label>
                        <Input
                            id="fornecedorId"
                            name="fornecedorId"
                            value={formData.fornecedorId}
                            onChange={handleChange}
                            className="col-span-2"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="valorBruto" className="text-right font-medium">
                            Valor Bruto R$:
                        </Label>
                        <Input
                            id="valorBruto"
                            name="valorBruto"
                            value={formData.valorBruto}
                            onChange={handleChange}
                            className="col-span-2"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="valorPago" className="text-right font-medium">
                            Valor Pago R$:
                        </Label>
                        <Input id="valorPago" name="valorPago" value={formData.valorPago} onChange={handleChange} className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="dataVencimento" className="text-right font-medium">
                            Data de Vencimento:
                        </Label>
                        <Input
                            id="dataVencimento"
                            name="dataVencimento"
                            type="date"
                            value={formData.dataVencimento}
                            onChange={handleChange}
                            className="col-span-2"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="dataPagamento" className="text-right font-medium">
                            Data de Pagamento:
                        </Label>
                        <Input
                            id="dataPagamento"
                            name="dataPagamento"
                            type="date"
                            value={formData.dataPagamento}
                            onChange={handleChange}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="categoriaId" className="text-right font-medium">
                            Categoria:
                        </Label>
                        <Input
                            id="categoriaId"
                            name="categoriaId"
                            value={formData.categoriaId}
                            onChange={handleChange}
                            className="col-span-2"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="observacao" className="text-right font-medium">
                            Observação:
                        </Label>
                        <Input
                            id="observacao"
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="formaPagamentoId" className="text-right font-medium">
                            Forma de Pagamento:
                        </Label>
                        <Input
                            id="formaPagamentoId"
                            name="formaPagamentoId"
                            value={formData.formaPagamentoId}
                            onChange={handleChange}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="condicaoPagamentoId" className="text-right font-medium">
                            Condição de Pagamento:
                        </Label>
                        <Input
                            id="condicaoPagamentoId"
                            name="condicaoPagamentoId"
                            value={formData.condicaoPagamentoId}
                            onChange={handleChange}
                            className="col-span-2"
                        />
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ContasPagarCadastro
