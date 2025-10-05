import React, { useState } from "react";
import { Upload, Plus, Search, Pencil, Check } from "lucide-react";

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
    "id": 1,
    "imagen": "https://i.pravatar.cc/40?img=5",
    "sku": "SKU001",
    "producto": "Laptop Dell Inspiron",
    "categoria": "electrónica",
    "stkDisponible": 12,
    "stkReservado": 3,
    "stkTotal": 15,
    "estadoStk": "Disponible"
  },
  {
    "id": 2,
    "imagen": "https://i.pravatar.cc/40?img=6",
    "sku": "SKU002",
    "producto": "Mouse Logitech",
    "categoria": "accesorios",
    "stkDisponible": 5,
    "stkReservado": 2,
    "stkTotal": 7,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 3,
    "imagen": "https://i.pravatar.cc/40?img=7",
    "sku": "SKU003",
    "producto": "Camiseta Deportiva",
    "categoria": "ropa",
    "stkDisponible": 20,
    "stkReservado": 5,
    "stkTotal": 25,
    "estadoStk": "Disponible"
  },
  {
    "id": 4,
    "imagen": "https://i.pravatar.cc/40?img=8",
    "sku": "SKU004",
    "producto": "Auriculares Sony WH-1000XM4",
    "categoria": "electrónica",
    "stkDisponible": 8,
    "stkReservado": 4,
    "stkTotal": 12,
    "estadoStk": "Disponible"
  },
  {
    "id": 5,
    "imagen": "https://i.pravatar.cc/40?img=9",
    "sku": "SKU005",
    "producto": "Teclado Mecánico HyperX",
    "categoria": "accesorios",
    "stkDisponible": 4,
    "stkReservado": 2,
    "stkTotal": 6,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 6,
    "imagen": "https://i.pravatar.cc/40?img=10",
    "sku": "SKU006",
    "producto": "Smartwatch Samsung Galaxy Watch",
    "categoria": "electrónica",
    "stkDisponible": 15,
    "stkReservado": 2,
    "stkTotal": 17,
    "estadoStk": "Disponible"
  },
  {
    "id": 7,
    "imagen": "https://i.pravatar.cc/40?img=11",
    "sku": "SKU007",
    "producto": "Zapatillas Nike Air Zoom",
    "categoria": "ropa",
    "stkDisponible": 9,
    "stkReservado": 3,
    "stkTotal": 12,
    "estadoStk": "Disponible"
  },
  {
    "id": 8,
    "imagen": "https://i.pravatar.cc/40?img=12",
    "sku": "SKU008",
    "producto": "Monitor LG Ultrawide",
    "categoria": "electrónica",
    "stkDisponible": 2,
    "stkReservado": 1,
    "stkTotal": 3,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 9,
    "imagen": "https://i.pravatar.cc/40?img=13",
    "sku": "SKU009",
    "producto": "Cámara Canon EOS M50",
    "categoria": "fotografía",
    "stkDisponible": 6,
    "stkReservado": 2,
    "stkTotal": 8,
    "estadoStk": "Disponible"
  },
  {
    "id": 10,
    "imagen": "https://i.pravatar.cc/40?img=14",
    "sku": "SKU010",
    "producto": "Gorra Adidas Clásica",
    "categoria": "ropa",
    "stkDisponible": 11,
    "stkReservado": 1,
    "stkTotal": 12,
    "estadoStk": "Disponible"
  },
  {
    "id": 11,
    "imagen": "https://i.pravatar.cc/40?img=15",
    "sku": "SKU011",
    "producto": "Impresora Epson L3250",
    "categoria": "oficina",
    "stkDisponible": 3,
    "stkReservado": 2,
    "stkTotal": 5,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 12,
    "imagen": "https://i.pravatar.cc/40?img=16",
    "sku": "SKU012",
    "producto": "Mochila Targus 15.6”",
    "categoria": "accesorios",
    "stkDisponible": 10,
    "stkReservado": 1,
    "stkTotal": 11,
    "estadoStk": "Disponible"
  },
  {
    "id": 13,
    "imagen": "https://i.pravatar.cc/40?img=17",
    "sku": "SKU013",
    "producto": "Tablet Huawei MatePad",
    "categoria": "electrónica",
    "stkDisponible": 7,
    "stkReservado": 2,
    "stkTotal": 9,
    "estadoStk": "Disponible"
  },
  {
    "id": 14,
    "imagen": "https://i.pravatar.cc/40?img=18",
    "sku": "SKU014",
    "producto": "Silla ergonómica",
    "categoria": "oficina",
    "stkDisponible": 5,
    "stkReservado": 1,
    "stkTotal": 6,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 15,
    "imagen": "https://i.pravatar.cc/40?img=19",
    "sku": "SKU015",
    "producto": "Disco Duro Externo 1TB",
    "categoria": "almacenamiento",
    "stkDisponible": 18,
    "stkReservado": 3,
    "stkTotal": 21,
    "estadoStk": "Disponible"
  },
  {
    "id": 16,
    "imagen": "https://i.pravatar.cc/40?img=20",
    "sku": "SKU016",
    "producto": "Memoria USB 64GB Kingston",
    "categoria": "almacenamiento",
    "stkDisponible": 30,
    "stkReservado": 5,
    "stkTotal": 35,
    "estadoStk": "Disponible"
  },
  {
    "id": 17,
    "imagen": "https://i.pravatar.cc/40?img=21",
    "sku": "SKU017",
    "producto": "Camisa Formal Blanca",
    "categoria": "ropa",
    "stkDisponible": 10,
    "stkReservado": 0,
    "stkTotal": 10,
    "estadoStk": "Disponible"
  },
  {
    "id": 18,
    "imagen": "https://i.pravatar.cc/40?img=22",
    "sku": "SKU018",
    "producto": "Auriculares Inalámbricos JBL",
    "categoria": "electrónica",
    "stkDisponible": 6,
    "stkReservado": 3,
    "stkTotal": 9,
    "estadoStk": "Disponible"
  },
  {
    "id": 19,
    "imagen": "https://i.pravatar.cc/40?img=23",
    "sku": "SKU019",
    "producto": "Reloj Casio Vintage",
    "categoria": "accesorios",
    "stkDisponible": 8,
    "stkReservado": 2,
    "stkTotal": 10,
    "estadoStk": "Disponible"
  },
  {
    "id": 20,
    "imagen": "https://i.pravatar.cc/40?img=24",
    "sku": "SKU020",
    "producto": "Router TP-Link AX1500",
    "categoria": "electrónica",
    "stkDisponible": 4,
    "stkReservado": 1,
    "stkTotal": 5,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 21,
    "imagen": "https://i.pravatar.cc/40?img=25",
    "sku": "SKU021",
    "producto": "Pantalón Jean Levi’s",
    "categoria": "ropa",
    "stkDisponible": 13,
    "stkReservado": 2,
    "stkTotal": 15,
    "estadoStk": "Disponible"
  },
  {
    "id": 22,
    "imagen": "https://i.pravatar.cc/40?img=26",
    "sku": "SKU022",
    "producto": "Cargador Portátil 10000mAh",
    "categoria": "accesorios",
    "stkDisponible": 10,
    "stkReservado": 1,
    "stkTotal": 11,
    "estadoStk": "Disponible"
  },
  {
    "id": 23,
    "imagen": "https://i.pravatar.cc/40?img=27",
    "sku": "SKU023",
    "producto": "Smart TV Samsung 55\"",
    "categoria": "electrónica",
    "stkDisponible": 3,
    "stkReservado": 1,
    "stkTotal": 4,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 24,
    "imagen": "https://i.pravatar.cc/40?img=28",
    "sku": "SKU024",
    "producto": "Bolso Deportivo Puma",
    "categoria": "ropa",
    "stkDisponible": 9,
    "stkReservado": 1,
    "stkTotal": 10,
    "estadoStk": "Disponible"
  },
  {
    "id": 25,
    "imagen": "https://i.pravatar.cc/40?img=29",
    "sku": "SKU025",
    "producto": "Parlante Bluetooth Bose",
    "categoria": "electrónica",
    "stkDisponible": 5,
    "stkReservado": 2,
    "stkTotal": 7,
    "estadoStk": "Bajo Stock"
  },
  {
    "id": 26,
    "imagen": "https://i.pravatar.cc/40?img=30",
    "sku": "SKU026",
    "producto": "Mousepad RGB Razer",
    "categoria": "accesorios",
    "stkDisponible": 15,
    "stkReservado": 3,
    "stkTotal": 18,
    "estadoStk": "Disponible"
  },
  {
    "id": 27,
    "imagen": "https://i.pravatar.cc/40?img=31",
    "sku": "SKU027",
    "producto": "Cámara de Seguridad WiFi",
    "categoria": "electrónica",
    "stkDisponible": 11,
    "stkReservado": 2,
    "stkTotal": 13,
    "estadoStk": "Disponible"
  }
];

