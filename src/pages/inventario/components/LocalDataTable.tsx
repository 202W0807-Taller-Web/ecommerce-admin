import { useNavigate } from "react-router-dom";
import { TableHeader, TableCell, ActionMenuCell } from "@components/Table";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Column<T> {
  label: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface LocalDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  resourceName: string;
  getRowKey?: (item: T) => string | number;
  getActions?: (item: T) => any[];
  isLoading?: boolean;
  isError?: boolean;
}

const TableCellInfo = ({
  size,
  content,
}: {
  size: number;
  content: string;
}) => {
  return (
    <tr>
      <td
        colSpan={size}
        className="text-center py-6 text-gray-500 italic border border-stroke"
      >
        {content}
      </td>
    </tr>
  );
};

const LocalDataTable = <T extends Record<string, any>>({
  data,
  columns,
  resourceName,
  getRowKey = item => item.id,
  getActions,
  isLoading,
  isError,
}: LocalDataTableProps<T>) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-auto">
      <table className="overflow-visible min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <TableHeader
                key={idx}
                label={col.label}
                className={col.className}
              />
            ))}
            <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <TableCellInfo
              size={columns.length + 1}
              content="Cargando datos ..."
            />
          ) : isError ? (
            <TableCellInfo
              size={columns.length + 1}
              content="Ocurrio un error al cargar los datos"
            />
          ) : data.length === 0 ? (
            <TableCellInfo
              size={columns.length + 1}
              content="No hay resultados para la búsqueda"
            />
          ) : (
            data.map((item, idx) => (
              <tr
                key={getRowKey(item)}
                className={idx % 2 ? "bg-gray-50" : "bg-white"}
              >
                {columns.map((col, colIdx) => (
                  <TableCell key={colIdx} className={col.className}>
                    {col.render ? col.render(item) : (item[col.key] as any)}
                  </TableCell>
                ))}

                <ActionMenuCell
                  buttons={
                    getActions
                      ? getActions(item)
                      : [
                          {
                            label: "Ver detalles",
                            icon: <Eye className="w-4 h-4 text-blue-600" />,
                            onClick: () => navigate(`${item.id}`),
                          },
                          {
                            label: "Actualizar",
                            icon: <Pencil className="w-4 h-4 text-primary1" />,
                            onClick: () =>
                              console.log(
                                `Actualizar ${resourceName}: ${item.nombre}`
                              ),
                          },
                          {
                            label: "Eliminar",
                            icon: <Trash2 className="w-4 h-4 text-red-600" />,
                            onClick: () =>
                              alert(`Eliminar ${resourceName}: ${item.nombre}`),
                          },
                        ]
                  }
                />
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LocalDataTable;
