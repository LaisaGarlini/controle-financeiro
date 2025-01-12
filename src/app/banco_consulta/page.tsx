'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFloppyDisk, faFileCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

interface DataRow {
    id: number
    nome: string
}

const ContasPagarConsulta: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [sortColumn, setSortColumn] = useState<keyof DataRow>('nome')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/selectBanco')
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
    }, [])

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

    return (
        <div className="h-screen w-full">
            <header className="w-full h-[9%] bg-green-900 text-white flex flex-col">
                <div className="flex justify-between items-center px-4 h-3/5">
                    <div>
                        <h1 className="font-semibold text-2xl">Contas a Pagar</h1>
                    </div>
                    <div className="flex gap-4">
                        <h1>Domingos</h1>
                        <h1>DELL Transportes</h1>
                    </div>
                </div>
                <div className="w-full px-4 bg-green-800 h-2/5">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-row items-center justify-start cursor-pointer">
                            <FontAwesomeIcon icon={faArrowLeft} className="text-white w-9" />
                            <p>Voltar</p>
                        </div>
                        <div className="flex flex-row items-center justify-start cursor-pointer">
                            <FontAwesomeIcon icon={faFloppyDisk} className="text-green-600 w-9" />
                            <p>Salvar</p>
                        </div>
                        <div
                            className="flex flex-row items-center justify-start cursor-pointer"
                            onClick={() => router.push('/banco_cadastro')}
                        >
                            <FontAwesomeIcon icon={faFileCirclePlus} className="text-blue-600 w-9" />
                            <p>Novo</p>
                        </div>
                        <div className="flex flex-row items-center justify-start cursor-pointer">
                            <FontAwesomeIcon icon={faTrashCan} className="text-red-600 w-9" />
                            <p>Excluir</p>
                        </div>
                    </div>
                </div>
            </header>
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
                                    style={{ width: '200px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-right"
                                    onClick={() => toggleSort('id')}
                                >
                                    Código
                                    {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    className="sticky-header cursor-pointer text-black font-semibold text-left"
                                    onClick={() => toggleSort('nome')}
                                >
                                    Nome
                                    {sortColumn === 'nome' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                                    </TableCell>
                                    <TableCell className="text-right">{row.id}</TableCell>
                                    <TableCell className="text-left">{row.nome}</TableCell>
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
