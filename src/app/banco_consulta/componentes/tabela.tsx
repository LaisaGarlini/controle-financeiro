import { selectBanco } from "@/lib/database/banco";
import { useEffect, useState } from "react";

export function TabelaTeste() {
    const [data, setData] = useState();

    const fetchData = async () => {
        try {
          const response = await fetch('/api/selectBanco');
          if (!response.ok) {
            throw new Error('Erro na requisição');
          }
          const result = await response.json();
          console.log("Dados recebidos: ", result);
          setData(result); // Atualize o estado com os dados
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      };
      

    // const fetchData = async () => {
    //     try {
    //       const response = await fetch('/api/selectBanco');
    //       console.log("response: ", response)
    //     //   const result = await response();
    //     //   setData(result);
    //     } catch (error) {
    //       console.error('Erro ao buscar dados:', error);
    //     }
    //   };
  
    
      useEffect(() => {
        fetchData(); // Chama a função para buscar os dados ao montar o componente
      }, []);
    
    return (
        <div>
            TabelaTeste
        </div>
    )
}