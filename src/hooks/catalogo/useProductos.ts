import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { getProductos, getProductoById, createProducto } from "../../services/catalogo/ProductoService";
import type { Producto } from "../../types/catalogo/Productos";

// GET
export const useProductos = () => useData<Producto[]>(getProductos, []);

export const useProductoById = (id: number) =>
  useData<Producto>(() => getProductoById(id), [id]);

// POST
export const useCreateProducto = () =>
  usePostData<FormData, Producto>(createProducto);
