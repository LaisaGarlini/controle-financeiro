'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowLeft, faFileCirclePlus, faTrashCan, faHome, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

// Enum para os botões disponíveis
export enum HeaderButton {
    BACK = 'back',
    HOME = 'home',
    NEW = 'new',
    DELETE = 'delete',
    SAVE = 'save',
}

interface DataItem {
    id: number
    [key: string]: string | number | boolean
}

interface SaveConfig {
    data: unknown // dados a serem salvos
    successMessage?: string
    successCallback?: () => void
    redirectTo?: string
}

interface RouteConfig {
    path: string
    deleteMessage?: string
    buttons?: HeaderButton[]
    saveConfig?: SaveConfig // Nova configuração para salvar
}

interface HeaderProps {
    isConsultaScreen: boolean
    title: string
    userName: string
    companyName: string
    novo?: string
    selectedIds?: Set<number>
    data?: DataItem[]
    setData?: React.Dispatch<React.SetStateAction<DataItem[]>>
    routeConfig?: RouteConfig
}

export default function Header({
    isConsultaScreen,
    title,
    userName,
    companyName,
    novo,
    selectedIds,
    data,
    setData,
    routeConfig,
}: HeaderProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Função auxiliar para verificar se um botão deve ser exibido
    const shouldShowButton = (button: HeaderButton) => {
        return routeConfig?.buttons?.includes(button)
    }

    const handleBack = () => {
        router.back()
    }

    const handleHome = () => {
        router.push('/')
    }

    const handleNewClick = () => {
        if (novo) {
            router.push(novo)
        } else {
            console.warn("Caminho para 'novo' não foi especificado.")
        }
    }

    const handleDelete = async () => {
        if (!routeConfig?.path) {
            console.warn('Configuração de rota não fornecida')
            return
        }

        if (!selectedIds?.size) {
            toast.error('Selecione ao menos um item para excluir.')
            return
        }

        if (!data || !setData) {
            toast.error('Dados não disponíveis.')
            return
        }

        const confirmMessage = routeConfig.deleteMessage || 'Você tem certeza que deseja excluir os itens selecionados?'
        const confirmDelete = window.confirm(confirmMessage)

        if (!confirmDelete) return

        setLoading(true)

        try {
            const response = await fetch(`/api/${routeConfig.path}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: Array.from(selectedIds) }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao excluir os itens.')
            }

            const remainingData = data.filter((item) => !selectedIds.has(item.id))
            setData(remainingData)
            toast.success('Itens excluídos com sucesso.')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao excluir os itens.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!routeConfig?.path || !routeConfig.saveConfig) {
            console.warn('Configuração de salvamento não fornecida')
            return
        }

        const { data, successMessage, successCallback, redirectTo } = routeConfig.saveConfig

        setLoading(true)
        try {
            const response = await fetch(`/api/${routeConfig.path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao salvar')
            }

            toast.success(successMessage || 'Dados salvos com sucesso!')

            if (successCallback) {
                successCallback()
            }

            if (redirectTo) {
                router.push(redirectTo)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar os dados'
            toast.error(errorMessage)
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
                        {shouldShowButton(HeaderButton.BACK) && (
                            <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleBack}>
                                <FontAwesomeIcon icon={faArrowLeft} className="text-white w-9" />
                                <p>Voltar</p>
                            </div>
                        )}
                        {shouldShowButton(HeaderButton.HOME) && (
                            <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleHome}>
                                <FontAwesomeIcon icon={faHome} className="text-white w-9" />
                                <p>Home</p>
                            </div>
                        )}
                        {shouldShowButton(HeaderButton.NEW) && novo && (
                            <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleNewClick}>
                                <FontAwesomeIcon icon={faFileCirclePlus} className="text-blue-600 w-9" />
                                <p>Novo</p>
                            </div>
                        )}
                        {shouldShowButton(HeaderButton.DELETE) && routeConfig?.path && (
                            <div
                                className={`flex flex-row items-center justify-start cursor-pointer ${
                                    loading ? 'opacity-50 pointer-events-none' : ''
                                }`}
                                onClick={handleDelete}
                            >
                                <FontAwesomeIcon icon={faTrashCan} className="text-red-600 w-9" />
                                <p>Excluir</p>
                            </div>
                        )}
                        {shouldShowButton(HeaderButton.SAVE) && (
                            <div
                                className={`flex flex-row items-center justify-start cursor-pointer ${
                                    loading ? 'opacity-50 pointer-events-none' : ''
                                }`}
                                onClick={handleSave}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} className="text-green-600 w-9" />
                                <p>Salvar</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
