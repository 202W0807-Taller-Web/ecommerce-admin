import API from "./api";
import type { Root } from "../types/pagination";
import type { Tienda } from "../types/tienda";

export const getTiendas = async ({
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
}) => {
  const response = await API.get<Root<Tienda[]>>("/tiendas", {
    params: {
      page,
      per_page: limit,
      nombre,
      departamento,
      provincia,
      distrito,
    },
  });

  return response.data;
};
