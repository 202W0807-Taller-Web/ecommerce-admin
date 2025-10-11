import { fetchUrl } from "./api";
import type { AtributoValor, NuevoAtributoValor } from "../../types/catalogo/AtributoValores";

export const getAtributoValores = async (): Promise<AtributoValor[]> => {
  return await fetchUrl<AtributoValor[]>("/api/atributovalores");
};

export const getValoresByAtributoId = async (
  atributoId: number
): Promise<AtributoValor[]> => {
  return await fetchUrl<AtributoValor[]>(`/api/atributos/${atributoId}/valores`);
};

export const getValorById = async (
  atributoId: number,
  valorId: number
): Promise<AtributoValor> => {
  return await fetchUrl<AtributoValor>(
    `/api/atributos/${atributoId}/valores/${valorId}`
  );
};

export const createValorAtributo = async (
  atributoId: number,
  data: NuevoAtributoValor
): Promise<AtributoValor> => {
  return await fetchUrl<AtributoValor>(`/api/atributos/${atributoId}/valores`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
