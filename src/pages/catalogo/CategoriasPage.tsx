import React, { useState, useEffect } from "react";
import type { Producto } from "../../types/catalogo/Productos";
import SearchBar from "../../components/Catalogo/SearchBar";
import CategoryFilter from "../../components/Catalogo/CategoryFilter";
import ActionButtons from "../../components/Catalogo/ActionButtons";
import ProductTable, { type ProductRow } from "../../components/Catalogo/ProductTable";
import Pagination from "../../components/Catalogo/Pagination";
import AddProductModal from "../../components/Catalogo/AddProductModal";
import ConfirmDeleteModal from "../../components/Catalogo/ConfirmDeleteModal";
import Breadcrumbs from "@components/Catalogo/Breadcrumbs";
import EditProductModal from "../../components/Catalogo/EditProductModal";
import { getProductos, createProducto, deleteProducto } from "../../services/catalogo/ProductoService";

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

    // Determinar id robustamente (soporta ProductRow o Producto)
    const sel = productoSeleccionado as any;
    const id =
      typeof sel.id === "number" ? sel.id : typeof sel?.original?.id === "number" ? sel.original.id : undefined;

    if (typeof id !== "number") {
      setNotification({ type: "error", text: "ID de producto inválido." });
      setShowDeleteModal(false);
      setProductoSeleccionado(null);
      return;
    }

    // Optimistic UI: eliminar localmente para que la lista se actualice de inmediato
    const snapshot = productos; // snapshot para posible rollback
    setProductos((prev) => prev.filter((x) => x.id !== id));
    setShowDeleteModal(false);

    try {
      await deleteProducto(id);
      // Éxito: refrescar para asegurar consistencia final
      await fetchProductos();
      setNotification({ type: "success", text: "Producto eliminado correctamente." });
    } catch (err: any) {
      // Si el backend responde 404, consideramos eliminado igualmente
      const status = err?.response?.status;
      if (status === 404) {
        await fetchProductos();
        setNotification({ type: "success", text: "Producto eliminado correctamente." });
      } else {
        // rollback y notificar error
        setProductos(snapshot);
        console.error("Error eliminando producto:", err);
        setNotification({ type: "error", text: "Hubo un error al eliminar el producto." });
      }
    } finally {
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
          const val = (p as any).productoAtributos?.[0]?.atributoValor?.valor ?? "";
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
      (p.nombre?.toLowerCase().includes(textFilter.toLowerCase()) ?? false) ||
      (p.descripcion?.toLowerCase().includes(textFilter.toLowerCase()) ?? false);
    const matchesCategoria = categoriaFilter ? ((p as any).productoAtributos?.[0]?.atributoValor?.valor ?? "") === categoriaFilter : true;
    return matchesText && matchesCategoria;
  });

  const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = productosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      <h2 className="text-xl font-semibold mb-4">Productos en categoría: {categoriaFilter || "Todas"}</h2>

      {notification && (
        <div className={`mb-4 p-3 rounded ${notification.type === "success" ? "bg-[var(--color-primary1)]/10 text-[var(--color-primary5)]" : notification.type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
          {notification.text}
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <SearchBar text={textFilter} onChange={setTextFilter} />
        <CategoryFilter categorias={categoriasUnicas} value={categoriaFilter} onChange={setCategoriaFilter} />
        <ActionButtons onProductAdded={fetchProductos} onNotify={(n) => setNotification(n)} />
      </div>

      {loading && <p className="text-[var(--color-primary5)]">Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <ProductTable
          productos={currentItems.map((p) => ({
            id: p.id,
            imagen:
              (p as any).productoImagenes?.find((img: any) => img.principal)?.imagen ||
              (p as any).productoImagenes?.[0]?.imagen ||
              "https://via.placeholder.com/40",
            producto: p.nombre,
            descripcion: p.descripcion,
            precio: (p as any).variantes?.[0]?.precio || 0,
            sku: (p as any).variantes?.[0]?.sku || "Sin SKU",
            estadoStk: "Disponible",
            stkTotal: ((p as any).variantes?.length) || 0,
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
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
          onNotify={(n) => setNotification(n)}
        />
      )}

      {showDeleteModal && <ConfirmDeleteModal message="¿Seguro que desea eliminar este producto?" onCancel={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}

      {showEditModal && productoParaEditar && <EditProductModal producto={productoParaEditar} onClose={handleCloseEdit} onUpdated={handleAfterUpdate} onNotify={(n) => setNotification(n)} />}
    </div>
  );
};

export default CategoriasPage;
