import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { usePutData } from "@hooks/general/usePutData";
import { useDeleteData } from "@hooks/general/useDeleteData";
import { useState } from "react";
import {
  createValorAtributo,
  deleteValorAtributo,
  getAtributoValores,
  getValorById,
  getValoresByAtributoId,
  updateValorAtributo,
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

// POST - Crear valor de atributo
export const useCreateAtributoValor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (atributoId: number, formData: FormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await createValorAtributo(atributoId, formData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al crear valor:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

// DELETE - Eliminar valor de atributo
export const useDeleteAtributoValor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (atributoId: number, valorId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteValorAtributo(atributoId, valorId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al eliminar valor:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
