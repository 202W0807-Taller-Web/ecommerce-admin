import type { Atributo } from "./Atributos";
import type { Variante } from "./Variantes";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  productoImagenes?: ProductoImagen[];
  variantes?: Variante[]
  productoAtributos?:Atributo[]
}


export interface ProductoImagen{
  id: number,
  productoId: number,
  principal: boolean,
  imagen: string
}
