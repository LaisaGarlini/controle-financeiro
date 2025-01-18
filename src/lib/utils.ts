import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatarDataHora = (dataString: string) => {
    if (!dataString) return ''
    const data = new Date(dataString)
    if (isNaN(data.getTime())) return ''
    const opcoes: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }
    return data.toLocaleString('pt-BR', opcoes).replace(',', '')
}

export const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor)
}
