import { useQuery } from "@tanstack/react-query";
import { getAlmacenes } from "@services/inventario-envios/local/api/almacenes";
import { getTiendas } from "@services/inventario-envios/local/api/tiendas";
import type { Root } from "@services/inventario-envios/types/root";
import type { LocalListItem } from "@services/inventario-envios/local/types/local";

interface UseLocalesParams {
  local: "almacenes" | "tiendas";
  page?: number;
  limit?: number;
  nombre?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

const queryFns = {
  almacenes: getAlmacenes,
  tiendas: getTiendas,
} as const;

export const useLocales = ({
  local,
  page = 1,
  limit = 4,
  nombre = "",
  departamento = "",
  provincia = "",
  distrito = "",
}: UseLocalesParams) => {
  const queryFn = () => {
    const fn = queryFns[local];
    if (!fn) throw new Error(`Tipo de local no soportado: ${local}`);
    return fn({ page, limit, nombre, departamento, provincia, distrito });
  };

  return useQuery<Root<LocalListItem>>({
    queryKey: [
      local,
      { page, limit, nombre, departamento, provincia, distrito },
    ],
    queryFn,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
