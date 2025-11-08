import type { ChangeEventHandler } from "react";

interface CategoryFilterProps {
  categorias: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({
  categorias,
  value,
  onChange,
}: CategoryFilterProps) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    onChange(e.target.value);

  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-3 py-2 rounded-md border border-gray-300 bg-white cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Todas las categorías</option>
      {categorias
        .filter(
          (cat): cat is string =>
            typeof cat === "string" && cat.trim() !== ""
        )
        .map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
    </select>
  );
}
