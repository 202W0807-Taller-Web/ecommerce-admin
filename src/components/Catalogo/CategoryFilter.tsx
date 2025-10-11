import React from "react";

const CategoryFilter = ({ categorias, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid #c2c2c2",
      backgroundColor: "#fff",
      cursor: "pointer",
      fontSize: 14,
    }}
  >
    <option value="">Todas las categorías</option>
    {categorias.map((cat) => (
      <option key={cat} value={cat}>
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </option>
    ))}
  </select>
);

export default CategoryFilter;
