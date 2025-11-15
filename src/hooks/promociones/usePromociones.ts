// src/hooks/promociones/usePromociones.ts
import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { usePutData } from "@hooks/general/usePutData";
import { useDeleteData } from "@hooks/general/useDeleteData";
import { getPromociones, getPromocionById, createPromocion, updatePromocion, deletePromocion } from "../../services/promociones/PromocionService";
import type { Promocion } from "../../types/promociones/Promociones";

// GET
export const usePromociones = () => useData<Promocion[]>(getPromociones, []);

export const usePromocionById = (id: number) =>
  useData<Promocion>(() => getPromocionById(id), [id]);

// POST 
export const useCreatePromocion = () =>
  usePostData<Omit<Promocion, "id">, Promocion>(createPromocion);

// PUT
export const useUpdatePromocion = () =>
  usePutData<{ id: number; data: Omit<Promocion, "id"> }, Promocion>(
    async ({ id, data }) => updatePromocion(id, data)
  );

// DELETE
export const useDeletePromocion = () =>
  useDeleteData<number>(deletePromocion);