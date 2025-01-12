'use client'

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Checkbox } from '../../components/ui/checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFloppyDisk, faFileCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

// Colunas da tabela
interface DataRow {
    id: number
    dataEmissao: string
    municipioInicio: string
    municipioFim: string
    nomeDestinatario: string
    enderecoDestinatario: string
    valor: number
}

// Dados iniciais
const initialData: DataRow[] = [
    {
        id: 1,
        dataEmissao: '2025-01-01T00:00:00-03:00',
        municipioInicio: 'Rio do Sul',
        municipioFim: 'Blumenau',
        nomeDestinatario: 'João Silva',
        enderecoDestinatario: 'Rua das Flores, 123',
        valor: 100,
    },
    {
        id: 2,
        dataEmissao: '2025-01-02T00:00:00-03:00',
        municipioInicio: 'Blumenau',
        municipioFim: 'Itajaí',
        nomeDestinatario: 'Maria Oliveira',
        enderecoDestinatario: 'Av. Central, 456',
        valor: 200,
    },
    {
        id: 3,
        dataEmissao: '2025-01-03T00:00:00-03:00',
        municipioInicio: 'Itajaí',
        municipioFim: 'Florianópolis',
        nomeDestinatario: 'Carlos Mendes',
        enderecoDestinatario: 'Rua da Praia, 789',
        valor: 150,
    },
    {
        id: 4,
        dataEmissao: '2025-01-04T00:00:00-03:00',
        municipioInicio: 'Florianópolis',
        municipioFim: 'Joinville',
        nomeDestinatario: 'Ana Costa',
        enderecoDestinatario: 'Rua das Acácias, 321',
        valor: 250,
    },
    {
        id: 5,
        dataEmissao: '2025-01-05T00:00:00-03:00',
        municipioInicio: 'Joinville',
        municipioFim: 'Rio do Sul',
        nomeDestinatario: 'Roberto Lima',
        enderecoDestinatario: 'Av. das Palmeiras, 654',
        valor: 180,
    },
    {
        id: 6,
        dataEmissao: '2025-01-06T00:00:00-03:00',
        municipioInicio: 'Rio do Sul',
        municipioFim: 'Itajaí',
        nomeDestinatario: 'Fernanda Almeida',
        enderecoDestinatario: 'Rua das Hortênsias, 567',
        valor: 220,
    },
    {
        id: 7,
        dataEmissao: '2025-01-07T00:00:00-03:00',
        municipioInicio: 'Itajaí',
        municipioFim: 'Blumenau',
        nomeDestinatario: 'Paulo Santana',
        enderecoDestinatario: 'Av. Atlântica, 890',
        valor: 140,
    },
    {
        id: 8,
        dataEmissao: '2025-01-08T00:00:00-03:00',
        municipioInicio: 'Blumenau',
        municipioFim: 'Florianópolis',
        nomeDestinatario: 'Juliana Ribeiro',
        enderecoDestinatario: 'Rua das Palmeiras, 112',
        valor: 310,
    },
    {
        id: 9,
        dataEmissao: '2025-01-09T00:00:00-03:00',
        municipioInicio: 'Florianópolis',
        municipioFim: 'Joinville',
        nomeDestinatario: 'Thiago Ferreira',
        enderecoDestinatario: 'Av. Beira Mar, 333',
        valor: 270,
    },
    {
        id: 10,
        dataEmissao: '2025-01-10T00:00:00-03:00',
        municipioInicio: 'Joinville',
        municipioFim: 'Itajaí',
        nomeDestinatario: 'Camila Souza',
        enderecoDestinatario: 'Rua das Orquídeas, 444',
        valor: 190,
    },
    {
        id: 11,
        dataEmissao: '2025-01-11T00:00:00-03:00',
        municipioInicio: 'Itajaí',
        municipioFim: 'Rio do Sul',
        nomeDestinatario: 'Ricardo Martins',
        enderecoDestinatario: 'Rua das Águas, 555',
        valor: 120,
    },
    {
        id: 12,
        dataEmissao: '2025-01-12T00:00:00-03:00',
        municipioInicio: 'Rio do Sul',
        municipioFim: 'Blumenau',
        nomeDestinatario: 'Larissa Borges',
        enderecoDestinatario: 'Av. das Camélias, 666',
        valor: 210,
    },
    {
        id: 13,
        dataEmissao: '2025-01-13T00:00:00-03:00',
        municipioInicio: 'Blumenau',
        municipioFim: 'Joinville',
        nomeDestinatario: 'Marcelo Nunes',
        enderecoDestinatario: 'Rua das Rosas, 777',
        valor: 130,
    },
    {
        id: 14,
        dataEmissao: '2025-01-14T00:00:00-03:00',
        municipioInicio: 'Joinville',
        municipioFim: 'Florianópolis',
        nomeDestinatario: 'Tatiana Santos',
        enderecoDestinatario: 'Av. das Flores, 888',
        valor: 230,
    },
    {
        id: 15,
        dataEmissao: '2025-01-15T00:00:00-03:00',
        municipioInicio: 'Florianópolis',
        municipioFim: 'Itajaí',
        nomeDestinatario: 'Fábio Rocha',
        enderecoDestinatario: 'Rua dos Pássaros, 999',
        valor: 170,
    },
    {
        id: 16,
        dataEmissao: '2025-01-16T00:00:00-03:00',
        municipioInicio: 'Itajaí',
        municipioFim: 'Rio do Sul',
        nomeDestinatario: 'Cláudia Silva',
        enderecoDestinatario: 'Rua das Magnólias, 101',
        valor: 290,
    },
    {
        id: 17,
        dataEmissao: '2025-01-17T00:00:00-03:00',
        municipioInicio: 'Rio do Sul',
        municipioFim: 'Blumenau',
        nomeDestinatario: 'André Pereira',
        enderecoDestinatario: 'Av. das Acácias, 202',
        valor: 200,
    },
    {
        id: 18,
        dataEmissao: '2025-01-18T00:00:00-03:00',
        municipioInicio: 'Blumenau',
        municipioFim: 'Florianópolis',
        nomeDestinatario: 'Renata Lima',
        enderecoDestinatario: 'Rua das Hortênsias, 303',
        valor: 250,
    },
    {
        id: 19,
        dataEmissao: '2025-01-19T00:00:00-03:00',
        municipioInicio: 'Florianópolis',
        municipioFim: 'Joinville',
        nomeDestinatario: 'Eduardo Castro',
        enderecoDestinatario: 'Av. das Palmeiras, 404',
        valor: 160,
    },
    {
        id: 20,
        dataEmissao: '2025-01-20T00:00:00-03:00',
        municipioInicio: 'Joinville',
        municipioFim: 'Rio do Sul',
        nomeDestinatario: 'Sofia Mendes',
        enderecoDestinatario: 'Rua das Rosas, 505',
        valor: 180,
    },
]

