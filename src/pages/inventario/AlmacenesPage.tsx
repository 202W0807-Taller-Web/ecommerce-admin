import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { useModal } from "@hooks/useModal";
import Button from "@components/Button";
import FooterTable from "@components/FooterTable";
import { useLocales } from "./hooks/local/useLocales";
import { useLocalesFilterUrl } from "./hooks/local/useLocalesFilterUrl";
import LocalDataTable from "./components/local/LocalDataTable";
import LocalFilterForm from "./components/local/LocalFilterForm";
import { LocalCreateModal } from "./components/local/LocalCreateModal";
import { LocalEditModal } from "./components/local/LocalEditModal";
import type { LocalListItem } from "@services/inventario-envios/local/types/local";
import { useDeleteLocal } from "./hooks/local/useDeleteLocal";

export default function AlmacenesPage() {
  const navigate = useNavigate();
  const almacenesFilter = useLocalesFilterUrl();
  const { page, nombre, departamento, provincia, distrito, setPage } =
    almacenesFilter;

  const { data, isPending, isError } = useLocales({
    local: "almacenes",
    limit: 2,
    page,
    nombre,
    departamento,
    provincia,
    distrito,
  });

  const { mutate: deleteAlmacen } = useDeleteLocal("almacenes");

  const [isCreateOpen, openCreateModal, closeCreateModal] = useModal();
  const [isEditOpen, openEditModal, closeEditModal] = useModal();
  const [selectedLocal, setSelectedLocal] = useState<LocalListItem | null>(
    null
  );

  const handleEdit = (local: LocalListItem) => {
    setSelectedLocal(local);
    openEditModal();
  };

  const handleDelete = (local: LocalListItem) => {
    const del = confirm(
      `¿Esta seguro de eliminar el almacen "${local.nombre}"?`
    );
    if (del) {
      deleteAlmacen(local.id, {
        onSuccess: () => {
          alert(`El almacen "${local.nombre} se elimino correctamente"`);
        },
        onError: error => {
          console.error("Error al eliminar el local: ", error);
          alert("No se pudo eliminar el almacen");
        },
      });
    }
  };

  const almacenes = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    per_page: 4,
    total: 0,
    total_pages: 0,
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Almacenes</h1>
      <LocalFilterForm disabled={isPending} filters={almacenesFilter} />
      <Button
        text="Añadir almacén"
        variant="secondary"
        icon={PlusCircle}
        onClick={openCreateModal}
      />
      <LocalDataTable
        data={almacenes}
        page={pagination.page}
        limit={pagination.per_page}
        resourceName="almacenes"
        isLoading={isPending}
        isError={isError}
        getActions={item => [
          {
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4 text-blue-600" />,
            onClick: () => navigate(`/inventario/almacenes/${item.id}`),
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
        localType="almacenes"
        isOpen={isCreateOpen}
        closeModal={closeCreateModal}
      />
      <LocalEditModal
        localType="almacenes"
        isOpen={isEditOpen}
        closeModal={closeEditModal}
        localData={selectedLocal}
      />
    </>
  );
}
