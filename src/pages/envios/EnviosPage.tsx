import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import Button from "../../components/Button";
import { TableHeader, TableCell, StatusBadge } from "../../components/Table";
import { useEnvios, useEnvioStats, useConfirmarEnvio, useEstadosEnvio } from "../../modules/envios/hooks/useEnvios";
import type { EnvioFilters } from "../../modules/envios/types/EnvioTypes";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ENTREGADO": return "success";
    case "CONFIRMADO": return "success";
    case "EN TRANSITO": return "warning";
    case "EN_TRANSITO": return "warning";
    case "PENDIENTE": return "warning";
    case "CON INCIDENCIA": return "danger";
    case "CANCELADO": return "danger";
    case "FALLIDO": return "danger";
    default: return "neutral";
  }
};

const EnviosPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EnvioFilters>({ page: 1, limit: 10 });

  // Hooks de datos
  const { data: enviosResponse, isLoading: isLoadingEnvios } = useEnvios(filters);
  const { data: statsResponse, isLoading: isLoadingStats } = useEnvioStats();
  const { data: estadosResponse } = useEstadosEnvio();
  const confirmarEnvioMutation = useConfirmarEnvio();

  const envios = enviosResponse?.data || [];
  const stats = statsResponse?.data;
  const estados = estadosResponse?.data || [];

  const handleConfirmar = (id: number) => {
    confirmarEnvioMutation.mutate(id);
  };

  const handleFilterChange = (key: keyof EnvioFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Envíos</h1>
        <Button text="Crear Envío" onClick={() => navigate("/envios/crear")} variant="primary" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white border-none">
          <Plus size={20} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-yellow-400 p-6 text-white">
          <h3 className="font-semibold text-lg">En transito</h3>
          <p className="text-3xl font-bold">
            {isLoadingStats ? <Loader2 className="animate-spin" /> : stats?.por_estado.find(s => s.estado_nombre === "EN_TRANSITO")?.cantidad || 0}
          </p>
        </div>
        <div className="bg-yellow-600 p-6 text-white">
          <h3 className="font-semibold text-lg">Entregados</h3>
          <p className="text-3xl font-bold">
            {isLoadingStats ? <Loader2 className="animate-spin" /> : stats?.por_estado.find(s => s.estado_nombre === "ENTREGADO")?.cantidad || 0}
          </p>
        </div>
        <div className="bg-yellow-700 p-6 text-white">
          <h3 className="font-semibold text-lg">Con incidencias</h3>
          <p className="text-3xl font-bold">
            {isLoadingStats ? <Loader2 className="animate-spin" /> : stats?.por_estado.find(s => s.estado_nombre === "FALLIDO")?.cantidad || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar por ID, Cliente o Tracking"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onChange={(e) => handleFilterChange("tracking_number", e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e) => handleFilterChange("estado", e.target.value)}
        >
          <option value="">Todos los estados</option>
          {estados.map(estado => (
            <option key={estado.id} value={estado.nombre}>{estado.nombre}</option>
          ))}
        </select>
        {/* <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          <option>Filtrar por Carrier</option>
        </select> */}
        <Button text="Filtrar" variant="secondary" className="flex items-center gap-2 bg-yellow-600 text-white hover:bg-yellow-700 border-none">
          <Filter size={16} />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <TableHeader label="ID Pedido" />
                <TableHeader label="Carrier" />
                <TableHeader label="Cliente" />
                <TableHeader label="Nº de seguimiento" />
                <TableHeader label="Estado" />
                <TableHeader label="Fecha de envío" />
                <TableHeader label="Confirmación" />
                <TableHeader label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {isLoadingEnvios ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" /> Cargando envíos...
                    </div>
                  </td>
                </tr>
              ) : envios.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No se encontraron envíos.
                  </td>
                </tr>
              ) : envios.map((envio, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                  <TableCell>{envio.id_orden}</TableCell>
                  <TableCell>{envio.carrier?.nombre || "N/A"}</TableCell>
                  <TableCell>{envio.cliente?.nombre_completo || "N/A"}</TableCell>
                  <TableCell>{envio.tracking_number || "Pendiente"}</TableCell>
                  <TableCell>
                    <StatusBadge label={envio.estado?.nombre} variant={getStatusVariant(envio.estado?.nombre)} />
                  </TableCell>
                  <TableCell>{envio.created_at ? new Date(envio.created_at).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    {envio.estado?.nombre === "PENDIENTE" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleConfirmar(envio.id)}
                        disabled={confirmarEnvioMutation.isPending}
                      >
                        {confirmarEnvioMutation.isPending ? "..." : "Confirmar envío"}
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/envios/ordenes/${envio.id}`)}
                      className="text-yellow-600 hover:text-yellow-800 underline text-sm font-medium"
                    >
                      Ver Detalles
                    </button>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enviosResponse?.pagination && (
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Página {enviosResponse.pagination.page} de {enviosResponse.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={enviosResponse.pagination.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={enviosResponse.pagination.page === enviosResponse.pagination.totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnviosPage;