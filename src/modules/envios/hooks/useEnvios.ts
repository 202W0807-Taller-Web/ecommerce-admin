import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEnvios,
  getEnvioStats,
  confirmarEnvio,
  getEstadosEnvio,
  getEnvioById,
  crearEnvio,
} from "../api/EnvioService";
import type { EnvioFilters } from "../types/EnvioTypes";

export const useEnvios = (filters: EnvioFilters = {}) => {
  return useQuery({
    queryKey: ["envios", filters],
    queryFn: () => getEnvios(filters),
  });
};

export const useEnvio = (id: number) => {
  return useQuery({
    queryKey: ["envio", id],
    queryFn: () => getEnvioById(id),
    enabled: !!id,
  });
};

export const useCrearEnvio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearEnvio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      queryClient.invalidateQueries({ queryKey: ["envios-stats"] });
    },
  });
};

export const useEnvioStats = () => {
  return useQuery({
    queryKey: ["envios-stats"],
    queryFn: getEnvioStats,
  });
};

export const useEstadosEnvio = () => {
  return useQuery({
    queryKey: ["envios-estados"],
    queryFn: getEstadosEnvio,
  });
};

export const useConfirmarEnvio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmarEnvio,
    onSuccess: () => {
      // Invalidar la query de envíos para recargar la lista
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      // También podríamos invalidar las estadísticas si cambian al confirmar
      queryClient.invalidateQueries({ queryKey: ["envios-stats"] });
    },
  });
};
