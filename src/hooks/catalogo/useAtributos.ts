import { useData } from "@hooks/general/useData";
import { usePostData } from "@hooks/general/usePostData";
import { getAtributos, getAtributoById, createAtributo } from "../../services/catalogo/AtributoService";
import type { Atributo, NuevoAtributo } from "../../types/catalogo/Atributos";

// GET
export const useAtributos = () => useData<Atributo[]>(getAtributos, []);

export const useAtributoById = (id: number) =>
  useData<Atributo>(() => getAtributoById(id), [id]);

// POST
export const useCreateAtributo = () =>
  usePostData<NuevoAtributo, Atributo>(createAtributo);
