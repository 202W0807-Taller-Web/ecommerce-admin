import React from "react";
import { Eye } from "lucide-react";
import {
  TableHeader,
  TableCell,
  TableCellInfo,
  ActionMenuCell,
  StatusBadge,
} from "@components/Table";
import type {
  ProductoGlobal,
  ProductoPorLocal,
  LocalPorProducto,
} from "@services/inventario-envios/inventory/types/producto";

type StockVariant = "global" | "por-local" | "por-producto";

type Column<T = any> = {
  label: string;
  key: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
};

interface StockDataTableProps<T> {
  data?: T[];
  page: number;
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
  variant: StockVariant;
  getRowKey?: (item: T, index?: number) => string | number;
  getActions?: (item: T) => any[];
}

const StockDataTable = <
  T extends ProductoGlobal | ProductoPorLocal | LocalPorProducto,
>({
  data,
  page,
  limit,
  isLoading = false,
  isError = false,
  variant,
  getRowKey,
  getActions,
}: StockDataTableProps<T>) => {
  // fallback visual data (solo para cuando no hay data)
  const defaultData: ProductoGlobal[] = [
    {
      id: 1,
      nombre: "Producto demo",
      imagen: "https://i.ibb.co/6Y9G7mP/no-image-placeholder.png",
      stk_disponible_global: 10,
      stk_reservado_global: 2,
      stk_total_global: 12,
      stk_estado_global: "DISPONIBLE",
    },
  ];

  const stockData = (data ?? defaultData).slice(0) as T[];

  // Columns dinámicas según variant
  const getColumns = (): Column<T>[] => {
    if (variant === "global") {
      return [
        { label: "Id", key: "id" },
        { label: "Producto", key: "nombre" },
        { label: "Stck. Disponible", key: "stk_disponible_global" },
        { label: "Stck. Reservado", key: "stk_reservado_global" },
        { label: "Stck. Total", key: "stk_total_global" },
        {
          label: "Estado",
          key: "stk_estado_global",
          render: (item: any) => {
            const estado = item.stk_estado_global ?? "SIN ESTADO";
            const v =
              estado === "DISPONIBLE"
                ? "success"
                : estado === "BAJO STOCK"
                  ? "warning"
                  : "danger";
            return <StatusBadge label={estado} variant={v} />;
          },
        },
      ];
    }

    if (variant === "por-local") {
      return [
        { label: "Id", key: "id_producto" },
        { label: "Producto", key: "producto" },
        { label: "Stck. Disponible", key: "stk_disponible" },
        { label: "Stck. Reservado", key: "stk_reservado" },
        { label: "Stck. Total", key: "stk_total" },
        {
          label: "Estado",
          key: "stk_estado",
          render: (item: any) => {
            const estado = item.stk_estado ?? "SIN ESTADO";
            const v =
              estado === "DISPONIBLE"
                ? "success"
                : estado === "BAJO STOCK"
                  ? "warning"
                  : "danger";
            return <StatusBadge label={estado} variant={v} />;
          },
        },
      ];
    }

    // por-producto
    return [
      { label: "Id", key: "id_almacen" },
      { label: "Local", key: "local" },
      { label: "Stck. Disponible", key: "stk_disponible" },
      { label: "Stck. Reservado", key: "stk_reservado" },
      { label: "Stck. Total", key: "stk_total" },
      {
        label: "Estado",
        key: "stk_estado",
        render: (item: any) => {
          const estado = item.stk_estado ?? "SIN ESTADO";
          const v =
            estado === "DISPONIBLE"
              ? "success"
              : estado === "BAJO STOCK"
                ? "warning"
                : "danger";
          return <StatusBadge label={estado} variant={v} />;
        },
      },
    ];
  };

  const dynamicColumns = getColumns();

  // Columnas base (index + imagen) + dinámicas
  const columns: Column<T>[] = [
    {
      label: "#",
      key: "index",
      className: "w-12 text-center",
      render: (_: T, idx: number) => (page - 1) * limit + idx + 1,
    },
    {
      label: "Imagen",
      key: "imagen",
      className: "w-16 text-center",
      render: (item: any) => (
        <div className="relative flex justify-center items-center group">
          <img
            src={
              item?.imagen ??
              "https://i.ibb.co/6Y9G7mP/no-image-placeholder.png"
            }
            alt={
              (item?.nombre ??
                item?.producto ??
                item?.local ??
                "imagen") as string
            }
            className="w-8 h-8 rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
        </div>
      ),
    },
    ...dynamicColumns,
  ];

  // Default getRowKey
  const rowKeyFn =
    getRowKey ??
    ((item: any, idx?: number) => {
      // intenta claves conocidas
      return (
        item?.id ??
        item?.id_producto ??
        item?.id_almacen ??
        idx ??
        JSON.stringify(item)
      );
    });

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
            stockData.map((item: any, idx: number) => (
              <tr
                key={rowKeyFn(item, idx)}
                className={idx % 2 ? "bg-gray-50" : "bg-white"}
              >
                {columns.map((col, colIdx) => (
                  <TableCell key={colIdx} className={col.className}>
                    {col.render
                      ? col.render(item, idx)
                      : (item as any)[col.key]}
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
