import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocales } from "./hooks/local/useLocales";
import { useLocalesFilterUrl } from "./hooks/local/useLocalesFilterUrl";
import { useModal } from "@hooks/useModal";
import { LocalCreateModal } from "./components/local/LocalCreateModal";
import FooterTable from "@components/FooterTable";
import LocalDataTable from "./components/local/LocalDataTable";
import LocalFilterForm from "./components/local/LocalFilterForm";
import Button from "@components/Button";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { LocalEditModal } from "./components/local/LocalEditModal";
import type { LocalListItem } from "@services/inventario-envios/local/types/local";
import {
  downloadTiendas,
  uploadTiendas,
} from "@services/inventario-envios/local/api/tiendas";
import { useDeleteLocal } from "./hooks/local/useDeleteLocal";
import FileAction from "@components/FileAction";
import UploadCsvModal from "@components/UploadCsvModal";
import { useQueryClient } from "@tanstack/react-query";

export default function AlmacenesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const tiendasFilter = useLocalesFilterUrl();
  const { page, nombre, departamento, provincia, distrito, setPage } =
    tiendasFilter;

  const { data, isPending, isError } = useLocales({
    local: "tiendas",
    limit: 2,
    page,
    nombre,
    departamento,
    provincia,
    distrito,
  });

  const { mutate: deleteTienda } = useDeleteLocal("tiendas");

  const [isCreateOpen, openCreateModal, closeCreateModal] = useModal();
  const [isEditOpen, openEditModal, closeEditModal] = useModal();
  const [isUploadOpen, openUploadModal, closeUploadModal] = useModal();
  const [selectedLocal, setSelectedLocal] = useState<LocalListItem | null>(
    null
  );

  const handleEdit = (local: LocalListItem) => {
    setSelectedLocal(local);
    openEditModal();
  };

  const handleDelete = (local: LocalListItem) => {
    const del = confirm(
      `¿Esta seguro de eliminar la tienda "${local.nombre}"?`
    );
    if (del) {
      deleteTienda(local.id, {
        onSuccess: () => {
          alert(`La tienda "${local.nombre} se elimino correctamente"`);
        },
        onError: error => {
          console.error("Error al eliminar el local: ", error);
          alert("No se pudo eliminar la tienda");
        },
      });
    }
  };

  const tiendas = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    per_page: 4,
    total: 0,
    total_pages: 0,
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Tiendas</h1>
      <LocalFilterForm disabled={isPending} filters={tiendasFilter} />
      <div className="flex gab-4">
        <FileAction
          text="Descargar CSV"
          variant="download"
          onClick={downloadTiendas}
        />
        <FileAction
          text="Subir CSV"
          variant="upload"
          onClick={openUploadModal}
        />
        <Button
          text="Añadir tienda"
          variant="secondary"
          icon={PlusCircle}
          onClick={openCreateModal}
        />
      </div>
      <LocalDataTable
        data={tiendas}
        page={pagination.page}
        limit={pagination.per_page}
        resourceName="tiendas"
        isLoading={isPending}
        isError={isError}
        getActions={item => [
          {
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4 text-blue-600" />,
            onClick: () => navigate(`/inventario/tiendas/${item.id}`),
          },
          {
            label: "Editar",
            icon: <Pencil className="w-4 h-4 text-primary1" />,
            onClick: () => handleEdit(item),
          },
          {
            label: "Eliminar",
            icon: <Trash2 className="w-4 h-4 text-red-600" />,
            onClick: () => handleDelete(item),
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
      <LocalCreateModal
        localType="tiendas"
        isOpen={isCreateOpen}
        closeModal={closeCreateModal}
      />
      <LocalEditModal
        localType="tiendas"
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        localData={selectedLocal}
      />
      <UploadCsvModal
        isOpen={isUploadOpen}
        closeModal={closeUploadModal}
        title="Importar tiendas desde CSV"
        resourceName="tiendas"
        uploadFn={uploadTiendas}
        onSuccess={() => {
          setPage(1); // reset to first page to see new data
          queryClient.invalidateQueries({ queryKey: ["tiendas"] });
        }}
      />
    </>
  );
}
