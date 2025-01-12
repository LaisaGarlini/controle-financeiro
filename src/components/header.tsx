'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowLeft, faFileCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface HeaderProps {
    isConsultaScreen: boolean
    title: string
    userName: string
    companyName: string
    novo?: string
    selectedIds?: Set<number> // IDs selecionados para exclusão
    data?: Array<{ id: number; [key: string]: any }> // Dados atuais
    setData?: React.Dispatch<React.SetStateAction<any[]>> // Função para atualizar os dados
}

export default function Header({ isConsultaScreen, title, userName, companyName, novo, selectedIds, data, setData }: HeaderProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleNewClick = () => {
        if (novo) {
            router.push(novo)
        } else {
            console.warn("Caminho para 'novo' não foi especificado.")
        }
    }

    const handleDelete = async () => {
        if (selectedIds.size === 0) {
            toast.error('Selecione ao menos um item para excluir.')
            return
        }

        const confirmDelete = window.confirm('Você tem certeza que deseja excluir os itens selecionados?')

        if (!confirmDelete) return

        setLoading(true)

        try {
            const response = await fetch('/api/categoria', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: Array.from(selectedIds) }),
            })

            if (!response.ok) {
                throw new Error('Erro ao excluir os itens.')
            }

            const remainingData = data.filter((item) => !selectedIds.has(item.id))
            setData(remainingData)
            toast.success('Itens excluídos com sucesso.')
        } catch (error: any) {
            toast.error(error.message || 'Erro desconhecido ao excluir os itens.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <header
            className={`w-full h-[9%] bg-green-900 text-white ${
                isConsultaScreen ? 'flex flex-col' : 'flex justify-between items-center px-4'
            }`}
        >
            <div className="flex justify-between items-center px-4 h-3/5 w-full">
                <div>
                    <h1 className="font-semibold text-2xl">{title}</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <FontAwesomeIcon icon={faBell} className="text-white h-5 w-5" />
                    <h1>{userName}</h1>
                    <h1>{companyName}</h1>
                </div>
            </div>
            {isConsultaScreen && (
                <div className="w-full px-4 bg-green-800 h-2/5">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-row items-center justify-start cursor-pointer" onClick={() => router.back()}>
                            <FontAwesomeIcon icon={faArrowLeft} size="sm" className="text-white w-9" />
                            <p>Voltar</p>
                        </div>
                        <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleNewClick}>
                            <FontAwesomeIcon icon={faFileCirclePlus} size="sm" className="text-blue-600 w-9" />
                            <p>Novo</p>
                        </div>
                        <div
                            className={`flex flex-row items-center justify-start cursor-pointer ${
                                loading ? 'opacity-50 pointer-events-none' : ''
                            }`}
                            onClick={handleDelete}
                        >
                            <FontAwesomeIcon icon={faTrashCan} size="sm" className="text-red-600 w-9" />
                            <p>Excluir</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
