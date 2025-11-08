import React, { useState } from "react";

interface Atributo {
  id?: number;
  atributo: string;
  tipo: string;
  valor: string;
}

interface AddAtributoModalProps {
  onClose: () => void;
  onSubmit: (atributo: Atributo) => void;
}

const AddAtributoModal: React.FC<AddAtributoModalProps> = ({ onClose, onSubmit }) => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [estado, setEstado] = useState("Activo");

  const handleSubmit = () => {
    if (!nombre.trim() || !tipo.trim()) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const nuevoAtributo: Atributo = {
      atributo: nombre,
      tipo,
      valor,
    };

    // Enviar al padre
    onSubmit(nuevoAtributo);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px] max-w-[90%]">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Agregar nuevo atributo
        </h3>

        {/* Grid para labels e inputs */}
        <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
          <label className="text-gray-700 font-medium text-right">Nombre:</label>
          <input
            type="text"
            placeholder="Ej. Color, Tamaño..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
          />

          <label className="text-gray-700 font-medium text-right">Tipo:</label>
          <input
            type="text"
            placeholder="Ej. Texto, Número..."
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
          />

          <label className="text-gray-700 font-medium text-right">Valor:</label>
          <input
            type="text"
            placeholder="Ej. Rojo, 42..."
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
          />

          <label className="text-gray-700 font-medium text-right">Estado:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-800 outline-none"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAtributoModal;
