import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Producto } from "../../types/catalogo/Productos";
import { useNavigate } from "react-router-dom";

export interface ProductRow {
  id: number;
  imagen: string;
  producto: string;
  descripcion?: string;
  precio?: number;
  sku?: string;
  estadoStk: string;
  stkTotal: number;
  original?: Producto | Record<string, unknown>;
}

interface ProductTableProps {
  productos?: ProductRow[];
  selectedIds?: number[];
  onSelect?: (id: number) => void;
  onSelectAll?: (selectAll: boolean) => void;
  onDelete: (producto: ProductRow | Producto) => void;
  onEdit?: (producto: ProductRow | Producto) => void;
}

export default function ProductTable({
  productos = [],
  selectedIds = [],
  onSelect = () => {},
  onSelectAll = () => {},
  onDelete,
  onEdit = () => {},
}: ProductTableProps) {
  const navigate = useNavigate();

  const allSelected =
    selectedIds.length === productos.length && productos.length > 0;

  const handleViewClick = (producto: ProductRow) => {
    navigate(`/catalogo/productos/${producto.id}/variantes`, {
      state: { nombreProducto: producto.producto },
    });
  };

  return (
    <div className="w-full bg-[var(--color-base)] p-6 rounded-2xl shadow-sm">
      {/* uso table-fixed y colgroup para alinear y dar anchos estables */}
      <table className="w-full table-fixed border-separate border-spacing-y-2">
        <colgroup>
          <col style={{ width: "4%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>

        <thead>
          <tr className="text-left" style={{ backgroundColor: "rgba(0,0,0,0.03)" }}>
            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="accent-[var(--color-primary1)] cursor-pointer"
              />
            </th>

            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)] text-center">
              Imagen
            </th>

            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)]">
              Nombre
            </th>

            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)]">
              Descripción
            </th>

            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)] text-center">
              Variantes
            </th>

            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)] text-center">
              Stock
            </th>

            <th className="py-3 px-4 font-semibold text-[var(--color-primary5)] border-b-2 border-[rgba(0,0,0,0.06)] text-center">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr
              key={p.id}
              className="bg-[var(--color-base)] hover:bg-[rgba(0,0,0,0.02)] transition-all"
            >
              <td className="py-3 px-4 align-middle text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => onSelect(p.id)}
                  className="accent-[var(--color-primary1)] cursor-pointer"
                />
              </td>

              <td className="py-3 px-4 text-center align-middle">
                <img
                  src={p.imagen}
                  alt={p.producto}
                  className="w-12 h-12 rounded-md object-cover mx-auto"
                />
              </td>

              <td className="py-3 px-4 text-[var(--color-primary6)] font-medium align-middle">
                <div className="flex flex-col">
                  <span className="truncate">{p.producto}</span>
                </div>
              </td>

              <td className="py-3 px-4 text-[var(--color-primary5)] align-middle">
                {p.descripcion ? (
                  <span className="block text-sm truncate" title={p.descripcion}>
                    {p.descripcion}
                  </span>
                ) : (
                  <span className="text-[var(--color-primary4)] text-sm">Sin descripción</span>
                )}
              </td>

              <td className="py-3 px-4 text-[var(--color-primary6)] font-semibold text-center align-middle">
                {p.stkTotal}
              </td>

              <td className="py-3 px-4 text-center align-middle">
                <span className="inline-block px-2 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">
                  Disponible
                </span>
              </td>

              <td className="py-3 px-4 text-center align-middle">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleViewClick(p)}
                    className="p-2 rounded-full hover:bg-[var(--color-primary4)]/20 transition"
                    title="Ver variantes"
                  >
                    <Eye className="w-5 h-5 text-[var(--color-primary6)]" />
                  </button>

                  <button
                    onClick={() => onEdit((p.original as Producto) ?? p)}
                    className="p-2 rounded-full hover:bg-[var(--color-primary4)]/20 transition"
                    title="Editar producto"
                  >
                    <Pencil className="w-5 h-5 text-[var(--color-primary6)]" />
                  </button>

                  <button
                    onClick={() => onDelete((p.original as Producto) ?? p)}
                    className="p-2 rounded-full hover:bg-[var(--color-primary4)]/20 transition"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5 text-red" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {productos.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center text-[var(--color-primary4)] py-6 italic"
              >
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}