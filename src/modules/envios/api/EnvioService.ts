import axios from "axios";
import type {
  EnvioResponse,
  StatsResponse,
  EnvioFilters,
  EstadoEnvio,
} from "../types/EnvioTypes";

const API_URL =
  "https://shipping-service-staging-814404078279.us-central1.run.app/api";

const api = axios.create({
  baseURL: API_URL,
});

export const getEnvios = async (
  filters: EnvioFilters = {}
): Promise<EnvioResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.cliente) params.append("cliente", filters.cliente);
  if (filters.id_carrier)
    params.append("id_carrier", filters.id_carrier.toString());
  if (filters.estado) params.append("estado", filters.estado);
  if (filters.tracking_number)
    params.append("tracking_number", filters.tracking_number);

  const response = await api.get<EnvioResponse>(
    `/shipping?${params.toString()}`
  );
  return response.data;
};

export const getEnvioById = async (id: number): Promise<{ success: boolean; data: import('../types/EnvioTypes').Envio }> => {
  const response = await api.get<{ success: boolean; data: import('../types/EnvioTypes').Envio }>(`/shipping/${id}`);
  return response.data;
};

export const crearEnvio = async (data: { id_orden: number; id_carrier: number; costo_envio: number }): Promise<{ success: boolean; data: import('../types/EnvioTypes').Envio }> => {
  const response = await api.post<{ success: boolean; data: import('../types/EnvioTypes').Envio }>('/shipping', data);
  return response.data;
};

export const getEnvioStats = async (): Promise<StatsResponse> => {
  const response = await api.get<StatsResponse>("/shipping/stats");
  return response.data;
};

export const getEstadosEnvio = async (): Promise<{
  success: boolean;
  data: EstadoEnvio[];
}> => {
  const response = await api.get<{ success: boolean; data: EstadoEnvio[] }>(
    "/shipping/states"
  );
  return response.data;
};

export const confirmarEnvio = async (id: number): Promise<void> => {
  await api.patch('/shipping/confirmar-envio', { id_envio: id });
};
