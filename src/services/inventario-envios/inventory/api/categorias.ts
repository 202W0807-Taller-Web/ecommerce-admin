import API from "./api";
import type { Categoria } from "../types/categoria";

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await API.get<{ success: boolean; data: Categoria[] }>(
    "/productos/categorias"
  );
  return response.data.data;
};
