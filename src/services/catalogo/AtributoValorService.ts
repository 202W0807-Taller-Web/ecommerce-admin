import { fetchUrl } from "./api";
import type { AtributoValor } from "../../types/catalogo/AtributoValores";

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
  formData: FormData
): Promise<AtributoValor> => {
  const res = await fetch(`/api/atributos/${atributoId}/valores`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error crear valor atributo: ${res.status} ${t}`);
  }
  return res.json() as Promise<AtributoValor>;
};
