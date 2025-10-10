import API from "./api";
import type { Departamento, Provincia, Distrito } from "../types/ubigeo";

export const getDepartamentos = async (): Promise<Departamento[]> => {
  const response = await API.get<{ success: boolean; data: Departamento[] }>(
    "/departamentos"
  );
  return response.data.data;
};

export const getProvincias = async (
  id_departamento: string
): Promise<Provincia[]> => {
  const response = await API.get<{ success: boolean; data: Provincia[] }>(
    "/provincias",
    {
      params: { id_departamento },
    }
  );
  return response.data.data;
};

export const getDistritos = async (
  id_provincia: string
): Promise<Distrito[]> => {
  const response = await API.get<{ success: boolean; data: Distrito[] }>(
    "distritos",
    {
      params: { id_provincia },
    }
  );
  return response.data.data;
};
