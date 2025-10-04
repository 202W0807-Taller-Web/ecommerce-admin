import React, { useState } from "react";
import { useParams } from "react-router-dom";

type Producto = {
  id: number;
  imagen: string;
  sku: string;
  producto: string;
  categoria: string;
  stkDisponible: number;
  stkReservado: number;
  stkTotal: number;
  estadoStk: string;
};

const productos: Producto[] = [
  {
    id: 1,
    imagen: "https://i.pravatar.cc/40?img=5",
    sku: "SKU001",
    producto: "Laptop Dell Inspiron",
    categoria: "electrónica",
    stkDisponible: 12,
    stkReservado: 3,
    stkTotal: 15,
    estadoStk: "Disponible",
  },
  {
    id: 2,
    imagen: "https://i.pravatar.cc/40?img=6",
    sku: "SKU002",
    producto: "Mouse Logitech",
    categoria: "accesorios",
    stkDisponible: 5,
    stkReservado: 2,
    stkTotal: 7,
    estadoStk: "Bajo Stock",
  },
  {
    id: 3,
    imagen: "https://i.pravatar.cc/40?img=7",
    sku: "SKU003",
    producto: "Camiseta Deportiva",
    categoria: "ropa",
    stkDisponible: 20,
    stkReservado: 5,
    stkTotal: 25,
    estadoStk: "Disponible",
  },
];

const CategoriasPage: React.FC = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const productosFiltrados = categoria
    ? productos.filter(
        (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
      )
    : productos;

  const allSelected =
    selectedIds.length === productosFiltrados.length && productosFiltrados.length > 0;
  const isIndeterminate =
    selectedIds.length > 0 && !allSelected;

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(productosFiltrados.map((p) => p.id));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Productos en categoría: {categoria || "Todas"}</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ flexGrow: 1, maxWidth: 300 }}>
          <input
            type="text"
            placeholder="Buscar producto"
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <span role="img" aria-label="upload"></span> Subir archivo
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <span role="img" aria-label="add">➕</span> Agregar producto
          </button>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 12px",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "2px solid #222",
              height: 50,
            }}
          >
            <th
              style={{ paddingLeft: 16, width: 40, textAlign: "left", paddingTop: 10, paddingBottom: 10 }}
            >
              <input
                type="checkbox"
                style={{ width: 20, height: 20 }}
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
              />
            </th>
            <th
              style={{
                width: 150,
                textAlign: "center",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            ></th>
            <th
              style={{
                textAlign: "center",
                fontWeight: 700,
                paddingTop: 10,
                paddingBottom: 10,
                width: 200,
              }}
            >
              Producto
            </th>
            <th
              style={{
                textAlign: "center",
                fontWeight: 700,
                paddingTop: 10,
                paddingBottom: 10,
                width: 150,
              }}
            >
              Estado
            </th>
            <th
              style={{
                textAlign: "center",
                fontWeight: 700,
                paddingTop: 10,
                paddingBottom: 10,
                width: 100,
              }}
            >
              Cantidad
            </th>
            <th
              style={{
                textAlign: "center",
                fontWeight: 700,
                paddingTop: 10,
                paddingBottom: 10,
                width: 100,
              }}
            >
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => {
            const isSelected = selectedIds.includes(producto.id);
            return (
              <tr
                key={producto.id}
                style={{
                  borderBottom: "none",
                  textAlign: "center",
                  backgroundColor: isSelected ? "#e6f7ff" : "transparent",
                }}
              >
                <td style={{ paddingLeft: 16, paddingTop: 12, paddingBottom: 12 }}>
                  <input
                    type="checkbox"
                    style={{ width: 20, height: 20 }}
                    checked={isSelected}
                    onChange={() => handleSelect(producto.id)}
                  />
                </td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 80,
                    paddingTop: 12,
                    paddingBottom: 12,
                  }}
                >
                  <img
                    src={producto.imagen}
                    alt={`${producto.producto} imagen`}
                    width={80}
                    height={80}
                    style={{ display: "block" }}
                  />
                </td>
                <td style={{ paddingTop: 12, paddingBottom: 12, textAlign: "center" }}>
                  {producto.producto}
                </td>
                <td style={{ paddingTop: 12, paddingBottom: 12 }}>{producto.estadoStk}</td>
                <td style={{ paddingTop: 12, paddingBottom: 12 }}>{producto.stkDisponible}</td>
                <td style={{ paddingTop: 12, paddingBottom: 12 }}>
                  <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                    <span role="img" aria-label="edit">✏️</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriasPage;
