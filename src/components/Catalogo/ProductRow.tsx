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
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          className="w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500 cursor-pointer"
        />
      </td>
      <td className="p-3">{product.producto}</td>
      <td className="p-3">{product.categoria}</td>
      <td className="p-3 text-center">{product.stkDisponible}</td>
      <td className="p-3 text-center">{product.stkTotal}</td>
    </tr>
  );
}
