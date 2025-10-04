import API from "./api";
import type { Producto } from "../types/producto";

export const getProductos = async (): Promise<Producto[]> => {
  const { data } = await API.get<Producto[]>("/productos");
  return data;
};
