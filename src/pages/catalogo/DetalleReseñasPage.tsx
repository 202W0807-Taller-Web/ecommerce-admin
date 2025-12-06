import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Trash2, Loader2 } from "lucide-react";

import { getResenasByProducto, deleteResena } from "../../services/catalogo/ResenaService";
import type { Resena } from "../../services/catalogo/ResenaService";

import { getProductoById } from "../../services/catalogo/ProductoService";
import type { Producto } from "../../services/catalogo/ProductoService";

import Pagination from "../../components/Catalogo/Pagination";
import ConfirmDeleteModal from "../../components/Catalogo/ConfirmDeleteModal";

const ITEMS_PER_PAGE = 8;

const DetalleReseñasPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [resenaToDelete, setResenaToDelete] = useState<Resena | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [resenasData, productoData] = await Promise.all([
          getResenasByProducto(Number(id)),
          getProductoById(Number(id)),
        ]);
        setResenas(resenasData);
        setProducto(productoData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderStars = (value: number) => {
    const full = Math.floor(value);
    const hasHalf = value % 1 !== 0;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= full) return <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />;
          if (i === full + 1 && hasHalf) {
            return (
              <div key={i} className="relative w-4 h-4">
                <Star size={16} className="text-gray-300" />
                <Star
                  size={16}
                  className="text-yellow-400 fill-yellow-400 absolute top-0 left-0 overflow-hidden"
                  style={{ width: "50%" }}
                />
              </div>
            );
          }
          return <Star key={i} size={16} className="text-gray-300" />;
        })}
      </div>
    );
  };

  const totalPages = Math.ceil(resenas.length / ITEMS_PER_PAGE);
  const paginated = resenas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openDeleteModal = (resena: Resena) => {
    setResenaToDelete(resena);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!resenaToDelete) return;
    setLoadingDelete(true);
    try {
      await deleteResena(resenaToDelete.id);
      setResenas(resenas.filter((r) => r.id !== resenaToDelete.id));
      setModalOpen(false);
      setResenaToDelete(null);
    } catch (error) {
      console.error("Error eliminando reseña:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center w-full" style={{ height: "80vh" }}>
        <Loader2 className="animate-spin text-gray-700" size={48} />
      </div>
    );

  return (
    <div className="w-full px-8 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 text-xl"
          style={{ background: "none", border: "none", padding: "4px 8px", cursor: "pointer" }}
        >
          &lt;
        </button>
        {producto && <h1 className="text-2xl font-semibold">Reseñas de {producto.nombre}</h1>}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600" style={{ gridTemplateColumns: "50px 2fr 1fr 1fr 3fr 70px" }}>
          <input type="checkbox" />
          <p>Usuario</p>
          <p>Fecha</p>
          <p>Rating</p>
          <p>Comentario</p>
          <p>Acción</p>
        </div>

        {paginated.map((r) => (
          <div key={r.id} className="grid items-center px-6 py-4 text-sm border-b border-gray-100" style={{ gridTemplateColumns: "50px 2fr 1fr 1fr 3fr 70px" }}>
            <input type="checkbox" />
            <p>{r.nombre_usuario || "Sin nombre"}</p>
            <p>{new Date(r.fecha_resena).toISOString().split("T")[0]}</p>
            {renderStars(r.calificacion)}
            <p className="text-gray-700">{r.comentario || "Sin comentario"}</p>
            <div className="flex justify-center">
              <button onClick={() => openDeleteModal(r)} className="text-yellow-800 hover:text-yellow-900">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {resenas.length === 0 && <p className="p-6 text-gray-500 text-center">Sin reseñas aún</p>}
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      {modalOpen && resenaToDelete && (
        <ConfirmDeleteModal
          message="¿Estás seguro de que deseas eliminar esta reseña?"
          onCancel={() => setModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default DetalleReseñasPage;
