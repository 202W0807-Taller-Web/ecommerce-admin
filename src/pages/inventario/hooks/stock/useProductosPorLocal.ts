import { useQuery } from "@tanstack/react-query";
import { getProductosPorLocal } from "@services/inventario-envios/inventory/api/productos";
import type { Root } from "@services/inventario-envios/types/root";
import type { ProductoPorLocal } from "@services/inventario-envios/inventory/types/producto";

/**
 * Hook para obtener los productos con stock en un local (almacén o tienda)
 */
export const useProductosPorLocal = ({
  id_local,
  page,
  limit = 10,
}: {
  id_local: number;
  page: number;
  limit?: number;
}) => {
  return useQuery<Root<ProductoPorLocal>>({
    queryKey: ["productosPorLocal", id_local, page, limit],
    queryFn: () => getProductosPorLocal({ id_local, page, limit }),
    enabled: !!id_local,
    staleTime: 0,
  });
};
