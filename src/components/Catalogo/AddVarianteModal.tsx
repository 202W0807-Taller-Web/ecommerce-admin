import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { useAtributos } from "@hooks/catalogo/useAtributos";

interface AddVarianteModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const AddVarianteModal: React.FC<AddVarianteModalProps> = ({ onClose, onSubmit }) => {
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");

  const { data: atributos, loading, error } = useAtributos();

  const colores = useMemo(() => {
    const colorAtributo = atributos?.find(
      (attr) => attr.nombre.toLowerCase() === "color"
    );
    return colorAtributo?.atributoValores.map((av) => ({
      id: av.id,
      label: av.valor,
    })) || [];
  }, [atributos]);

  const tallas = useMemo(() => {
    const tallaAtributo = atributos?.find(
      (attr) => attr.nombre.toLowerCase() === "talla"
    );
    return tallaAtributo?.atributoValores.map((av) => ({
      id: av.id,
      label: av.valor,
    })) || [];
  }, [atributos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sku.trim() || !precio.trim() || !imagen || !colorSeleccionado || !tallaSeleccionada) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    const formData = new FormData();
    formData.append("Sku", sku.trim());
    formData.append("Precio", precio.trim());
    formData.append("IdsAtributosValores", colorSeleccionado);
    formData.append("IdsAtributosValores", tallaSeleccionada);
    formData.append("Imagenes", imagen);

    console.log("📦 Datos enviados:");
    for (const [k, v] of formData.entries()) {
      console.log(`${k}:`, v instanceof File ? `File(${v.name})` : v);
    }

    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p>Cargando atributos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-red-600">Error al cargar atributos: {error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[var(--color-primary2)] text-white rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

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
            <X className="text-gray-600 hover:text-[var(--color-primary6)]" />
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

            {/* Color */}
            <div>
              <label className="block text-sm font-medium">Color</label>
              <select
                value={colorSeleccionado}
                onChange={(e) => setColorSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                disabled={colores.length === 0}
              >
                <option value="">Seleccione un color</option>
                {colores.map((color) => (
                  <option key={color.id} value={String(color.id)}>
                    {color.label}
                  </option>
                ))}
              </select>
              {colores.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No hay colores disponibles</p>
              )}
            </div>

            {/* Talla */}
            <div>
              <label className="block text-sm font-medium">Talla</label>
              <select
                value={tallaSeleccionada}
                onChange={(e) => setTallaSeleccionada(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                disabled={tallas.length === 0}
              >
                <option value="">Seleccione una talla</option>
                {tallas.map((talla) => (
                  <option key={talla.id} value={String(talla.id)}>
                    {talla.label}
                  </option>
                ))}
              </select>
              {tallas.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No hay tallas disponibles</p>
              )}
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

            {/* Botones */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-[var(--color-primary6)] rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-primary1)] text-white rounded-lg hover:bg-[var(--color-primary2)]"
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
