import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { getVariantesByProductoId, createVariante } from "../../services/catalogo/VarianteService";
import type { Variante, NuevaVariante } from "../../types/catalogo/Variantes";

// GET
export const useVariantesByProducto = (productoId: number) =>
  useData<Variante[]>(() => getVariantesByProductoId(productoId), [
    productoId,
  ]);

// POST
export const useCreateVariante = (productoId: number) =>
  usePostData<NuevaVariante, Variante>(
    (input) => createVariante(productoId, input)
  );
