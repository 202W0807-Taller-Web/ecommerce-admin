import API from "./api";
import type { Root } from "../types/pagination";
import type { Almacen, AlmacenBackend } from "../types/almacen";

const recurso = "/locales";

export const getAlmacenes = async ({
  page,
  limit,
  nombre,
  departamento,
  provincia,
  distrito,
}: {
  page: number;
  limit: number;
  nombre: string;
  departamento: string;
  provincia: string;
  distrito: string;
}): Promise<Root<Almacen>> => {
  const response = await API.get<Root<AlmacenBackend>>(recurso, {
    params: {
      page,
      per_page: limit,
      nombre,
      departamento,
      provincia,
      distrito,
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

export const getAlmacen = async (id: number): Promise<Almacen> => {
  const response = await API.get<{ success: boolean; data: AlmacenBackend }>(
    `${recurso}/${id}`
  );

  const { data } = response.data;

  const transformedData: Almacen = {
    id: data.id,
    imagen: data.imagen,
    nombre: data.nombre,
    estado: data.estado,
    direccion: data.direccion?.referencia ?? "",
    distrito: data.direccion?.distrito?.nombre ?? "",
    provincia: data.direccion?.distrito?.provincia?.nombre ?? "",
    departamento:
      data.direccion?.distrito?.provincia?.departamento?.nombre ?? "",
  };

  return transformedData;
};
