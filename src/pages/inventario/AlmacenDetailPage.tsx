import { useParams } from "react-router-dom";
import { useLocal } from "./hooks/local/useLocal";
import LocalDescripcion from "./components/local/LocalDescripcion";
import LocalDataTable from "./components/local/LocalDataTable";
import { useQuery } from "@tanstack/react-query";
import { getTiendasFromAlmacen } from "@services/inventario-envios/local/api/almacenes";
import StockDataTable from "./components/stock/StockDataTable";
import Button from "@components/Button";
import { Pencil } from "lucide-react";
import { useModal } from "@hooks/useModal";
import { LocalEditModal } from "./components/local/LocalEditModal";

export default function AlmacenDetailPage() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useLocal({
    local: "almacenes",
    id: Number(id),
  });

  const [isEditOpen, openEditModal, closeEditModal] = useModal();

  const almacen = data?.data;

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
      <StockDataTable limit={3} page={1} />
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
