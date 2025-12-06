import { useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../../components/Button";
import FileAction from "../../components/FileAction";
import { TableHeader, TableCell, ActionMenuCell } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { Eye, Trash2 } from "lucide-react";

// Datos simulados
const productosData = [
  {
    id: 1,
    nombre: "Laptop Dell Inspiron",
    categoria: "Electrónica",
    imagen: "https://i.pravatar.cc/80?img=5",
    stkTotal: 20,
    stkDisponible: 15,
    stkReservado: 5,
    estadoStk: "Disponible",
    ultimaActualizacion: "2025-10-02",
  },
  {
    id: 2,
    nombre: "Mouse Logitech",
    categoria: "Accesorios",
    imagen: "https://i.pravatar.cc/80?img=6",
    stkTotal: 7,
    stkDisponible: 5,
    stkReservado: 2,
    estadoStk: "Bajo Stock",
    ultimaActualizacion: "2025-10-01",
  },
];

const movimientosData = [
  {
    id: 1,
    fecha: "2025-10-01",
    motivo: "Compra",
    tipo: "Ingreso",
    cantidad: 10,
    stkResultante: 20,
  },
  {
    id: 2,
    fecha: "2025-10-02",
    motivo: "Venta",
    tipo: "Retiro",
    cantidad: -5,
    stkResultante: 15,
  },
];

export default function StockDetailsPage() {
  const { id } = useParams();
  const producto = productosData.find(p => p.id === Number(id)) || productosData[0];

  // Historial movimientos
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movimientosData.length / pageSize));
  const paginated = movimientosData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-2">{producto.nombre}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{producto.categoria}</h2>
      <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center">
        <img src={producto.imagen} alt={producto.nombre} className="w-40 h-40 rounded-lg border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <div><b>Stock total:</b> {producto.stkTotal}</div>
            <div><b>Stock disponible:</b> {producto.stkDisponible}</div>
            <div><b>Stock reservado:</b> {producto.stkReservado}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div><b>Estado de stock:</b> <span className={producto.estadoStk === "Disponible" ? "text-green-700" : "text-red-700"}>{producto.estadoStk}</span></div>
            <div><b>Última actualización:</b> {producto.ultimaActualizacion}</div>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Historial de movimientos</h2>
      <div className="flex flex-row gap-4 mb-4">
        <FileAction text="Exportar data" variant="download" />
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
              <TableHeader label="Fecha" />
              <TableHeader label="Motivo" />
              <TableHeader label="Tipo movimiento" />
              <TableHeader label="Cantidad" />
              <TableHeader label="Stk. resultante" />
              <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><TableCell>No hay movimientos</TableCell></tr>
            ) : (
              paginated.map((m, idx) => (
                <tr key={m.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="w-12 min-w-[48px] text-center">{m.id}</TableCell>
                  <TableCell>{m.fecha}</TableCell>
                  <TableCell>{m.motivo}</TableCell>
                  <TableCell>
                    <span className={m.tipo === "Ingreso" ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                      {m.tipo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={m.tipo === "Ingreso" ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                      {m.tipo === "Ingreso" ? `+${Math.abs(m.cantidad)}` : `-${Math.abs(m.cantidad)}`}
                    </span>
                  </TableCell>
                  <TableCell>{m.stkResultante}</TableCell>
                  <ActionMenuCell
                    buttons={[{
                      label: "Ver detalles",
                      icon: <Eye className="w-4 h-4 text-blue-600" />,
                      onClick: () => console.log(`Ver detalles movimiento: ${m.id}`),
                    }, {
                      label: "Eliminar",
                      icon: <Trash2 className="w-4 h-4 text-red-600" />,
                      onClick: () => console.log(`Eliminar movimiento: ${m.id}`),
                    }]}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-center w-full mt-2">
          <span className="text-sm text-gray-500 mr-2">
            {`Mostrando ${movimientosData.length === 0 ? 0 : ((page - 1) * pageSize + 1)} - ${movimientosData.length === 0 ? 0 : Math.min(page * pageSize, movimientosData.length)} de ${movimientosData.length} resultados`}
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
    </div>
  );
}
