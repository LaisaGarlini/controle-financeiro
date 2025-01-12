"use client";

import React, { useEffect, useState } from "react";
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
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Header from "../../components/header";

interface DataRow {
  id: number;
  nome: string;
  tipo: number;
}

const ContasPagarConsulta: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof DataRow>("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categoria");
        if (!response.ok) {
          throw new Error("Erro ao buscar dados da API");
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    console.log("selectedIds", selectedIds);
    if (selectedIds.size === 0) {
      alert("Selecione ao menos uma categoria para excluir.");
      return;
    }

    const confirmDelete = window.confirm(
      "Você tem certeza que deseja excluir as categorias selecionadas?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/categoria", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir categorias.");
      }

      const remainingData = data.filter((row) => !selectedIds.has(row.id));
      setData(remainingData);
      setSelectedIds(new Set());
      alert("Categorias excluídas com sucesso.");
    } catch (error: any) {
      console.error(error.message);
      alert(error.message || "Erro desconhecido ao excluir categorias.");
    }
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

  return (
    <div className="h-screen w-full">
      <Header isConsultaScreen={true} title="Categorias" userName="Domingos" companyName="DELL Transportes" novo="categoria_cadastro" />
      <main className="w-full h-[91%] flex flex-col gap-8 p-3">
        {loading ? (
          <p>Carregando dados...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
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
                <TableHead
                  style={{ width: "200px" }}
                  className="sticky-header cursor-pointer text-black font-semibold text-right"
                  onClick={() => toggleSort("id")}
                >
                  Código
                  {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="sticky-header cursor-pointer text-black font-semibold text-left"
                  onClick={() => toggleSort("nome")}
                >
                  Nome
                  {sortColumn === "nome" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead colSpan={2}
                  className="sticky-header cursor-pointer text-black font-semibold text-left"
                  onClick={() => toggleSort("tipo")}
                >
                  Tipo
                  {sortColumn === "tipo" && (sortDirection === "asc" ? "↑" : "↓")}
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
                  <TableCell className="text-right">{row.id}</TableCell>
                  <TableCell className="text-left">{row.nome}</TableCell>
                  <TableCell className="text-left">
                    {row.tipo === 1 ? "Entrada" : "Saída"}
                  </TableCell>
                  <TableCell className="text-center">
                    <FontAwesomeIcon
                      icon={row.tipo === 1 ? faArrowDown : faArrowUp}
                      className={row.tipo === 1 ? "text-green-600" : "text-red-600"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  );
};

export default ContasPagarConsulta;