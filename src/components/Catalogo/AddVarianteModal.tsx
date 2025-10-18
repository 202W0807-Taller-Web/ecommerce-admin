import React, { useState } from "react";
import { X } from "lucide-react";

interface AddVarianteModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const AddVarianteModal: React.FC<AddVarianteModalProps> = ({ onClose, onSubmit }) => {
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [tallaId, setTallaId] = useState<number | null>(null);
  const [colorId, setColorId] = useState<number | null>(null);

  const tallas = [
    { id: 40, valor: "S" },
    { id: 41, valor: "M" },
    { id: 42, valor: "L" },
    { id: 43, valor: "XL" },
  ];

  const colores = [
    { id: 28, valor: "Negro" },
    { id: 29, valor: "Blanco" },
    { id: 30, valor: "Azul" },
    { id: 31, valor: "Verde" },
    { id: 32, valor: "Plomo" },
    { id: 33, valor: "Morado" },
    { id: 34, valor: "Rosado" },
    { id: 35, valor: "Rojo" },
    { id: 36, valor: "Celeste" },
    { id: 37, valor: "Naranja" },
    { id: 38, valor: "Amarillo" },
    { id: 39, valor: "Multicolor" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sku || !precio || !imagen || !tallaId || !colorId) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("Sku", sku);
    formData.append("Precio", precio);
    formData.append("IdsAtributosValores", colorId.toString());
    formData.append("IdsAtributosValores", tallaId.toString());
    formData.append("Imagenes", imagen);

    console.log("📦 Datos listos para enviar al backend:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[550px] max-w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agregar variante</h2>
          <button onClick={onClose}>
            <X className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              placeholder="Ej. SKU-12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              placeholder="Ej. 99.90"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Talla y Color en la misma fila */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Talla</label>
              <select
                value={tallaId ?? ""}
                onChange={(e) => setTallaId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              >
                <option value="">Seleccione una talla</option>
                {tallas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.valor}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Color</label>
              <select
                value={colorId ?? ""}
                onChange={(e) => setColorId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              >
                <option value="">Seleccione un color</option>
                {colores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.valor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-200"
            >
              Guardar variante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVarianteModal;
