import { useNavigate } from "react-router-dom";

import {
  TableHeader,
  TableCell,
  StatusBadge,
  ActionMenuCell,
} from "@components/Table";

import { Eye, Pencil, Trash2, Store, PackagePlus } from "lucide-react";
import type { Almacen } from "modules/inventario/types/almacen";

const AlmacenDataTable = ({ almacenes }: { almacenes: Almacen[] }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-auto">
      <table className="overflow-visible min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
            <TableHeader label="Imagen" />
            <TableHeader label="Nombre" />
            <TableHeader label="Estado" />
            <TableHeader label="Dirección" />
            <TableHeader label="Distrito" />
            <TableHeader label="Provincia" />
            <TableHeader label="Departamento" />
            <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
          </tr>
        </thead>
        <tbody>
          {almacenes.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="text-center py-6 text-gray-500 italic border border-stroke"
              >
                No hay almacenes registrados
              </td>
            </tr>
          ) : (
            almacenes.map((a, idx) => (
              <tr key={a.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                <TableCell className="w-12 min-w-[48px] text-center">
                  {a.id}
                </TableCell>
                <TableCell>
                  <img
                    src={a.imagen || "none"}
                    alt={a.nombre}
                    className="w-8 h-8 rounded-full"
                  />
                </TableCell>
                <TableCell>{a.nombre}</TableCell>
                <TableCell>
                  <StatusBadge
                    label={a.estado}
                    variant={a.estado === "ACTIVO" ? "success" : "neutral"}
                  />
                </TableCell>
                <TableCell>{a.direccion}</TableCell>
                <TableCell>{a.distrito}</TableCell>
                <TableCell>{a.provincia}</TableCell>
                <TableCell>{a.departamento}</TableCell>
                <ActionMenuCell
                  buttons={[
                    {
                      label: "Ver detalles",
                      icon: <Eye className="w-4 h-4 text-blue-600" />,
                      onClick: () => navigate(`/inventario/almacenes/${a.id}`),
                    },
                    {
                      label: "Actualizar",
                      icon: <Pencil className="w-4 h-4 text-primary1" />,
                      onClick: () =>
                        console.log(`Actualizar almacén: ${a.nombre}`),
                    },
                    {
                      label: "Eliminar",
                      icon: <Trash2 className="w-4 h-4 text-red-600" />,
                      onClick: () =>
                        console.log(`Eliminar almacén: ${a.nombre}`),
                    },
                    {
                      label: "Asignar tiendas",
                      icon: <Store className="w-4 h-4 text-secondary-color" />,
                      onClick: () =>
                        console.log(`Asignar tiendas a: ${a.nombre}`),
                    },
                    {
                      label: "Asignar productos",
                      icon: <PackagePlus className="w-4 h-4 text-green-600" />,
                      onClick: () =>
                        console.log(`Asignar productos a: ${a.nombre}`),
                    },
                  ]}
                />
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlmacenDataTable;
