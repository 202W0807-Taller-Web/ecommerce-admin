import { API, API_UPDATE } from "./api";
import type { Orden } from "../types/orden";

export const getOrdenes = async (params: {
  page: number;
  pageSize: number;
  busquedaId: string;
  busquedaCliente: string;
  estado: string;
  tipoDevolucion: string;
  fechaInicio: string;
  fechaFin: string;
}) => {

  const queryParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.pageSize),
  });
  
  if (params.busquedaId) queryParams.append("busquedaId", params.busquedaId);
  if (params.busquedaCliente) queryParams.append("busquedaCliente", params.busquedaCliente);
  if (params.estado) queryParams.append("estado", params.estado);
  if (params.tipoDevolucion) queryParams.append("tiene_devolucion", params.tipoDevolucion);
  if (params.fechaInicio) queryParams.append("fechaInicio", params.fechaInicio);
  if (params.fechaFin) queryParams.append("fechaFin", params.fechaFin);

  const apiUrl = `/api/orders?${queryParams.toString()}`;

  try {
    const response = await API.get(apiUrl);
    const apiData = response.data;

    const MAPPED_DATA: Orden[] = apiData.data.map((ordenApi: any) => ({
      idOrden: ordenApi._id,
      codOrden: ordenApi.cod_orden,
      nombreCliente: ordenApi.nombre,
      fecha: new Date(ordenApi.fechaCreacion).toLocaleDateString(),
      estado: ordenApi.estado,
      tipoDevolucion: ordenApi.tiene_devolucion ? "SI" : "NO",
      montoTotal: ordenApi.total,
    }));

    return {
      data: MAPPED_DATA,
      totalItems: apiData.total,
      estados: ["CREADO","PAGADO", "CONFIRMADO", "PROCESADO","ENTREGADO", "CANCELADO"],
      tiposDevolucion: [
        { label: "SI", value: "true" },
        { label: "NO", value: "false" },
      ],
    };
  } catch (error) {
    console.error("error al obtener las ordenes:", error);
    return { data: [], totalItems: 0, estados: [], tiposDevolucion: [] };
  }
};

export const confirmarOrden = async (idOrden: string, usuario: string) => {
    console.log("Confirmando orden:", idOrden, usuario);
    await API_UPDATE.patch(`/api/orders/${idOrden}/confirmar`, { usuario });
    return true;
};

export const getOrdenById = async (idOrden: string) => {
  try {
    const response = await API.get(`/api/orders/${idOrden}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles de la orden:", error);
    throw error;
  }
};
