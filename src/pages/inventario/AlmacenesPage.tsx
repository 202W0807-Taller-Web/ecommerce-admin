import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getAlmacenes } from "../../modules/inventario-envios/local/api/almacenes";
import type {
  Almacen,
  AlmacenBody,
} from "../../modules/inventario-envios/local/types/almacen";
import type { Root } from "../../modules/inventario-envios/local/types/pagination";
import AlmacenDataTable from "./components/AlmacenDataTable";
import SelectsUbigeo from "./components/SelectsUbigeo";
import FooterTable from "./components/FooterTable";
import FilterForm from "./components/FilterForm";
import { useSearchParams } from "react-router-dom";
import Input from "@components/Input";
import Button from "@components/Button";
import FileAction from "@components/FileAction";
import { useModal } from "@hooks/useModal";
import { PlusCircle } from "lucide-react";
import ModalForm from "@components/ModalForm";
import AlmacenForm from "./components/AlmacenForm";

const limit = 2; // Número de items por página

export default function AlmacenesPage() {
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
  const { data, isPending, isError } = useQuery<Root<Almacen>>({
    queryKey: [
      "almacenes",
      { page, limit, nombre, departamento, provincia, distrito },
    ],
    queryFn: () =>
      getAlmacenes({ page, limit, nombre, departamento, provincia, distrito }),
  });

  const almacenes = data?.data ?? [];
  const pagination = data?.pagination;

  // Cambiar pagina
  const handlePageChange = (newPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: String(newPage) });
  };

  // Busqueda con URL
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

  // const queryClient = useQueryClient();

  // react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlmacenBody>({
    defaultValues: {
      nombre: "",
      direccion: "",
      estado: "",
      ubigeo: {
        departamento: "",
        provincia: "",
        distrito: "",
      },
      imagen: "",
    },
  });

  // react-query
  // const { mutate: addAlmacen } = useMutation({
  //   mutationFn: createAlmacen,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["almacenes"] });
  //     alert("Almacen creado correctamente");
  //     reset();
  //     closeModalForm();
  //   },
  //   onError: error => {
  //     console.error("Error al crear almacén:", error);
  //     alert("No se pudo crear el almacén");
  //   },
  // });

  const onSubmitAddAlmacen: SubmitHandler<AlmacenBody> = data => {
    alert(`Se ha creado el almacen:\n ${JSON.stringify(data)}`);
    console.log(data);
    closeModalForm();
    reset();
    ubicacionRef.current?.reset();
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Almacenes</h1>
      {/* Filtracion */}
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
            text="Añadir almacén"
            variant="secondary"
            icon={PlusCircle}
            onClick={openModalForm}
          />
        </div>
      </div>

      {/* Tabla */}
      <AlmacenDataTable
        almacenes={almacenes}
        isLoading={isPending}
        isError={isError}
        page={page}
        limit={limit}
      />

      {/* Pie de Tabla */}
      <FooterTable
        page={page}
        limit={limit}
        pagination={pagination}
        handlePageChange={handlePageChange}
      />

      {/* Modal para agregar almacén */}
      <ModalForm
        title="Añadir Almacén"
        isOpen={isOpenModalForm}
        closeModal={closeModalForm}
        onSubmit={handleSubmit(onSubmitAddAlmacen)}
        isLoading={isSubmitting}
      >
        <AlmacenForm
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
