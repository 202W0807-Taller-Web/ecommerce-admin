import API from "./api";
import {
  getLocalById,
  getLocalesByTipo,
  createLocalByTipo,
  updateLocalById,
  deleteLocalById,
  downloadLocalesByTipo,
} from "./locales";
import type { Root, RootSingleData } from "../../types/root";
import type { LocalListItem, LocalBody, LocalUpdateBody } from "../types/local";
import type { TiendasAlmacen } from "../types/almacen";
import { mapLocalToListItem } from "../utils/mapLocalToListItem";
import { normalizeArray } from "@services/inventario-envios/utils/normalizeData";

const TIPO_LOCAL_ALMACEN = 1;

export const getAlmacenes = (
  params: Omit<Parameters<typeof getLocalesByTipo>[0], "tipoLocal">
): Promise<Root<LocalListItem>> => {
  return getLocalesByTipo({ ...params, tipoLocal: TIPO_LOCAL_ALMACEN });
};

export const getAlmacen = (
  id: number
): Promise<RootSingleData<LocalListItem>> =>
  getLocalById(id, TIPO_LOCAL_ALMACEN);

export const createAlmacen = (
  local: Omit<LocalBody, "id_tipo_local">
): Promise<RootSingleData<LocalListItem>> => {
  return createLocalByTipo({ ...local, id_tipo_local: TIPO_LOCAL_ALMACEN });
};

export const updateAlmacen = (
  id: number,
  local: Omit<LocalUpdateBody, "id_tipo_local">
): Promise<RootSingleData<LocalListItem>> =>
  updateLocalById(id, { ...local, id_tipo_local: TIPO_LOCAL_ALMACEN });

export const deleteAlmacen = (
  id: number
): Promise<RootSingleData<{ id: number }>> => deleteLocalById(id);

export const getTiendasFromAlmacen = async (
  id: number
): Promise<{ success: boolean; data: LocalListItem[]; total: number }> => {
  const response = await API.get<{
    success: boolean;
    data: TiendasAlmacen[];
    total: number;
  }>(`/locales/almacen/${id}/tiendas`);

  const almacenes: TiendasAlmacen[] = normalizeArray(response.data.data);
  const tiendas = almacenes.map(a => a.tienda);
  const data: LocalListItem[] = tiendas.map(mapLocalToListItem);

  return { ...response.data, data };
};

export const downloadAlmacenes = () => {
  return downloadLocalesByTipo(TIPO_LOCAL_ALMACEN, "almacenes")
}
