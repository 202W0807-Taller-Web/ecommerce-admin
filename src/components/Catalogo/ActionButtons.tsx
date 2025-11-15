import React, { useState } from "react";
import { Upload } from "lucide-react";
import AddProductModal from "./AddProductModal";
import AddProductButton from "./AddProductButton";
import { createProducto } from "../../services/catalogo/ProductoService";

interface ActionButtonsProps {
  onProductAdded?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onProductAdded }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAdd = async (formData: FormData) => {
    try {
      console.log("Enviando producto al backend...");
      const nuevoProducto = await createProducto(formData);
      console.log("Producto creado:", nuevoProducto);

      onProductAdded?.();

      alert("Producto agregado correctamente.");
      setShowModal(false);
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Error al crear el producto. Revisa la consola.");
    }
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <AddProductButton onClick={() => setShowModal(true)} />

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#C0A648",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => alert("Funcionalidad de importación en desarrollo")}
      >
        <Upload size={18} /> Importar productos
      </button>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default ActionButtons;