const CTEConsulta: React.FC = () => {
    const [data, setData] = useState<DataRow[]>(initialData)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [sortColumn, setSortColumn] = useState<keyof DataRow>('dataEmissao')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const router = useRouter()

    // Função para formatar a data
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
        return date.toLocaleDateString('pt-BR', options) // Exibe apenas a data no formato dd/MM/yyyy
    }

    // Ordenar os dados
    const sortedData = [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
            return sortDirection === 'asc' ? -1 : 1
        }
        if (a[sortColumn] > b[sortColumn]) {
            return sortDirection === 'asc' ? 1 : -1
        }
        return 0
    })

    // Alternar a seleção de um registro
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

    // Alternar ordenação
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
                        <h1 className="font-semibold text-2xl">CTe's</h1>
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
                            onClick={() => router.push('/contas_pagar_cadastro')}
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
                                style={{ width: '140px' }}
                                className="sticky-header cursor-pointer text-black font-semibold text-center"
                                onClick={() => toggleSort('dataEmissao')}
                            >
                                Data de Emissão
                                {sortColumn === 'dataEmissao' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead
                                style={{ width: '140px' }}
                                className="sticky-header cursor-pointer text-black font-semibold text-right"
                                onClick={() => toggleSort('valor')}
                            >
                                R$ Valor
                                {sortColumn === 'valor' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead
                                style={{ width: '220px' }}
                                className="sticky-header cursor-pointer text-black font-semibold text-left"
                                onClick={() => toggleSort('municipioInicio')}
                            >
                                Município Início
                                {sortColumn === 'municipioInicio' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead
                                style={{ width: '220px' }}
                                className="sticky-header cursor-pointer text-black font-semibold text-left"
                                onClick={() => toggleSort('municipioFim')}
                            >
                                Município Fim
                                {sortColumn === 'municipioFim' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead
                                style={{ width: '250px' }}
                                className="sticky-header cursor-pointer text-black font-semibold text-left"
                                onClick={() => toggleSort('nomeDestinatario')}
                            >
                                Nome do Destinatário
                                {sortColumn === 'nomeDestinatario' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead
                                className="sticky-header cursor-pointer text-black font-semibold text-left"
                                onClick={() => toggleSort('enderecoDestinatario')}
                            >
                                Endereço do Destinatário
                                {sortColumn === 'enderecoDestinatario' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                                </TableCell>
                                <TableCell className="text-center">{formatDate(row.dataEmissao)}</TableCell>
                                <TableCell className="text-right">{row.valor.toFixed(2)}</TableCell>
                                <TableCell className="text-left">{row.municipioInicio}</TableCell>
                                <TableCell className="text-left">{row.municipioFim}</TableCell>
                                <TableCell className="text-left">{row.nomeDestinatario}</TableCell>
                                <TableCell className="text-left">{row.enderecoDestinatario}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
        </div>
    )
}

export default CTEConsulta
