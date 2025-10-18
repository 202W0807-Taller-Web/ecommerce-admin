import type { Direccion } from "./ubigeo";

export interface TipoLocal {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Local {
  id: number;
  nombre: string;
  imagen: string | null;
  estado: string;
  id_direccion: number;
  id_tipo_local: number;
  tipoLocal: TipoLocal;
  direccion: Direccion;
}

export interface LocalRelacion {
  id: number;
  id_almacen: number;
  id_tienda: number;
  fecha_asignacion: string;
}

export interface LocalResumen {
  id: number;
  nombre: string;
  estado: string;
  direccion: {
    referencia: string;
    distrito: { nombre: string };
  };
}

export interface LocalListItem {
  id: number;
  nombre: string;
  imagen: string | null;
  estado: string;
  direccion: string;
  distrito: { id: number; nombre: string };
  provincia: { id: number; nombre: string };
  departamento: { id: number; nombre: string };
  tipo_local?: number;
}

export interface LocalBody {
  id_tipo_local: 1 | 2;
  nombre: string;
  estado?: "ACTIVO" | "INACTIVO";
  direccion: string;
  ubigeo: {
    departamento: string;
    provincia: string;
    distrito: string;
  };
  imagen?: string;
}

export interface LocalUpdateBody {
  nombre?: string;
  imagen?: string;
  id_tipo_local?: 1 | 2;
  estado?: "ACTIVO" | "INACTIVO";
}
