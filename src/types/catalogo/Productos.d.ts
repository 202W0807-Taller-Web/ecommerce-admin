export interface NuevoProducto {
  nombre: string;
  descripcion: string;
  imagenesBase64?: string[];
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes?: string[];
}
