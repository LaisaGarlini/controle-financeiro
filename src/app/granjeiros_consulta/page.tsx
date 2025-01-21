'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Header, { BotoesCabecalho } from '../../components/header'

interface DataRow {
    id: number
    nome: string
    fantasia: string
    tipo: string
    cpf_cnpj: string
    rg_ie: string
    celular: string
    email: string
    data_cadastro: string
    data_atualizacao: string
    ativo: boolean
    tipo_granjeiro: boolean
    tipo_motorista: boolean
    tipo_fornecedor: boolean
}

const formatCpfCnpj = (value: string) => {
    if (!value) return value
    if (value.length === 11) {
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (value.length === 14) {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return value
}

const GranjeirosConsulta: React.FC = () => {
    const [data, setData] = useState<DataRow[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [sortColumn, setSortColumn] = useState<keyof DataRow>('nome')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/granjeiro')
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
            <Header
                TelaConsulta={true}
                titulo="Granjeiros"
                novo="/granjeiro_cadastro"
                idsSelecionados={selectedIds}
                dados={data}
                setDados={setData}
                configuracoesRota={{
                    caminho: 'granjeiro',
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
                                <TableHead
                                    style={{ width: '80px' }}
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
                                <TableHead
                                    style={{ width: '200px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-left"
                                    onClick={() => toggleSort('cpf_cnpj')}
                                >
                                    CPF/CNPJ
                                    {sortColumn === 'cpf_cnpj' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '200px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-left"
                                    onClick={() => toggleSort('celular')}
                                >
                                    Celular
                                    {sortColumn === 'celular' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '200px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-left"
                                    onClick={() => toggleSort('email')}
                                >
                                    Email
                                    {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead
                                    style={{ width: '70px' }}
                                    className="sticky-header cursor-pointer text-black font-semibold text-center"
                                    onClick={() => toggleSort('ativo')}
                                >
                                    Ativo
                                    {sortColumn === 'ativo' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                                    <TableCell className="text-left">{formatCpfCnpj(row.cpf_cnpj)}</TableCell>
                                    <TableCell className="text-left">{row.celular}</TableCell>
                                    <TableCell className="text-left">{row.email}</TableCell>
                                    <TableCell className="text-center">{row.ativo ? <FontAwesomeIcon icon={faCheck} /> : null}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </main>
        </div>
    )
}

export default GranjeirosConsulta
