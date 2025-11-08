import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { usePutData } from "@hooks/general/usePutData";
import { useDeleteData } from "@hooks/general/useDeleteData";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../../services/catalogo/ProductoService";
import type { Producto } from "../../types/catalogo/Productos";

// GET
export const useProductos = () => useData<Producto[]>(getProductos, []);

export const useProductoById = (id: number) =>
  useData<Producto>(() => getProductoById(id), [id]);

// POST
export const useCreateProducto = () =>
  usePostData<FormData, Producto>(createProducto);

// PUT
export const useUpdateProducto = (id: number) =>
  usePutData<FormData, Producto>((fd) => updateProducto(id, fd));

// DELETE
export const useDeleteProducto = () =>
  useDeleteData<number>((id) => deleteProducto(id));
