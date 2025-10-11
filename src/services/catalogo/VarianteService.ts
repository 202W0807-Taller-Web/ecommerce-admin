import { fetchUrl } from "./api";
import type { NuevaVariante, Variante } from "../../types/catalogo/Variantes";

export const getVariantesByProductoId = async (id: number): Promise<Variante[]> => {
  return await fetchUrl<Variante[]>(`/api/variantes/productos/${id}/variantes`);
};

export const createVariante = async (
  id: number,
  data: NuevaVariante
): Promise<Variante> => {
  return await fetchUrl<Variante>(`/api/variantes/productos/${id}/variantes`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
