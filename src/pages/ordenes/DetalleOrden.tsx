import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useState } from "react";
import type { ReactNode } from "react";
import ReembolsoModal from "./components/ReembolsoModal";
import ReemplazoModal from "./components/ReemplazoModal";
import { getOrdenById } from "../../modules/ordenes/api/ordenes";
import InfoField from "./components/InfoField";

interface ItemOrden {
  producto_id: string;
  precioUnitario: number;
  subTotal: number;
  cantidad: number;
  detalle_producto: {
    nombre: string;
    descripcion: string;
    imagen: string;
  };
}

interface HistorialEstado {
  fechaModificacion: string;
  estadoNuevo: string;
  estadoAnterior: string;
  modificadoPor: string;
  motivo: string;
}

// main
export default function DetalleOrdenPage() {
  const { idOrden } = useParams<{ idOrden: string }>();
  const navigate = useNavigate(); // Hook para navegar.
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal.

  const { data: orden, isLoading, isError } = useQuery({
    queryKey: ["orden", idOrden],
    queryFn: () => getOrdenById(idOrden!),
    enabled: !!idOrden,
  });
  const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);
  const [isReembolsoModalOpen, setIsReembolsoModalOpen] = useState(false);
  const [isReemplazoModalOpen, setIsReemplazoModalOpen] = useState(false);

  // Lógica para confirmar la anulación. "backend"
  const handleAnularConfirm = async () => {
    console.log(`1. Iniciando anulación para la orden: ${idOrden}`);
    try {
      console.log("2. Enviando petición al backend...");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula llamada a API.
      console.log("3. Backend respondió: ¡Éxito!");

      setIsModalOpen(false); // Cierra el modal.
      navigate("/ordenes"); // Redirige a la lista de órdenes.

    } catch (error) {
      console.error("Error al anular la orden:", error);
      setIsModalOpen(false);
    }
  };
  const handleReembolsoSubmit = (data: any) => { console.log("Procesando reembolso:", data); setIsReembolsoModalOpen(false); };
  const handleReemplazoSubmit = (items: number[]) => { console.log("Procesando reemplazo con items:", items); setIsReemplazoModalOpen(false); };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !orden) {
    return <div className="text-center text-red-500 p-8">Error al cargar los datos de la orden.</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Encabezado con título y acciones. */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button title="d" onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Detalles de Orden :
            <span className="text-xl font-bold text-gray-700 bg-gray-200 px-3 py-2 rounded-md">
              {orden.cod_orden}
            </span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600">
            Anular Orden
          </button>
          <button
            onClick={() => navigate(`/ordenes/devoluciones/crear?ordenId=${idOrden}`)}
            className="px-3 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generar Devolución
          </button>
        </div>
      </div>

      {/* Contenido principal en dos columnas. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna izquierda para detalles. */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] ">
            <h2 className="font-bold text-lg mb-2">Datos del cliente</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <InfoField label="ID Usuario" value={orden.usuarioId} />
              <InfoField label="Nombre Completo" value={orden.direccionEnvio.nombreCompleto} />
              <InfoField label="Teléfono" value={orden.direccionEnvio.telefono} />
            </div>
          </div>
          {orden.estado !== "CANCELADO" && orden.estado !== "CREADO" && (
            <div className="bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <h2 className="font-bold text-lg mb-2">Datos de pago</h2>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <InfoField label="ID Pago" value={orden.pago.pago_id} />
                <InfoField label="Método pago" value={orden.pago.metodo} />
                <InfoField label="Estado" value={
                  orden.pago.estado === "PAGO_EXITOSO" ? (
                    <span className="font-bold text-[#C9B35E]">PAGO EXITOSO</span>
                  ) : (
                    orden.pago.estado
                  )
                } />
                <InfoField label="Fecha"
                  value={new Date(orden.pago.fecha_pago).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                />
                {/* <InfoField label="Fecha" value={orden.pago.fecha_pago} /> */}
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <h2 className="font-bold text-lg mb-2">Datos de Entrega</h2>
            <div className="border  border-gray-300 rounded-md overflow-hidden">
              <InfoField label="Tipo de entrega" value={
                <span className="font-bold text-[#C9B35E]">
                  {orden.entrega.tipo === "RECOJO_TIENDA"
                    ? "RECOJO EN TIENDA"
                    : orden.entrega.tipo === "DOMICILIO"
                      ? "A DOMICILIO"
                      : orden.entrega.tipo}
                </span>
              }
              />

              {orden.entrega.tipo === "DOMICILIO" && (
                <>
                  <InfoField label="ID Carrier " value={orden.entrega.carrierSeleccionado.carrier_id} />
                  <InfoField label="Nombre Carrier " value={orden.entrega.carrierSeleccionado.carrier_nombre} />
                  <InfoField label="País" value={orden.direccionEnvio.pais} />
                  <InfoField label="Provincia" value={orden.direccionEnvio.provincia} />
                  <InfoField label="Ciudad" value={orden.direccionEnvio.ciudad} />
                  <InfoField label="Dirección Linea 1" value={orden.direccionEnvio.direccionLinea1} />
                  <InfoField label="Dirección Linea 2" value={orden.direccionEnvio.direccionLinea2} />
                  <InfoField label="Código postal" value={orden.direccionEnvio.codigoPostal} />
                  <InfoField label="Fecha entrega estimada: " value={orden.entrega.carrierSeleccionado.fecha_entrega_estimada
                    ? new Date(orden.entrega.carrierSeleccionado.fecha_entrega_estimada).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : ""}
                  />
                  <InfoField label="Tiempo estimado " value={`${orden.entrega.carrierSeleccionado.tiempo_estimado_dias} días`} />
                </>
              )}

              {orden.entrega.tipo === "RECOJO_TIENDA" && (
                <>
                  <InfoField label="ID Tienda " value={orden.entrega.tiendaSeleccionada.id} />
                  <InfoField label="Nombre de la tienda " value={orden.entrega.tiendaSeleccionada.nombre} />
                  <InfoField label="Dirección de la tienda " value={orden.entrega.tiendaSeleccionada.direccion} />
                  <InfoField label="Fecha entrega estimada: " value={orden.entrega.fechaEntregaEstimada
                    ? new Date(orden.entrega.fechaEntregaEstimada).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : ""}
                  />
                  <InfoField label="Tiempo estimado " value={`${orden.entrega.tiempoEstimadoDias} días`} />

                  {/* En este caso no mostramos carrier ni dirección completa */}
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] ">
            <h2 className="font-bold text-lg mb-2">Historial de la orden</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: "#C9B35E" }}>
                  <tr className="divide-x divide-gray-300">
                    <th className="p-2 text-center font-semibold">Fecha y Hora</th>
                    <th className="p-2 text-center font-semibold">Estado Anterior</th>
                    <th className="p-2 text-center font-semibold">Estado Actual</th>
                    <th className="p-2 text-center font-semibold">Modificado por</th>
                    <th className="p-2 text-center font-semibold">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {orden.historialEstados.map((h: HistorialEstado, index: number) => (
                    <tr key={index} className="divide-x divide-gray-300">
                      <td className="p-2">{new Date(h.fechaModificacion).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                      </td>
                      <td className="p-2">{h.estadoAnterior}</td>
                      <td className="p-2">{h.estadoNuevo}</td>
                      <td className="p-2">{h.modificadoPor}</td>
                      <td className="p-2">{h.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna derecha para items. */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] ">
          <h2 className="font-bold text-lg mb-2">Items de la orden</h2>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <table className="w-full text-sm ">
              <thead style={{ backgroundColor: "#C9B35E" }}>
                <tr className="divide-x divide-gray-300">
                  <th className="p-2 text-center font-semibold">ID Item</th>
                  <th className="p-2 text-center font-semibold">Nombre producto</th>
                  {/* <th className="p-2 text-left font-semibold">Marca</th> */}
                  <th className="p-2 text-center font-semibold">Descripción</th>
                  <th className="p-2 text-center font-semibold">Cantidad</th>
                  <th className="p-2 text-center font-semibold">Precio Unitario</th>
                  <th className="p-2 text-center font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300" >
                {orden.items.map((item: ItemOrden) => (
                  <tr key={item.producto_id} className="divide-x divide-gray-300">
                    <td className="p-2">{item.producto_id}</td>
                    <td className="p-2">{item.detalle_producto?.nombre || "N/A"}</td>
                    {/* <td className="p-2">{item.detalle_producto?.marca || "N/A" }</td> */}
                    <td className="p-2">{item.detalle_producto?.descripcion || "N/A"}</td>
                    <td className="p-2 text-center">{item.cantidad}</td>
                    <td className="p-2">s/{item.precioUnitario.toFixed(2)}</td>
                    <td className="p-2">s/{item.subTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Minitabla de totales */}
          <div className="mt-6 ">
            <h2 className="font-bold text-lg mb-2">Costos</h2>
            <div className="inline-block border border-gray-300 rounded-md overflow-hidden">
              <table className="text-sm w-auto">
                <tbody className="divide-y divide-gray-300">
                  <tr>
                    <td className="p-2 text-right font-semibold bg-[#C9B35E]">Subtotal Orden</td>
                    <td className="p-2 text-right ">s/{orden.costos.subtotal.toFixed(2)}</td>
                  </tr>
                  {/* <tr >
                    <td className="p-2 text-right font-semibold bg-[#C9B35E]">Impuestos</td>
                    <td className="p-2 text-right">s/{orden.costos.impuestos.toFixed(2)}</td>
                  </tr> */}
                  <tr >
                    <td className="p-2 text-right font-semibold bg-[#C9B35E]">Envío</td>
                    <td className="p-2 text-right">s/{orden.costos.envio.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t-2">
                    <td className="p-2 text-right font-bold ">Total</td>
                    <td className="p-2 text-right font-bold">s/{orden.costos.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleAnularConfirm}
          title="Anular Orden"
          message="¿Seguro que quiere anular esta orden? Esta acción no se puede deshacer."
        />
        <ReembolsoModal
          isOpen={isReembolsoModalOpen}
          onClose={() => setIsReembolsoModalOpen(false)}
          onSubmit={handleReembolsoSubmit}
          montoSugerido={150}
        />

        <ReemplazoModal
          isOpen={isReemplazoModalOpen}
          onClose={() => setIsReemplazoModalOpen(false)}
          onSubmit={handleReemplazoSubmit}
        />
      </div>
    </div>
  );
}