import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; // importa tu componente modal

interface Producto {
  id: number;
  imagen: string;
  producto: string;
  estadoStk: string;
  stkTotal: number;
}

interface ProductTableProps {
  productos?: Producto[];
  selectedIds?: number[];
  onSelect?: (id: number) => void;
  onSelectAll?: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  productos = [],
  selectedIds = [],
  onSelect = () => {},
  onSelectAll = () => {},
}) => {
  const navigate = useNavigate();
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  const allSelected = selectedIds.length === productos.length && productos.length > 0;

  const handleEditClick = (producto: Producto) => {
    console.log(
      `🟢 Navegando a /catalogo/productos/${producto.id}/variantes con nombre: ${producto.producto}`
    );

    navigate(`/catalogo/productos/${producto.id}/variantes`, {
      state: { nombreProducto: producto.producto },
    });
  };

  const handleDeleteClick = (producto: Producto) => {
    setProductoAEliminar(producto);
  };

  const handleConfirmDelete = () => {
    if (productoAEliminar) {
      console.log("🗑️ Eliminando producto:", {
        id: productoAEliminar.id,
        nombre: productoAEliminar.producto,
      });
    }
    setProductoAEliminar(null);
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-2xl shadow-sm">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="accent-gray-500 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">Imagen</th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">Producto</th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">Estado</th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">Cantidad</th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">Acción</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr
              key={p.id}
              className="bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all"
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => onSelect(p.id)}
                  className="accent-gray-500 cursor-pointer"
                />
              </td>
              <td className="py-3 px-4">
                <img
                  src={p.imagen}
                  alt={p.producto}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="py-3 px-4 text-gray-800 font-medium">{p.producto}</td>
              <td
                className={`py-3 px-4 font-medium ${
                  p.estadoStk === "Disponible" ? "text-green-600" : "text-red-500"
                }`}
              >
                {p.estadoStk}
              </td>
              <td className="py-3 px-4 text-gray-700 font-semibold">{p.stkTotal}</td>
              <td className="py-3 px-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(p)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="Ver variantes"
                >
                  <Pencil className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>

                <button
                  onClick={() => handleDeleteClick(p)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                </button>
              </td>
            </tr>
          ))}

          {productos.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-6 italic">
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {productoAEliminar && (
        <ConfirmDeleteModal
          message="¿Seguro que desea eliminar este producto?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductoAEliminar(null)}
        />
      )}
    </div>
  );
};

export default ProductTable;
