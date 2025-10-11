export interface NuevaVariante {
  sku: string;
  precio: number;
  imagenes?: string[];
  idsAtributosValores: number[];
}

export interface Variante {
  id: number;
  sku: string;
  precio: number;
  productoId: number;
}