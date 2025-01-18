'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import Header, { BotoesCabecalho } from '@/components/header'
import { formatarDataHora, formatarMoeda } from '@/lib/utils'

interface DataRow {
    id: number
    data_emissao: string
    valor: number
    municipio_inicio: { nome: string }
    municipio_fim: { nome: string }
    destinatario: { nome: string }
}

const CTEConsulta: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [sortColumn, setSortColumn] = useState<keyof DataRow>('data_emissao')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/cte')
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da API')
                }
                const result = await response.json()
                setData(result as DataRow[])
            } catch (err: string | unknown) {
                setError(err.message || 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const sortedData = [...data].sort((a, b) => {
        if (sortColumn === 'municipio_inicio' || sortColumn === 'municipio_fim' || sortColumn === 'destinatario') {
            const aValue = a[sortColumn].nome.toLowerCase()
            const bValue = b[sortColumn].nome.toLowerCase()
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
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

    return (
        <div className="h-screen w-full">
            <Header
                TelaConsulta={true}
                titulo="CTE's"
                novo="/cte_cadastro"
                idsSelecionados={selectedIds}
                dados={data}
                setDados={setData}
                configuracoesRota={{
                    caminho: 'cte',
                    botoes: [BotoesCabecalho.VOLTAR, BotoesCabecalho.NOVO, BotoesCabecalho.EXCLUIR],
                }}
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
                                <TableHead className="cursor-pointer w-44 text-center" onClick={() => toggleSort('data_emissao')}>
                                    Data de Emissão
                                </TableHead>
                                <TableHead className="cursor-pointer w-44 text-center" onClick={() => toggleSort('valor')}>
                                    Valor
                                </TableHead>
                                <TableHead className="cursor-pointer text-left" onClick={() => toggleSort('municipio_inicio')}>
                                    Município Início
                                </TableHead>
                                <TableHead className="cursor-pointer text-left" onClick={() => toggleSort('municipio_fim')}>
                                    Município Fim
                                </TableHead>
                                <TableHead className="cursor-pointer text-left" onClick={() => toggleSort('destinatario')}>
                                    Destinatário
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                                    </TableCell>
                                    <TableCell className="text-center">{formatarDataHora(row.data_emissao)}</TableCell>
                                    <TableCell className="text-center">{formatarMoeda(row.valor)}</TableCell>
                                    <TableCell className="text-left">{row.municipio_inicio.nome}</TableCell>
                                    <TableCell className="text-left">{row.municipio_fim.nome}</TableCell>
                                    <TableCell className="text-left">{row.destinatario.nome}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </main>
        </div>
    )
}

export default CTEConsulta
