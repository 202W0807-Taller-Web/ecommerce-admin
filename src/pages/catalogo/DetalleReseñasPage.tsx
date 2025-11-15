import React from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

const DetalleReseñasPage: React.FC = () => {
  const { id } = useParams();

  // Datos temporales (simulando reseñas)
  const reviews = [
    { user: "Usuario 1", date: "2025-01-10", rating: 4 },
    { user: "Usuario 2", date: "2025-01-08", rating: 5 },
    { user: "Usuario 3", date: "2025-01-03", rating: 3 },
    { user: "Usuario 4", date: "2025-01-01", rating: 4 },
    { user: "Usuario 5", date: "2024-12-29", rating: 2 },
    { user: "Usuario 6", date: "2024-12-20", rating: 5 },
  ];

  const productoNombre = `Producto ${id}`;

  return (
    <div className="w-full px-8 py-6">

      {/* Título */}
      <h1 className="text-2xl font-semibold mb-6">
        Reseñas de {productoNombre}
      </h1>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        {/* Encabezados */}
        <div
          className="grid px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600"
          style={{
            gridTemplateColumns: "60px 2fr 1fr 1fr",
          }}
        >
          <input type="checkbox" />
          <p>Usuario</p>
          <p>Fecha</p>
          <p>Rating</p>
        </div>

        {/* Filas */}
        {reviews.map((r, index) => (
          <div
            key={index}
            className="grid items-center px-6 py-4 text-sm border-b border-gray-100"
            style={{
              gridTemplateColumns: "60px 2fr 1fr 1fr",
            }}
          >
            {/* Checkbox */}
            <input type="checkbox" />

            {/* Usuario */}
            <p>{r.user}</p>

            {/* Fecha */}
            <p>{r.date}</p>

            {/* Rating */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i <= r.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetalleReseñasPage;
