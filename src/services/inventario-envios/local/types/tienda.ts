import type { Local, LocalRelacion } from "./local";

export interface TiendaRelacion extends LocalRelacion {
  almacen: Local;
}

export interface AlmacenesTienda {
  id: number;
  id_almacen: number;
  id_tienda: number;
  fecha_asignacion: string;
  almacen: Local;
}

// GET LOCALES TIPO 2
// export interface TiendaRelacion extends LocalRelacion {
//   almacen: LocalResumen;
// }

// export interface Tienda extends Local {
//   almacenesQueReciben: TiendaRelacion[];
// }
