import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import AddAtributoModal from "../../components/Catalogo/AddAtributoModal";
import AtributosTable from "../../components/Catalogo/AtributosTable";

type Atributo = {
  id: number;
  atributo: string;
  tipo: string;
  valor: string;
};

const ITEMS_PER_PAGE = 5;

const AtributosPage: React.FC = () => {
  const [atributos, setAtributos] = useState<Atributo[]>([
    { id: 1, atributo: "Color", tipo: "Texto", valor: "Rojo" },
    { id: 2, atributo: "Tamaño", tipo: "Número", valor: "42" },
    { id: 3, atributo: "Material", tipo: "Texto", valor: "Algodón" },
    { id: 4, atributo: "Peso", tipo: "Número", valor: "200" },
    { id: 5, atributo: "Marca", tipo: "Texto", valor: "Nike" },
    { id: 6, atributo: "Modelo", tipo: "Texto", valor: "Air Max" },
    { id: 7, atributo: "Stock", tipo: "Número", valor: "10" },
  ]);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTipo, setSelectedTipo] = useState("Todos");

  // Tipos dinámicos según los atributos existentes
  const tipos = ["Todos", ...Array.from(new Set(atributos.map(a => a.tipo)))];

  const filteredAtributos = atributos.filter(
    (a) =>
      a.atributo.toLowerCase().includes(search.toLowerCase()) &&
      (selectedTipo === "Todos" || a.tipo === selectedTipo)
  );

  const totalPages = Math.ceil(filteredAtributos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredAtributos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTipo]);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedIds(currentItems.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleAddAtributo = (atributo: Atributo) => {
    setAtributos((prev) => [...prev, { ...atributo, id: prev.length + 1 }]);
    setShowModal(false);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Bloque superior sin fondo */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Atributos</h2>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-2/3">
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Buscar atributo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 bg-white pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <Plus size={18} /> Agregar Atributo
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <AtributosTable
          atributos={currentItems}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      </div>

      {/* Paginación centrada con flechas */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <button onClick={goToPrevious} className="text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded-md text-sm transition-all ${
              currentPage === page
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}

        <button onClick={goToNext} className="text-gray-500 hover:text-gray-700">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <AddAtributoModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddAtributo}
        />
      )}
    </div>
  );
};

export default AtributosPage;
