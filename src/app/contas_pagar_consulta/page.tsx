"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";   
import { 
  faArrowLeft, 
  faFloppyDisk, 
  faFileCirclePlus, 
  faTrashCan, 
  faCheck, 
  faExclamationTriangle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

interface DataRow {
  id: number;
  descricao: string;
  valorBruto: number;
  valorPago: number;
  dataVencimento: string;
  dataPagamento: string;
  categoria: string;
  situacao: string;
}

// Dados iniciais
const initialData: DataRow[] = [
    {
      id: 1,
      descricao: "Compra de materiais de escritório",
      valorBruto: 150.0,
      valorPago: 150.0,
      dataVencimento: "2025-01-10",
      dataPagamento: "2025-01-08",
      categoria: "Escritório",
      situacao: "Pago",
    },
    {
      id: 2,
      descricao: "Serviço de consultoria",
      valorBruto: 1200.0,
      valorPago: 1200.0,
      dataVencimento: "2025-01-15",
      dataPagamento: "2025-01-14",
      categoria: "Serviços",
      situacao: "Pago",
    },
    {
      id: 3,
      descricao: "Manutenção de equipamentos",
      valorBruto: 300.0,
      valorPago: 0.0,
      dataVencimento: "2025-01-20",
      dataPagamento: "2025-01-10",
      categoria: "Manutenção",
      situacao: "Pendente",
    },
    {
      id: 4,
      descricao: "Pagamento de conta de energia",
      valorBruto: 500.0,
      valorPago: 500.0,
      dataVencimento: "2025-01-18",
      dataPagamento: "2025-01-17",
      categoria: "Utilidades",
      situacao: "Pago",
    },
    {
      id: 5,
      descricao: "Assinatura de software",
      valorBruto: 75.0,
      valorPago: 75.0,
      dataVencimento: "2025-01-25",
      dataPagamento: "2025-01-24",
      categoria: "Tecnologia",
      situacao: "Pago",
    },
    {
      id: 6,
      descricao: "Compra de móveis",
      valorBruto: 2500.0,
      valorPago: 1250.0,
      dataVencimento: "2025-02-01",
      dataPagamento: "2025-01-30",
      categoria: "Escritório",
      situacao: "Parcialmente Pago",
    },
    {
      id: 7,
      descricao: "Compra de papel para impressão",
      valorBruto: 200.0,
      valorPago: 0.0,
      dataVencimento: "2025-01-28",
      dataPagamento: "2025-01-10",
      categoria: "Escritório",
      situacao: "Pendente",
    },
    {
      id: 8,
      descricao: "Serviço de limpeza mensal",
      valorBruto: 800.0,
      valorPago: 800.0,
      dataVencimento: "2025-01-15",
      dataPagamento: "2025-01-14",
      categoria: "Serviços",
      situacao: "Pago",
    },
    {
      id: 9,
      descricao: "Compra de equipamentos de TI",
      valorBruto: 5000.0,
      valorPago: 5000.0,
      dataVencimento: "2025-02-10",
      dataPagamento: "2025-02-08",
      categoria: "Tecnologia",
      situacao: "Pago",
    },
    {
      id: 10,
      descricao: "Manutenção predial",
      valorBruto: 400.0,
      valorPago: 400.0,
      dataVencimento: "2025-02-05",
      dataPagamento: "2025-02-03",
      categoria: "Manutenção",
      situacao: "Pago",
    },
    {
      id: 11,
      descricao: "Café para a equipe",
      valorBruto: 60.0,
      valorPago: 60.0,
      dataVencimento: "2025-01-12",
      dataPagamento: "2025-01-11",
      categoria: "Escritório",
      situacao: "Pago",
    },
    {
      id: 12,
      descricao: "Compra de uniformes",
      valorBruto: 900.0,
      valorPago: 900.0,
      dataVencimento: "2025-02-15",
      dataPagamento: "2025-02-14",
      categoria: "Recursos Humanos",
      situacao: "Pago",
    },
    {
      id: 13,
      descricao: "Taxa de condomínio",
      valorBruto: 1200.0,
      valorPago: 1200.0,
      dataVencimento: "2025-01-31",
      dataPagamento: "2025-01-30",
      categoria: "Despesas Fixas",
      situacao: "Pago",
    },
    {
      id: 14,
      descricao: "Compra de licenças de software",
      valorBruto: 1500.0,
      valorPago: 1500.0,
      dataVencimento: "2025-03-01",
      dataPagamento: "2025-02-28",
      categoria: "Tecnologia",
      situacao: "Pago",
    },
    {
      id: 15,
      descricao: "Treinamento para colaboradores",
      valorBruto: 1800.0,
      valorPago: 1800.0,
      dataVencimento: "2025-03-05",
      dataPagamento: "2025-03-03",
      categoria: "Recursos Humanos",
      situacao: "Pago",
    },
    {
      id: 16,
      descricao: "Despesas com transporte",
      valorBruto: 350.0,
      valorPago: 350.0,
      dataVencimento: "2025-01-22",
      dataPagamento: "2025-01-21",
      categoria: "Logística",
      situacao: "Pago",
    },
    {
      id: 17,
      descricao: "Compra de cartuchos para impressora",
      valorBruto: 200.0,
      valorPago: 200.0,
      dataVencimento: "2025-01-30",
      dataPagamento: "2025-01-28",
      categoria: "Escritório",
      situacao: "Pago",
    },
    {
      id: 18,
      descricao: "Compra de material de construção",
      valorBruto: 450.0,
      valorPago: 450.0,
      dataVencimento: "2025-02-10",
      dataPagamento: "2025-02-08",
      categoria: "Manutenção",
      situacao: "Pago",
    },
    {
      id: 19,
      descricao: "Serviço de internet",
      valorBruto: 300.0,
      valorPago: 300.0,
      dataVencimento: "2025-02-20",
      dataPagamento: "2025-02-18",
      categoria: "Utilidades",
      situacao: "Pago",
    },
    {
      id: 20,
      descricao: "Compra de cadeiras para a sala de reunião",
      valorBruto: 2500.0,
      valorPago: 1250.0,
      dataVencimento: "2025-03-10",
      dataPagamento: "2025-03-08",
      categoria: "Escritório",
      situacao: "Parcialmente Pago",
    },
  ];   

const ContasPagarConsulta: React.FC = () => {
  const [data, setData] = useState<DataRow[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof DataRow>("dataVencimento");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("pt-BR", options);
  };  

  const sortedData = [...data].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (a[sortColumn] > b[sortColumn]) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const toggleSort = (column: keyof DataRow) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getStatusIcon = (situacao: string) => {
    switch (situacao) {
      case "Pago":
        return <FontAwesomeIcon icon={faCheck} className="text-green-500" />;
      case "Parcialmente Pago":
        return <FontAwesomeIcon icon={faCheck} className="text-blue-500" />;
      case "Pendente":
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
      case "Atrasado":
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full">
      <header className="w-full h-[9%] bg-green-900 text-white flex flex-col">
        <div className="flex justify-between items-center px-4 h-3/5">
            <div>
                <h1 className="font-semibold text-2xl">Contas a Pagar</h1>
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
                <div className="flex flex-row items-center justify-start cursor-pointer">
                    <FontAwesomeIcon icon={faFloppyDisk} size="sm" className="text-green-600 w-9" />
                    <p>Salvar</p>
                </div>
                <div className="flex flex-row items-center justify-start cursor-pointer">
                    <FontAwesomeIcon icon={faFileCirclePlus} size="sm" className="text-blue-600 w-9" />
                    <p>Novo</p>
                </div>
                <div className="flex flex-row items-center justify-start cursor-pointer">
                    <FontAwesomeIcon icon={faTrashCan} size="sm" className="text-red-600 w-9" />
                    <p>Excluir</p>
                </div>
            </div>
        </div>
      </header>
      <main className="w-full h-[91%] flex flex-col gap-8 p-3">
        <Table className="border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "35px" }} className="sticky-header">
                <Checkbox
                  checked={selectedIds.size === data.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedIds(new Set(data.map((row) => row.id)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                />
              </TableHead>
              <TableHead style={{ width: "250px" }}
                className="sticky-header cursor-pointer text-black font-semibold text-left"
                onClick={() => toggleSort("descricao")}
              >
                Descrição
                {sortColumn === "descricao" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead style={{ width: "200px" }}
                className="sticky-header cursor-pointer text-black font-semibold text-left"
                onClick={() => toggleSort("categoria")}
              >
                Categoria
                {sortColumn === "categoria" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead style={{ width: "170px" }}
                className="sticky-header cursor-pointer text-black font-semibold text-center"
                onClick={() => toggleSort("dataVencimento")}
              >
                Data de Vencimento
                {sortColumn === "dataVencimento" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead style={{ width: "170px" }}
                className="sticky-header cursor-pointer text-black font-semibold text-center"
                onClick={() => toggleSort("dataPagamento")}
              >
                Data de Pagamento
                {sortColumn === "dataPagamento" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead style={{ width: "150px" }}
                className="sticky-header cursor-pointer text-black font-semibold text-right"
                onClick={() => toggleSort("valorBruto")}
              >
                R$ Bruto
                {sortColumn === "valorBruto" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead style={{ width: "150px" }}
                className="sticky-header cursor-pointer text-black font-semibold text-right"
                onClick={() => toggleSort("valorPago")}
              >
                R$ Pago
                {sortColumn === "valorPago" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="sticky-header cursor-pointer text-black font-semibold text-left"
                onClick={() => toggleSort("situacao")}
              >
                Situação
                {sortColumn === "situacao" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="sticky-header text-black font-semibold text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(row.id)}
                    onCheckedChange={() => toggleSelect(row.id)}
                  />
                </TableCell>
                <TableCell className="text-left">{row.descricao}</TableCell>
                <TableCell className="text-left">{row.categoria}</TableCell>
                <TableCell className="text-center">{formatDate(row.dataVencimento)}</TableCell>
                <TableCell className="text-center">{formatDate(row.dataPagamento)}</TableCell>
                <TableCell className="text-right">{row.valorBruto.toFixed(2)}</TableCell>
                <TableCell className="text-right">{row.valorPago.toFixed(2)}</TableCell>
                <TableCell className="text-left">{row.situacao}</TableCell>
                <TableCell className="text-center">{getStatusIcon(row.situacao)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

export default ContasPagarConsulta;