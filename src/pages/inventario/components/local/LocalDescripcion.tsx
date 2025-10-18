import type { LocalListItem } from "@services/inventario-envios/local/types/local";

const LocalDescripcion = ({
  data,
  resourceName,
}: {
  data?: LocalListItem;
  resourceName: "almacen" | "tienda";
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{data?.nombre}</h1>
      <div className="flex flex-col md:flex-row">
        {/* Nombre e imagen */}
        <div className="md:w-1/3">
          <img
            src={
              data?.imagen ||
              (resourceName === "almacen"
                ? "https://i.ibb.co/LhsjTdTM/almacen.jpg"
                : "https://i.ibb.co/67pNqs5D/tienda.jpg")
            }
            alt={data?.nombre}
            className="w-full h-50 object-cover"
          />
        </div>

        {/* Descripción */}
        <div className="md:w-2/3 p-6 flex flex-col justify-center space-y-3">
          <p className="font-semibold text-gray-700">
            Estado:
            <span
              className={`self-start px-3 py-1 text-sm font-semibold rounded-full ml-1  ${
                data?.estado === "ACTIVO"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {data?.estado}
            </span>
          </p>
          <div className="text-gray-700 space-y-2">
            <p>
              <span className="font-semibold">Dirección:</span>{" "}
              {data?.direccion}
            </p>
            <p>
              <span className="font-semibold">Departamento:</span>{" "}
              {data?.departamento?.nombre}
            </p>
            <p>
              <span className="font-semibold">Provincia:</span>{" "}
              {data?.provincia?.nombre}
            </p>
            <p>
              <span className="font-semibold">Distrito:</span>{" "}
              {data?.distrito?.nombre}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocalDescripcion;
