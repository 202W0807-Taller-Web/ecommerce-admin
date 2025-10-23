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

  const [grupos, setGrupos] = useState([
    {
      key: "categoria",
      label: "Categoría",
      activo: false,
      seleccionado: "",
      opciones: [
        { id: 1, label: "Ropa" },
        { id: 2, label: "Calzado" },
        { id: 3, label: "Accesorios" },
      ],
    },
    {
      key: "genero",
      label: "Género",
      activo: false,
      seleccionado: "",
      opciones: [
        { id: 4, label: "Hombre" },
        { id: 5, label: "Mujer" },
        { id: 6, label: "Niños" },
      ],
    },
    {
      key: "deporte",
      label: "Deporte",
      activo: false,
      seleccionado: "",
      opciones: [
        { id: 7, label: "Urbano" },
        { id: 8, label: "Fútbol" },
        { id: 9, label: "Correr" },
        { id: 10, label: "Entrenar" },
        { id: 11, label: "Tenis" },
        { id: 12, label: "Básquet" },
        { id: 13, label: "Vóleibol" },
        { id: 14, label: "Acuático" },
      ],
    },
    {
      key: "tipo",
      label: "Tipo",
      activo: false,
      seleccionado: "",
      opciones: [
        { id: 15, label: "Zapatilla" },
        { id: 16, label: "Chimpunes" },
        { id: 17, label: "Sandalias" },
        { id: 18, label: "Polos" },
        { id: 19, label: "Shorts" },
        { id: 20, label: "Pantalones" },
        { id: 21, label: "Casacas" },
        { id: 22, label: "Ropa de baño" },
        { id: 23, label: "Bolsas y mochilas" },
        { id: 24, label: "Gorras" },
        { id: 25, label: "Medias" },
        { id: 26, label: "Guantes" },
      ],
    },
    {
      key: "colecciones",
      label: "Colecciones",
      activo: false,
      seleccionado: "",
      opciones: [{ id: 27, label: "Colección 2025" }],
    },
    {
      key: "color",
      label: "Color",
      activo: false,
      seleccionado: "",
      opciones: [
        { id: 28, label: "Negro" },
        { id: 29, label: "Blanco" },
        { id: 30, label: "Azul" },
        { id: 31, label: "Verde" },
        { id: 32, label: "Plomo" },
        { id: 33, label: "Morado" },
        { id: 34, label: "Rosado" },
        { id: 35, label: "Rojo" },
        { id: 36, label: "Celeste" },
        { id: 37, label: "Naranja" },
        { id: 38, label: "Amarillo" },
        { id: 39, label: "Multicolor" },
      ],
    },
    {
      key: "talla",
      label: "Talla",
      activo: false,
      seleccionado: "",
      opciones: [
        { id: 40, label: "S" },
        { id: 41, label: "M" },
        { id: 42, label: "L" },
        { id: 43, label: "XL" },
      ],
    },
  ]);

  const toggleGrupo = (idx: number) => {
    const copy = [...grupos];
    copy[idx].activo = !copy[idx].activo;
    if (!copy[idx].activo) copy[idx].seleccionado = "";
    setGrupos(copy);
  };

  const changeSeleccion = (idx: number, value: string) => {
    const copy = [...grupos];
    copy[idx].seleccionado = value;
    setGrupos(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sku.trim() || !precio.trim() || !imagen) {
      alert("Por favor completa SKU, Precio e Imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("Sku", sku.trim());
    formData.append("Precio", precio.trim());
    grupos.forEach((g) => {
      if (g.activo && g.seleccionado) {
        formData.append("IdsAtributosValores", g.seleccionado);
      }
    });
    formData.append("Imagenes", imagen);

    console.log("📦 Datos enviados:");
    for (const [k, v] of formData.entries()) {
      console.log(`${k}:`, v instanceof File ? `File(${v.name})` : v);
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-xl shadow-lg w-[520px] max-w-full relative"
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Agregar variante</h2>
          <button onClick={onClose}>
            <X className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{ flex: 1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SKU */}
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

            {/* Precio */}
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

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Atributos */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Atributos
              </h3>

              <div className="space-y-3">
                {grupos.map((g, idx) => (
                  <div key={g.key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={g.activo}
                      onChange={() => toggleGrupo(idx)}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium w-36">{g.label}</label>
                    <select
                      disabled={!g.activo}
                      value={g.seleccionado}
                      onChange={(e) => changeSeleccion(idx, e.target.value)}
                      className={`flex-1 border rounded-lg px-3 py-2 ${
                        !g.activo
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="">Seleccione valor</option>
                      {g.opciones.map((opt) => (
                        <option key={opt.id} value={String(opt.id)}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Guardar variante
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Estilo de scrollbar minimalista */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </div>
  );
};

export default AddVarianteModal;
