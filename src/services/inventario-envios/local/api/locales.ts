import API from "./api";
import type { Root, RootSingleData } from "../../types/root";
import type {
  Local,
  LocalBody,
  LocalUpdateBody,
  LocalListItem,
} from "../types/local";
import { normalizeArray, normalizeObject } from "../../utils/normalizeData";
import { mapLocalToListItem } from "../utils/mapLocalToListItem";

interface GetLocalesParams {
  tipoLocal: number;
  page: number;
  limit: number;
  nombre: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export const getLocalesByTipo = async ({
  tipoLocal,
  page,
  limit,
  nombre,
  departamento,
  provincia,
  distrito,
}: GetLocalesParams): Promise<Root<LocalListItem>> => {
  const response = await API.get<Root<Local>>(`/locales/tipo/${tipoLocal}`, {
    params: {
      page,
      per_page: limit,
      nombre,
      departamento,
      provincia,
      distrito,
    },
  });

  const locales: Local[] = normalizeArray(response.data.data);

  const data: LocalListItem[] = locales.map(mapLocalToListItem);

  return { ...response.data, data };
};

export const getLocalById = async (
  id: number,
  expectedTipoLocal?: number
): Promise<RootSingleData<LocalListItem>> => {
  const response = await API.get<RootSingleData<Local>>(`/locales/${id}`);

  const local: Local = normalizeObject(response.data.data);

  if (expectedTipoLocal && local.id_tipo_local !== expectedTipoLocal) {
    throw new Error(
      `El local con ID ${id} no pertenece al tipo ${expectedTipoLocal}`
    );
  }

  const data: LocalListItem = mapLocalToListItem(local);

  return { ...response.data, data };
};

export const createLocalByTipo = async (
  local: LocalBody
): Promise<RootSingleData<LocalListItem>> => {
  const response = await API.post<RootSingleData<Local>>(`/locales`, local);

  const localRes: Local = normalizeObject(response.data.data);
  const data: LocalListItem = mapLocalToListItem(localRes);

  return { ...response.data, data };
};

export const updateLocalById = async (
  id: number,
  local: LocalUpdateBody
): Promise<RootSingleData<LocalListItem>> => {
  const response = await API.put<RootSingleData<Local>>(
    `/locales/${id}`,
    local
  );

  const localRes: Local = normalizeObject(response.data.data);

  const data: LocalListItem = mapLocalToListItem(localRes);

  return { ...response.data, data };
};

export const deleteLocalById = async (
  id: number
): Promise<RootSingleData<{ id: number }>> => {
  const response = await API.delete(`/locales/${id}`);
  return response.data;
};

export const downloadLocalesByTipo = async (id: number, file_name: string) => {
  const response = await API.get(`/locales/download-csv/${id}`, {
    responseType: "blob",
  });

  // Crear un objeto URL temporal y forzar la descarga
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // Nombre del archivo (puedes hacerlo dinámico)
  link.setAttribute("download", `${file_name}.csv`);

  document.body.appendChild(link);
  link.click();

  // Limpieza
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadLocalesByTipo = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post(`/locales/upload-csv/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
