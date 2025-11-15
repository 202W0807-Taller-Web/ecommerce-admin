import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, AlertTriangle } from "lucide-react";

interface AtributoValor {
  id: number;
  atributoId: number;
  valor: string;
}

interface Atributo {
  id: number;
  nombre: string;
  atributoValores: AtributoValor[];
}

interface AtributosTableProps {
  atributos: Atributo[];
  onCreateAtributo: (nombre: string) => void;
  onDeleteAtributo: (id: number) => void;
  onCreateValor: (atributoId: number, valor: string) => void;
  onDeleteValor: (valorId: number) => void;
}

const AtributosTable: React.FC<AtributosTableProps> = ({
  atributos,
  onCreateAtributo,
  onDeleteAtributo,
  onCreateValor,
  onDeleteValor,
}) => {
  const [selectedAtributo, setSelectedAtributo] = useState<Atributo | null>(
    null
  );
  const [nuevoAtributo, setNuevoAtributo] = useState("");
  const [nuevoValor, setNuevoValor] = useState("");
  const [showAtributoInput, setShowAtributoInput] = useState(false);
  const [showValorInput, setShowValorInput] = useState(false);

  // Estados para modales de confirmación
  const [deleteAtributoModal, setDeleteAtributoModal] = useState<{
    show: boolean;
    id: number | null;
  }>({
    show: false,
    id: null,
  });
  const [deleteValorModal, setDeleteValorModal] = useState<{
    show: boolean;
    id: number | null;
  }>({
    show: false,
    id: null,
  });

  // Seleccionar automáticamente el primer atributo cuando cambie la lista
  // Incluimos `selectedAtributo` en las dependencias para satisfacer eslint
  useEffect(() => {
    if (atributos.length > 0 && !selectedAtributo) {
      setSelectedAtributo(atributos[0]);
    }
  }, [atributos, selectedAtributo]);

  const handleCreateAtributo = () => {
    if (nuevoAtributo.trim()) {
      onCreateAtributo(nuevoAtributo.trim());
      setNuevoAtributo("");
      setShowAtributoInput(false);
    }
  };

  const handleCreateValor = () => {
    if (nuevoValor.trim() && selectedAtributo) {
      onCreateValor(selectedAtributo.id, nuevoValor.trim());
      setNuevoValor("");
      setShowValorInput(false);
    }
  };

  const handleDeleteAtributo = () => {
    if (deleteAtributoModal.id) {
      onDeleteAtributo(deleteAtributoModal.id);
      if (selectedAtributo?.id === deleteAtributoModal.id) {
        const remainingAtributos = atributos.filter(
          (a) => a.id !== deleteAtributoModal.id
        );
        setSelectedAtributo(
          remainingAtributos.length > 0 ? remainingAtributos[0] : null
        );
      }
      setDeleteAtributoModal({ show: false, id: null });
    }
  };

  const handleDeleteValor = () => {
    if (deleteValorModal.id) {
      onDeleteValor(deleteValorModal.id);
      setDeleteValorModal({ show: false, id: null });
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla Principal: Atributos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#363636]">Atributos</h3>
            <button
              onClick={() => setShowAtributoInput(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Nuevo
            </button>
          </div>

          {showAtributoInput && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevoAtributo}
                  onChange={(e) => setNuevoAtributo(e.target.value)}
                  placeholder="Nombre del atributo"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0A648] text-[#363636]"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAtributo()}
                  autoFocus
                />
                <button
                  onClick={handleCreateAtributo}
                  className="px-4 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors text-sm"
                >
                  Crear
                </button>
                <button
                  onClick={() => {
                    setShowAtributoInput(false);
                    setNuevoAtributo("");
                  }}
                  className="px-3 py-2 bg-gray-200 text-[#363636] rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {atributos.map((atributo) => (
              <div
                key={atributo.id}
                onClick={() => setSelectedAtributo(atributo)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selectedAtributo?.id === atributo.id
                    ? "bg-[#C0A648] text-white shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100 text-[#363636]"
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{atributo.nombre}</p>
                  <p
                    className={`text-xs ${
                      selectedAtributo?.id === atributo.id
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    {atributo.atributoValores?.length || 0} valor(es)
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteAtributoModal({ show: true, id: atributo.id });
                  }}
                  className={`p-2 rounded-lg transition ${
                    selectedAtributo?.id === atributo.id
                      ? "hover:bg-[#968751]"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {atributos.length === 0 && !showAtributoInput && (
              <p className="text-center text-gray-500 py-8 italic">
                No hay atributos. Crea uno nuevo.
              </p>
            )}
          </div>
        </div>

        {/* Tabla Secundaria: Valores */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#363636]">
              {selectedAtributo
                ? `Valores de "${selectedAtributo.nombre}"`
                : "Valores"}
            </h3>
            {selectedAtributo && (
              <button
                onClick={() => setShowValorInput(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo
              </button>
            )}
          </div>

          {selectedAtributo ? (
            <>
              {showValorInput && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoValor}
                      onChange={(e) => setNuevoValor(e.target.value)}
                      placeholder="Valor del atributo"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0A648] text-[#363636]"
                      onKeyDown={(e) => e.key === "Enter" && handleCreateValor()}
                      autoFocus
                    />
                    <button
                      onClick={handleCreateValor}
                      className="px-4 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors text-sm"
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => {
                        setShowValorInput(false);
                        setNuevoValor("");
                      }}
                      className="px-3 py-2 bg-gray-200 text-[#363636] rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                {selectedAtributo.atributoValores &&
                selectedAtributo.atributoValores.length > 0 ? (
                  selectedAtributo.atributoValores.map((valor) => (
                    <div
                      key={valor.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <p className="text-[#363636] font-medium">{valor.valor}</p>
                      <button
                        onClick={() => setDeleteValorModal({ show: true, id: valor.id })}
                        className="p-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  ))
                ) : (
                  !showValorInput && (
                    <p className="text-center text-gray-500 py-8 italic">
                      No hay valores. Agrega uno nuevo.
                    </p>
                  )
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8 italic">
              Selecciona un atributo para ver sus valores
            </p>
          )}
        </div>
      </div>

      {/* Modal Eliminar Atributo */}
      {deleteAtributoModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#363636] mb-2">
                  Eliminar Atributo
                </h3>
                <p className="text-gray-600 text-sm">
                  ¿Estás seguro de eliminar este atributo y todos sus valores? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setDeleteAtributoModal({ show: false, id: null })}
                className="px-4 py-2 bg-gray-200 text-[#363636] rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAtributo}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Valor */}
      {deleteValorModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#363636] mb-2">
                  Eliminar Valor
                </h3>
                <p className="text-gray-600 text-sm">
                  ¿Estás seguro de eliminar este valor? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setDeleteValorModal({ show: false, id: null })}
                className="px-4 py-2 bg-gray-200 text-[#363636] rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteValor}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default AtributosTable;
