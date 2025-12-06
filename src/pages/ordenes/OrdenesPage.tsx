import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// componentes
import Input from "@components/Input";
import Button from "@components/Button"; 
import { TableHeader, TableCell, StatusBadge } from "@components/Table";
import Pagination  from "@components/Pagination";
import ConfirmationModal from "@components/ConfirmationModal";
import { Search, Loader2 } from "lucide-react";
import DetailActionCell from "./components/DetailActionCell";
import { getOrdenes, confirmarOrden  } from "../../modules/ordenes/api/ordenes";

// componente principal
export default function OrdenesPage() {
  // estados de filtros
  const [busquedaId, setBusquedaId] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoDevolucion, setTipoDevolucion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // obtiene datos usando react query
  const { data, isLoading } = useQuery({
    queryKey: ["ordenes", page, pageSize, busquedaId, busquedaCliente, estado, tipoDevolucion, fechaInicio, fechaFin],
    queryFn: () => getOrdenes({ page, pageSize, busquedaId, busquedaCliente, estado, tipoDevolucion, fechaInicio, fechaFin }),
    refetchInterval: 5000,
  });

  // extrae datos
  const ordenes = data?.data || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const estados = data?.estados || [];
  const tiposDevolucion = data?.tiposDevolucion || [];
  const startIndex = (page - 1) * pageSize;
  const numColumns = 8;

  // define color segun estado
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CREADO": return "warning";
      case "PAGADO": return "success";
      case "CONFIRMADO": return "neutral";
      case "ENTREGADO": return "success";
      case "CANCELADO": return "danger";
      default: return "neutral";
    }
  };

  // limpia los filtros
  const handleClear = () => {
    setBusquedaId("");
    setBusquedaCliente("");
    setEstado("");
    setTipoDevolucion("");
    setFechaInicio("");
    setFechaFin("");
    setPage(1);
  };

  const handleConfirmarOrden = async () => {
    if (!ordenSeleccionada) return;
    try {
      await confirmarOrden(ordenSeleccionada, "admin-user-001");
      queryClient.setQueryData(
        ["ordenes", page, pageSize, busquedaId, busquedaCliente, estado, tipoDevolucion, fechaInicio, fechaFin],
        (oldData: any) => {
          if (!oldData) return oldData;
          const nuevaData = oldData.data.map((orden: any) =>
            orden.idOrden === ordenSeleccionada
              ? { ...orden, estado: "CONFIRMADO" }
              : orden
          );
          return { ...oldData, data: nuevaData };
        }
      );
      setModalOpen(false);
      setOrdenSeleccionada(null);
    } catch (error) {
      console.error("Error al confirmar orden:", error);
      setModalOpen(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Ordenes</h1>

      {/* filtros */}
      <div className="flex flex-col gap-4 mb-6 w-full">
        {/* fila 1 */}
        <div className="flex flex-wrap gap-2 sm:gap-4 items-end w-full">
          <div className="w-full sm:w-64 min-w-0">
            <Input label="Buscar por ID de Orden" placeholder="ID de Orden" value={busquedaId} onChange={e => { setBusquedaId(e.target.value); setPage(1); }} rightIcon={Search} />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Input label="Fecha inicio" type="date" value={fechaInicio} onChange={e => { setFechaInicio(e.target.value); setPage(1); }} />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <label className="mb-[8px] block text-base font-medium text-dark">Estado</label>
            <select className="bg-white w-full rounded-md border py-[10px] px-4 text-dark" value={estado} onChange={e => { setEstado(e.target.value); setPage(1); }}>
              <option value="">Todos</option>
              {estados.map(e => (<option key={e} value={e}>{e}</option>))}
            </select>
          </div>
        </div>

        {/* fila 2 */}
        <div className="flex flex-wrap gap-2 sm:gap-4 items-end w-full">
          <div className="w-full sm:w-64 min-w-0">
            <Input label="Buscar por cliente" placeholder="Nombre del cliente" value={busquedaCliente} onChange={e => { setBusquedaCliente(e.target.value); setPage(1); }} rightIcon={Search} />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Input label="Fecha fin" type="date" value={fechaFin} onChange={e => { setFechaFin(e.target.value); setPage(1); }} />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <label className="mb-[8px] block text-base font-medium text-dark">Tiene devolucion</label>
            <select className="bg-white w-full rounded-md border py-[10px] px-4 text-dark" value={tipoDevolucion} onChange={e => { setTipoDevolucion(e.target.value); setPage(1); }}>
              <option value="">Todos</option>
              {tiposDevolucion.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>
          <div className="flex-grow"></div>
          <button type="button" onClick={handleClear} className="text-body-color px-3 py-2 rounded-md border-none bg-transparent hover:text-secondary-color self-end mb-[10px]">
            clear all
          </button>
        </div>
      </div>

      {/* tabla y paginacion */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[900px] w-full border-collapse mb-2 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader label="#" className="w-10 min-w-[40px] !text-center" />
              <TableHeader label="ID Orden" className="min-w-[150px] !text-center" />
              <TableHeader label="Nombre Cliente" className="min-w-[200px] !text-center" />
              <TableHeader label="Fecha" className="min-w-[100px] !text-center" />
              <TableHeader label="Estado" className="min-w-[100px] !text-center" />
              <TableHeader label="Tiene Devolucion" className="min-w-[120px] !text-center" />
              <TableHeader label="Monto total" className="min-w-[100px] !text-center" />
              <TableHeader label="Acción" className="min-w-[100px] !text-center" />
              <th className="w-10 min-w-[40px] text-center border border-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={numColumns} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" /> cargando...</td></tr>
            ) : ordenes.length === 0 ? (
              <tr><td colSpan={numColumns} className="text-center py-4 border border-stroke text-gray-500">no se encontraron ordenes</td></tr>
            ) : (
              ordenes.map((o, idx) => (
                <tr key={o.idOrden} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="w-10 min-w-[40px] text-center">{idx + startIndex + 1}</TableCell>
                  <TableCell>{o.codOrden}</TableCell>
                  <TableCell>{o.nombreCliente}</TableCell>
                  <TableCell>{o.fecha}</TableCell>
                  <TableCell>
                    {o.estado === "PROCESADO" ? (
                      <span className="px-3 inline-flex justify-center text-sm leading-5 font-semibold rounded-xl text-center w-full uppercase py-1 bg-[#818181] text-white">
                        {o.estado}
                      </span>
                    ) : o.estado === "ENTREGADO" ? (
                      <span className="px-3 inline-flex justify-center text-sm leading-5 font-semibold rounded-xl text-center w-full uppercase py-1 bg-[#C9B35E] text-white">
                        {o.estado}
                      </span>
                    ) : (
                      <StatusBadge label={o.estado} variant={getStatusVariant(o.estado)} />
                    )}
                  </TableCell>
                  <TableCell>{o.tipoDevolucion}</TableCell>
                  <TableCell>S/{o.montoTotal.toFixed(2)}</TableCell>

                  {/* Celda para el botón de cambio de estado a CONFIRMADO */}
                  <TableCell className="text-center">
                    {o.estado === "PAGADO" ? (
                      <Button
                        text="Confirmar orden"
                        variant="secondary"
                        className=" !px-4 !py-2  w-[160px] !text-sm "
                        onClick={() => {
                          setOrdenSeleccionada(o.idOrden);
                          setModalOpen(true);
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No disponible</span>
                    )}
                  </TableCell>
                  <DetailActionCell idOrden={o.idOrden} />
                </tr>
              ))
            )}
          </tbody>
        </table>

        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmarOrden}
          title="¿Confirmar orden?"
          message="Esta acción marcará la orden como confirmada. ¿Deseas continuar?"
        />

        {/* paginacion */}
        <div className="flex justify-between items-center w-full mt-4">
          <span className="text-sm text-gray-500">
            {`mostrando ${totalItems > 0 ? startIndex + 1 : 0} - ${Math.min(startIndex + pageSize, totalItems)} de ${totalItems} resultados`}
          </span>
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
