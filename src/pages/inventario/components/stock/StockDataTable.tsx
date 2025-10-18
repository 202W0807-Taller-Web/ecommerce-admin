import { Eye } from "lucide-react";
import {
  TableHeader,
  TableCell,
  TableCellInfo,
  ActionMenuCell,
} from "@components/Table";
import { StatusBadge } from "@components/Table";

export interface StockListItem {
  id: number;
  imagen?: string;
  sku: string;
  producto: string;
  categoria: string;
  stock_disponible: number;
  stock_reservado: number;
  stock_total: number;
  estado: "DISPONIBLE" | "BAJO STOCK" | "CERO";
}

interface StockDataTableProps {
  data?: StockListItem[];
  page: number;
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
  getRowKey?: (item: StockListItem) => string | number;
  getActions?: (item: StockListItem) => any[];
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
  const defaultData: StockListItem[] = [
    {
      id: 1,
      sku: "SKU-001",
      producto: "Camisa Polo Azul",
      categoria: "Ropa Hombre",
      imagen: "https://i.ibb.co/Np8VbVv/producto-ropa.jpg",
      stock_disponible: 25,
      stock_reservado: 5,
      stock_total: 30,
      estado: "DISPONIBLE",
    },
    {
      id: 2,
      sku: "SKU-002",
      producto: "Zapatillas Urbanas",
      categoria: "Calzado",
      imagen: "https://i.ibb.co/6FRm7Y3/zapatillas.jpg",
      stock_disponible: 4,
      stock_reservado: 1,
      stock_total: 5,
      estado: "BAJO STOCK",
    },
    {
      id: 3,
      sku: "SKU-003",
      producto: "Pantalón Jeans Negro",
      categoria: "Ropa Hombre",
      imagen: "https://i.ibb.co/8Nv94DH/jeans.jpg",
      stock_disponible: 0,
      stock_reservado: 0,
      stock_total: 0,
      estado: "CERO",
    },
  ];

  const stockData = data ?? defaultData;

  const columns: {
    label: string;
    key: keyof StockListItem;
    className?: string;
    render?: (item: StockListItem, index: number) => React.ReactNode;
  }[] = [
    {
      label: "#",
      key: "id",
      className: "w-12 text-center",
      render: (_: StockListItem, idx: number) => (page - 1) * limit + idx + 1,
    },
    {
      label: "Imagen",
      key: "imagen",
      className: "w-16 text-center",
      render: (item: StockListItem) => (
        <div className="relative flex justify-center items-center group">
          <img
            src={
              item.imagen || "https://i.ibb.co/6Y9G7mP/no-image-placeholder.png"
            }
            alt={item.producto}
            className="w-8 h-8 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        </div>
      ),
    },
    { label: "SKU", key: "sku" },
    { label: "Producto", key: "producto" },
    { label: "Categoría", key: "categoria" },
    {
      label: "Stck. Disponible",
      key: "stock_disponible",
      className: "text-right",
    },
    {
      label: "Stck. Reservado",
      key: "stock_reservado",
      className: "text-right",
    },
    {
      label: "Stck. Total",
      key: "stock_total",
      className: "text-right",
    },
    {
      label: "Estado",
      key: "estado",
      className: "text-center",
      render: (item: StockListItem) => {
        const variant =
          item.estado === "DISPONIBLE"
            ? "success"
            : item.estado === "BAJO STOCK"
              ? "warning"
              : "danger";
        return <StatusBadge label={item.estado} variant={variant} />;
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
