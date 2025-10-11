import React, { useState } from "react";
import { Search } from "lucide-react";
import ReseñaRow from "../../components/Reseña/ReseñaRow";

type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  nroReseñas: number;
  valoracion: number;
};

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Zapatillas Nike Air Zoom Pegasus 40",
    imagen:
      "https://sudamericasport.com.pe/cdn/shop/files/000000097889--1_2000x2000.jpg?v=1697053367",
    nroReseñas: 240,
    valoracion: 4.6,
  },
  {
    id: 2,
    nombre: "Balón de Fútbol Adidas Al Rihla Pro",
    imagen:
      "https://cloud.mideporte.pe/wp-content/uploads/2023/05/H57786_1.webp",
    nroReseñas: 180,
    valoracion: 4.8,
  },
  {
    id: 3,
    nombre: "Guantes de Entrenamiento Under Armour",
    imagen:
      "https://home.ripley.com.pe/Attachment/WOP_5/2020264152558/2020264152558_2.jpg",
    nroReseñas: 96,
    valoracion: 4.3,
  },
  {
    id: 4,
    nombre: "Botella Deportiva Reutilizable Hydro Flask",
    imagen: "https://media.falabella.com.pe/falabellaPE/20227113_1/public",
    nroReseñas: 132,
    valoracion: 4.7,
  },
  {
    id: 5,
    nombre: "Mochila Deportiva Nike Brasilia",
    imagen:
      "https://www.nike.com.pe/on/demandware.static/-/Sites-catalog-equinox/default/dw88fc3d66/images/hi-res/196154143929_1_20240208120000-mrtPeru.jpeg",
    nroReseñas: 210,
    valoracion: 4.5,
  },
];

const ReseñasPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "#2c2c2c",
          marginBottom: 16,
        }}
      >
        Gestionar reseñas
      </h2>

      {/* Barra de búsqueda */}
      <div
        style={{
          position: "relative",
          marginBottom: 24,
          width: "100%",
          maxWidth: 320,
        }}
      >
        <Search
          size={18}
          color="#9ca3af"
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <input
          type="text"
          placeholder="Buscar producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px 8px 34px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 14,
            backgroundColor: "white",
          }}
        />
      </div>

      {/* Tabla */}
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#f3f4f6",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f3f4f6",
                borderBottom: "1px solid #2c2c2c", 
              }}
            >
              <th
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#2c2c2c",
                }}
              >
                Producto
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: 14,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#2c2c2c",
                }}
              >
                Nro. reseñas
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: 14,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#2c2c2c",
                }}
              >
                Valoración
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: 14,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#2c2c2c",
                }}
              >
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.map((p) => (
              <ReseñaRow
                key={p.id}
                imagen={p.imagen}
                nombre={p.nombre}
                nroReseñas={p.nroReseñas}
                valoracion={p.valoracion}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReseñasPage;
