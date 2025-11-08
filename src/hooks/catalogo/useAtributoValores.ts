import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { usePutData } from "@hooks/general/usePutData";
import { useDeleteData } from "@hooks/general/useDeleteData";
import {
  getAtributoValores,
  getValoresByAtributoId,
  getValorById,
  createValorAtributo,
  updateValorAtributo,
  deleteValorAtributo,
} from "../../services/catalogo/AtributoValorService";
import type { AtributoValor } from "../../types/catalogo/AtributoValores";

// GET
export const useAtributoValores = () =>
  useData<AtributoValor[]>(getAtributoValores, []) as {
    data: AtributoValor[] | undefined;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };

export const useValoresByAtributoId = (atributoId: number) =>
  useData<AtributoValor[]>(() => getValoresByAtributoId(atributoId), [atributoId]);

export const useValorById = (atributoId: number, valorId: number) =>
  useData<AtributoValor>(() => getValorById(atributoId, valorId), [atributoId, valorId]);

// POST
export const useCreateValorAtributo = (atributoId: number) =>
  usePostData<FormData, AtributoValor>((fd) => createValorAtributo(atributoId, fd));

// PUT
export const useUpdateValorAtributo = (atributoId: number, valorId: number) =>
  usePutData<FormData, AtributoValor>((fd) =>
    updateValorAtributo(atributoId, valorId, fd)
  );

// DELETE
export const useDeleteValorAtributo = (atributoId: number, valorId: number) =>
  useDeleteData<void>(() => deleteValorAtributo(atributoId, valorId));
