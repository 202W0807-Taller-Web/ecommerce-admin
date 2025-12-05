import type { Local, LocalListItem } from "../types/local";

export const mapLocalToListItem = (local: Local): LocalListItem => ({
  id: local.id,
  nombre: local.nombre,
  imagen: local.imagen ?? null,
  estado: local.estado,
  direccion: local.direccion?.referencia ?? "",
  distrito: {
    id: local.direccion?.distrito?.id ?? 0,
    nombre: local.direccion?.distrito?.nombre ?? "",
  },
  provincia: {
    id: local.direccion?.distrito?.provincia?.id ?? 0,
    nombre: local.direccion?.distrito?.provincia?.nombre ?? "",
  },
  departamento: {
    id: local.direccion?.distrito?.provincia?.departamento?.id ?? 0,
    nombre: local.direccion?.distrito?.provincia?.departamento?.nombre ?? "",
  },
  tipo_local: local.id_tipo_local,
});
