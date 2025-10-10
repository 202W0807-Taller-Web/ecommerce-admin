export interface Tienda {
  id: number;
  imagen: string;
  nombre: string;
  almacen: string;
  estado: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

export interface TiendaBody {
  nombre: string;
  almacen: string;
  estado: string;
  direccion: string;
  ubigeo: {
    departamento: string;
    provincia: string;
    distrito: string;
  };
  imagen?: string;
}
