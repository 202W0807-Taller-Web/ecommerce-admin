import { Plus } from "lucide-react";
import type { MouseEventHandler } from "react";

interface AddProductButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-sm transition-colors"
    >
      <Plus className="w-4 h-4" /> Agregar producto
    </button>
  );
}
