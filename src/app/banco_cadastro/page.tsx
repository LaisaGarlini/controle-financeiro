"use client"

import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"   
import { faArrowLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const BancoCadastro: React.FC = () => {
  const [formData, setFormData] = useState({
    id: '',
    usuarioId: '',
    nome: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
  }

  return (
    <div className="h-screen w-full">
      <header className="w-full h-[9%] bg-green-900 text-white flex flex-col">
        <div className="flex justify-between items-center px-4 h-3/5">
            <div>
                <h1 className="font-semibold text-2xl">Cadastro de CTe's</h1>
            </div>
            <div className="flex gap-4">
                <h1>Domingos</h1>
                <h1>DELL Transportes</h1>
            </div>
        </div>
        <div className="w-full px-4 bg-green-800 h-2/5">
            <div className="flex flex-row gap-4">
                <div className="flex flex-row items-center justify-start cursor-pointer">
                    <FontAwesomeIcon icon={faArrowLeft} size="sm" className="text-white w-9" />
                    <p>Voltar</p>
                </div>
                <div className="flex flex-row items-center justify-start cursor-pointer" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faFloppyDisk} size="sm" className="text-green-600 w-9" />
                    <p>Salvar</p>
                </div>
            </div>
        </div>
      </header>
      <main className="w-full h-[91%] flex flex-col items-start gap-8 p-6 bg-gray-100 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={key} className="text-right font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              </Label>
              <Input
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="col-span-2"
              />
            </div>
          ))}
        </form>
      </main>
    </div>
  )
}

export default BancoCadastro