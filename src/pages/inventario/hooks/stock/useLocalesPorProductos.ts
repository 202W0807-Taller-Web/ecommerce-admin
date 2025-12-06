import { useQuery } from "@tanstack/react-query";
import { getLocalesPorProducto } from "@services/inventario-envios/inventory/api/productos";
import type { Root } from "@services/inventario-envios/types/root";
import type { LocalPorProducto } from "@services/inventario-envios/inventory/types/producto";

/**
 * Hook para obtener los locales (almacenes o tiendas) donde hay stock de un producto
 */
export const useLocalesPorProducto = ({
  id_producto,
  page,
  limit = 10,
}: {
  id_producto: number;
  page: number;
  limit?: number;
}) => {
  return useQuery<Root<LocalPorProducto>>({
    queryKey: ["localesPorProducto", { id_producto, page, limit }],
    queryFn: () => getLocalesPorProducto({ id_producto, page, limit }),
    enabled: !!id_producto, // evita ejecutar si id_producto es falsy
  });
};
