import React, { useState, useMemo } from "react";
import AtributosTable from "../../components/Catalogo/AtributosTable";
import {
  useAtributos,
  useCreateAtributo,
  useDeleteAtributo,
} from "../../hooks/catalogo/useAtributos";
import {
  useCreateAtributoValor,
  useDeleteAtributoValor,
} from "../../hooks/catalogo/useAtributoValores";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AtributosPage: React.FC = () => {
  const { data: atributos, loading, error, refetch } = useAtributos();
  const { execute: createAtributo } = useCreateAtributo();
  const { execute: deleteAtributo } = useDeleteAtributo();
  const { execute: createValor } = useCreateAtributoValor();
  const { execute: deleteValor } = useDeleteAtributoValor();

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calcular atributos paginados
  const paginatedAtributos = useMemo(() => {
    if (!atributos) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return atributos.slice(startIndex, endIndex);
  }, [atributos, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!atributos) return 0;
    return Math.ceil(atributos.length / itemsPerPage);
  }, [atributos, itemsPerPage]);

  // Reset a la primera página cuando cambia items per page
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleCreateAtributo = async (nombre: string) => {
    const formData = new FormData();
    formData.append("Nombre", nombre);

    const success = await createAtributo(formData);
    if (success) {
      await refetch();
    }
  };

  const handleDeleteAtributo = async (id: number) => {
    const success = await deleteAtributo(id);
    if (success) {
      await refetch();
      // Si eliminamos el último item de la página actual, retroceder
      if (paginatedAtributos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleCreateValor = async (atributoId: number, valor: string) => {
    const formData = new FormData();
    formData.append("Valor", valor);

    const success = await createValor(atributoId, formData);
    if (success) {
      await refetch();
    }
  };

  const handleDeleteValor = async (valorId: number) => {
    const atributo = atributos?.find((attr) =>
      attr.atributoValores?.some((val) => val.id === valorId)
    );

    if (!atributo) {
      console.error("No se encontró el atributo para este valor");
      return;
    }

    const success = await deleteValor(atributo.id, valorId);
    if (success) {
      await refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0A648] mx-auto mb-4"></div>
          <p className="text-[#6B644C]">Cargando atributos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-semibold mb-2">
            Error al cargar atributos
          </p>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-[#363636]">
          Gestión de Atributos
        </h2>
        <p className="text-[#6B644C]">
          Administra los atributos y sus valores para los productos del catálogo
        </p>
      </div>

      {/* Selector de items por página */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6B644C]">Mostrar:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 border border-[#C0A648] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0A648] bg-white text-[#363636]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="text-sm text-[#6B644C]">por página</span>
        </div>

        <div className="text-sm text-[#6B644C]">
          Total: {atributos?.length || 0} atributo(s)
        </div>
      </div>

      <AtributosTable
        atributos={paginatedAtributos}
        onCreateAtributo={handleCreateAtributo}
        onDeleteAtributo={handleDeleteAtributo}
        onCreateValor={handleCreateValor}
        onDeleteValor={handleDeleteValor}
      />

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-[#6B644C]">
            Página {currentPage} de {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-[#C0A648] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C0A648] hover:text-white transition-colors text-[#363636]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Números de página */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-2 text-[#6B644C]">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentPage === page
                          ? "bg-[#C0A648] text-white"
                          : "border border-[#C0A648] text-[#363636] hover:bg-[#968751] hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#C0A648] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C0A648] hover:text-white transition-colors text-[#363636]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Info de rango */}
          <div className="text-sm text-[#6B644C]">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, atributos?.length || 0)} de{" "}
            {atributos?.length || 0}
          </div>
        </div>
      )}
    </div>
  );
};

export default AtributosPage;
