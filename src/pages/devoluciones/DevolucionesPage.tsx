import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { TableHeader, TableCell, StatusBadge } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { Search, Loader2 } from "lucide-react";
import { useDevoluciones } from "../../modules/devoluciones";
import type { DevolucionEnLista } from "../../modules/devoluciones/types/devolucion";

const DetailActionCell = ({ idDevolucion }: { idDevolucion: string }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/ordenes/devoluciones/${idDevolucion}`);
  return (
    <TableCell className="w-10 text-center">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center p-1 text-gray-500 hover:text-blue-500 transition duration-150"
        title={`Ver detalles de la devolución #${idDevolucion}`}
      >
        <Search className="h-5 w-5" />
      </button>
    </TableCell>
  );
};

export default function DevolucionesPage() {
  // Filtros
  const [busquedaOrden, setBusquedaOrden] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: devoluciones = [], isLoading } = useDevoluciones();

  // Opciones para selects dinámicos
  const estadosDisponibles = Array.isArray(devoluciones) ? Array.from(new Set(devoluciones.map(d => d.estado))).sort() : [];
  const tiposDisponibles = Array.isArray(devoluciones) ? Array.from(new Set(devoluciones.map(d => d.tipoDevolucion))).sort() : [];

  // Filtrado local
  const filteredDevoluciones = Array.isArray(devoluciones) ? devoluciones.filter(d => {
    const fechaDevolucion = new Date(d.createdAt);
    const fInicio = fechaInicio ? new Date(fechaInicio) : null;
    const fFin = fechaFin ? new Date(fechaFin) : null;

    if (fInicio) fInicio.setHours(0, 0, 0, 0);
    if (fFin) fFin.setHours(23, 59, 59, 999);

    return (
      ( (d.codDevolucion && d.codDevolucion.toLowerCase().includes(busquedaOrden.toLowerCase())) || (d.codOrden && d.codOrden.toLowerCase().includes(busquedaOrden.toLowerCase())) || d.orden_id.toLowerCase().includes(busquedaOrden.toLowerCase())) &&
      (d.nombreCliente || '').toLowerCase().includes(busquedaCliente.toLowerCase()) &&
      (estado ? d.estado === estado : true) &&
      (tipo ? d.tipoDevolucion === tipo : true) &&
      (fInicio ? fechaDevolucion >= fInicio : true) &&
      (fFin ? fechaDevolucion <= fFin : true)
    );
  }) : [];

  const totalItems = filteredDevoluciones.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedDevoluciones = filteredDevoluciones.slice((page - 1) * pageSize, page * pageSize);

  const getStatusVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APROBADO":
      case "COMPLETADA": return "success";
      case "RECHAZADO":
      case "CANCELADA": return "danger";
      case "PENDIENTE":
      case "SOLICITADO":
      case "PROCESANDO": return "warning";
      default: return "neutral";
    }
  };

  const handleClear = () => {
    setBusquedaOrden("");
    setBusquedaCliente("");
    setEstado("");
    setTipo("");
    setFechaInicio("");
    setFechaFin("");
    setPage(1);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Devoluciones</h1>

      {/* --- SECCIÓN DE FILTROS IDÉNTICA A ORDENES --- */}
      <div className="flex flex-col gap-4 mb-6 w-full">
        {/* Fila 1 */}
        <div className="flex flex-wrap gap-2 sm:gap-4 items-end w-full">
          <div className="w-full sm:w-64 min-w-0">
            <Input 
              label="Buscar por ID Orden" 
              placeholder="ID de Orden" 
              value={busquedaOrden} 
              onChange={e => { setBusquedaOrden(e.target.value); setPage(1); }} 
              rightIcon={Search} 
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Input 
              label="Fecha inicio" 
              type="date" 
              value={fechaInicio} 
              onChange={e => { setFechaInicio(e.target.value); setPage(1); }} 
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <label className="mb-[8px] block text-base font-medium text-dark">Estado</label>
            <select 
              className="bg-white w-full rounded-md border py-[10px] px-4 text-dark" 
              value={estado} 
              onChange={e => { setEstado(e.target.value); setPage(1); }}
            >
              <option value="">Todos</option>
              {estadosDisponibles.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Fila 2 */}
        <div className="flex flex-wrap gap-2 sm:gap-4 items-end w-full">
          <div className="w-full sm:w-64 min-w-0">
            <Input 
              label="Buscar por cliente" 
              placeholder="Nombre del cliente" 
              value={busquedaCliente} 
              onChange={e => { setBusquedaCliente(e.target.value); setPage(1); }} 
              rightIcon={Search} 
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <Input 
              label="Fecha fin" 
              type="date" 
              value={fechaFin} 
              onChange={e => { setFechaFin(e.target.value); setPage(1); }} 
            />
          </div>
          <div className="w-full sm:w-48 min-w-0">
            <label className="mb-[8px] block text-base font-medium text-dark">Tipo de devolución</label>
            <select 
              className="bg-white w-full rounded-md border py-[10px] px-4 text-dark" 
              value={tipo} 
              onChange={e => { setTipo(e.target.value); setPage(1); }}
            >
              <option value="">Todos</option>
              {tiposDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-grow"></div>
          <button 
            type="button" 
            onClick={handleClear} 
            className="text-body-color px-3 py-2 rounded-md border-none bg-transparent hover:text-secondary-color self-end mb-[10px]"
          >
            clear all
          </button>
        </div>
      </div>

      {/* --- TABLA --- */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[900px] w-full border-collapse mb-2 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader label="#" className="w-10 min-w-[40px] !text-center" />
              <TableHeader label="ID Devolución" className="min-w-[150px] !text-center" />
              <TableHeader label="ID Orden" className="min-w-[150px] !text-center" />
              <TableHeader label="Nombre Cliente" className="min-w-[200px] !text-center" />
              <TableHeader label="Fecha" className="min-w-[100px] !text-center" />
              <TableHeader label="Tipo Devolución" className="min-w-[120px] !text-center" />
              <TableHeader label="Estado" className="min-w-[100px] !text-center" />
              <TableHeader label="Monto Total" className="min-w-[100px] !text-center" />
              <th className="w-10 min-w-[40px] text-center border border-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" /> cargando...</td></tr>
            ) : paginatedDevoluciones.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-4 border border-stroke text-gray-500">No se encontraron devoluciones.</td></tr>
            ) : (
              paginatedDevoluciones.map((d, idx) => (
                <tr key={d.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="w-10 min-w-[40px] text-center">{(page - 1) * pageSize + idx + 1}</TableCell>
                  <TableCell>{d.codDevolucion || d.id} </TableCell>
                  <TableCell>{d.codOrden || d.orden_id}</TableCell>
                  <TableCell>{d.nombreCliente}</TableCell>
                  <TableCell>{new Date(d.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{d.tipoDevolucion}</TableCell>
                  <TableCell>
                    <StatusBadge label={d.estado} variant={getStatusVariant(d.estado)} />
                  </TableCell>
                  <TableCell>S/ {d.montoTotal?.toFixed(2) || '0.00'}</TableCell>
                  <DetailActionCell idDevolucion={d.id} />
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center w-full mt-4">
          <span className="text-sm text-gray-500">
            {`mostrando ${totalItems > 0 ? (page - 1) * pageSize + 1 : 0} - ${Math.min(page * pageSize, totalItems)} de ${totalItems} resultados`}
          </span>
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}