import FilterForm from "@components/FilterForm";
import StockDataTable from "./components/stock/StockDataTable";
import MovStockDataTable from "./components/stock/MovStockDataTable";
import SelectCategoria from "./components/SelectCategoria";
import { useProductosGlobal } from "./hooks/stock/useProductosGlobal";
import FooterTable from "@components/FooterTable";
import { useStockFilterUrl } from "./hooks/stock/useStockFilterUrl";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockPage() {
  const navigate = useNavigate();

  const { page, categoria, setPage, setCategoria } = useStockFilterUrl();

  const { data, isPending, isError } = useProductosGlobal({
    page,
    categoria,
    limit: 4,
  });

  const productos = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    per_page: 4,
    total: 0,
    total_pages: 0,
  };

  const handleFilterSubmit = (filters: Record<string, string>) => {
    setCategoria(filters.categoria || "");
  };

  const handleFilterReset = () => {
    setCategoria("");
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Stock de productos</h1>
      <FilterForm
        disabled={isPending}
        onSubmit={handleFilterSubmit}
        onReset={handleFilterReset}
      >
        <SelectCategoria defaultValue={categoria} />
      </FilterForm>
      <StockDataTable
        data={productos}
        variant="global"
        page={pagination.page}
        limit={pagination.per_page}
        isLoading={isPending}
        isError={isError}
        getActions={item => [
          {
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4 text-blue-600" />,
            onClick: () => navigate(`/inventario/productos/${item.id}`),
          },
        ]}
      />
      <FooterTable
        page={pagination.page}
        limit={pagination.per_page}
        total_pages={pagination.total_pages}
        total={pagination.total}
        handlePageChange={setPage}
      />
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-1">
        Historial de movimiento
      </h2>
      <MovStockDataTable />
    </>
  );
}
