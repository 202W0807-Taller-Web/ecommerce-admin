interface Product {
  id: number;
  producto: string;
  categoria: string;
  stkDisponible: number;
  stkTotal: number;
}

interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export default function ProductRow({
  product,
  isSelected,
  onSelect,
}: ProductRowProps) {
  return (
    <tr className="border-b hover:bg-[rgba(0,0,0,0.02)] transition-colors">
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          className="w-4 h-4 accent-[var(--color-primary1)]"
        />
      </td>
      <td className="p-3 text-[var(--color-primary6)]">{product.producto}</td>
      <td className="p-3 text-[var(--color-primary5)]">{product.categoria}</td>
      <td className="p-3 text-center">{product.stkDisponible}</td>
      <td className="p-3 text-center">{product.stkTotal}</td>
    </tr>
  );
}
