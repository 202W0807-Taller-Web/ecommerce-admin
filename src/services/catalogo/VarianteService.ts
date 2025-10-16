import { fetchUrl } from "./api";
import type { Variante } from "../../types/catalogo/Variantes";

export const getVariantesByProductoId = async (id: number): Promise<Variante[]> => {
  return await fetchUrl<Variante[]>(`/api/variantes/productos/${id}/variantes`);
};

export const createVariante = async (
  productoId: number,
  formData: FormData
): Promise<Variante> => {
  const res = await fetch(`/api/variantes/productos/${productoId}/variantes`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error crear variante: ${res.status} ${t}`);
  }
  return res.json() as Promise<Variante>;
};
