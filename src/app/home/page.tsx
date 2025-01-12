import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
    faTruck,
    faPiggyBank,
    faMoneyBill,
    faUserGear,
    faChartBar,
    faChartPie,
    faChartSimple,
    faBuildingColumns,
    faBuildingUser,
    faCreditCard,
    faWallet,
    faCalendarDay,
    faMapLocationDot,
    faList,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Header from '../../components/header'

interface ItemProps {
    icone: IconDefinition
    titulo: string
    cor: string
    rota: string
}

const Item: React.FC<ItemProps> = ({ icone, titulo, cor, rota }) => (
    <Link href={rota}>
        <div className="w-1/4 min-w-[120px] h-full min-h-[120px] flex flex-col justify-around items-center p-4 hover:bg-[#f4f4f4] hover:scale-95 transition duration-300 ease-in-out">
            <FontAwesomeIcon key={titulo} icon={icone} size="2x" className={`${cor} w-16`} />
            <p className="text-base text-center">{titulo}</p>
        </div>
    </Link>
)

interface ModuloProps {
    titulo: string
    itens: ItemProps[]
}

const Modulo: React.FC<ModuloProps> = ({ titulo, itens }) => (
    <div className="w-1/3 min-w-[200px] h-[35%] p-2 bg-[#fafafa] hover:scale-95 transition duration-300 ease-in-out mt-3 flex flex-col">
        <div className="w-full h-[10%]">
            <h1 className="text-xl">{titulo}</h1>
        </div>
        <div className="w-full h-[90%] flex flex-row items-center justify-around">
            {itens.map((item, index) => (
                <Item key={index} {...item} />
            ))}
        </div>
    </div>
)

const Home: React.FC = () => {
    const Modulos: ModuloProps[] = [
        {
            titulo: 'Fretes',
            itens: [
                { icone: faTruck, titulo: "CTE's", cor: 'text-green-600', rota: '/cte_consulta' },
                { icone: faPiggyBank, titulo: 'Granjeiros', cor: 'text-blue-600', rota: '/' },
            ],
        },
        {
            titulo: 'Financeiro',
            itens: [
                { icone: faMoneyBill, titulo: 'Contas a receber', cor: 'text-green-600', rota: '/' },
                { icone: faMoneyBill, titulo: 'Contas a pagar', cor: 'text-red-600', rota: '/contas_pagar_consulta' },
                { icone: faUserGear, titulo: 'Fornecedores', cor: 'text-blue-600', rota: '/' },
            ],
        },
        {
            titulo: 'Pessoas',
            itens: [
                { icone: faUserGear, titulo: 'Fornecedores', cor: 'text-blue-600', rota: '/' },
                { icone: faPiggyBank, titulo: 'Granjeiros', cor: 'text-blue-600', rota: '/' },
            ],
        },
        {
            titulo: 'Dashboard',
            itens: [
                { icone: faChartSimple, titulo: 'Geral', cor: 'text-green-600', rota: '/' },
                { icone: faChartPie, titulo: 'Receita X Despesa', cor: 'text-red-600', rota: '/contas_pagar_consulta' },
                { icone: faChartBar, titulo: "CTE's", cor: 'text-blue-600', rota: '/' },
            ],
        },
        {
            titulo: 'Configurações',
            itens: [
                { icone: faBuildingColumns, titulo: 'Banco', cor: 'text-blue-600', rota: '/banco_consulta' },
                { icone: faBuildingUser, titulo: 'Agência', cor: 'text-red-600', rota: '/contas_pagar_consulta' },
                { icone: faCalendarDay, titulo: 'Condição de Pagamento', cor: 'text-green-600', rota: '/' },
                { icone: faWallet, titulo: 'Conta Financeira', cor: 'text-blue-600', rota: '/' },
                { icone: faCreditCard, titulo: 'Forma de Pagamento', cor: 'text-red-600', rota: '/' },
                { icone: faMapLocationDot, titulo: 'Endereço', cor: 'text-green-600', rota: '/' },
                { icone: faList, titulo: 'Categoria', cor: 'text-blue-600', rota: '/categoria_consulta' },
            ],
        },
    ]

    return (
        <div className="h-screen w-full">
            <Header isConsultaScreen={false} title="Controle Financeiro" userName="Domingos" companyName="DELL Transportes" />
            <main className="w-full h-[91%] flex flex-wrap gap-4 p-3">
                {Modulos.map((modulo, index) => (
                    <Modulo key={index} {...modulo} />
                ))}
            </main>
        </div>
    )
}

export default Home
