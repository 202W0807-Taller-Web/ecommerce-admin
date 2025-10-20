import React, { useState, useEffect } from "react";
import { getProductos, createProducto } from "../../services/catalogo/ProductoService";
import SearchBar from "../../components/Catalogo/SearchBar";
import CategoryFilter from "../../components/Catalogo/CategoryFilter";
import ActionButtons from "../../components/Catalogo/ActionButtons";
import ProductTable from "../../components/Catalogo/ProductTable";
import Pagination from "../../components/Catalogo/Pagination";
import AddProductModal from "../../components/Catalogo/AddProductModal";

const ITEMS_PER_PAGE = 5;

const CategoriasPage: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [textFilter, setTextFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProductos = async () => {
    console.log("Intentando cargar productos desde el backend...");
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      console.log("Productos recibidos:", data);
      setProductos(data);
    } catch (err: any) {
      console.error("Error al cargar productos:", err);
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleAddProduct = async (formData: FormData) => {
    try {
      const nuevo = await createProducto(formData);
      console.log("Producto creado:", nuevo);
      await fetchProductos();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Hubo un error al crear el producto.");
    }
  };

  const categoriasUnicas = Array.from(
    new Set(
      productos
        .map(
          (p) =>
            p.productoAtributos?.find(
              (a) => a.atributoValor?.valor
            )?.atributoValor?.valor
        )
        .filter(Boolean)
    )
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [textFilter, categoriaFilter]);

  const productosFiltrados = productos.filter((p) => {
    const categoria =
      p.productoAtributos?.find((a) => a.atributoValor?.valor)?.atributoValor
        ?.valor || "";

    const cumpleTexto = p.nombre
      .toLowerCase()
      .includes(textFilter.toLowerCase());

    const cumpleCategoria = categoriaFilter
      ? categoria.toLowerCase() === categoriaFilter.toLowerCase()
      : true;

    return cumpleTexto && cumpleCategoria;
  });

  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = productosFiltrados.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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

      {/* Barra de búsqueda, filtro y acciones */}
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <SearchBar text={textFilter} onChange={setTextFilter} />
        <CategoryFilter
          categorias={categoriasUnicas}
          value={categoriaFilter}
          onChange={setCategoriaFilter}
        />
        {}
        <ActionButtons onProductAdded={fetchProductos} />
      </div>

      {loading && <p className="text-gray-500">Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <ProductTable
          productos={currentItems.map((p) => ({
            id: p.id,
            imagen:
              p.productoImagenes?.find((img) => img.principal)?.imagen ||
              p.productoImagenes?.[0]?.imagen ||
              "https://via.placeholder.com/40",
            producto: p.nombre,
            descripcion: p.descripcion,
            precio: p.variantes?.[0]?.precio || 0,
            sku: p.variantes?.[0]?.sku || "Sin SKU",
            estadoStk: "Disponible",
            stkTotal: p.variantes?.length || 0,
          }))}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
};

export default CategoriasPage;