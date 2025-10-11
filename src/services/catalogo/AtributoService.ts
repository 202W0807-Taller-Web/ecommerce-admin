import { fetchUrl } from "./api";
import type { NuevoAtributo, Atributo } from "../../types/catalogo/Atributos";

export const getAtributos = async (): Promise<Atributo[]> => {
  return await fetchUrl<Atributo[]>("/api/atributos");
};

export const createAtributo = async (data: NuevoAtributo): Promise<Atributo> => {
  return await fetchUrl<Atributo>("/api/atributos", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAtributoById = async (id: number): Promise<Atributo> => {
  return await fetchUrl<Atributo>(`/api/atributos/${id}`);
};
