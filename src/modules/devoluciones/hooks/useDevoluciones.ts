import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDevoluciones,
  getDevolucionById,
  createDevolucion,
  updateDevolucion,
  deleteDevolucion,
  aprobarDevolucion,
  rechazarDevolucion,
  completarDevolucion,
  cancelarDevolucion,
  ejecutarReembolso,
} from '../api/devoluciones';
import type {
  CreateDevolucionDto,
  UpdateDevolucionDto,
  AprobarDevolucionDto,
  RechazarDevolucionDto,
} from '../types/devolucion';

// Query Keys
export const devolucionesKeys = {
  all: ['devoluciones'] as const,
  lists: () => [...devolucionesKeys.all, 'list'] as const,
  list: (filters?: any) => [...devolucionesKeys.lists(), filters] as const,
  details: () => [...devolucionesKeys.all, 'detail'] as const,
  detail: (id: string) => [...devolucionesKeys.details(), id] as const,
};

/**
 * Hook para obtener todas las devoluciones
 */
export const useDevoluciones = () => {
  return useQuery({
    queryKey: devolucionesKeys.lists(),
    queryFn: getDevoluciones,
    staleTime: 30000, // 30 segundos
  });
};

/**
 * Hook para obtener una devolución específica por ID
 */
export const useDevolucion = (id: string) => {
  return useQuery({
    queryKey: devolucionesKeys.detail(id),
    queryFn: () => getDevolucionById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

/**
 * Hook para crear una nueva devolución
 */
export const useCreateDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (devolucion: CreateDevolucionDto) => createDevolucion(devolucion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar una devolución
 */
export const useUpdateDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateDevolucionDto }) =>
      updateDevolucion(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.detail(data.id) });
    },
  });
};

/**
 * Hook para eliminar una devolución
 */
export const useDeleteDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDevolucion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
    },
  });
};

/**
 * Hook para aprobar una devolución
 */
export const useAprobarDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AprobarDevolucionDto }) =>
      aprobarDevolucion(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.detail(data.devolucion.id) });
    },
  });
};

/**
 * Hook para rechazar una devolución
 */
export const useRechazarDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RechazarDevolucionDto }) =>
      rechazarDevolucion(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.detail(data.id) });
    },
  });
};

/**
 * Hook para completar una devolución
 */
export const useCompletarDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completarDevolucion(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.detail(data.id) });
    },
  });
};

/**
 * Hook para cancelar una devolución
 */
export const useCancelarDevolucion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelarDevolucion(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.detail(data.id) });
    },
  });
};

/**
 * Hook para ejecutar el reembolso automático
 */
export const useEjecutarReembolso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ejecutarReembolso(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: devolucionesKeys.detail(data.id) });
    },
  });
};
