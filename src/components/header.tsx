"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faArrowLeft, faFileCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isConsultaScreen: boolean;
  title: string;
  userName: string;
  companyName: string;
  novo?: string;
  onNewClick?: () => void;
  onDeleteClick?: () => void;
}

export default function Header({
  isConsultaScreen,
  title,
  userName,
  companyName,
  novo,
  onNewClick,
  onDeleteClick
}: HeaderProps) {
  const router = useRouter();

  const handleNewClick = () => {
    if (novo) {
      router.push(novo);
    } else {
      console.warn("Caminho para 'novo' não foi especificado.");
    }
  };

  return (
    <header className={`w-full h-[9%] bg-green-900 text-white ${
        isConsultaScreen 
          ? 'flex flex-col' 
          : 'flex justify-between items-center px-4'
      }`}>
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
            <div className="flex flex-row items-center justify-start cursor-pointer" onClick={() => router.back()}>
              <FontAwesomeIcon icon={faArrowLeft} size="sm" className="text-white w-9" />
              <p>Voltar</p>
            </div>
            <div
              className="flex flex-row items-center justify-start cursor-pointer"
              onClick={handleNewClick}
            >
              <FontAwesomeIcon icon={faFileCirclePlus} size="sm" className="text-blue-600 w-9" />
              <p>Novo</p>
            </div>
            <div
              className="flex flex-row items-center justify-start cursor-pointer"
              onClick={onDeleteClick}
            >
              <FontAwesomeIcon icon={faTrashCan} size="sm" className="text-red-600 w-9" />
              <p>Excluir</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}