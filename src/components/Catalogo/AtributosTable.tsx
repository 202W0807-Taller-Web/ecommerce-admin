import React from "react";
import { Pencil } from "lucide-react";

interface Atributo {
  id: number;
  imagen: string;
  atributo: string;
  cantidad: number;
}

interface AtributosTableProps {
  atributos: Atributo[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onSelectAll: () => void;
}

const AtributosTable: React.FC<AtributosTableProps> = ({
  atributos,
  selectedIds,
  onSelect,
  onSelectAll,
}) => {
  const allSelected =
    selectedIds.length === atributos.length && atributos.length > 0;

  return (
    <div className="w-full bg-gray-50 p-6 rounded-2xl shadow-sm">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="accent-gray-500 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">
              Imagen
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">
              Atributo
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">
              Cantidad
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {atributos.map((a) => (
            <tr
              key={a.id}
              className="bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(a.id)}
                  onChange={() => onSelect(a.id)}
                  className="accent-gray-500 cursor-pointer"
                />
              </td>
              <td className="py-3 px-4">
                <img
                  src={a.imagen}
                  alt={a.atributo}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="py-3 px-4 text-gray-800 font-medium">
                {a.atributo}
              </td>
              <td className="py-3 px-4 text-gray-700 font-semibold">
                {a.cantidad}
              </td>
              <td className="py-3 px-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Pencil className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </td>
            </tr>
          ))}

          {atributos.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center text-gray-500 py-6 italic"
              >
                No se encontraron atributos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AtributosTable;
