import { TableHeader, TableCell, TableCellInfo } from "@components/Table";
import { StatusBadge } from "@components/Table";

interface MovimientoStock {
  id: number;
  fecha: string;
  motivo: string;
  tipo: "Ingreso" | "Retiro";
  cantidad: number;
  stock_resultante: number;
}

interface MovStockDataTableProps {
  data?: MovimientoStock[];
  page?: number;
  limit?: number;
  isLoading?: boolean;
  isError?: boolean;
}

const MovStockDataTable = ({
  data,
  page = 1,
  limit = 5,
  isLoading,
  isError,
}: MovStockDataTableProps) => {
  // Datos estáticos si no se pasan props
  const movimientos: MovimientoStock[] = data ?? [
    {
      id: 1,
      fecha: "2025-10-10",
      motivo: "Ingreso por compra a proveedor",
      tipo: "Ingreso",
      cantidad: 50,
      stock_resultante: 150,
    },
    {
      id: 2,
      fecha: "2025-10-11",
      motivo: "Retiro para venta en tienda",
      tipo: "Retiro",
      cantidad: -20,
      stock_resultante: 130,
    },
    {
      id: 3,
      fecha: "2025-10-12",
      motivo: "Ingreso por devolución",
      tipo: "Ingreso",
      cantidad: 10,
      stock_resultante: 140,
    },
    {
      id: 4,
      fecha: "2025-10-13",
      motivo: "Retiro por merma",
      tipo: "Retiro",
      cantidad: -5,
      stock_resultante: 135,
    },
  ];

  const columns = [
    { label: "#", key: "id", className: "w-12 text-center" },
    { label: "Fecha", key: "fecha" },
    { label: "Motivo", key: "motivo" },
    { label: "Tipo de movimiento", key: "tipo" },
    { label: "Cantidad", key: "cantidad" },
    { label: "Stock resultante", key: "stock_resultante" },
  ];

  return (
    <div className="w-full overflow-auto">
      <table className="overflow-visible min-w-[700px] w-full border-collapse mb-2 text-xs sm:text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <TableHeader
                key={idx}
                label={col.label}
                className={col.className}
              />
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <TableCellInfo
              className="animate-pulse"
              size={columns.length}
              content="Cargando movimientos ..."
            />
          ) : isError ? (
            <TableCellInfo
              size={columns.length}
              content="Ocurrió un error al cargar los datos"
            />
          ) : movimientos.length === 0 ? (
            <TableCellInfo
              size={columns.length}
              content="No hay movimientos registrados"
            />
          ) : (
            movimientos.map((mov, idx) => (
              <tr key={mov.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                <TableCell className="text-center">
                  {(page - 1) * limit + idx + 1}
                </TableCell>
                <TableCell>{mov.fecha}</TableCell>
                <TableCell>{mov.motivo}</TableCell>
                <TableCell className="text-center">
                  <StatusBadge
                    label={mov.tipo}
                    variant={mov.tipo === "Ingreso" ? "success" : "danger"}
                  />
                </TableCell>
                <TableCell
                  className={`text-center font-semibold ${
                    mov.tipo === "Ingreso" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {mov.cantidad > 0 ? `+${mov.cantidad}` : mov.cantidad}
                </TableCell>
                <TableCell className="text-center">
                  {mov.stock_resultante}
                </TableCell>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MovStockDataTable;
