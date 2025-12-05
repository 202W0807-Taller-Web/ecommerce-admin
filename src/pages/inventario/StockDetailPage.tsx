import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductoById } from "@services/inventario-envios/inventory/api/temp";
import { useLocalesPorProducto } from "./hooks/stock/useLocalesPorProductos";
import StockDataTable from "./components/stock/StockDataTable";
import FooterTable from "@components/FooterTable";
import { useState } from "react";
import FileAction from "@components/FileAction";
import { useModal } from "@hooks/useModal";
import UploadCsvModal from "@components/UploadCsvModal";
import { uploadProductosFromCsv } from "@services/inventario-envios/inventory/api/productos";

export default function StockDetailPage() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [page, setPage] = useState<number>(1);
  const [isUploadOpen, openUploadModal, closeUploadModal] = useModal();

  // 🔹 Llamada al producto
  const {
    data: producto,
    isLoading: isLoadingProducto,
    isError: isErrorProducto,
  } = useQuery({
    queryKey: ["producto", id],
    queryFn: () => getProductoById(Number(id)),
    enabled: !!id,
  });

  // 🔹 Llamada al stock por producto
  const {
    data: localesData,
    isPending: isLoadingLocales,
    isError: isErrorLocales,
  } = useLocalesPorProducto({
    id_producto: Number(id),
    page,
    limit: 3,
  });

  const locales = localesData?.data ?? [];
  const pagination = localesData?.pagination ?? {
    page: 1,
    per_page: 3,
    total: 0,
    total_pages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoadingProducto) return <div>Cargando producto...</div>;
  if (isErrorProducto) return <div>Error al cargar producto</div>;

  return (
    <>
      <div className="mb-6 bg-white shadow-md rounded-2xl p-4 flex flex-col md:flex-row gap-6 border border-gray-100">
        {/* Imagen principal */}
        <div className="flex-shrink-0 flex justify-center items-center bg-gray-50 rounded-xl p-2">
          {producto.productoImagenes?.length > 0 ? (
            <img
              src={producto.productoImagenes[0].imagen}
              alt={producto.nombre}
              className="w-56 h-56 object-contain rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {producto.nombre}
            </h2>
            <p className="text-gray-600 mb-3">{producto.descripcion}</p>
          </div>

          {/* Variante destacada (opcional) */}
          {producto.variantes?.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-700 text-sm mb-1">Desde:</p>
              <p className="text-xl font-semibold text-indigo-600">
                S/.{" "}
                {Math.min(
                  ...producto.variantes.map((v: any) => v.precio)
                ).toLocaleString("es-PE")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <FileAction
          text="Importar CSV"
          variant="upload"
          onClick={openUploadModal}
        />
      </div>

      <StockDataTable
        data={locales}
        variant="por-producto"
        limit={pagination.per_page}
        page={pagination.page}
        isLoading={isLoadingLocales}
        isError={isErrorLocales}
      />

      <FooterTable
        page={pagination.page}
        limit={pagination.per_page}
        total_pages={pagination.total_pages}
        total={pagination.total}
        handlePageChange={handlePageChange}
      />

      <UploadCsvModal
        isOpen={isUploadOpen}
        closeModal={closeUploadModal}
        title="Importar stock a locales desde CSV"
        resourceName="localesPorProducto"
        uploadFn={uploadProductosFromCsv}
        onSuccess={() => {
          setPage(1); // reset to first page to see new data
          queryClient.invalidateQueries({ queryKey: ["localesPorProducto"] });
        }}
      />
    </>
  );
}
