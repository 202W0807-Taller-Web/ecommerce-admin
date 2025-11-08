import { fetchUrl } from "./api";
import type { Atributo } from "../../types/catalogo/Atributos";

export const getAtributos = async (): Promise<Atributo[]> => {
  return await fetchUrl<Atributo[]>("/api/atributos");
};

export const createAtributo = async (formData: FormData): Promise<Atributo> => {
  const res = await fetch("/api/atributos", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error crear atributo: ${res.status} ${t}`);
  }
  return res.json() as Promise<Atributo>;
};

export const getAtributoById = async (id: number): Promise<Atributo> => {
  return await fetchUrl<Atributo>(`/api/atributos/${id}`);
};

export const updateAtributo = async (id: number, formData: FormData): Promise<Atributo> => {
  const res = await fetch(`/api/atributos/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error actualizar atributo: ${res.status} ${t}`);
  }
  return res.json() as Promise<Atributo>;
};

export const deleteAtributo = async (id: number): Promise<void> => {
  const res = await fetch(`/api/atributos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error eliminar atributo: ${res.status} ${t}`);
  }
};
