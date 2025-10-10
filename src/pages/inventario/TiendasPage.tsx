import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTiendas } from "../../modules/inventario-envios/local/api/tiendas";
import { useModal } from "@hooks/useModal";
import ModalForm from "@components/ModalForm";
import TiendaForm from "./components/TiendaForm";
import type {
  Tienda,
  TiendaBody,
} from "../../modules/inventario-envios/local/types/tienda";
import type { Root } from "../../modules/inventario-envios/local/types/pagination";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { PlusCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

import TiendaDataTable from "./components/TiendaDataTable";
import SelectsUbigeo from "./components/SelectsUbigeo";
import FilterForm from "./components/FilterForm";
import FooterTable from "./components/FooterTable";
import FileAction from "@components/FileAction";

const limit = 2; // Número de items por página

export default function TiendasPage() {
  // Modales
  const [isOpenModalForm, openModalForm, closeModalForm] = useModal(false);
  const [isOpenModalUpdateStock, openModalUpdateStock, closeModalUpdateStock] =
    useModal(false);
  const [isOpenModalImportData, openModalImportData, closeModalImportData] =
    useModal(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const ubicacionRef = useRef<{ reset: () => void }>(null);
  const [ubigeo, setUbigeo] = useState({ label: "", value: "" });

  // Obtener valores de la URL
  const nombre = searchParams.get("nombre") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Detectar ubigeo
  const departamento = searchParams.get("departamento") || "";
  const provincia = searchParams.get("provincia") || "";
  const distrito = searchParams.get("distrito") || "";

  // react-query
  const { data, isPending, isError } = useQuery<Root<Tienda>>({
    queryKey: [
      "tiendas",
      {
        nombre,
        almacen: "",
        departamento,
        provincia,
        distrito,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getTiendas({
        nombre,
        almacen: "",
        departamento,
        provincia,
        distrito,
        page,
        limit,
      }),
  });

  const tiendas = data?.data ?? [];
  const pagination = data?.pagination;

  // Cambiar pagina
  const handlePageChange = (newPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: String(newPage) });
  };

  // Busqueda con url
  const handleSubmitSearch = (formData: Record<string, string>) => {
    const params: Record<string, string> = {};
    if (formData.nombre) params.nombre = formData.nombre;
    if (ubigeo.value && ubigeo.label) params[ubigeo.label] = ubigeo.value;
    params.page = "1";
    setSearchParams(params);
  };

  // Limpiar inputs
  const handleReset = () => {
    ubicacionRef.current?.reset();
    setUbigeo({ label: "", value: "" });
    setSearchParams({});
  };

  // react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TiendaBody>({
    defaultValues: {
      nombre: "",
      almacen: "",
      estado: "",
      direccion: "",
      ubigeo: {
        departamento: "",
        provincia: "",
        distrito: "",
      },
      imagen: "",
    },
  });

  const onSubmitAddTienda: SubmitHandler<TiendaBody> = data => {
    alert(`"Se ha creado la tienda\n: ${JSON.stringify(data)}`);
    console.log(data);
    closeModalForm();
    reset();
    ubicacionRef.current?.reset();
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Tiendas</h1>

      {/* Filtros */}
      <FilterForm
        onSubmit={handleSubmitSearch}
        onReset={handleReset}
        disabled={isPending}
      >
        <Input
          type="text"
          name="nombre"
          label="Nombre"
          placeholder="Buscar por nombre"
          defaultValue={nombre}
          className="sm:flex-1"
        />
        <SelectsUbigeo ref={ubicacionRef} onChangeUbicacion={setUbigeo} />
      </FilterForm>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full mb-3">
        <div className="flex flex-wrap gap-4">
          <FileAction
            text="Importar data"
            variant="upload"
            onClick={openModalImportData}
          />
          <FileAction text="Exportar data" variant="download" />
          <FileAction
            text="Actualizar stock"
            variant="update"
            onClick={openModalUpdateStock}
          />
        </div>
        <div className="sm:shrink-0 sm:w-auto w-full">
          <Button
            text="Añadir tienda"
            variant="secondary"
            icon={PlusCircle}
            onClick={openModalForm}
          />
        </div>
      </div>

      {/* Tabla */}
      <TiendaDataTable
        tiendas={tiendas}
        page={page}
        limit={limit}
        isLoading={isPending}
        isError={isError}
      />

      {/* Pie de tabla */}
      <FooterTable
        page={page}
        limit={limit}
        pagination={pagination}
        handlePageChange={handlePageChange}
      />

      {/* Modal para agregar tienda */}
      <ModalForm
        title="Añadir tienda"
        isOpen={isOpenModalForm}
        closeModal={closeModalForm}
        onSubmit={handleSubmit(onSubmitAddTienda)}
        isLoading={isSubmitting}
      >
        <TiendaForm
          control={control}
          errors={errors}
          ubicacionRef={ubicacionRef}
        />
      </ModalForm>

      {/* Modal para actualizar stock */}
      <ModalForm
        title="Actualizar stock"
        isOpen={isOpenModalUpdateStock}
        closeModal={closeModalUpdateStock}
        // onSubmit={handleSubmit(onSubmit)}
        // isLoading={isSubmitting}
      ></ModalForm>

      {/* Modal para Importar data */}
      <ModalForm
        title="Importar data"
        isOpen={isOpenModalImportData}
        closeModal={closeModalImportData}
        // onSubmit={handleSubmit(onSubmit)}
        // isLoading={isSubmitting}
      ></ModalForm>
    </div>
  );
}
