import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import FileAction from "../../components/FileAction";
import {
  TableHeader,
  TableCell,
  StatusBadge,
  ActionMenuCell,
} from "../../components/Table";
import Pagination from "../../components/Pagination";
import { PlusCircle } from "lucide-react";
import { Search, RefreshCw } from "lucide-react";
import Select from "../../components/Select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTiendas, createTienda } from "../../modules/inventario/api/tiendas";
import { useModal } from "@hooks/useModal";
import ModalForm from "@components/ModalForm";
import TiendaForm from "./components/TiendaForm";
import type { Tienda } from "../../modules/inventario/types/tienda";
import { useForm, type SubmitHandler } from "react-hook-form";

type TiendaInput = {
  nombre: string;
  almacen: string;
  estado: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  imagen?: string;
};

export default function TiendasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [almacen, setAlmacen] = useState("");
  const [distrito, setDistrito] = useState("");
  const [provincia, setProvincia] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal state for adding tienda
  const [isOpenModalForm, openModalForm, closeModalForm] = useModal(false);

  // react-query
  const {
    isPending,
    isError,
    data: tiendasData,
    error,
  } = useQuery<Tienda[]>({
    queryKey: ["tiendas"],
    queryFn: getTiendas,
  });

  // react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TiendaInput>({
    defaultValues: {
      nombre: "",
      almacen: "",
      estado: "Activo",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
      imagen: "",
    },
  });

  // react-query
  const queryClient = useQueryClient();
  const { mutate: addTienda } = useMutation({
    mutationFn: createTienda,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiendas"] });
      alert("Tienda creada correctamente");
      reset();
      closeModalForm();
    },
    onError: error => {
      console.error("Error al crear tienda:", error);
      alert("No se pudo crear la tienda");
    },
  });

  const onSubmit: SubmitHandler<TiendaInput> = data => {
    addTienda(data);
  };

  if (isPending) return <span>Loading...</span>;

  if (isError) return <span>Error: {error.message}</span>;

  // Obtiene valores únicos para los selects
  const almacenes = Array.from(new Set(tiendasData.map(t => t.almacen)));
  const distritos = Array.from(new Set(tiendasData.map(t => t.distrito)));
  const provincias = Array.from(new Set(tiendasData.map(t => t.provincia)));
  const departamentos = Array.from(
    new Set(tiendasData.map(t => t.departamento))
  );

  const almacenOptions = almacenes.map(a => ({ value: a, label: a }));
  const distritoOptions = distritos.map(d => ({ value: d, label: d }));
  const provinciaOptions = provincias.map(p => ({ value: p, label: p }));
  const departamentoOptions = departamentos.map(dep => ({
    value: dep,
    label: dep,
  }));

  // Filtros
  const filtered = tiendasData.filter(
    t =>
      t.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (almacen ? t.almacen === almacen : true) &&
      (distrito ? t.distrito === distrito : true) &&
      (provincia ? t.provincia === provincia : true) &&
      (departamento ? t.departamento === departamento : true)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleClear = () => {
    setBusqueda("");
    setAlmacen("");
    setDistrito("");
    setProvincia("");
    setDepartamento("");
    setPage(1);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Tiendas</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 items-end w-full">
        <div className="w-full sm:w-64 min-w-0">
          <Input
            label="Buscar por nombre"
            placeholder="Nombre de tienda"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            rightIcon={Search}
          />
        </div>
        <div className="w-full sm:w-48 min-w-0">
          <Select
            label="Almacén"
            placeholder="Todos"
            options={almacenOptions}
            value={almacen}
            onChange={e => setAlmacen(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 min-w-0">
          <Select
            label="Distrito"
            placeholder="Todos"
            options={distritoOptions}
            value={distrito}
            onChange={e => setDistrito(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 min-w-0">
          <Select
            label="Provincia"
            placeholder="Todas"
            options={provinciaOptions}
            value={provincia}
            onChange={e => setProvincia(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 min-w-0">
          <Select
            label="Departamento"
            placeholder="Todos"
            options={departamentoOptions}
            value={departamento}
            onChange={e => setDepartamento(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-body-color px-3 py-2 rounded-md border-none bg-transparent hover:text-secondary-color"
        >
          Clear all
        </button>
        <div className="flex-1 flex justify-end">
          <Button
            text="Añadir tienda"
            icon={PlusCircle}
            iconPosition="right"
            variant="primary"
            onClick={openModalForm}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 my-10 w-full">
        <FileAction text="Importar data" variant="upload" />
        <FileAction text="Exportar data" variant="download" />
        <button
          type="button"
          className="cursor-pointer flex items-center text-sm gap-2 text-body-color underline hover:text-secondary-color"
        >
          <span>Actualizar stock</span>
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader
                label="#"
                className="w-12 min-w-[48px] text-center"
              />
              <TableHeader label="Imagen" />
              <TableHeader label="Nombre" />
              <TableHeader label="Almacén" />
              <TableHeader label="Estado" />
              <TableHeader label="Dirección" />
              <TableHeader label="Distrito" />
              <TableHeader label="Provincia" />
              <TableHeader label="Departamento" />
              <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <TableCell>No hay tiendas</TableCell>
              </tr>
            ) : (
              paginated.map((t, idx) => (
                <tr key={t.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="w-12 min-w-[48px] text-center">
                    {t.id}
                  </TableCell>
                  <TableCell>
                    <img
                      src={t.imagen}
                      alt={t.nombre}
                      className="w-8 h-8 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{t.nombre}</TableCell>
                  <TableCell>{t.almacen}</TableCell>
                  <TableCell>
                    <StatusBadge
                      label={t.estado}
                      variant={t.estado === "Activo" ? "success" : "neutral"}
                    />
                  </TableCell>
                  <TableCell>{t.direccion}</TableCell>
                  <TableCell>{t.distrito}</TableCell>
                  <TableCell>{t.provincia}</TableCell>
                  <TableCell>{t.departamento}</TableCell>
                  <ActionMenuCell />
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-center w-full mt-2">
          <span className="text-sm text-gray-500 mr-2">
            {`Mostrando ${filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} - ${filtered.length === 0 ? 0 : Math.min(page * pageSize, filtered.length)} de ${filtered.length} resultados`}
          </span>
        </div>
        <div className="flex justify-center mt-4 w-full">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal para agregar tienda */}
      <ModalForm
        title="Añadir tienda"
        isOpen={isOpenModalForm}
        closeModal={closeModalForm}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <TiendaForm control={control} errors={errors} />
      </ModalForm>

      {/* <Modal
        open={modalOpen}
        title="Agregar tienda"
        onCancel={handleCloseModal}
        onAccept={handleAccept}
      >
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleFormChange}
              placeholder="Nombre de la tienda"
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleFormChange}
              placeholder="Dirección"
            />
          </div>

          <div className="sm:col-span-2">
            <Select
              name="almacen"
              label="Almacén"
              placeholder="Selecciona almacén"
              options={almacenOptions}
              value={form.almacen}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <Select
              name="departamento"
              label="Departamento"
              placeholder="Selecciona departamento"
              options={departamentoOptions}
              value={form.departamento}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <Select
              name="provincia"
              label="Provincia"
              placeholder="Selecciona provincia"
              options={provinciaOptions}
              value={form.provincia}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <Select
              name="distrito"
              label="Distrito"
              placeholder="Selecciona distrito"
              options={distritoOptions}
              value={form.distrito}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <Select
              name="estado"
              label="Estado"
              options={[
                { value: "Activo", label: "Activo" },
                { value: "Inactivo", label: "Inactivo" },
              ]}
              value={form.estado}
              onChange={handleFormChange}
            />
          </div>

          <div className="sm:col-span-2">
            <InputFile
              label="Imagen"
              name="imagen"
              maxFiles={1}
              onFilesChange={(_, dataUrls) => {
                setForm(f => ({
                  ...f,
                  imagen: dataUrls && dataUrls.length ? dataUrls[0] : "",
                }));
              }}
            />
          </div>
        </form>
      </Modal> */}
    </div>
  );
}
