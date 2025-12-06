import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { usePutData } from "@hooks/general/usePutData";
import { useDeleteData } from "@hooks/general/useDeleteData";
import {
  getAtributos,
  getAtributoById,
  createAtributo,
  updateAtributo,
  deleteAtributo,
} from "../../services/catalogo/AtributoService";
import type { Atributo } from "../../types/catalogo/Atributos";

// GET
export const useAtributos = () => useData<Atributo[]>(getAtributos, []);

export const useAtributoById = (id: number) =>
  useData<Atributo>(() => getAtributoById(id), [id]);

// POST
export const useCreateAtributo = () =>
  usePostData<FormData, Atributo>(createAtributo);

// PUT
export const useUpdateAtributo = (id: number) =>
  usePutData<FormData, Atributo>((fd) => updateAtributo(id, fd));

// DELETE
export const useDeleteAtributo = () =>
  useDeleteData<number>((id) => deleteAtributo(id));


