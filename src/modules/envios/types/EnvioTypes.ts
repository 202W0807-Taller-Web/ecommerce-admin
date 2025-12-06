export type EnvioEstado =
  | "ENTREGADO"
  | "EN TRANSITO"
  | "CON INCIDENCIA";

export interface Carrier {
  id: number;
  nombre: string;
  codigo: string;
}

export interface EstadoEnvio {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface Direccion {
  id: number;
  calle: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigo_postal: string;
  direccion_completa: string;
}

export interface Cliente {
  id: number;
  nombre_completo: string;
  correo: string;
  celular: string;
  tipo_documento: string;
  nro_documento: string;
  direccion_default: Direccion;
  total_direcciones: number;
}

export interface Envio {
  id: number;
  id_orden: number;
  id_cliente: number;
  id_estado: number;
  id_carrier: number;
  tracking_number: string;
  tipo_envio: string;
  costo_envio: number;
  carrier: Carrier;
  estado: EstadoEnvio;
  tipo_envio_descripcion: string;
  cliente: Cliente;
  fecha?: string; // Mantenemos por compatibilidad si es necesario, o usamos created_at
  created_at?: string;
}

export interface EnvioStats {
  total_envios: number;
  por_estado: {
    id_estado: number;
    cantidad: number;
    estado_nombre: string;
  }[];
  por_carrier: {
    carrier: string | null;
    cantidad: number;
  }[];
  por_tipo_envio: {
    tipo_envio: string;
    cantidad: number;
  }[];
}

export interface EnvioFilters {
  page?: number;
  limit?: number;
  cliente?: string;
  id_carrier?: number;
  estado?: string;
  tracking_number?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EnvioResponse {
  success: boolean;
  data: Envio[];
  pagination: PaginationData;
}

export interface StatsResponse {
  success: boolean;
  data: EnvioStats;
}
