import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import FileAction from "../../components/FileAction";
import { TableHeader, TableCell, StatusBadge, ActionMenuCell } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { Pencil, PackagePlus, Trash2 } from "lucide-react";

// Datos simulados
const almacenesData = [
  {
    id: 1,
    nombre: "Almacen Central",
    direccion: "Av. Principal 123",
    estado: "Activo",
    distrito: "Miraflores",
    provincia: "Lima",
    departamento: "Lima",
    imagen: "https://i.pravatar.cc/80?img=1",
  },
  {
    id: 2,
    nombre: "Almacen Secundario",
    direccion: "Calle Secundaria 456",
    estado: "Inactivo",
    distrito: "San Isidro",
    provincia: "Lima",
    departamento: "Lima",
    imagen: "https://i.pravatar.cc/80?img=2",
  },
];

const productosData = [
  {
    id: 1,
    imagen: "https://i.pravatar.cc/40?img=5",
    sku: "SKU001",
    producto: "Laptop Dell Inspiron",
    categoria: "Electrónica",
    stkDisponible: 12,
    stkReservado: 3,
    stkTotal: 15,
    estadoStk: "Disponible",
  },
  {
    id: 2,
    imagen: "https://i.pravatar.cc/40?img=6",
    sku: "SKU002",
    producto: "Mouse Logitech",
    categoria: "Accesorios",
    stkDisponible: 5,
    stkReservado: 2,
    stkTotal: 7,
    estadoStk: "Bajo Stock",
  },
];

const categorias = Array.from(new Set(productosData.map(p => p.categoria)));
const categoriaOptions = categorias.map(c => ({ value: c, label: c }));

export default function AlmacenesDetailsPage() {
  const { id } = useParams();
  const almacen = almacenesData.find(a => a.id === Number(id)) || almacenesData[0];

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtros productos
  const filtered = productosData.filter((p) =>
    p.producto.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoria ? p.categoria === categoria : true)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 w-full max-w-full overflow-x-auto">
      {/* Título y botón editar */}
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">{almacen.nombre}</h1>
        <Button text="Editar" icon={Pencil} variant="primary" />
      </div>
      {/* Datos del almacén */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center">
        <img src={almacen.imagen} alt={almacen.nombre} className="w-20 h-20 rounded-lg border" />
        <div className="flex flex-col gap-2">
          <div><b>Dirección:</b> {almacen.direccion}</div>
          <div><b>Estado:</b> {almacen.estado}</div>
          <div><b>Distrito:</b> {almacen.distrito}</div>
          <div><b>Provincia:</b> {almacen.provincia}</div>
          <div><b>Departamento:</b> {almacen.departamento}</div>
        </div>
      </div>
      {/* Filtros productos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end w-full">
        <div className="w-full sm:w-64 min-w-0">
          <Input
            label="Buscar producto"
            placeholder="Nombre de producto"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 min-w-0">
          <Select
            label="Categoría"
            placeholder="Todas"
            options={categoriaOptions}
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          />
        </div>
      </div>
      {/* Acciones productos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <FileAction text="Importar data" variant="upload" />
        <FileAction text="Exportar data" variant="download" />
      </div>
      {/* Tabla productos */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full border-collapse mb-2 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader label="#" className="w-12 min-w-[48px] text-center" />
              <TableHeader label="Imagen" />
              <TableHeader label="SKU" />
              <TableHeader label="Producto" />
              <TableHeader label="Stk. Disponible" />
              <TableHeader label="Stk. Reservado" />
              <TableHeader label="Stk. Total" />
              <TableHeader label="Estado" />
              <th className="w-24 min-w-[64px] text-center border border-stroke"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><TableCell>No hay productos</TableCell></tr>
            ) : (
              paginated.map((p, idx) => (
                <tr key={p.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                  <TableCell className="w-12 min-w-[48px] text-center">{p.id}</TableCell>
                  <TableCell><img src={p.imagen} alt={p.producto} className="w-8 h-8 rounded-full" /></TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.producto}</TableCell>
                  <TableCell>{p.stkDisponible}</TableCell>
                  <TableCell>{p.stkReservado}</TableCell>
                  <TableCell>{p.stkTotal}</TableCell>
                  <TableCell>
                    <StatusBadge label={p.estadoStk} variant={p.estadoStk === "Disponible" ? "success" : "danger"} />
                  </TableCell>
                  <ActionMenuCell
                    buttons={[{
                      label: "Editar",
                      icon: <Pencil className="w-4 h-4 text-primary1" />,
                      onClick: () => console.log(`Editar producto: ${p.producto}`),
                    }, {
                      label: "Eliminar",
                      icon: <Trash2 className="w-4 h-4 text-red-600" />,
                      onClick: () => console.log(`Eliminar producto: ${p.producto}`),
                    }, {
                      label: "Asignar",
                      icon: <PackagePlus className="w-4 h-4 text-green-600" />,
                      onClick: () => console.log(`Asignar producto: ${p.producto}`),
                    }]}
                  />
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end items-center w-full mt-2">
          <span className="text-sm text-gray-500 mr-2">
            {`Mostrando ${filtered.length === 0 ? 0 : ((page - 1) * pageSize + 1)} - ${filtered.length === 0 ? 0 : Math.min(page * pageSize, filtered.length)} de ${filtered.length} resultados`}
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
      {/* Aquí podrías agregar la sección de tiendas asignadas al almacén */}
    </div>
  );
}
