export interface ProductoGlobal {
  id: number;
  nombre: string;
  imagen: string;
  stk_disponible_global: number;
  stk_reservado_global: number;
  stk_total_global: number;
  stk_estado_global: string;
}

export interface ProductoPorLocal {
  id_producto: number;
  producto: string;
  imagen: string;
  stk_disponible: number;
  stk_reservado: number;
  stk_total: number;
  stk_estado: string;
}

export interface LocalPorProducto {
  id_almacen: number;
  local: string;
  imagen: string;
  stk_disponible: number;
  stk_reservado: number;
  stk_total: number;
  stk_estado: string;
}
