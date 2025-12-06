import React, { useState, useEffect } from "react";
import { Search, Eye, Star } from "lucide-react";

interface Product {
  id: number;
  nombre: string;
  imagen_url: string;
}

interface ProductWithStats {
  id: number;
  name: string;
  image: string;
  reviewsCount: number;
  rating: number;
}

const API_URL = "https://resenas-gybuf9h7fsgwd2ez.canadacentral-01.azurewebsites.net";

const ReseñasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos`);
        const data: Product[] = await res.json();

        const enriched = await Promise.all(
          data.map(async (product) => {
            const r = await fetch(`${API_URL}/api/productos/${product.id}/reseñas`);
            const reviews = await r.json();

            const count = reviews.length;
            const avg =
              count > 0
                ? reviews.reduce((acc: number, x: any) => acc + x.calificacion, 0) / count
                : 0;

            const img = product.imagen_url || "/img/products/default.png";

            return {
              id: product.id,
              name: product.nombre,
              image: img,
              reviewsCount: count,
              rating: avg,
            };
          })
        );

        setProducts(enriched);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="p-6">Cargando productos...</p>;

  return (
    <div className="w-full px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6">Gestionar reseñas</h1>

      <div className="relative w-80 mb-6">
        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar producto"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div
          className="grid px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600"
          style={{ gridTemplateColumns: "70px 2fr 1fr 1fr 80px" }}
        >
          <p></p>
          <p>Producto</p>
          <p>N° reseñas</p>
          <p>Valoración</p>
          <p>Acción</p>
        </div>

        {filtered.map((product) => (
          <div
            key={product.id}
            className="grid items-center px-6 py-4 text-sm border-b border-gray-100"
            style={{ gridTemplateColumns: "70px 2fr 1fr 1fr 80px" }}
          >
            <div className="flex justify-center">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
            </div>

            <span className="font-medium">{product.name}</span>

            <p>{product.reviewsCount}</p>

            <div className="flex items-center gap-1">
              <span>{product.rating.toFixed(1)}</span>
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>

            <button
              className="hover:opacity-70 transition"
              onClick={() => (window.location.href = `/catalogo/reseñas/${product.id}`)}
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
