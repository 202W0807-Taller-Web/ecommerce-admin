import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Componentes UI
import Button from "../../components/Button";
import { TableHeader, TableCell, StatusBadge } from "../../components/Table";
import CustomStatusDropdown from "../../components/StatusDropdown";

// API y Tipos del nuevo módulo de devoluciones
import { useDevolucion, useAprobarDevolucion, useRechazarDevolucion } from "../../modules/devoluciones";
import type { ItemDevolucion, DevolucionHistorial, MetodoDevolucion } from "../../modules/devoluciones/types/devolucion";

// --- CONFIGURACIÓN DE ESTADOS Y ESTILOS ---
const ESTADO_OPTIONS = [
  { value: "SOLICITADO", label: "SOLICITADO" },
  { value: "APROBADO", label: "APROBADO" },
  { value: "RECHAZADO", label: "RECHAZADO" },
  { value: "PROCESANDO", label: "PROCESANDO" },
  { value: "COMPLETADO", label: "COMPLETADO" },
  { value: "CANCELADO", label: "CANCELADO" },
];

const getEstadoStyle = (estado: string): string => {
  switch (estado?.toUpperCase()) {
    case "PENDIENTE":
    case "SOLICITADO": return "bg-yellow-500";
    case "APROBADO":
    case "COMPLETADO": return "bg-green-500";
    case "RECHAZADO":
    case "CANCELADO":
    case "ERROR_REEMBOLSO": return "bg-red-500";
    case "PROCESANDO": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

const getStatusVariant = (ajuste: number) => {
  if (ajuste > 0) return "success";
  if (ajuste < 0) return "danger";
  return "neutral";
};

// --- COMPONENTE AUXILIAR: DATA ROW (Para el diseño de rejilla) ---
const DataRow: React.FC<{
  label: string;
  value: string | number;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ label, value, isFirst, isLast }) => {
  return (
    <div className="flex border-b border-gray-200 last:border-b-0">
      <div
        className={`w-1/3 p-2 text-sm font-semibold text-black ${isFirst ? "rounded-tl-lg" : ""} ${isLast ? "rounded-bl-lg" : ""}`}
        style={{ backgroundColor: "#C9B35E" }}
      >
        {label}
      </div>
      <div
        className={`w-2/3 p-2 text-sm text-gray-800 bg-white ${isFirst ? "rounded-tr-lg" : ""} ${isLast ? "rounded-br-lg" : ""}`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
};

// --- COMPONENTE AUXILIAR: TABLA DE ARTÍCULOS ---
const ArticulosTable: React.FC<{ articulos: ItemDevolucion[] }> = ({ articulos }) => (
  <div className="mt-8 border border-gray-200 rounded-lg overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          {["ID Producto", "Acción", "Cantidad", "Precio Unit.", "Subtotal", "Motivo"].map((header) => (
            <TableHeader
              key={header}
              label={header}
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-none bg-gray-50"
            />
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {articulos.map((item) => (
          <tr key={item.id}>
            <TableCell className="px-3 py-2 text-sm text-gray-900 border-none">{item.producto_id_dev}</TableCell>
            <TableCell className="px-3 py-2 text-sm text-gray-900 border-none uppercase font-bold">{item.tipo_accion}</TableCell>
            <TableCell className="px-3 py-2 text-sm text-gray-900 border-none">{item.cantidad_dev}</TableCell>
            <TableCell className="px-3 py-2 text-sm text-gray-900 border-none">S/ {Number(item.precio_unitario_dev).toFixed(2)}</TableCell>
            <TableCell className="px-3 py-2 text-sm text-gray-900 border-none font-semibold">S/ {(item.cantidad_dev * item.precio_unitario_dev).toFixed(2)}</TableCell>
            <TableCell className="px-3 py-2 text-sm text-gray-700 border-none">{item.motivo}</TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- PÁGINA PRINCIPAL ---
const DevolucionDetallePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 1. Cargar Datos Reales usando el hook del nuevo módulo
  const { data: devolucion, isLoading, isError } = useDevolucion(id!);

  const [currentEstado, setCurrentEstado] = useState<string>("");

  useEffect(() => {
    if (devolucion) {
      setCurrentEstado(devolucion.estado);
    }
  }, [devolucion]);

  // 2. Mutaciones para Aprobar y Rechazar usando hooks del nuevo módulo
  const { mutate: aprobarDevolucionMutation, isPending: isApproving } = useAprobarDevolucion();
  const { mutate: rechazarDevolucionMutation, isPending: isRejecting } = useRechazarDevolucion();

  const handleAprobar = () => {
    if (!id || !devolucion) return;
    
    // TODO: Obtener adminId del usuario actual (cuando se integre autenticación)
    const adminId = 1; // Temporal
    const metodoDevolucion: MetodoDevolucion = 'CORREO'; // Temporal, debería ser seleccionable
    
    aprobarDevolucionMutation(
      { id, dto: { adminId, metodoDevolucion } },
      {
        onSuccess: (response) => {
          alert(`¡Éxito! La devolución ha sido aprobada.\n\nNúmero de autorización: ${response.instrucciones.numeroAutorizacion}\nMétodo: ${response.instrucciones.metodoDevolucion}`);
        },
        onError: (error: any) => {
          console.error("Error al aprobar:", error);
          alert(`Error: ${error.response?.data?.message || "Error inesperado"}`);
        },
      }
    );
  };

  const handleRechazar = () => {
    if (!id || !devolucion) return;
    
    const motivo = prompt("Ingrese el motivo del rechazo:");
    if (!motivo || motivo.trim() === "") {
      alert("Debe ingresar un motivo para rechazar la devolución");
      return;
    }

    const comentario = prompt("Comentario adicional (opcional):") || undefined;
    
    // TODO: Obtener adminId del usuario actual
    const adminId = 1; // Temporal
    
    rechazarDevolucionMutation(
      { id, dto: { adminId, motivo, comentario } },
      {
        onSuccess: () => {
          alert("La devolución ha sido rechazada exitosamente.");
        },
        onError: (error: any) => {
          console.error("Error al rechazar:", error);
          alert(`Error: ${error.response?.data?.message || "Error inesperado"}`);
        },
      }
    );
  };

  const handleEstadoChange = (newValue: string) => {
    setCurrentEstado(newValue);
    // Nota: Los cambios de estado ahora se manejan mediante los botones específicos
  };

  const handleVerOrdenGenerada = () => {
    if (devolucion?.orden_id) {
        navigate(`/ordenes/ordenes/${devolucion.orden_id}`);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-blue-500" /></div>;
  }

  if (isError || !devolucion) {
    return <div className="p-10 text-center text-xl text-red-600 font-bold">Error al cargar la devolución.</div>;
  }

  // Cálculos para la UI
  const montoTotal = devolucion.items.reduce(
    (sum, item) => sum + (item.precio_unitario_dev * item.cantidad_dev), 
    0
  );

  // Obtener el historial ordenado (más reciente primero)
  const historialOrdenado = devolucion.historial 
    ? [...devolucion.historial].sort((a, b) => 
        new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      )
    : [];

  // Fecha de solicitud (primer registro del historial o createdAt)
  const fechaSolicitud = historialOrdenado.length > 0 
    ? new Date(historialOrdenado[historialOrdenado.length - 1].fecha_creacion).toLocaleDateString()
    : new Date(devolucion.createdAt).toLocaleDateString(); 

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          Detalles de la devolución:
          <span className="ml-3 px-3 py-1 text-lg font-mono text-black bg-gray-300 rounded-lg">
            {devolucion.codDevolucion || devolucion.id}
          </span>
        </h1>
        <div className="flex items-center gap-3">
          {/* Botones de Aceptar/Rechazar solo cuando está SOLICITADO */}
          {devolucion.estado === "SOLICITADO" && (
            <>
              <button
                onClick={handleAprobar}
                disabled={isApproving || isRejecting}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Aprobando...
                  </>
                ) : (
                  'Aceptar'
                )}
              </button>
              <button
                onClick={handleRechazar}
                disabled={isApproving || isRejecting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rechazando...
                  </>
                ) : (
                  'Rechazar'
                )}
              </button>
            </>
          )}
          <div className={isApproving || isRejecting ? "opacity-50 cursor-not-allowed" : ""}>
            <CustomStatusDropdown
              currentValue={currentEstado}
              options={ESTADO_OPTIONS}
              onChange={handleEstadoChange}
              getColorStyle={getEstadoStyle}
            />
          </div>
        </div>
      </div>

      {/* SUB-HEADER INFO */}
      <div className="flex space-x-4 mb-8 text-sm">
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
          <span className="font-semibold text-gray-600">ID Orden Original:</span>
          <span className="font-semibold text-black">{devolucion.codOrden || devolucion.orden_id}</span>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
          <span className="font-semibold text-gray-600">Fecha Solicitud:</span>
          <span className="font-semibold text-black">{fechaSolicitud}</span>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
          <span className="font-semibold text-gray-600">Correlativo:</span>
          <span className="font-semibold text-black">#{devolucion.correlativo || 'N/A'}</span>
        </div>
      </div>

      {/* GRID DE 3 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* COLUMNA 1: DATOS DEL CLIENTE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-2 p-2 border-b">Datos del cliente</h2>
          <DataRow label="Nombre" value={devolucion.datosCliente?.nombres || "Pendiente integración"} isFirst />
          <DataRow label="ID Cliente" value={devolucion.datosCliente?.idUsuario || "Pendiente integración"} />
          <DataRow label="Teléfono" value={devolucion.datosCliente?.telefono || "Pendiente integración"} isLast />
        </div>

        {/* COLUMNA 2: RESOLUCIÓN FINANCIERA */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-2 p-2 border-b">Resolución Financiera</h2>
          <DataRow label="Monto Total" value={`S/ ${montoTotal.toFixed(2)}`} isFirst />
          <DataRow label="ID Reembolso" value={devolucion.reembolso?.id || "Pendiente"} />
          <DataRow label="Estado Pago" value={devolucion.reembolso?.estado || "Pendiente"} />
          <DataRow label="Transacción" value={devolucion.reembolso?.transaccion_id || "N/A"} />
          <DataRow label="Monto Reembolsado" value={devolucion.reembolso ? `${devolucion.reembolso.moneda} ${devolucion.reembolso.monto.toFixed(2)}` : "N/A"} />
          <DataRow label="Fecha Procesamiento" value={devolucion.reembolso?.fecha_procesamiento ? new Date(devolucion.reembolso.fecha_procesamiento).toLocaleDateString() : "N/A"} isLast />
        </div>

        {/* COLUMNA 3: HISTORIAL */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-2 p-2 border-b">Historial de Estados</h2>
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {historialOrdenado.length > 0 ? (
              historialOrdenado.map((hist, index) => (
                <div key={hist.id} className="text-xs border-l-2 border-blue-500 pl-2 py-1">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-800">
                      {hist.estado_anterior} → {hist.estado_nuevo}
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      {new Date(hist.fecha_creacion).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    Por admin ID: {hist.modificado_por_id}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">Sin historial disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* TABLA DE ARTÍCULOS */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Artículos de la Devolución</h2>
      <ArticulosTable articulos={devolucion.items} />

    </div>
  );
};

export default DevolucionDetallePage;