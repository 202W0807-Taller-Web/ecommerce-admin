import { Plus } from "lucide-react";

export default function AddProductButton({ onClick }) {
  return (
    <button
      onClick={onClick}
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
    >
      <Plus /> Agregar producto
    </button>
  );
}
