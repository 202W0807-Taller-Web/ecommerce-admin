import { fetchUrl } from "./api";
import type { Producto } from "../../types/catalogo/Productos";

export const getProductos = async (): Promise<Producto[]> => {
  return await fetchUrl<Producto[]>("/api/productos");
};

export const createProducto = async (formData: FormData): Promise<Producto> => {
  const res = await fetch("/api/productos", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear producto: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json as Producto;
};

export const getProductoById = async (id: number): Promise<Producto> => {
  return await fetchUrl<Producto>(`/api/productos/${id}`);
};
