import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlmacen } from "@services/inventario-envios/local/api/almacenes";
import { createTienda } from "@services/inventario-envios/local/api/tiendas";
import type {
  LocalBody,
  LocalListItem,
} from "@services/inventario-envios/local/types/local";
import type { RootSingleData } from "@services/inventario-envios/types/root";

const mutationFns = {
  almacenes: createAlmacen,
  tiendas: createTienda,
} as const;

export const useCreateLocal = (local: "almacenes" | "tiendas") => {
  const queryClient = useQueryClient();

  return useMutation<
    RootSingleData<LocalListItem>,
    Error,
    Omit<LocalBody, "id_tipo_local">
  >({
    mutationFn: data => {
      const fn = mutationFns[local];
      if (!fn) throw new Error(`Tipo de local no soportado: ${local}`);
      return fn(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [local] });
    },
  });
};
