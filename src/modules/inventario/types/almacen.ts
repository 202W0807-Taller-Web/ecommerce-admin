// Estructura del backend
interface BackendAlmacen {
  id: number;
  nombre: string;
  imagen: string | null;
  estado: string;
  id_direccion: number;
  id_tipo_local: number;
  almacenId: number | null;
  direccion: {
    id: number;
    referencia: string;
    id_distrito: number;
    id_geopoint: number;
    distrito: {
      id: number;
      nombre: string;
      id_provincia: number;
      provincia: {
        id: number;
        nombre: string;
        id_departamento: number;
        departamento: {
          id: number;
          nombre: string;
        };
      };
    };
  };
}

// Tipo para la UI
export interface Almacen {
  id?: number;
  imagen: string | null;
  nombre: string;
  estado: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

// Meta para la paginación
export interface Meta {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

// Respuesta completa del endpoint
export interface AlmacenResponse {
  data: BackendAlmacen[];
  meta: Meta;
}
