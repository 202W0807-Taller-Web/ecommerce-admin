export interface GeoPoint {
  id: number;
  latitud: string;
  longitud: string;
}

export interface Departamento {
  id: number;
  nombre: string;
}

export interface Provincia {
  id: number;
  nombre: string;
  id_departamento: number;
  departamento: Departamento;
}

export interface Distrito {
  id: number;
  nombre: string;
  id_provincia: number;
  provincia: Provincia;
}

export interface Direccion {
  id: number;
  referencia: string;
  id_distrito: number;
  id_geopoint: number;
  geopoint: GeoPoint;
  distrito: Distrito;
}
