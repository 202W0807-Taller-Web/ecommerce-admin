import React, { useState, useEffect } from "react";
import { Upload, Plus } from "lucide-react";
import AddProductModal from "../../components/Catalogo/AddProductModal";
import SearchBar from "../../components/Catalogo/SearchBar";
import CategoryFilter from "../../components/Catalogo/CategoryFilter";
import ActionButtons from "../../components/Catalogo/ActionButtons";
import ProductTable from "../../components/Catalogo/ProductTable";
import Pagination from "../../components/Catalogo/Pagination";

// 🧩 Datos de ejemplo
const productos = [
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
  {
    id: 15,
    imagen: "https://i.pravatar.cc/40?img=19",
    sku: "SKU015",
    producto: "Disco Duro Externo 1TB",
    categoria: "almacenamiento",
    stkDisponible: 18,
    stkReservado: 3,
    stkTotal: 21,
    estadoStk: "Disponible",
  },
  {
    id: 16,
    imagen: "https://i.pravatar.cc/40?img=20",
    sku: "SKU016",
    producto: "Memoria USB 64GB Kingston",
    categoria: "almacenamiento",
    stkDisponible: 30,
    stkReservado: 5,
    stkTotal: 35,
    estadoStk: "Disponible",
  },
  {
    id: 27,
    imagen: "https://i.pravatar.cc/40?img=31",
    sku: "SKU027",
    producto: "Cámara de Seguridad WiFi",
    categoria: "electrónica",
    stkDisponible: 11,
    stkReservado: 2,
    stkTotal: 13,
    estadoStk: "Disponible",
  },
];

const ITEMS_PER_PAGE = 5;

const CategoriasPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [textFilter, setTextFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categoriasUnicas = Array.from(new Set(productos.map((p) => p.categoria)));

  // 🔁 Reinicia la página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [textFilter, categoriaFilter]);

  // 🔍 Filtrado por texto y categoría
  const productosFiltrados = productos.filter((p) => {
    const cumpleTexto = p.producto
      .toLowerCase()
      .includes(textFilter.toLowerCase());
    const cumpleCategoria = categoriaFilter ? p.categoria === categoriaFilter : true;
    return cumpleTexto && cumpleCategoria;
  });

  // 📄 Paginación
  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = productosFiltrados.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ Selección de filas
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allSelected =
      selectedIds.length === currentItems.length && currentItems.length > 0;
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(currentItems.map((p) => p.id));
  };

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        Productos en categoría: {categoriaFilter || "Todas"}
      </h2>

      {/* 🔎 Barra de búsqueda + filtro + acciones */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <SearchBar text={textFilter} onChange={setTextFilter} />
        <CategoryFilter
          categorias={categoriasUnicas}
          value={categoriaFilter}
          onChange={setCategoriaFilter}
        />
        <ActionButtons />
      </div>

      {/* 📋 Tabla de productos (solo columnas requeridas) */}
      <ProductTable
        productos={currentItems.map((p) => ({
          id: p.id,
          imagen: p.imagen,
          producto: p.producto,
          estadoStk: p.estadoStk,
          stkTotal: p.stkTotal,
        }))}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      />

      {/* 📑 Paginación */}
      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CategoriasPage;
