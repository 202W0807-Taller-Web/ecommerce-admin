import { useQuery } from "@tanstack/react-query";
import { getAlmacen } from "@services/inventario-envios/local/api/almacenes";
import { getTienda } from "@services/inventario-envios/local/api/tiendas";
import type { RootSingleData } from "@services/inventario-envios/types/root";
import type { LocalListItem } from "@services/inventario-envios/local/types/local";

interface UseLocalParams {
  local: "almacenes" | "tiendas";
  id: number;
  enabled?: boolean;
}

const queryFns = {
  almacenes: getAlmacen,
  tiendas: getTienda,
} as const;

export const useLocal = ({ local, id, enabled = true }: UseLocalParams) => {
  const queryFn = () => {
    const fn = queryFns[local];
    if (!fn) throw new Error(`Tipo de local no soportado: ${local}`);
    return fn(id);
  };

  return useQuery<RootSingleData<LocalListItem>>({
    queryKey: [local, "detail", id],
    queryFn,
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
