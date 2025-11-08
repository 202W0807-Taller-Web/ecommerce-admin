import { Eye } from "lucide-react";
import {
  TableHeader,
  TableCell,
  TableCellInfo,
  ActionMenuCell,
} from "@components/Table";
import { StatusBadge } from "@components/Table";
import type { ProductoGlobal } from "@services/inventario-envios/inventory/types/producto";

interface StockDataTableProps {
  data?: ProductoGlobal[];
  page: number;
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
  getRowKey?: (item: ProductoGlobal) => string | number;
  getActions?: (item: ProductoGlobal) => any[];
}

const StockDataTable = ({
  data,
  page,
  limit,
  isLoading,
  isError,
  getRowKey = item => item.id,
  getActions,
}: StockDataTableProps) => {
  // Ejemplo data
  const defaultData: ProductoGlobal[] = [
    {
      id: 1,
      nombre: "Camisa Polo Azul",
      imagen: "https://i.ibb.co/Np8VbVv/producto-ropa.jpg",
      stk_disponible_global: 25,
      stk_reservado_global: 5,
      stk_total_global: 30,
      stk_estado_global: "DISPONIBLE",
    },
    {
      id: 2,
      nombre: "Camisa Polo Rojo",
      imagen: "https://i.ibb.co/Np8VbVv/producto-ropa.jpg",
      stk_disponible_global: 25,
      stk_reservado_global: 5,
      stk_total_global: 30,
      stk_estado_global: "BAJO STOCK",
    },
  ];

  const stockData = data ?? defaultData;

  const columns: {
    label: string;
    key: keyof ProductoGlobal;
    className?: string;
    render?: (item: ProductoGlobal, index: number) => React.ReactNode;
  }[] = [
    {
      label: "#",
      key: "id",
      className: "w-12 text-center",
      render: (_: ProductoGlobal, idx: number) => (page - 1) * limit + idx + 1,
    },
    {
      label: "Imagen",
      key: "imagen",
      className: "w-16 text-center",
      render: (item: ProductoGlobal) => (
        <div className="relative flex justify-center items-center group">
          <img
            src={
              item.imagen || "https://i.ibb.co/6Y9G7mP/no-image-placeholder.png"
            }
            alt={item.nombre}
            className="w-8 h-8 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        </div>
      ),
    },
    { label: "Producto", key: "nombre" },
    {
      label: "Stck. Disponible",
      key: "stk_disponible_global",
      className: "text-right",
    },
    {
      label: "Stck. Reservado",
      key: "stk_reservado_global",
      className: "text-right",
    },
    {
      label: "Stck. Total",
      key: "stk_total_global",
      className: "text-right",
    },
    {
      label: "Estado",
      key: "stk_estado_global",
      className: "text-center",
      render: (item: ProductoGlobal) => {
        const variant =
          item.stk_estado_global === "DISPONIBLE"
            ? "success"
            : item.stk_estado_global === "BAJO STOCK"
              ? "warning"
              : "danger";
        return <StatusBadge label={item.stk_estado_global} variant={variant} />;
      },
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <table className="overflow-visible min-w-[800px] w-full border-collapse mb-2 text-xs sm:text-sm">
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
              content="Ocurrió un error al cargar los datos"
            />
          ) : stockData.length === 0 ? (
            <TableCellInfo
              size={columns.length + 1}
              content="No hay resultados para la búsqueda"
            />
          ) : (
            stockData.map((item, idx) => (
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
                            onClick: () => console.log("Ver", item),
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

export default StockDataTable;
