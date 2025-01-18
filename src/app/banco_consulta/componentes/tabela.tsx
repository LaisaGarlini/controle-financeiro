'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

export interface DataRow {
    id: number
    nome: string
    [key: string]: string | number // para permitir propriedades adicionais
}

interface TabelaProps {
    data: DataRow[]
    selectedIds: Set<number>
    onToggleSelect: (id: number) => void
    onToggleSelectAll: (checked: boolean) => void
    sortColumn: keyof DataRow
    sortDirection: 'asc' | 'desc'
    onSort: (column: keyof DataRow) => void
    loading: boolean
    error: string | null
}

export function TabelaBanco({
    data,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    sortColumn,
    sortDirection,
    onSort,
    loading,
    error,
}: TabelaProps) {
    // Função de comparação tipada
    const compareValues = (a: string | number, b: string | number): number => {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b)
        }
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b
        }
        return 0
    }

    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        const compareResult = compareValues(aValue, bValue)
        return sortDirection === 'asc' ? compareResult : -compareResult
    })

    if (loading) return <p>Carregando dados...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <Table className="border border-gray-300">
            <TableHeader>
                <TableRow>
                    <TableHead style={{ width: '35px' }} className="sticky-header">
                        <Checkbox
                            checked={selectedIds.size === data.length && data.length > 0}
                            onCheckedChange={(checked) => onToggleSelectAll(checked === true)}
                        />
                    </TableHead>
                    <TableHead
                        style={{ width: '200px' }}
                        className="sticky-header cursor-pointer text-black font-semibold text-right"
                        onClick={() => onSort('id')}
                    >
                        Código
                        {sortColumn === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="sticky-header cursor-pointer text-black font-semibold text-left" onClick={() => onSort('nome')}>
                        Nome
                        {sortColumn === 'nome' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>
                            <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => onToggleSelect(row.id)} />
                        </TableCell>
                        <TableCell className="text-right">{row.id}</TableCell>
                        <TableCell className="text-left">{row.nome}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
