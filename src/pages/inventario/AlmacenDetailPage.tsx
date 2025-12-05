import { useNavigate, useParams } from "react-router-dom";
import { useLocal } from "./hooks/local/useLocal";
import LocalDescripcion from "./components/local/LocalDescripcion";
import LocalDataTable from "./components/local/LocalDataTable";
import { useQuery } from "@tanstack/react-query";
import { getTiendasFromAlmacen } from "@services/inventario-envios/local/api/almacenes";
import StockDataTable from "./components/stock/StockDataTable";
import Button from "@components/Button";
import { Eye, Pencil } from "lucide-react";
import { useModal } from "@hooks/useModal";
import { LocalEditModal } from "./components/local/LocalEditModal";
import { useProductosPorLocal } from "./hooks/stock/useProductosPorLocal";
import FooterTable from "@components/FooterTable";
import { useState } from "react";

export default function AlmacenDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [page, setPage] = useState<number>(1);

  const { data, isPending, isError, error } = useLocal({
    local: "almacenes",
    id: Number(id),
  });

  const [isEditOpen, openEditModal, closeEditModal] = useModal();

  const almacen = data?.data;

  const {
    data: productosData,
    isPending: isLoadingProductos,
    isError: isErrorProductos,
  } = useProductosPorLocal({
    id_local: Number(id),
    page,
    limit: 3,
  });

  const productos = productosData?.data ?? [];
  const pagination = productosData?.pagination ?? {
    page: 1,
    per_page: 3,
    total: 0,
    total_pages: 0,
  };

  const {
    data: tiendasAsociadas,
    isPending: isPendingTiendas,
    isError: isErrorTiendas,
  } = useQuery({
    queryKey: ["tiendasAsociadas", id],
    queryFn: () => getTiendasFromAlmacen(Number(id)),
  });

  const tiendas = tiendasAsociadas?.data ?? [];
  const total = tiendasAsociadas?.total ?? 3;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isPending)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Cargando...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <p className="text-red-500 font-semibold">Ocurrió un error:</p>
        <p className="text-sm text-gray-600">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </div>
    );

  return (
    <>
      <div className="relative mb-6">
        <LocalDescripcion data={almacen} resourceName="almacen" />
        <div className="absolute bottom-4 right-4">
          <Button
            text="Editar almacén"
            variant="secondary"
            icon={Pencil}
            onClick={openEditModal}
          />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-1">
        Productos en el almacén
      </h2>
      <StockDataTable
        data={productos}
        variant="por-local"
        limit={pagination.per_page}
        page={page}
        isLoading={isLoadingProductos}
        isError={isErrorProductos}
        getActions={item => [
          {
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4 text-blue-600" />,
            onClick: () =>
              navigate(`/inventario/productos/${item.id_producto}`),
          },
        ]}
      />
      <FooterTable
        page={pagination.page}
        limit={pagination.per_page}
        total_pages={pagination.total_pages}
        total={pagination.total}
        handlePageChange={handlePageChange}
      />
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3 border-b pb-1">
        Tiendas asociadas al almacén
      </h2>
      <LocalDataTable
        data={tiendas}
        isLoading={isPendingTiendas}
        isError={isErrorTiendas}
        resourceName="tiendas"
        page={1}
        limit={total}
      />
      <LocalEditModal
        localType="almacenes"
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        localData={almacen ?? null}
      />
    </>
  );
}
