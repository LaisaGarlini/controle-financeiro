'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowLeft, faFileCirclePlus, faTrashCan, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export enum BotaoCabecalho {
    VOLTAR = 'voltar',
    NOVO = 'novo',
    EXCLUIR = 'excluir',
    SALVAR = 'salvar',
    EDITAR = 'editar',
}

interface Registros {
    id: number
    [chave: string]: string | number | boolean
}

interface ConfiguracaoSalvar {
    dados: unknown
    mensagemSucesso?: string
    callbackSucesso?: () => void
    redirecionarPara?: string
}

interface ConfiguracaoRota {
    caminho: string
    botoes?: BotaoCabecalho[]
    configuracaoSalvar?: ConfiguracaoSalvar
}

interface PropriedadesCabecalho {
    TelaConsulta?: boolean
    TelaDashboard?: boolean
    titulo: string
    novo?: string
    idsSeleccionados?: Set<number>
    dados?: Registros[]
    definirDados?: React.Dispatch<React.SetStateAction<Registros[]>>
    configuracaoRota?: ConfiguracaoRota
}

export default function Cabecalho({
    TelaConsulta,
    titulo,
    novo,
    idsSeleccionados,
    dados,
    definirDados,
    configuracaoRota,
}: PropriedadesCabecalho) {
    const roteador = useRouter()
    const [carregando, definirCarregando] = useState(false)

    const deveMostrarBotao = (botao: BotaoCabecalho) => {
        return configuracaoRota?.botoes?.includes(botao)
    }

    const lidarComVoltar = () => {
        roteador.back()
    }

    const lidarComNovoClique = () => {
        if (novo) {
            roteador.push(novo)
        } else {
            toast.warning('Caminho para novo não foi especificado.')
        }
    }

    const lidarComExclusao = async () => {
        if (!configuracaoRota?.caminho) {
            toast.warning('Configuração de rota não fornecida')
            return
        }

        if (!idsSeleccionados?.size) {
            toast.warning('Selecione ao menos um item para excluir')
            return
        }

        if (!dados || !definirDados) {
            toast.error('Dados não disponíveis')
            return
        }

        const confirmarExclusao = window.confirm('Você tem certeza que deseja excluir os itens selecionados?')

        if (!confirmarExclusao) return

        definirCarregando(true)

        try {
            const resposta = await fetch(`/api/${configuracaoRota.caminho}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: Array.from(idsSeleccionados) }),
            })

            if (!resposta.ok) {
                const dadosErro = await resposta.json()
                throw new Error(dadosErro.erro || 'Erro ao excluir os itens.')
            }

            const dadosRestantes = dados.filter((item) => !idsSeleccionados.has(item.id))
            definirDados(dadosRestantes)
            toast.success('Itens excluídos com sucesso.')
        } catch (erro) {
            const mensagemErro = erro instanceof Error ? erro.message : 'Erro desconhecido ao excluir os itens.'
            toast.error(mensagemErro)
        } finally {
            definirCarregando(false)
        }
    }

    const lidarComSalvar = async () => {
        if (!configuracaoRota?.caminho || !configuracaoRota.configuracaoSalvar) {
            toast.warning('Configuração de salvamento não fornecida')
            return
        }

        const { dados, mensagemSucesso, callbackSucesso, redirecionarPara } = configuracaoRota.configuracaoSalvar

        definirCarregando(true)
        try {
            const resposta = await fetch(`/api/${configuracaoRota.caminho}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            })

            if (!resposta.ok) {
                const dadosErro = await resposta.json()
                throw new Error(dadosErro.erro || 'Erro ao salvar')
            }

            toast.success(mensagemSucesso || 'Dados salvos com sucesso!')

            if (callbackSucesso) {
                callbackSucesso()
            }

            if (redirecionarPara) {
                roteador.push(redirecionarPara)
            }
        } catch (erro) {
            const mensagemErro = erro instanceof Error ? erro.message : 'Erro ao salvar os dados'
            toast.error(mensagemErro)
        } finally {
            definirCarregando(false)
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
                    <h2>Domingos</h2>
                    <h2>DELL Transportes</h2>
                </div>
            </div>
            {TelaConsulta && (
                <div className="w-full px-4 bg-green-800 h-2/5">
                    <div className="flex flex-row gap-4">
                        {deveMostrarBotao(BotaoCabecalho.VOLTAR) && (
                            <button
                                className="flex flex-row items-center justify-start cursor-pointer"
                                onClick={lidarComVoltar}
                                disabled={carregando}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="text-white w-9" />
                                <span>Voltar</span>
                            </button>
                        )}
                        {deveMostrarBotao(BotaoCabecalho.NOVO) && novo && (
                            <button
                                className="flex flex-row items-center justify-start cursor-pointer"
                                onClick={lidarComNovoClique}
                                disabled={carregando}
                            >
                                <FontAwesomeIcon icon={faFileCirclePlus} className="text-blue-600 w-9" />
                                <span>Novo</span>
                            </button>
                        )}
                        {deveMostrarBotao(BotaoCabecalho.EXCLUIR) && configuracaoRota?.caminho && (
                            <button
                                className={`flex flex-row items-center justify-start cursor-pointer ${
                                    carregando ? 'opacity-50 pointer-events-none' : ''
                                }`}
                                onClick={lidarComExclusao}
                                disabled={carregando}
                            >
                                <FontAwesomeIcon icon={faTrashCan} className="text-red-600 w-9" />
                                <span>Excluir</span>
                            </button>
                        )}
                        {deveMostrarBotao(BotaoCabecalho.SALVAR) && (
                            <button
                                className={`flex flex-row items-center justify-start cursor-pointer ${
                                    carregando ? 'opacity-50 pointer-events-none' : ''
                                }`}
                                onClick={lidarComSalvar}
                                disabled={carregando}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} className="text-green-600 w-9" />
                                <span>Salvar</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
