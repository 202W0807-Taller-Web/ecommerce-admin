import type { GeoPoint, Direccion } from "./ubigeo";

export interface AlmacenBackend {
  id: number;
  nombre: string;
  imagen: string;
  estado: string;
  direccion: Direccion;
  geopoint: GeoPoint;
}

export interface Almacen {
  id: number;
  imagen: string;
  nombre: string;
  estado: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  id_departamento?: string;
  id_provincia?: string;
  id_distrito?: string;
}

export interface AlmacenBody {
  nombre: string;
  direccion: string;
  estado: string;
  ubigeo: {
    departamento: string;
    provincia: string;
    distrito: string;
  };
  imagen?: string;
}
