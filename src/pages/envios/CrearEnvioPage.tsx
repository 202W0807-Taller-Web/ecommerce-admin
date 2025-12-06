import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useCrearEnvio } from "../../modules/envios/hooks/useEnvios";

const CrearEnvioPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [idOrden, setIdOrden] = useState("");
  const [selectedRate, setSelectedRate] = useState<{ id_carrier: number; price: number; name: string } | null>(null);
  const crearEnvioMutation = useCrearEnvio();

  const handleCrearEnvio = () => {
    if (!selectedRate || !idOrden) return;

    crearEnvioMutation.mutate(
      {
        id_orden: Number(idOrden),
        id_carrier: selectedRate.id_carrier,
        costo_envio: selectedRate.price,
      },
      {
        onSuccess: () => {
          setStep(4);
        },
      }
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px] flex flex-col">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Crear nuevo Envío
        </h1>
        <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>

        <div className="flex-1">
          {step === 1 && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-lg font-semibold mb-4">
                Paso 1: Buscar Orden
              </h2>
              <p className="text-gray-600 mb-4">
                Ingresa el ID de la orden para cargar los datos del cliente y
                los productos.
              </p>
              <input
                type="text"
                placeholder="Ingresa el ID de la orden"
                className="w-full p-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={idOrden}
                onChange={(e) => setIdOrden(e.target.value)}
              />
              <div className="flex justify-center gap-4">
                <Button
                  text="Cancelar"
                  variant="secondary"
                  onClick={() => navigate("/envios/ordenes")}
                  className="w-32"
                >
                </Button>
                <Button
                  text="Buscar"
                  variant="primary"
                  onClick={() => {
                    if (idOrden) setStep(2);
                  }}
                  className="w-32 bg-yellow-600 hover:bg-yellow-700 text-white border-none"
                >
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-6">
                Paso 2: Confirmar Datos y Calcular Tarifas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-yellow-100 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Remitente (Almacén)
                  </h3>
                  <p className="text-gray-700">Almacén Principal</p>
                  <p className="text-gray-600 text-sm">
                    Av. Industrial 345, Villa El Salvador, Lima
                  </p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Destinatario (Cliente)
                  </h3>
                  <p className="text-gray-700">Cliente de Orden #{idOrden}</p>
                  <p className="text-gray-600 text-sm">
                    Dirección registrada en la orden
                  </p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg border border-yellow-200 md:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Detalles del Paquete
                  </h3>
                  <p className="text-gray-700">Peso: 2.5 kg (Estimado)</p>
                  <p className="text-gray-600 text-sm">
                    Dimensiones: 30x20x15 cm (Estándar)
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-auto">
                <Button
                  text="Volver"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="w-32"
                >
                </Button>
                <Button
                  text="Calcular tarifas"
                  variant="primary"
                  onClick={() => setStep(3)}
                  className="w-40 bg-yellow-600 hover:bg-yellow-700 text-white border-none"
                >
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-6">
                Paso 3: Seleccionar Tarifa y Generar Etiqueta
              </h2>

              <div className="space-y-4 mb-8">
                {[
                  {
                    id_carrier: 1,
                    name: "Urbano Express - Estándar",
                    time: "2-3 día(s)",
                    price: 10.00,
                  },
                  {
                    id_carrier: 1,
                    name: "Urbano Express - Express",
                    time: "1 día(s)",
                    price: 15.00,
                  },
                  {
                    id_carrier: 2,
                    name: "Olva Courier - Regular",
                    time: "2 día(s)",
                    price: 12.00,
                  },
                ].map((rate, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 flex justify-between items-center hover:border-yellow-500 transition-colors ${selectedRate?.name === rate.name ? 'border-yellow-500 bg-yellow-50' : ''}`}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {rate.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{rate.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 mb-2">
                        S/ {rate.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedRate(rate);
                          // setStep(4); // Ya no avanza automático, espera confirmación
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-auto">
                <Button
                  text="Volver"
                  variant="secondary"
                  onClick={() => setStep(2)}
                  className="w-32"
                >
                </Button>
                 <Button
                  text={crearEnvioMutation.isPending ? "Generando..." : "Generar Etiqueta"}
                  variant="primary"
                  onClick={handleCrearEnvio}
                  disabled={!selectedRate || crearEnvioMutation.isPending}
                  className="w-48 bg-yellow-600 hover:bg-yellow-700 text-white border-none disabled:opacity-50"
                >
                  {crearEnvioMutation.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-8">
                Paso 4: Confirmación
              </h2>

              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ¡Envío Creado Exitosamente!
              </h3>
              <p className="text-gray-500 mb-8">
                Se ha generado el envío para la orden #{idOrden} con {selectedRate?.name}
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  text="Finalizar"
                  variant="primary"
                  onClick={() => navigate("/envios/ordenes")}
                  className="w-40 bg-yellow-600 hover:bg-yellow-700 text-white border-none"
                >
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrearEnvioPage;
