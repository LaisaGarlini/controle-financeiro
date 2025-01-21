'use client'

import type React from 'react'
import { useState } from 'react'
import Header from '@/components/header'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

const ImportarCTE: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [results, setResults] = useState<Array<{ success: boolean; chave: string }>>([])
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) return

        setIsUploading(true)
        setError(null)
        setResults([])

        try {
            const formData = new FormData()
            Array.from(event.target.files).forEach((file) => {
                formData.append('files', file)
            })

            formData.append('empresaId', '1')

            const response = await fetch('/api/importar_cte', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()
            if (data.success) {
                setResults(data.results)
            } else {
                throw new Error(data.message || 'Erro ao processar os arquivos XML')
            }
        } catch (error) {
            toast.error('Erro ao processar os arquivos XML')
            setError(error instanceof Error ? error.message : 'Erro desconhecido ao processar os arquivos XML')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="h-screen w-full">
            <Header TelaConsulta={false} titulo="Importar CTE's" />
            <main className="w-full h-[91%] flex flex-col gap-8 p-3">
                <Alert className="bg-green-100">
                    <AlertDescription>
                        Selecione um ou mais arquivos do tipo <strong>XML</strong> e clique em "Importar" para importar os CTE's
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <Label htmlFor="arquivo" className="w-24">
                            Arquivos
                        </Label>
                        <Input
                            id="arquivo"
                            type="file"
                            className="w-96"
                            onChange={handleFileUpload}
                            multiple
                            accept=".xml"
                            disabled={isUploading}
                        />
                        <Button className="bg-green-200 text-green-800 hover:bg-green-300" disabled={isUploading}>
                            {isUploading ? 'Importando...' : 'Importar'}
                        </Button>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {results.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">CTEs importados:</h3>
                            <ul className="list-disc pl-5">
                                {results.map((result, index) => (
                                    <li key={index} className="text-sm">
                                        {result.success ? (
                                            <span className="text-green-600">CTE {result.chave} importado com sucesso</span>
                                        ) : (
                                            <span className="text-red-600">Falha ao importar CTE {result.chave}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default ImportarCTE
