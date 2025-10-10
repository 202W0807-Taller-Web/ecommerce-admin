import LocalDataTable from "./LocalDataTable";
import { StatusBadge } from "@components/Table";
import type { Tienda } from "../../../modules/inventario-envios/local/types/tienda";

const TiendaDataTable = ({
  tiendas,
  isLoading,
  isError,
  almacenes = true,
  page,
  limit,
}: {
  tiendas: Tienda[];
  isLoading?: boolean;
  isError?: boolean;
  almacenes?: boolean;
  page: number;
  limit: number;
}) => {
  const columns = [
    {
      label: "#",
      key: "serial",
      className: "w-12 text-center",
      render: (_: Tienda, idx: number) => (page - 1) * limit + idx + 1,
    },
    // {
    //   label: "Imagen",
    //   key: "imagen",
    //   render: (t: Tienda) => (
    //     <img
    //       src={t.imagen || "none"}
    //       alt={t.nombre}
    //       className="w-8 h-8 rounded-full"
    //     />
    //   ),
    // },
    { label: "Nombre", key: "nombre" },
    {
      label: "Estado",
      key: "estado",
      render: (t: Tienda) => (
        <StatusBadge
          label={t.estado}
          variant={t.estado === "ACTIVO" ? "success" : "danger"}
        />
      ),
    },
    { label: "Dirección", key: "direccion" },
    { label: "Distrito", key: "distrito" },
    { label: "Provincia", key: "provincia" },
    { label: "Departamento", key: "departamento" },
  ];

  if (almacenes) columns.push({ label: "Almacén", key: "almacen" });

  return (
    <LocalDataTable
      data={tiendas}
      columns={columns}
      resourceName="tiendas"
      isLoading={isLoading}
      isError={isError}
    />
  );
};

export default TiendaDataTable;
