import { useNavigate } from "react-router-dom";
import {
  TableHeader,
  TableCellInfo,
  TableCell,
  StatusBadge,
  ActionMenuCell,
} from "@components/Table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { LocalListItem } from "@services/inventario-envios/local/types/local";

interface LocalDataTableProps {
  data: LocalListItem[];
  page: number;
  limit: number;
  resourceName: "almacenes" | "tiendas";
  isLoading?: boolean;
  isError?: boolean;
  getRowKey?: (item: LocalListItem) => string | number;
  getActions?: (item: LocalListItem) => any[];
}

const LocalDataTable = ({
  data,
  page,
  limit,
  resourceName,
  getRowKey = item => item.id,
  getActions,
  isLoading,
  isError,
}: LocalDataTableProps) => {
  const navigate = useNavigate();

  const columns: {
    label: string;
    key: keyof LocalListItem;
    className?: string;
    render?: (item: LocalListItem, index: number) => React.ReactNode;
  }[] = [
    {
      label: "#",
      key: "id",
      className: "w-12 text-center",
      render: (_: LocalListItem, idx: number) => (page - 1) * limit + idx + 1,
    },
    {
      label: "Imagen",
      key: "imagen",
      className: "w-16 text-center",
      render: (local: LocalListItem) => (
        <div className="relative flex justify-center items-center group">
          <img
            src={
              local.imagen ||
              (resourceName === "almacenes"
                ? "https://i.ibb.co/LhsjTdTM/almacen.jpg"
                : "https://i.ibb.co/67pNqs5D/tienda.jpg")
            }
            alt={local.nombre}
            className="w-8 h-8 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        </div>
      ),
    },
    { label: "Nombre", key: "nombre" },
    {
      label: "Estado",
      key: "estado",
      render: (local: LocalListItem) => (
        <StatusBadge
          label={local.estado}
          variant={local.estado === "ACTIVO" ? "success" : "danger"}
        />
      ),
    },
    {
      label: "Direccion",
      key: "direccion",
      render: (local: LocalListItem) => local.direccion ?? "",
    },
    {
      label: "Distrito",
      key: "distrito",
      render: (local: LocalListItem) => local.distrito?.nombre ?? "",
    },
    {
      label: "Provincia",
      key: "provincia",
      render: (local: LocalListItem) => local.provincia?.nombre ?? "",
    },
    {
      label: "Departamento",
      key: "departamento",
      render: (local: LocalListItem) => local.departamento?.nombre ?? "",
    },
  ];

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
              className="animate-pulse"
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
                    {col.render
                      ? col.render(item, idx)
                      : (item[col.key] as any)}
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
                            onClick: () =>
                              navigate(
                                `/inventario/${resourceName}/${item.id}`
                              ),
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
