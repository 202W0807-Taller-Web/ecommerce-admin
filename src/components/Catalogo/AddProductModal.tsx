import { useState } from "react";

type AddProductModalProps = {
  onClose: () => void;
  onAdd: (product: any) => void;
};

export default function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!name || !category || !price || !stock) {
      alert("Por favor complete todos los campos.");
      return;
    }
    if (parseFloat(price) < 0 || parseInt(stock) < 0) {
      alert("Los valores numéricos no pueden ser negativos.");
      return;
    }
    onAdd({ name, category, price, stock, image });
    onClose();
  };

  const handleFileChange = (file: File | null) => {
    setImage(file);
    setFileName(file ? file.name : "Ningún archivo seleccionado");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 14,
          minWidth: 520,
          maxWidth: 560,
        }}
      >
        <h3
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#333",
          }}
        >
          Agregar nuevo producto
        </h3>

        {/* Nombre */}
        <label>Nombre:</label>
        <input
          type="text"
          placeholder="Ingrese el nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* Categoría */}
        <label>Categoría:</label>
        <input
          type="text"
          placeholder="Ingrese la categoría del producto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* Precio */}
        <label>Precio:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Ingrese el precio del producto"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* Stock */}
        <label>Stock:</label>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="Ingrese el stock disponible"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        {/* File Input */}
        <label>Seleccionar archivo:</label>
        <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
          <input
            type="file"
            id="file-upload"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition flex-shrink-0"
          >
            Seleccionar archivo
          </label>
          <span className="text-sm text-gray-600 truncate block overflow-hidden text-ellipsis">
            {fileName}
          </span>
        </div>

        {/* Botones */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded-md bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
