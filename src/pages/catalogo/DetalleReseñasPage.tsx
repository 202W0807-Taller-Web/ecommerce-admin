import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Loader2 } from "lucide-react";

import { getResenasByProducto } from "../../services/catalogo/ResenaService";
import type { Resena } from "../../services/catalogo/ResenaService";

import { getProductoById } from "../../services/catalogo/ProductoService";
import type { Producto } from "../../services/catalogo/ProductoService";

import Pagination from "../../components/Catalogo/Pagination";

const ITEMS_PER_PAGE = 8;

const DetalleReseñasPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [producto, setProducto] = useState<Producto | null>(null);

  const [loadingResenas, setLoadingResenas] = useState(true);
  const [loadingProducto, setLoadingProducto] = useState(true);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchResenas = async () => {
      try {
        const data = await getResenasByProducto(Number(id));
        setResenas(data);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      } finally {
        setLoadingResenas(false);
      }
    };

    const fetchProducto = async () => {
      try {
        const prod = await getProductoById(Number(id));
        setProducto(prod);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoadingProducto(false);
      }
    };

    fetchResenas();
    fetchProducto();
  }, [id]);

  const loading = loadingResenas || loadingProducto;

  const renderStars = (value: number) => {
    const full = Math.floor(value);
    const hasHalf = value % 1 !== 0;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= full) {
            return (
              <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            );
          }

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
  const paginated = resenas.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full px-8 py-6">

      {/* ---------- BOTÓN ATRÁS + TÍTULO ---------- */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 text-xl"
          style={{
            background: "none",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          &lt;
        </button>

        {!loading && (
          <h1 className="text-2xl font-semibold">
            Reseñas de {producto?.nombre ?? "Producto desconocido"}
          </h1>
        )}
      </div>

      {loading ? (
        // 🔥 Loader centrado vertical + horizontal
        <div className="flex items-center justify-center w-full" style={{ height: "80vh" }}>
          <Loader2 className="animate-spin text-gray-700" size={48} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div
              className="grid px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600"
              style={{ gridTemplateColumns: "50px 2fr 1fr 1fr 3fr" }}
            >
              <input type="checkbox" />
              <p>Usuario</p>
              <p>Fecha</p>
              <p>Rating</p>
              <p>Comentario</p>
            </div>

            {paginated.map((r) => (
              <div
                key={r.id}
                className="grid items-center px-6 py-4 text-sm border-b border-gray-100"
                style={{ gridTemplateColumns: "50px 2fr 1fr 1fr 3fr" }}
              >
                <input type="checkbox" />

                <p>{r.nombre_usuario || "Sin nombre"}</p>

                <p>{new Date(r.fecha_resena).toISOString().split("T")[0]}</p>

                {renderStars(r.calificacion)}

                <p className="text-gray-700">{r.comentario || "Sin comentario"}</p>
              </div>
            ))}

            {resenas.length === 0 && (
              <p className="p-6 text-gray-500 text-center">Sin reseñas aún</p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DetalleReseñasPage;
