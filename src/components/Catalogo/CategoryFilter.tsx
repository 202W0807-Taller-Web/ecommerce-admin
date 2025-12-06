
export default function CategoryFilter({
  categorias,
  value,
  onChange,
}: {
  categorias: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 rounded border border-[var(--color-primary5)] bg-transparent text-[var(--color-primary6)]"
    >
      <option value="">Todas las categorías</option>
      {categorias.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
