import { fetchUrl } from "./api";
import type { AtributoValor } from "../../types/catalogo/AtributoValores";

const API_CATALOGO_URL =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_CATALOGO_URL
    : process.env.VITE_API_CATALOGO_URL;

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
  const valor = formData.get("Valor") as string;
  
  const res = await fetch(`${API_CATALOGO_URL}/api/atributos/${atributoId}/valores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valor }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error crear valor atributo: ${res.status} ${t}`);
  }
  return res.json() as Promise<AtributoValor>;
};

export const updateValorAtributo = async (
  atributoId: number,
  valorId: number,
  formData: FormData
): Promise<AtributoValor> => {
  const valor = formData.get("Valor") as string;
  
  const res = await fetch(`${API_CATALOGO_URL}/api/atributos/${atributoId}/valores/${valorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valor }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error actualizar valor atributo: ${res.status} ${t}`);
  }
  return res.json() as Promise<AtributoValor>;
};

export const deleteValorAtributo = async (
  atributoId: number,
  valorId: number
): Promise<void> => {
  const res = await fetch(`${API_CATALOGO_URL}/api/atributos/${atributoId}/valores/${valorId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error eliminar valor atributo: ${res.status} ${t}`);
  }
};
