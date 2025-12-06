import { API_RETURNS } from "./api";
import type {
  Devolucion,
  DevolucionEnLista,
  DevolucionDetalle,
  CreateDevolucionDto,
  UpdateDevolucionDto,
  AprobarDevolucionDto,
  RechazarDevolucionDto,
  AprobarDevolucionResponse,
} from "../types/devolucion";

/**
 * Obtiene todas las devoluciones (lista enriquecida con datos del cliente y orden)
 */
export const getDevoluciones = async (): Promise<DevolucionEnLista[]> => {
  const { data } = await API_RETURNS.get<DevolucionEnLista[]>('/devolucion');
  return data;
};

/**
 * Obtiene los detalles completos de una devolución por su ID
 */
export const getDevolucionById = async (id: string): Promise<DevolucionDetalle> => {
  const { data } = await API_RETURNS.get<DevolucionDetalle>(`/devolucion/${id}`);
  return data;
};

/**
 * Crea una nueva devolución con sus items
 */
export const createDevolucion = async (devolucion: CreateDevolucionDto): Promise<Devolucion> => {
  const { data } = await API_RETURNS.post<Devolucion>('/devolucion', devolucion);
  return data;
};

/**
 * Actualiza una devolución existente
 */
export const updateDevolucion = async (
  id: string,
  updates: UpdateDevolucionDto
): Promise<Devolucion> => {
  const { data } = await API_RETURNS.patch<Devolucion>(`/devolucion/${id}`, updates);
  return data;
};

/**
 * Elimina una devolución
 */
export const deleteDevolucion = async (id: string): Promise<void> => {
  await API_RETURNS.delete(`/devolucion/${id}`);
};

/**
 * Aprueba una devolución y genera instrucciones para el cliente
 */
export const aprobarDevolucion = async (
  id: string,
  dto: AprobarDevolucionDto
): Promise<AprobarDevolucionResponse> => {
  const { data } = await API_RETURNS.patch<AprobarDevolucionResponse>(
    `/devolucion/${id}/aprobar`,
    dto
  );
  return data;
};

/**
 * Rechaza una devolución
 */
export const rechazarDevolucion = async (
  id: string,
  dto: RechazarDevolucionDto
): Promise<Devolucion> => {
  const { data } = await API_RETURNS.patch<Devolucion>(`/devolucion/${id}/rechazar`, dto);
  return data;
};

/**
 * Marca una devolución como completada
 */
export const completarDevolucion = async (id: string): Promise<Devolucion> => {
  const { data } = await API_RETURNS.patch<Devolucion>(`/devolucion/${id}/complete`);
  return data;
};

/**
 * Marca una devolución como cancelada
 */
export const cancelarDevolucion = async (id: string): Promise<Devolucion> => {
  const { data } = await API_RETURNS.patch<Devolucion>(`/devolucion/${id}/cancel`);
  return data;
};

/**
 * Ejecuta el reembolso automático para una devolución aprobada
 */
export const ejecutarReembolso = async (id: string): Promise<Devolucion> => {
  const { data } = await API_RETURNS.post<Devolucion>(`/devolucion/${id}/refund`);
  return data;
};
