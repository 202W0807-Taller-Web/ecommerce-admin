import API from "./api";
import type { Root } from "../types/pagination";
import type { Tienda } from "../types/tienda";

export const getTiendas = async ({
  page,
  limit,
  nombre,
  almacen,
  departamento,
  provincia,
  distrito,
}: {
  page: number;
  limit: number;
  nombre: string;
  almacen: string;
  departamento: string;
  provincia: string;
  distrito: string;
}) => {
  const response = await API.get<Root<Tienda>>("/tiendas", {
    params: {
      page,
      per_page: limit,
      nombre,
      almacen,
      departamento,
      provincia,
      distrito,
    },
  });

  return response.data;
};
