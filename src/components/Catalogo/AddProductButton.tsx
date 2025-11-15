import { Plus } from "lucide-react";
import type { MouseEventHandler } from "react";

interface AddProductButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-[#C0A648] text-white rounded-lg hover:bg-[#968751] transition-colors"
    >
      <Plus className="w-4 h-4" /> Agregar producto
    </button>
  );
}
