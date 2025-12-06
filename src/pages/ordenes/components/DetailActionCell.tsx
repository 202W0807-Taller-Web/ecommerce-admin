import { useNavigate } from "react-router-dom";
import React from "react";
import { TableCell }  from "@components/Table" ;
import { Search } from "lucide-react";

const DetailActionCell = ({ idOrden }: { idOrden: string }) => {
  const navigate = useNavigate();
  const handleClick = () => { navigate(`/ordenes/${idOrden}`); };
  return (
    <TableCell className="w-10 min-w-[40px] text-center">
      <button type="button" onClick={handleClick} className="inline-flex items-center justify-center p-1 text-gray-500 hover:text-blue-500 transition duration-150" title={`ver detalles de la orden #${idOrden}`}>
        <Search className="h-5 w-5" />
      </button>
    </TableCell>
  );
};

export default DetailActionCell;
