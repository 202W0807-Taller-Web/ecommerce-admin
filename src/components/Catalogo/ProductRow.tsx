export default function ProductRow({ product, isSelected, onSelect }) {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          style={{
            width: 20,
            height: 20,
            appearance: "none",
            border: "2px solid #2c2c2c",
            borderRadius: "25%",
            cursor: "pointer"
          }}
        />
      </td>
      <td>{product.producto}</td>
      <td>{product.categoria}</td>
      <td>{product.stkDisponible}</td>
      <td>{product.stkTotal}</td>
    </tr>
  );
}
