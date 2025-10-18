import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAlmacen } from "@services/inventario-envios/local/api/almacenes";
import { deleteTienda } from "@services/inventario-envios/local/api/tiendas";
import type { RootSingleData } from "@services/inventario-envios/types/root";

const mutationFns = {
  almacenes: deleteAlmacen,
  tiendas: deleteTienda,
} as const;

export const useDeleteLocal = (local: "almacenes" | "tiendas") => {
  const queryClient = useQueryClient();

  return useMutation<RootSingleData<{ id: number }>, Error, number>({
    mutationFn: id => {
      const fn = mutationFns[local];
      if (!fn) throw new Error(`Tipo de local no soportado: ${local}`);
      return fn(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [local] });
    },
  });
};
