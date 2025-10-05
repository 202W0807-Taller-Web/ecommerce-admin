import API from "./api";
import type { AlmacenResponse, Meta, Almacen } from "../types/almacen";

export const getAlmacenes = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<{
  almacenes: Almacen[];
  meta: Meta;
}> => {
  const response = await API.get<AlmacenResponse>("/api/almacenes", {
    params: { page, per_page: limit },
  });

  const almacenes = response.data.data.map(item => ({
    id: item.id,
    imagen: item.imagen,
    nombre: item.nombre,
    estado: item.estado,
    direccion: item.direccion.referencia,
    distrito: item.direccion.distrito.nombre,
    provincia: item.direccion.distrito.provincia.nombre,
    departamento: item.direccion.distrito.provincia.departamento.nombre,
  }));

  return { almacenes, meta: response.data.meta };
};

export const createAlmacen = async (
  almacen: Omit<Almacen, "id">
): Promise<Almacen> => {
  const { data } = await API.post<Almacen>("/almacenes", almacen);
  return data;
};
