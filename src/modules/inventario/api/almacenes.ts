import API from "./api";
import type { Almacen } from "../types/almacen";

export const getAlmacenes = async (): Promise<Almacen[]> => {
  const { data } = await API.get<Almacen[]>("/almacenes");
  return data;
};

export const createAlmacen = async (
  almacen: Omit<Almacen, "id">
): Promise<Almacen> => {
  const { data } = await API.post<Almacen>("/almacenes", almacen);
  return data;
};
