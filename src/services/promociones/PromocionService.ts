import { fetchUrl } from "./api";
import type { Promocion } from "../../types/promociones/Promociones";
const API_PROMOCIONES_URL =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_PROMOCIONES_URL
    : process.env.VITE_API_PROMOCIONES_URL;

export const getPromociones = async (): Promise<Promocion[]> => {
  return await fetchUrl<Promocion[]>("/api/promociones");
};

export const getPromocionById = async (id: number): Promise<Promocion> => {
  return await fetchUrl<Promocion>(`/api/promociones/${id}`);
};

export const createPromocion = async (promo: Omit<Promocion, "id">): Promise<Promocion> => {
  const res = await fetch(`${API_PROMOCIONES_URL}/api/promociones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promo),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error crear promoción: ${res.status} ${t}`);
  }
  return res.json() as Promise<Promocion>;
};

export const updatePromocion = async (id: number, promo: Omit<Promocion, "id">): Promise<Promocion> => {
  const res = await fetch(`${API_PROMOCIONES_URL}/api/promociones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promo),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error actualizar promoción: ${res.status} ${t}`);
  }
  return res.json() as Promise<Promocion>;
};

export const deletePromocion = async (id: number): Promise<void> => {
  const res = await fetch(`${API_PROMOCIONES_URL}/api/promociones/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error eliminar promoción: ${res.status} ${t}`);
  }
};
