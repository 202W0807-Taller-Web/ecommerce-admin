import React, { useState, useEffect } from "react";
import {
  getProductos,
  createProducto,
  deleteProducto,
} from "../../services/catalogo/ProductoService";
import SearchBar from "../../components/Catalogo/SearchBar";
import CategoryFilter from "../../components/Catalogo/CategoryFilter";
import ActionButtons from "../../components/Catalogo/ActionButtons";
import ProductTable from "../../components/Catalogo/ProductTable";
import type { ProductRow } from "../../components/Catalogo/ProductTable";
import Pagination from "../../components/Catalogo/Pagination";
import AddProductModal from "../../components/Catalogo/AddProductModal";
import ConfirmDeleteModal from "../../components/Catalogo/ConfirmDeleteModal";
import Breadcrumbs from "@components/Catalogo/Breadcrumbs";
import EditProductModal from "../../components/Catalogo/EditProductModal";

const ITEMS_PER_PAGE = 8;

const CategoriasPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [textFilter, setTextFilter] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | ProductRow | Record<string, unknown> | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [productoParaEditar, setProductoParaEditar] = useState<Producto | null>(null);

  // notificaciones inline
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductos();
      setProductos(res ?? []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleAddProduct = async (formData: FormData) => {
    try {
      await createProducto(formData);
      await fetchProductos();
      setShowAddModal(false);
      setNotification({ type: "success", text: "Producto creado correctamente." });
    } catch (error) {
      console.error("Error creando producto:", error);
      setNotification({ type: "error", text: "Hubo un error al crear el producto." });
    }
  };

  const handleDeleteClick = (producto: Producto | ProductRow | Record<string, unknown>) => {
    setProductoSeleccionado(producto);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productoSeleccionado) {
      setShowDeleteModal(false);
      return;
    }

    const p = productoSeleccionado as Producto;
    if (typeof p.id !== "number") {
      setNotification({ type: "error", text: "ID de producto inválido." });
      setShowDeleteModal(false);
      setProductoSeleccionado(null);
      return;
    }

    try {
      await deleteProducto(p.id);
      await fetchProductos();
      setNotification({ type: "success", text: "Producto eliminado correctamente." });
    } catch (err) {
      console.error("Error eliminando producto:", err);
      setNotification({ type: "error", text: "Hubo un error al eliminar el producto." });
    } finally {
      setShowDeleteModal(false);
      setProductoSeleccionado(null);
    }
  };

  const handleEditClick = (producto: ProductRow | Producto | Record<string, unknown>) => {
    const p = (producto as Producto) ?? null;
    if (!p || typeof (p as Producto).id !== "number") {
      const maybeOriginal = (producto as ProductRow).original as Producto | undefined;
      if (maybeOriginal && typeof maybeOriginal.id === "number") {
        setProductoParaEditar(maybeOriginal);
        setShowEditModal(true);
        return;
      }
      return;
    }
    setProductoParaEditar(p);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setProductoParaEditar(null);
  };

  const handleAfterUpdate = async (updated?: Producto) => {
    await fetchProductos();
    if (updated) setNotification({ type: "success", text: "Producto actualizado correctamente." });
  };

  const categoriasUnicas = Array.from(
    new Set(
      productos
        .map((p) => {
          const val = p.productoAtributos?.[0]?.atributoValor?.valor ?? "";
          return val;
        })
        .filter((categoria) => categoria !== "")
    )
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [textFilter, categoriaFilter]);

  const productosFiltrados = productos.filter((p) => {
    const matchesText =
      p.nombre?.toLowerCase().includes(textFilter.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(textFilter.toLowerCase());
    const matchesCategoria = categoriaFilter ? (p.productoAtributos?.[0]?.atributoValor?.valor ?? "") === categoriaFilter : true;
    return matchesText && matchesCategoria;
  });

  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = productosFiltrados.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) setSelectedIds(currentItems.map((i) => i.id));
    else setSelectedIds([]);
  };

  return (
    <div className="p-6 text-[var(--color-primary6)]">
      <Breadcrumbs items={[{ label: "Productos" }]} />
      <h2 className="text-xl font-semibold mb-4">
        Productos en categoría: {categoriaFilter || "Todas"}
      </h2>

      {/* notificación inline */}
      {notification && (
        <div className={`mb-4 p-3 rounded ${notification.type === "success" ? "bg-green-50 text-green-800" : notification.type === "error" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}>
          {notification.text}
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <SearchBar text={textFilter} onChange={setTextFilter} />
        <CategoryFilter
          categorias={categoriasUnicas}
          value={categoriaFilter}
          onChange={setCategoriaFilter}
        />
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
            original: p,
          }))}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
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

      {showDeleteModal && (
        <ConfirmDeleteModal
          message="¿Seguro que desea eliminar este producto?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showEditModal && productoParaEditar && (
        <EditProductModal
          producto={productoParaEditar}
          onClose={handleCloseEdit}
          onUpdated={handleAfterUpdate}
          onNotify={(n) => setNotification(n)}
        />
      )}
    </div>
  );
};

export default CategoriasPage;
