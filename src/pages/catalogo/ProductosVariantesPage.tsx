import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import type { Variante } from "../../types/catalogo/Variantes";
import {
  getVariantesByProductoId,
  createVariante,
  deleteVariante,
} from "../../services/catalogo/VarianteService";
import SearchBar from "../../components/Catalogo/SearchBar";
import Pagination from "../../components/Catalogo/Pagination";
import AddVarianteModal from "../../components/Catalogo/AddVarianteModal";
import ConfirmDeleteModal from "../../components/Catalogo/ConfirmDeleteModal";
import { Trash2, Pencil } from "lucide-react";
import Breadcrumbs from "../../components/Catalogo/Breadcrumbs";

const ITEMS_PER_PAGE = 6;

const ProductosVariantesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const productoId = Number(id);

  const locationState = location.state as { nombreProducto?: string } | undefined;
  const nombreProducto = locationState?.nombreProducto ?? "Producto";

  type ExtendedVariante = Variante & {
    atributos?: { valor: string }[];
    imagenes?: string[];
    original?: Record<string, unknown>;
  };

  const [variantes, setVariantes] = useState<ExtendedVariante[]>([]);
  const [textFilter, setTextFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [varianteToDelete, setVarianteToDelete] = useState<ExtendedVariante | null>(null);

  const fetchVariantes = useCallback(async () => {
    if (!productoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getVariantesByProductoId(productoId);
      setVariantes(data as ExtendedVariante[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || "Error al cargar variantes");
    } finally {
      setLoading(false);
    }
  }, [productoId]);

  useEffect(() => {
    void fetchVariantes();
  }, [fetchVariantes]);

  const variantesFiltradas = variantes.filter((v) =>
    v.atributos?.some((a) =>
      a.valor.toLowerCase().includes(textFilter.toLowerCase())
    )
  );

  const totalPages = Math.ceil(variantesFiltradas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = variantesFiltradas.slice(
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
    setSelectedIds(allSelected ? [] : currentItems.map((v) => v.id));
  };

  const handleAddVariante = async (formData: FormData) => {
    try {
      await createVariante(productoId, formData);
      setShowAddModal(false);
      await fetchVariantes();
    } catch (err: unknown) {
      console.error(err);
      alert("Error al crear la variante. Revisa la consola.");
    }
  };

  const handleOpenDeleteModal = (variante: ExtendedVariante) => {
    setVarianteToDelete(variante);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!varianteToDelete) return;

    try {
      console.log("Eliminando variante:", varianteToDelete.id);
      await deleteVariante(productoId, varianteToDelete.id);
      await fetchVariantes();
      setShowDeleteModal(false);
      setVarianteToDelete(null);
    } catch (err: unknown) {
      console.error("Error al eliminar la variante:", err);
      alert("Hubo un error al eliminar la variante. Inténtalo de nuevo.");
      setShowDeleteModal(false);
      setVarianteToDelete(null);
    }
  };

  const breadcrumbItems = [
    { label: "Inicio", path: "/catalogo/productos" },
    { label: nombreProducto },
  ];

  return (
    <div className="p-6 text-gray-800">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Variantes de <span>{nombreProducto}</span>
        </h2>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <SearchBar text={textFilter} onChange={setTextFilter} />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-black border px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          + Agregar variante
        </button>
      </div>

      {loading && <p className="text-gray-500">Cargando variantes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === currentItems.length &&
                      currentItems.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3">Imagen</th>
                <th className="p-3">Atributos</th>
                <th className="p-3">Precio</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((v) => (
                  <tr
                    key={v.id}
                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                      selectedIds.includes(v.id) ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v.id)}
                        onChange={() => handleSelect(v.id)}
                      />
                    </td>
                        <td className="p-3">
                          <img
                            src={v.imagenes?.[0]}
                            alt="Variante"
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                        </td>
                        <td className="p-3">
                          {v.atributos?.map((a) => a.valor).join(" - ") || "—"}
                        </td>
                        <td className="p-3">S/ {v.precio?.toFixed(2)}</td>
                    <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            /* botón lápiz presente pero SIN funcionalidad por ahora */
                            className="text-gray-600 hover:text-gray-800 p-1 rounded"
                            title="Editar variante"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleOpenDeleteModal(v)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar variante"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No hay variantes disponibles para este producto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {showAddModal && (
        <AddVarianteModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddVariante}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          message="¿Seguro que desea eliminar esta variante?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ProductosVariantesPage;