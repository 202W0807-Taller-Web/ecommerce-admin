import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import {
  getAtributoValores,
  getValoresByAtributoId,
  getValorById,
  createValorAtributo,
} from "../../services/catalogo/AtributoValorService";
import type { AtributoValor } from "../../types/catalogo/AtributoValores";

// GET
export const useAtributoValores = () =>
  useData<AtributoValor[]>(getAtributoValores, []);

export const useValoresByAtributoId = (atributoId: number) =>
  useData<AtributoValor[]>(
    () => getValoresByAtributoId(atributoId),
    [atributoId]
  );

export const useValorById = (atributoId: number, valorId: number) =>
  useData<AtributoValor>(
    () => getValorById(atributoId, valorId),
    [atributoId, valorId]
  );

// POST
export const useCreateValorAtributo = (atributoId: number) =>
  usePostData<FormData, AtributoValor>(
    (fd) => createValorAtributo(atributoId, fd)
  );