const categoriasUnicas = Array.from(new Set(productos.map((p) => p.categoria)));

const ITEMS_PER_PAGE = 5;

const CategoriasPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [textFilter, setTextFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productosFiltrados = productos.filter((p) => {
    const cumpleTexto = p.producto
      .toLowerCase()
      .includes(textFilter.toLowerCase());
    const cumpleCategoria = categoriaFilter
      ? p.categoria === categoriaFilter
      : true;
    return cumpleTexto && cumpleCategoria;
  });

  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = productosFiltrados.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const allSelected =
    selectedIds.length === currentItems.length && currentItems.length > 0;
  const isIndeterminate = selectedIds.length > 0 && !allSelected;

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map((p) => p.id));
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((page, idx) => {
      if (page === "...") {
        return (
          <span key={`ellipsis-${idx}`} style={{ margin: "0 6px", color: "#888" }}>
            ...
          </span>
        );
      }

      return (
        <button
          key={`page-${idx}`}
          onClick={() => setCurrentPage(Number(page))}
          style={{
            border: "1px solid #ccc",
            backgroundColor: page === currentPage ? "#2c2c2c" : "#fff",
            color: page === currentPage ? "#fff" : "#000",
            padding: "4px 10px",
            margin: "0 4px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div style={{ padding: 24, color: "#2c2c2c" }}>
      <h2>Productos en categoría: {categoriaFilter || "Todas"}</h2>

      {/* 🔍 Filtros */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            minWidth: 200,
            maxWidth: 300,
            position: "relative",
          }}
        >
          <Search
            size={18}
            color="#999"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Buscar producto"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: 6,
              border: "1px solid #c2c2c2",
              backgroundColor: "#fff",
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #c2c2c2",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 14,
              color: "#2c2c2c",
            }}
          >
            <option value="">Todas las categorías</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #c2c2c2",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 14,
              color: "#2c2c2c",
            }}
          >
            <Upload />
            Subir archivo
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #c2c2c2",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: 14,
              color: "#2c2c2c",
            }}
          >
            <Plus /> Agregar producto
          </button>
        </div>
      </div>

      {/* 🧭 Cabecera */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 100px 1.5fr 150px 120px 80px",
          alignItems: "center",
          padding: "10px 16px",
          fontWeight: 700,
          borderBottom: "2px solid black",
          color: "#2c2c2c",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            onClick={handleSelectAll}
            style={{
              width: 20,
              height: 20,
              border: "2px solid #2c2c2c",
              borderRadius: "25%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: allSelected ? "#2c2c2c" : "transparent",
              transition: "all 0.2s ease",
              margin: "0 auto",
            }}
          >
            {allSelected && <Check size={14} color="#fff" />}
            {isIndeterminate && (
              <div
                style={{
                  width: 10,
                  height: 2,
                  backgroundColor: "#fff",
                }}
              />
            )}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>Imagen</div>
        <div style={{ textAlign: "center" }}>Producto</div>
        <div style={{ textAlign: "center" }}>Estado</div>
        <div style={{ textAlign: "center" }}>Cantidad</div>
        <div style={{ textAlign: "center" }}>Acción</div>
      </div>

      {/* 📦 Filas */}
      <div style={{ marginTop: 16 }}>
        {currentItems.map((producto) => {
          const isSelected = selectedIds.includes(producto.id);
          return (
            <div
              key={producto.id}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 100px 1.5fr 150px 120px 80px",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: 10,
                backgroundColor: isSelected ? "#dfdfdf" : "transparent",
                marginBottom: 10,
                boxShadow: "0 0 15px rgba(0,0,0,0.08)",
                transition: "background 0.2s ease",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  onClick={() => handleSelect(producto.id)}
                  style={{
                    width: 20,
                    height: 20,
                    border: "2px solid #2c2c2c",
                    borderRadius: "25%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? "#2c2c2c" : "transparent",
                    transition: "all 0.2s ease",
                    margin: "0 auto",
                  }}
                >
                  {isSelected && <Check size={14} color="#fff" />}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <img
                  src={producto.imagen}
                  alt={producto.producto}
                  width={60}
                  height={60}
                  style={{
                    borderRadius: 8,
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>

              <div style={{ textAlign: "center", fontWeight: 500 }}>
                {producto.producto}
              </div>

              <div style={{ textAlign: "center" }}>{producto.estadoStk}</div>

              <div style={{ textAlign: "center" }}>
                {producto.stkDisponible}
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <Pencil />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔢 Paginación */}
      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{
              border: "none",
              background: "none",
              color: "#2c2c2c",
              cursor: currentPage === 1 ? "default" : "pointer",
              fontSize: 18,
              marginRight: 8,
            }}
          >
            &lt;
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              border: "none",
              background: "none",
              color: "#2c2c2c",
              cursor: currentPage === totalPages ? "default" : "pointer",
              fontSize: 18,
              marginLeft: 8,
            }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriasPage;
