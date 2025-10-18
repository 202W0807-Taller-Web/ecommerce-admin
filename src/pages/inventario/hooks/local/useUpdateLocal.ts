import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAlmacen } from "@services/inventario-envios/local/api/almacenes";
import { updateTienda } from "@services/inventario-envios/local/api/tiendas";
import type {
  LocalUpdateBody,
  LocalListItem,
} from "@services/inventario-envios/local/types/local";
import type { RootSingleData } from "@services/inventario-envios/types/root";

const mutationFns = {
  almacenes: updateAlmacen,
  tiendas: updateTienda,
} as const;

export const useUpdateLocal = (local: "almacenes" | "tiendas") => {
  const queryClient = useQueryClient();

  return useMutation<
    RootSingleData<LocalListItem>,
    Error,
    { id: number; data: Omit<LocalUpdateBody, "id_tipo_local"> }
  >({
    mutationFn: ({ id, data }) => {
      const fn = mutationFns[local];
      if (!fn) throw new Error(`Tipo de local no soportado: ${local}`);
      return fn(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [local] }); // refresca lista
      queryClient.invalidateQueries({ queryKey: [local, "detail", id] }); // refresca detalle
    },
  });
};
