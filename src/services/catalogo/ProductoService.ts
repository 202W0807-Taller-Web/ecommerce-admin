import { fetchUrl } from "./api";
import type { Producto, NuevoProducto } from "../../types/catalogo/Productos";

export const getProductos = async (): Promise<Producto[]> => {
  return await fetchUrl<Producto[]>("/api/productos");
};

export const createProducto = async (data: NuevoProducto): Promise<Producto> => {
  return await fetchUrl<Producto>("/api/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getProductoById = async (id: number): Promise<Producto> => {
  return await fetchUrl<Producto>(`/api/productos/${id}`);
};
