import { useParams } from "react-router-dom";
import { useLocal } from "./hooks/local/useLocal";
import LocalDescripcion from "./components/local/LocalDescripcion";
import { useQuery } from "@tanstack/react-query";
import { getAlmacenesFromTienda } from "@services/inventario-envios/local/api/tiendas";
import LocalDataTable from "./components/local/LocalDataTable";
import { useModal } from "@hooks/useModal";
import Button from "@components/Button";
import { Pencil } from "lucide-react";
import { LocalEditModal } from "./components/local/LocalEditModal";

export default function TiendaDetailPage() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useLocal({
    local: "tiendas",
    id: Number(id),
  });

  const tienda = data?.data;

  const {
    data: almacenesAsociados,
    isPending: isPendingAlmacenes,
    isError: isErrorAlmacenes,
  } = useQuery({
    queryKey: ["almacenesAsociados", id],
    queryFn: () => getAlmacenesFromTienda(Number(id)),
  });

  const [isEditOpen, openEditModal, closeEditModal] = useModal();

  const almacenes = almacenesAsociados?.data ?? [];
  const total = almacenesAsociados?.total ?? 3;

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
        <LocalDescripcion data={tienda} resourceName="tienda" />
        <div className="absolute bottom-4 right-4">
          <Button
            text="Editar tienda"
            variant="secondary"
            icon={Pencil}
            onClick={openEditModal}
          />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3 border-b pb-1">
        Almacenes asociadas a la tienda
      </h2>
      <LocalDataTable
        data={almacenes}
        isLoading={isPendingAlmacenes}
        isError={isErrorAlmacenes}
        resourceName="almacenes"
        page={1}
        limit={total}
      />
      <LocalEditModal
        localType="tiendas"
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        localData={tienda ?? null}
      />
    </>
  );
}
