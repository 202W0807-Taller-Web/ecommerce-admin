export interface Producto {
  id?: number;
  imagen: string;
  sku: string;
  producto: string;
  categoria: string;
  stkDisponible: number;
  stkReservado: 3;
  stkTotal: 15;
  estadoStk: string;
}
