import React, { useState } from "react";
import { Upload, Plus } from "lucide-react";
import AddProductModal from "./AddProductModal";
import AddProductButton from "./AddProductButton";

export default function ActionButtons() {
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (newProduct) => {
    console.log("Nuevo producto agregado:", newProduct);
    // 🔧 Aquí podrías añadir lógica para actualizar tu lista de productos global o mediante contexto/estado
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* Botón para abrir modal */}
      <AddProductButton onClick={() => setShowModal(true)} />

      {/* Botón de subir archivo (placeholder visual) */}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #c2c2c2",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
        onClick={() => alert("Funcionalidad de importación en desarrollo")}
      >
        <Upload size={18} /> Importar productos
      </button>

      {/* Modal de agregar producto */}
      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
