import API from "./api";
import type { Root } from "../../types/root";
import type {
  ProductoGlobal,
  ProductoPorLocal,
  LocalPorProducto,
} from "../types/producto";

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

/** Obtener productos que están en un local (almacén / tienda) */
export const getProductosPorLocal = async ({
  id_local,
  page,
  limit,
}: {
  id_local: number;
  page: number;
  limit?: number;
}): Promise<Root<ProductoPorLocal>> => {
  const response = await API.get<Root<ProductoPorLocal>>(
    `/productos/almacen/${id_local}`,
    { params: { PageNumber: page, PageSize: limit } }
  );
  return response.data;
};

/** Obtener locales (almacenes/tiendas) con stock de un producto */
export const getLocalesPorProducto = async ({
  id_producto,
  page,
  limit,
}: {
  id_producto: number;
  page: number;
  limit?: number;
}): Promise<Root<LocalPorProducto>> => {
  const response = await API.get<Root<LocalPorProducto>>(
    `/productos/${id_producto}`,
    { params: { PageNumber: page, PageSize: limit } }
  );
  return response.data;
};

export const uploadProductosFromCsv = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/productos/upload-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
