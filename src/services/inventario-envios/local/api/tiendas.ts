import API from "./api";
import {
  getLocalById,
  getLocalesByTipo,
  createLocalByTipo,
  updateLocalById,
  deleteLocalById,
  downloadLocalesByTipo,
  uploadLocalesByTipo,
} from "./locales";
import type { Root, RootSingleData } from "../../types/root";
import type { LocalListItem, LocalBody, LocalUpdateBody } from "../types/local";
import type { AlmacenesTienda } from "../types/tienda";
import { mapLocalToListItem } from "../utils/mapLocalToListItem";
import { normalizeArray } from "@services/inventario-envios/utils/normalizeData";

const TIPO_LOCAL_TIENDA = 2;

export const getTiendas = (
  params: Omit<Parameters<typeof getLocalesByTipo>[0], "tipoLocal">
): Promise<Root<LocalListItem>> => {
  return getLocalesByTipo({ ...params, tipoLocal: TIPO_LOCAL_TIENDA });
};

export const getTienda = (id: number): Promise<RootSingleData<LocalListItem>> =>
  getLocalById(id, TIPO_LOCAL_TIENDA);

export const createTienda = (
  local: Omit<LocalBody, "id_tipo_local">
): Promise<RootSingleData<LocalListItem>> => {
  return createLocalByTipo({ ...local, id_tipo_local: TIPO_LOCAL_TIENDA });
};

export const updateTienda = (
  id: number,
  local: Omit<LocalUpdateBody, "id_tipo_local">
): Promise<RootSingleData<LocalListItem>> =>
  updateLocalById(id, { ...local, id_tipo_local: TIPO_LOCAL_TIENDA });

export const deleteTienda = (
  id: number
): Promise<RootSingleData<{ id: number }>> => deleteLocalById(id);

export const getAlmacenesFromTienda = async (
  id: number
): Promise<{ success: boolean; data: LocalListItem[]; total: number }> => {
  const response = await API.get<{
    success: boolean;
    data: AlmacenesTienda[];
    total: number;
  }>(`/locales/tienda/${id}/almacenes`);

  const tiendas: AlmacenesTienda[] = normalizeArray(response.data.data);
  const almacenes = tiendas.map(t => t.almacen);
  const data: LocalListItem[] = almacenes.map(mapLocalToListItem);

  return { ...response.data, data };
};

export const downloadTiendas = () => {
  return downloadLocalesByTipo(TIPO_LOCAL_TIENDA, "tiendas");
};

export const uploadTiendas = (file: File) => {
  return uploadLocalesByTipo(TIPO_LOCAL_TIENDA, file);
};
