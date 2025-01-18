'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface DataRow {
    id: number
    descricao: string
    fornecedor_id: number
    valor_bruto: number
    valor_pago: number
    data_vencimento: string
    data_pagamento: string | null
    categoria_id: number
    categoria: {
        nome: string
        tipo: number
    }
}

interface DateRange {
    from: Date
    to: Date
}

const DashboardReceitaDespesa: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState<DateRange>(() => {
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return { from: firstDay, to: lastDay }
    })

    // Quando o dateRange mudar, faz a requisição
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/contas_pagar?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`)
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da API')
                }
                const result = await response.json()
                setData(result)
            } catch (err: any) {
                setError(err.message || 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [dateRange]) // Dependendo do range de datas, a requisição é chamada novamente

    const totalReceita = data.filter((item) => item.categoria.tipo === 1).reduce((sum, item) => sum + item.valor_pago, 0)
    const totalDespesa = data.filter((item) => item.categoria.tipo === 2).reduce((sum, item) => sum + item.valor_pago, 0)
    const saldo = totalReceita - totalDespesa

    const categoriaDespesas = data
        .filter((item) => item.categoria.tipo === 2)
        .reduce((acc, item) => {
            const categoria = item.categoria.nome
            acc[categoria] = (acc[categoria] || 0) + item.valor_pago
            return acc
        }, {} as Record<string, number>)

    const pieChartData = Object.entries(categoriaDespesas).map(([name, value]) => ({ name, value }))

    const barChartData = [
        { name: 'Receita', value: totalReceita },
        { name: 'Despesa', value: totalDespesa },
        { name: 'Saldo', value: saldo },
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    return (
        <div className="h-screen w-full">
            <Header TelaConsulta={false} titulo="Receitas X Despesas" />
            <main className="w-full h-[91%] flex flex-col gap-8 p-3">
                {loading ? (
                    <p>Carregando dados...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Receita</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(totalReceita)}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Despesa</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(totalDespesa)}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(saldo)}</div>
                                    </CardContent>
                                </Card>
                            </div>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} className="custom-class" />
                        </div>
                        <div className="flex gap-4">
                            <Card className="w-1/2">
                                <CardHeader>
                                    <CardTitle>Categorias de Despesas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={{}} className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {pieChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                            <Card className="w-1/2">
                                <CardHeader>
                                    <CardTitle>Receita x Despesa x Saldo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={{}} className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barChartData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

export default DashboardReceitaDespesa
