import LocalDataTable from "./LocalDataTable";
import { StatusBadge } from "@components/Table";
import type { Almacen } from "../../../modules/inventario-envios/local/types/almacen";

const AlmacenDataTable = ({
  almacenes,
  isLoading,
  isError,
  page,
  limit,
}: {
  almacenes: Almacen[];
  isLoading?: boolean;
  isError?: boolean;
  page: number;
  limit: number;
}) => {
  const columns = [
    {
      label: "#",
      key: "serial",
      className: "w-12 text-center",
      render: (_: Almacen, idx: number) => (page - 1) * limit + idx + 1,
    },
    // {
    //   label: "Imagen",
    //   key: "imagen",
    //   render: (a: Almacen) => (
    //     <img
    //       src={a.imagen || "none"}
    //       alt={a.nombre}
    //       className="w-8 h-8 rounded-full"
    //     />
    //   ),
    // },
    { label: "Nombre", key: "nombre" },
    {
      label: "Estado",
      key: "estado",
      render: (a: Almacen) => (
        <StatusBadge
          label={a.estado}
          variant={a.estado === "ACTIVO" ? "success" : "danger"}
        />
      ),
    },
    { label: "Dirección", key: "direccion" },
    { label: "Distrito", key: "distrito" },
    { label: "Provincia", key: "provincia" },
    { label: "Departamento", key: "departamento" },
  ];

  return (
    <LocalDataTable
      data={almacenes}
      columns={columns}
      resourceName="almacenes"
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default AlmacenDataTable;
