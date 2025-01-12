'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationTriangle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/header'

interface DataRow {
    id: number
    descricao: string
    categoria: {
        nome: string
        tipo: number
    }
    data_vencimento: string
    data_pagamento: string
    valor_bruto: number
    valor_pago: number
    situacao: string
}

const ContasPagarConsulta: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [sortColumn, setSortColumn] = useState<keyof DataRow>('data_vencimento')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/contas_pagar')
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da API')
                }
                const result = await response.json()
                setData(result)
                console.log(result)
            } catch (err: any) {
                setError(err.message || 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
        return date.toLocaleDateString('pt-BR', options)
    }

    const sortedData = [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
            return sortDirection === 'asc' ? -1 : 1
        }
        if (a[sortColumn] > b[sortColumn]) {
            return sortDirection === 'asc' ? 1 : -1
        }
        return 0
    })

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const newSelected = new Set(prev)
            if (newSelected.has(id)) {
                newSelected.delete(id)
            } else {
                newSelected.add(id)
            }
            return newSelected
        })
    }

    const toggleSort = (column: keyof DataRow) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const getStatusIcon = (situacao: string) => {
        switch (situacao) {
            case 'Pago':
                return <FontAwesomeIcon icon={faCheck} className="text-green-500" />
            case 'Parcialmente Pago':
                return <FontAwesomeIcon icon={faCheck} className="text-blue-500" />
            case 'Pendente':
                return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
            case 'Atrasado':
                return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
            default:
                return null
        }
    }

    return (
        <div className="h-screen w-full">
            <Header
                isConsultaScreen={true}
                title="Contas a Pagar"
                userName="Domingos"
                companyName="DELL Transportes"
                novo="contas_pagar_cadastro"
                selectedIds={selectedIds}
                data={data}
                setData={setData}
            />
            <main className="w-full h-[91%] flex flex-col gap-8 p-3">
                {loading ? (
                    <p>Carregando dados...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Table className="border border-gray-300">
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ width: '35px' }} className="sticky-header">
                                    <Checkbox
                                        checked={selectedIds.size === data.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedIds(new Set(data.map((row) => row.id)))
                                            } else {
                                                setSelectedIds(new Set())
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead
                                    style={{ width: '250px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-left"
                                    onClick={() => toggleSort('descricao')}
                                >
                                    Descrição
                                    {sortColumn === 'descricao' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '200px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-left"
                                    onClick={() => toggleSort('categoria')}
                                >
                                    Categoria
                                    {sortColumn === 'categoria' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '170px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-center"
                                    onClick={() => toggleSort('data_vencimento')}
                                >
                                    Data de Vencimento
                                    {sortColumn === 'data_vencimento' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '170px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-center"
                                    onClick={() => toggleSort('data_pagamento')}
                                >
                                    Data de Pagamento
                                    {sortColumn === 'data_pagamento' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '150px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-right"
                                    onClick={() => toggleSort('valor_bruto')}
                                >
                                    R$ Bruto
                                    {sortColumn === 'valor_bruto' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '150px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-right"
                                    onClick={() => toggleSort('valor_pago')}
                                >
                                    R$ Pago
                                    {sortColumn === 'valor_pago' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                                    </TableCell>
                                    <TableCell className="text-left">{row.descricao}</TableCell>
                                    <TableCell className="text-left">{row.categoria.nome}</TableCell>
                                    <TableCell className="text-center">{formatDate(row.data_vencimento)}</TableCell>
                                    <TableCell className="text-center">{formatDate(row.data_pagamento)}</TableCell>
                                    <TableCell className="text-right">{row.valor_bruto}</TableCell>
                                    <TableCell className="text-right">{row.valor_pago}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </main>
        </div>
    )
}

export default ContasPagarConsulta
