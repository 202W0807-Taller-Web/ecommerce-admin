import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Loader2 } from "lucide-react";
import { getResenasByProducto } from "../../services/catalogo/ResenaService";
import type { Resena } from "../../services/catalogo/ResenaService";


const DetalleReseñasPage: React.FC = () => {
  const { id } = useParams();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getResenasByProducto(Number(id));
        setResenas(data);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const productoNombre = `Producto ${id}`;

  return (
    <div className="w-full px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6">
        Reseñas de {productoNombre}
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div
            className="grid px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600"
            style={{ gridTemplateColumns: "60px 2fr 1fr 1fr" }}
          >
            <input type="checkbox" />
            <p>Usuario</p>
            <p>Fecha</p>
            <p>Rating</p>
          </div>

          {resenas.map((r) => (
            <div
              key={r.id}
              className="grid items-center px-6 py-4 text-sm border-b border-gray-100"
              style={{ gridTemplateColumns: "60px 2fr 1fr 1fr" }}
            >
              <input type="checkbox" />

              {/* Usuario */}
              <p>{r.usuarioNombre ?? "Sin nombre"}</p>

              {/* Fecha */}
              <p>{new Date(r.fecha).toISOString().split("T")[0]}</p>

              {/* Rating */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i <= r.calificacion
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          {resenas.length === 0 && (
            <p className="p-6 text-gray-500 text-center">Sin reseñas aún</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetalleReseñasPage;
