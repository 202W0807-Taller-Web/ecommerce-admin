import type { Local, LocalRelacion } from "./local";

export interface AlmacenRelacion extends LocalRelacion {
  tienda: Local;
}

export interface TiendasAlmacen {
  id: number;
  id_almacen: number;
  id_tienda: number;
  fecha_asignacion: string;
  tienda: Local;
}

// GET LOCALES TIPO 1
// export interface AlmacenRelacion extends LocalRelacion {
//   tienda: LocalResumen;
// }

// export interface Almacen extends Local {
//   almacenesQueAbastecen: AlmacenRelacion[];
// }
