import API from "./api";
import type { Tienda } from "../types/tienda";

export const getTiendas = async (): Promise<Tienda[]> => {
  const { data } = await API.get<Tienda[]>("/tiendas");
  return data;
};

export const createTienda = async (
  tienda: Omit<Tienda, "id">
): Promise<Tienda> => {
  const { data } = await API.post<Tienda>("/tiendas", tienda);
  return data;
};
