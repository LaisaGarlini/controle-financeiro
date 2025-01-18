'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/header'
import { TabelaBanco, DataRow } from './componentes/tabela'
import { HeaderButton } from '@/components/header'

const BancoConsulta: React.FC = () => {
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
                const response = await fetch('/api/banco')
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da API')
                }
                const result = await response.json()
                setData(result as DataRow[])
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(data.map((row) => row.id)))
        } else {
            setSelectedIds(new Set())
        }
    }

    const handleSort = (column: keyof DataRow) => {
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
                isConsultaScreen={true}
                title="Bancos"
                userName="Usuário"
                companyName="Empresa"
                novo="/banco_cadastro"
                selectedIds={selectedIds}
                data={data}
                setData={setData}
                routeConfig={{
                    path: 'banco',
                    deleteMessage: 'Tem certeza que deseja excluir os bancos selecionados?',
                    buttons: [HeaderButton.BACK, HeaderButton.HOME, HeaderButton.NEW, HeaderButton.DELETE],
                }}
            />
            <main className="w-full h-[91%] flex flex-col gap-8 p-3">
                <TabelaBanco
                    data={data}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    loading={loading}
                    error={error}
                />
            </main>
        </div>
    )
}

export default BancoConsulta
