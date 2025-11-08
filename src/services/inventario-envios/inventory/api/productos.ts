import API from "./api";
import type { Root } from "../../types/root";
import type { ProductoGlobal } from "../types/producto";

export const getProductosStockGlobales = async ({
  page,
  categoria,
  limit,
}: {
  page: number;
  categoria?: string;
  limit?: number;
}): Promise<Root<ProductoGlobal>> => {
  const response = await API.get<Root<ProductoGlobal>>(`/productos`, {
    params: { PageNumber: page, Categoria: categoria, PageSize: limit },
  });
  return response.data;
};
