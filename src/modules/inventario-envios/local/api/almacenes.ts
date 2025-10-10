import API from "./api";
import type { Root } from "../types/pagination";
import type { Almacen, AlmacenBackend } from "../types/almacen";

export const getAlmacenes = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<Root<Almacen>> => {
  const response = await API.get<Root<AlmacenBackend>>("/locales", {
    params: {
      page,
      per_page: limit,
    },
  });

  const { success, data, pagination } = response.data;

  const transformedData: Almacen[] = data.map(almacen => ({
    id: almacen.id,
    imagen: almacen.imagen,
    nombre: almacen.nombre,
    estado: almacen.estado,
    direccion: almacen.direccion?.referencia ?? "",
    distrito: almacen.direccion?.distrito?.nombre ?? "",
    provincia: almacen.direccion?.distrito?.provincia?.nombre ?? "",
    departamento:
      almacen.direccion?.distrito?.provincia?.departamento?.nombre ?? "",
  }));

  return {
    success,
    data: transformedData,
    pagination,
  };
};
