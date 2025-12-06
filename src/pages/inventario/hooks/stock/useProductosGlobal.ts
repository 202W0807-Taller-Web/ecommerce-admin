import { useQuery } from "@tanstack/react-query";
import { getProductosStockGlobales } from "@services/inventario-envios/inventory/api/productos";
import type { Root } from "@services/inventario-envios/types/root";
import type { ProductoGlobal } from "@services/inventario-envios/inventory/types/producto";

export const useProductosGlobal = ({
  page,
  categoria,
  limit = 10,
}: {
  page: number;
  categoria?: string;
  limit?: number;
}) => {
  return useQuery<Root<ProductoGlobal>>({
    queryKey: ["productosGlobal", { page, categoria, limit }],
    queryFn: () => getProductosStockGlobales({ page, categoria, limit }),
  });
};
