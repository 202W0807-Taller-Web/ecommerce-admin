import { useParams } from "react-router-dom";
import { useLocal } from "./hooks/local/useLocal";
import LocalDescripcion from "./components/local/LocalDescripcion";
import LocalDataTable from "./components/local/LocalDataTable";
import { useQuery } from "@tanstack/react-query";
import { getTiendasFromAlmacen } from "@services/inventario-envios/local/api/almacenes";

export default function AlmacenDetailPage() {
  const { id } = useParams();

  const { data, isPending, isError, error } = useLocal({
    local: "almacenes",
    id: Number(id),
  });

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
      <LocalDescripcion data={almacen} resourceName="almacen" />
      <h2>Productos en el almacén</h2>
      <p>Data de otra entidad</p>
      <h2>Tiendas asociadas al almacén</h2>
      <LocalDataTable
        data={tiendas}
        isLoading={isPendingTiendas}
        isError={isErrorTiendas}
        resourceName="tiendas"
        page={1}
        limit={total}
      />
    </>
  );
}
