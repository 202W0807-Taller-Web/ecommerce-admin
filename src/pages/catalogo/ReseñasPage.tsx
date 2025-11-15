import React, { useState } from "react";
import { Search, Eye, Star } from "lucide-react";

interface ReviewProduct {
  id: string;
  name: string;
  image: string;
  reviewsCount: number;
  rating: number;
}

const ReseñasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products: ReviewProduct[] = [
    {
      id: "1",
      name: "Pelota de Fútbol Adidas",
      image: "/img/products/pelota.png",
      reviewsCount: 34,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Guantes de Box Everlast",
      image: "/img/products/guantes.png",
      reviewsCount: 19,
      rating: 4.6,
    },
    {
      id: "3",
      name: "Bicicleta de Montaña Trek",
      image: "/img/products/bicicleta.png",
      reviewsCount: 12,
      rating: 4.9,
    },
    {
      id: "4",
      name: "Raqueta de Tenis Wilson Pro",
      image: "/img/products/raqueta.png",
      reviewsCount: 22,
      rating: 4.7,
    },
    {
      id: "5",
      name: "Zapatillas Running Nike Air",
      image: "/img/products/zapatillas.png",
      reviewsCount: 41,
      rating: 4.8,
    },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6">Gestionar reseñas</h1>

      {/* Barra de búsqueda */}
      <div className="relative w-80 mb-6">
        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar producto"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md outline-none focus:border-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        {/* Encabezados */}
        <div
          className="grid px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600"
          style={{
            gridTemplateColumns: "70px 2fr 1fr 1fr 1fr 80px",
          }}
        >
          <p></p>
          <p>Producto</p>
          <p>Nro. reseñas</p>
          <p>Número de reseñas</p>
          <p>Valoración</p>
          <p>Acción</p>
        </div>

        {/* Filas */}
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="grid items-center px-6 py-4 text-sm border-b border-gray-100"
            style={{
              gridTemplateColumns: "70px 2fr 1fr 1fr 1fr 80px",
            }}
          >
            {/* Imagen */}
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* Producto */}
            <span className="font-medium">{product.name}</span>

            {/* Nro. reseñas */}
            <p>{product.reviewsCount}</p>

            {/* Número de reseñas */}
            <p>{product.reviewsCount}</p>

            {/* Valoración */}
            <div className="flex items-center gap-1">
              <span>{product.rating.toFixed(1)}</span>
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>

            {/* Acción */}
            <button
              className="hover:opacity-70 transition"
              onClick={() => window.location.href = `/catalogo/reseñas/${product.id}`}
            >
              <Eye size={20} className="text-gray-800" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReseñasPage;
