import React, { useState } from "react";
import { Upload } from "lucide-react";
import AddProductModal from "./AddProductModal";
import AddProductButton from "./AddProductButton";
import { createProducto } from "../../services/catalogo/ProductoService";

interface ActionButtonsProps {
  onProductAdded?: () => void;
  onNotify?: (message: { type: "success" | "error" | "info"; text: string }) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onProductAdded, onNotify }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAdd = async (formData: FormData) => {
    try {
      await createProducto(formData);
      onProductAdded?.();
      // delegar notificación al padre si se pasó
      onNotify?.({ type: "success", text: "Producto creado correctamente." });
      setShowModal(false);
    } catch (error) {
      console.error("Error creando producto:", error);
      onNotify?.({ type: "error", text: "Hubo un error al crear el producto." });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <AddProductButton onClick={() => setShowModal(true)} />

      <button
        className="px-3 py-2 rounded-md border border-[var(--color-primary5)] text-[var(--color-primary6)] bg-transparent flex items-center gap-2"
        onClick={() => console.log("Importar productos (no implementado)")}
      >
        <Upload size={16} /> Importar
      </button>

      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={handleAdd} onNotify={onNotify} />
      )}
    </div>
  );
};

export default ActionButtons;
