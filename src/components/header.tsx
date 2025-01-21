'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowLeft, faFileCirclePlus, faTrashCan, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export enum BotoesCabecalho {
    VOLTAR = 'voltar',
    NOVO = 'novo',
    EXCLUIR = 'excluir',
    SALVAR = 'salvar',
    EDITAR = 'editar',
}

interface Registros {
    id: number
    [key: string]: string | number | boolean
}

interface configuracoesSalvar {
    dados: unknown
    successCallback?: () => void
    redirecionarPara?: string
}

interface configuracoesRota {
    caminho: string
    botoes?: BotoesCabecalho[]
    configuracoesSalvar?: configuracoesSalvar
}

interface HeaderProps {
    TelaConsulta: boolean
    titulo: string
    novo?: string
    idsSelecionados?: Set<number>
    dados?: Registros[]
    setDados?: React.Dispatch<React.SetStateAction<Registros[]>>
    configuracoesRota?: configuracoesRota
}

export default function Header({ TelaConsulta, titulo, novo, idsSelecionados, dados, setDados, configuracoesRota }: HeaderProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const deveMostrarBotao = (button: BotoesCabecalho) => {
        return configuracoesRota?.botoes?.includes(button)
    }

    const handleBack = () => {
        router.back()
    }

    const handleNewClick = () => {
        if (novo) {
            router.push(novo)
        } else {
            toast.warning("Caminho para 'novo' não foi especificado.")
        }
    }

    const handleDelete = async () => {
        if (!configuracoesRota?.caminho) {
            toast.warning('Configuração de rota não fornecida')
            return
        }

        if (!idsSelecionados?.size) {
            toast.error('Selecione ao menos um item para excluir.')
            return
        }

        if (!dados || !setDados) {
            toast.error('Dados não disponíveis.')
            return
        }

        const confirmDelete = window.confirm('Você tem certeza que deseja excluir os itens selecionados?')

        if (!confirmDelete) return

        setLoading(true)

        try {
            const response = await fetch(`/api/${configuracoesRota.caminho}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: Array.from(idsSelecionados) }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao excluir os itens.')
            }

            const remainingData = dados.filter((item) => !idsSelecionados.has(item.id))
            setDados(remainingData)
            toast.success('Itens excluídos com sucesso.')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao excluir os itens.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!configuracoesRota?.caminho || !configuracoesRota.configuracoesSalvar) {
            toast.warning('Configuração de salvamento não fornecida')
            return
        }

        const { dados, successCallback, redirecionarPara } = configuracoesRota.configuracoesSalvar

        setLoading(true)
        try {
            const response = await fetch(`/api/${configuracoesRota.caminho}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao salvar')
            }

            toast.success('Dados salvos com sucesso!')

            if (successCallback) {
                successCallback()
            }

            if (redirecionarPara) {
                router.push(redirecionarPara)
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
            className={`w-full h-[9%] bg-green-900 text-white ${TelaConsulta ? 'flex flex-col' : 'flex justify-between items-center px-4'}`}
        >
            <div className="flex justify-between items-center px-4 h-3/5 w-full">
                <div>
                    <h1 className="font-semibold text-2xl">{titulo}</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <FontAwesomeIcon icon={faBell} className="text-white h-5 w-5" />
                    <h1>Domingos</h1>
                    <h1>DELL Transportes</h1>
                </div>
            </div>
            {TelaConsulta && (
                <div className="w-full px-4 bg-green-800 h-2/5">
                    <div className="flex flex-row gap-4">
                        {deveMostrarBotao(BotoesCabecalho.VOLTAR) && (
                            <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleBack}>
                                <FontAwesomeIcon icon={faArrowLeft} className="text-white w-9" />
                                <p>Voltar</p>
                            </div>
                        )}
                        {deveMostrarBotao(BotoesCabecalho.NOVO) && novo && (
                            <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleNewClick}>
                                <FontAwesomeIcon icon={faFileCirclePlus} className="text-blue-600 w-9" />
                                <p>Novo</p>
                            </div>
                        )}
                        {deveMostrarBotao(BotoesCabecalho.EXCLUIR) && configuracoesRota?.caminho && (
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
                        {deveMostrarBotao(BotoesCabecalho.SALVAR) && (
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
