import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { ArrowLeft, Loader2, Truck, User, MapPin } from "lucide-react";
import { useEnvio } from "../../modules/envios/hooks/useEnvios";
import { StatusBadge } from "../../components/Table";

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

const DetalleEnvioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useEnvio(Number(id));
  const envio = response?.data;

  if (isLoading) return (
    <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin w-10 h-10 text-yellow-500" />
    </div>
  );

  if (isError || !envio) return (
    <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-700">Envío no encontrado</h2>
        <Button text="Volver" onClick={() => navigate("/envios/ordenes")} className="mt-4" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalle del Envío</h1>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-yellow-600 font-semibold text-lg">#{envio.tracking_number || `ORD-${envio.id_orden}`}</span>
             <StatusBadge label={envio.estado?.nombre || 'Desconocido'} variant={getStatusVariant(envio.estado?.nombre)} />
          </div>
        </div>
        <Button text="Volver al Dashboard" variant="primary" onClick={() => navigate("/envios/ordenes")} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white border-none px-6 py-2">
          <ArrowLeft size={18} /> 
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cliente Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b">
                <User className="text-yellow-500" size={24} /> Información del Cliente
            </h2>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Nombre Completo</p>
                    <p className="font-medium text-gray-800">{envio.cliente?.nombre_completo || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    <p className="font-medium text-gray-800">{envio.cliente?.correo || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium text-gray-800">{envio.cliente?.celular || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 mb-1">Dirección de Envío</p>
                    <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-md">
                        <MapPin className="text-gray-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm">{envio.cliente?.direccion_default?.direccion_completa || "Dirección no disponible"}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Envio Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b">
                <Truck className="text-yellow-500" size={24} /> Detalles del Paquete
            </h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Carrier</p>
                        <p className="font-medium text-gray-800">{envio.carrier?.nombre || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tipo de Envío</p>
                        <p className="font-medium text-gray-800">{envio.tipo_envio_descripcion || envio.tipo_envio}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Número de Tracking</p>
                    <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block mt-1 text-gray-700">{envio.tracking_number || "Pendiente"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Costo de Envío</p>
                    <p className="font-bold text-gray-800 text-lg">S/ {envio.costo_envio ? envio.costo_envio.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Fecha de Creación</p>
                    <p className="font-medium text-gray-800">{envio.created_at ? new Date(envio.created_at).toLocaleString() : 'N/A'}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEnvioPage;
