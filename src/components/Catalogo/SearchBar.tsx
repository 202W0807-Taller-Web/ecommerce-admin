import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ text, onChange }) => (
  <div style={{ flexGrow: 1, maxWidth: 300, position: "relative" }}>
    <Search size={18} color="#999" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
    <input
      type="text"
      placeholder="Buscar producto"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 6, border: "1px solid #c2c2c2" }}
    />
  </div>
);

export default SearchBar;
