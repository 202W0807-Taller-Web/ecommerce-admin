import { useLocales } from "./hooks/local/useLocales";
import { useLocalesFilterUrl } from "./hooks/local/useLocalesFilterUrl";
import { useModal } from "@hooks/useModal";
import { LocalCreateModal } from "./components/local/LocalCreateModal";
import FooterTable from "@components/FooterTable";
import LocalDataTable from "./components/local/LocalDataTable";
import LocalFilterForm from "./components/local/LocalFilterForm";
import Button from "@components/Button";
import { PlusCircle } from "lucide-react";

export default function AlmacenesPage() {
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

  const [isOpen, openModal, closeModal] = useModal();

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
      <Button
        text="Añadir tienda"
        variant="secondary"
        icon={PlusCircle}
        onClick={openModal}
      />
      <LocalDataTable
        data={tiendas}
        page={pagination.page}
        limit={pagination.per_page}
        resourceName="tiendas"
        isLoading={isPending}
        isError={isError}
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
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
}
